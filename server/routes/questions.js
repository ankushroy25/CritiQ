
const express = require('express');
const { createQuestion, getQuestions } = require('../controller/questionController');
const router = express.Router();


router.post('/question', createQuestion);
router.get('/question/:id', getQuestions);
module.exports = router;