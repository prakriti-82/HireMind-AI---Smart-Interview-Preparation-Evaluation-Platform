import Groq from "groq-sdk";

import { mockQuestions } from "../data/mockQuestions.js";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// =======================================
// FAST + CHEAP MODEL
// =======================================
const MODEL =
  "llama-3.1-8b-instant";

// =======================================
// SAFE GROQ CALL
// =======================================
const groqCall = (messages) =>
  Promise.race([
    groq.chat.completions.create({
      messages,

      model: MODEL,

      response_format: {
        type: "json_object",
      },

      temperature: 0.7,

      max_tokens: 700,
    }),

    new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Groq timeout")
          ),
        10000
      )
    ),
  ]);

// =======================================
// INTERVIEW PERSONALITIES
// =======================================
const personalityPrompts = {
  friendly:
    "You are a supportive and encouraging interviewer.",

  strict:
    "You are a strict FAANG interviewer who expects concise and technically accurate answers.",

  challenging:
    "You are a challenging senior engineer interviewer who asks deep follow-up questions.",

  "google-style":
    "You are a Google interviewer focused on problem solving, clarity, structured thinking, and communication.",
};

// =======================================
// DIFFICULTY RULES
// =======================================
const difficultyInstructions = {
  easy:
    "Ask beginner-friendly interview questions.",

  medium:
    "Ask intermediate-level industry interview questions.",

  hard:
    "Ask advanced FAANG-level technical questions.",
};

// =======================================
// GENERATE QUESTION
// =======================================
export const generateInterviewQuestion =
  async (
    jobRole,
    jobDesc,
    resumeText = "",
    options = {}
  ) => {

    try {

      const {
        difficulty = "medium",

        personality =
          "friendly",

        round =
          "technical",

        previousQuestions = [],
      } = options;

      const prompt = `
Generate ONE realistic ${round} interview question.

IMPORTANT:
- Return ONLY valid JSON
- Avoid repeating previous questions
- Make the question natural and human-like

JSON FORMAT:
{
  "question": "<question>"
}

INTERVIEWER PERSONALITY:
${
  personalityPrompts[
    personality
  ]
}

DIFFICULTY:
${
  difficultyInstructions[
    difficulty
  ]
}

ROLE:
${jobRole || "General Role"}

JOB DESCRIPTION:
${(
  jobDesc || ""
).slice(0, 1000)}

RESUME:
${(
  resumeText || ""
).slice(0, 1000)}

PREVIOUS QUESTIONS:
${previousQuestions.join("\n")}
`;

      const response =
        await groqCall([
          {
            role: "user",

            content: prompt,
          },
        ]);

      const text =
        response.choices[0]
          .message.content;

      const parsed = JSON.parse(
        text
          .replace(
            /```json|```/g,
            ""
          )
          .trim()
      );

      return (
        parsed.question ||
        mockQuestions[
          Math.floor(
            Math.random() *
              mockQuestions.length
          )
        ]
      );

    } catch (error) {

      console.error(
        "Groq generateQuestion failed:",
        error.message
      );

      return mockQuestions[
        Math.floor(
          Math.random() *
            mockQuestions.length
        )
      ];
    }
  };

// =======================================
// EVALUATE ANSWER
// =======================================
export const evaluateInterviewAnswer =
  async (
    question,
    answer,
    questionCount,
    options = {}
  ) => {

    try {

      const {
        difficulty = "medium",

        personality =
          "friendly",

        round =
          "technical",
      } = options;

      const isLast =
        questionCount >= 5;

      const prompt = `
You are conducting a professional ${round} interview.

Evaluate the candidate answer realistically.

IMPORTANT:
- Return ONLY JSON
- Give concise feedback
- Score from 1-10
- Ask stronger follow-up questions if answer is good
- Ask simpler questions if answer is weak

JSON FORMAT:
${
  isLast

    ? `
{
  "score": 8,
  "feedback": "<feedback>",
  "nextQuestion": null
}
`

    : `
{
  "score": 8,
  "feedback": "<feedback>",
  "nextQuestion": "<question>"
}
`
}

INTERVIEWER:
${
  personalityPrompts[
    personality
  ]
}

DIFFICULTY:
${
  difficultyInstructions[
    difficulty
  ]
}

QUESTION:
${question}

ANSWER:
${answer.slice(0, 3000)}

QUESTION NUMBER:
${questionCount} of 5
`;

      const response =
        await groqCall([
          {
            role: "user",

            content: prompt,
          },
        ]);

      const text =
        response.choices[0]
          .message.content;

      const result = JSON.parse(
        text
          .replace(
            /```json|```/g,
            ""
          )
          .trim()
      );

      return {

        score: Math.min(
          10,

          Math.max(
            0,

            Number(
              result.score
            ) || 7
          )
        ),

        feedback:
          result.feedback ||
          "Good answer.",

        nextQuestion: isLast
          ? null
          : result.nextQuestion ||
            null,
      };

    } catch (error) {

      console.error(
        "Groq evaluateAnswer failed:",
        error.message
      );

      return {

        score:
          Math.floor(
            Math.random() * 4
          ) + 6,

        feedback:
          "Good attempt. Improve clarity, communication, and technical depth.",

        nextQuestion:
          questionCount >= 5

            ? null

            : mockQuestions[
                Math.floor(
                  Math.random() *
                    mockQuestions.length
                )
              ],
      };
    }
  };