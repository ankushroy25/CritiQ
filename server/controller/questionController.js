const QuestionSet = require("../models/Question.js");

const createQuestion = async (req, res) => {
  try {
    console.log("Body :", req.body);
    const {
      productName,
      productDescription,
      productImageUrl,
      isOrderIdTracking,
      reviewDate,
      excelFile,
      questions,
    } = req.body;

    const newQuestionSet = new QuestionSet({
      productName: productName,
      productDescription: productDescription,
      productImageUrl: productImageUrl,
      isOrderIdTracking: isOrderIdTracking,
      reviewDate: isOrderIdTracking ? reviewDate : null,
      excelFile: !isOrderIdTracking ? excelFile : null,
      questions: questions,
    });

    const data = await newQuestionSet.save();
    res
      .status(201)
      .send({ data: data, message: "Form submitted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const getQuestions = async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    const questionSet = await QuestionSet.findOne({ _id: id });
    if (!questionSet) {
      return res.status(404).json({ message: "Questions not found" });
    }
    res.json({
      isOrderIdTracking: questionSet.isOrderIdTracking,
      questions: questionSet.questions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { createQuestion, getQuestions };
