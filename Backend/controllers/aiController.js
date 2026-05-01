

export const generateInterviewPrep = async (req, res) => {
  try {
    const { resume, jobDesc } = req.body;

    if (!resume || !jobDesc) {
      return res.status(400).json({
        message: "Resume and Job Description are required",
      });
    }

    const result = await getInterviewPrepAI(resume, jobDesc);

    res.json(result);

  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "AI service failed" });
  }
};
