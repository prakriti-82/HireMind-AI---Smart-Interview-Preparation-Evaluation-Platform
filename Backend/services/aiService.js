import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

import { mockQuestions } from "../data/mockQuestions.js";
import { mockFeedbacks } from "../data/mockFeedback.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =======================================
// START INTERVIEW
// =======================================
export const generateInterviewQuestion = async (
  jobRole,
  jobDesc
) => {
  try {

    const prompt = `
      Generate ONE interview question for:
      Role: ${jobRole}

      Job Description:
      ${jobDesc}

      Keep the question professional and concise.
    `;

    const response =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        model: "llama-3.3-70b-versatile",
      });

    return response.choices[0].message.content;

  } catch (error) {

    console.log(
      "Groq Failed → Using Mock Question"
    );

    return mockQuestions[
      Math.floor(Math.random() * mockQuestions.length)
    ];
  }
};

// =======================================
// EVALUATE ANSWER
// =======================================
export const evaluateInterviewAnswer = async (
  question,
  answer
) => {
  try {

    const prompt = `
      Interview Question:
      ${question}

      Candidate Answer:
      ${answer}

      Evaluate this answer professionally.

      Give:
      1. Score out of 10
      2. Short feedback
      3. Next interview question

      Response format:

      Score: X
      Feedback: ...
      Next Question: ...
    `;

    const response =
      await groq.chat.completions.create({
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],

        model: "llama-3.3-70b-versatile",
      });

    const text =
      response.choices[0].message.content;

    const scoreMatch =
      text.match(/Score:\s*(\d+)/i);

    const feedbackMatch =
      text.match(/Feedback:\s*([\s\S]*?)Next Question:/i);

    const nextQuestionMatch =
      text.match(/Next Question:\s*([\s\S]*)/i);

    return {
      score: scoreMatch
        ? Number(scoreMatch[1])
        : 7,

      feedback: feedbackMatch
        ? feedbackMatch[1].trim()
        : "Good attempt.",

      nextQuestion: nextQuestionMatch
        ? nextQuestionMatch[1].trim()
        : mockQuestions[
            Math.floor(
              Math.random() * mockQuestions.length
            )
          ],
    };

  } catch (error) {

    console.log(
      "Groq Failed → Using Mock Feedback"
    );

    const randomFeedback =
      mockFeedbacks[
        Math.floor(
          Math.random() * mockFeedbacks.length
        )
      ];

    const randomQuestion =
      mockQuestions[
        Math.floor(
          Math.random() * mockQuestions.length
        )
      ];

    return {
      score: randomFeedback.score,
      feedback: randomFeedback.feedback,
      nextQuestion: randomQuestion,
    };
  }
};