
import dotenv from "dotenv";
dotenv.config();

import Groq from "groq-sdk";

import { mockQuestions } from "../data/mockQuestions.js";
import { mockFeedbacks } from "../data/mockFeedback.js";

// =======================================
// GROQ CLIENT
// =======================================
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
      Generate ONE professional interview question.

      Job Role:
      ${jobRole}

      Job Description:
      ${jobDesc}

      Keep the question concise and professional.
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
      Math.floor(
        Math.random() * mockQuestions.length
      )
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

      Evaluate the answer professionally.

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

    // =======================================
    // EXTRACT SCORE
    // =======================================
    const scoreMatch =
      text.match(/Score:\s*(\d+)/i);

    // =======================================
    // EXTRACT FEEDBACK
    // =======================================
    const feedbackMatch =
      text.match(
        /Feedback:\s*([\s\S]*?)Next Question:/i
      );

    // =======================================
    // EXTRACT NEXT QUESTION
    // =======================================
    const nextQuestionMatch =
      text.match(
        /Next Question:\s*([\s\S]*)/i
      );

    // =======================================
    // RANDOMLY END INTERVIEW
    // =======================================
    const shouldEndInterview =
      Math.random() > 0.7;

    return {

      score: scoreMatch
        ? Number(scoreMatch[1])
        : 7,

      feedback: feedbackMatch
        ? feedbackMatch[1].trim()
        : "Good attempt.",

      nextQuestion: shouldEndInterview
        ? null
        : nextQuestionMatch
          ? nextQuestionMatch[1].trim()
          : mockQuestions[
              Math.floor(
                Math.random() *
                mockQuestions.length
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
          Math.random() *
          mockFeedbacks.length
        )
      ];

    const randomQuestion =
      mockQuestions[
        Math.floor(
          Math.random() *
          mockQuestions.length
        )
      ];

    // =======================================
    // RANDOMLY END INTERVIEW
    // =======================================
    const shouldEndInterview =
      Math.random() > 0.7;

    return {

      score: randomFeedback.score,

      feedback: randomFeedback.feedback,

      nextQuestion: shouldEndInterview
        ? null
        : randomQuestion,
    };
  }
};