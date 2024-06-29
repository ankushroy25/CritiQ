import { generate } from "@genkit-ai/ai";
import { configureGenkit } from "@genkit-ai/core";
import { defineFlow, run, runFlow, startFlowsServer } from "@genkit-ai/flow";
import express from "express";
import * as z from "zod";
import { ollama } from "genkitx-ollama";
import cors from "cors";
// import axios from "axios";
const app = express();
app.use(express.json());
app.use("", cors());

configureGenkit({
  plugins: [
    ollama({
      models: [
        {
          name: "gemma:2b",
          type: "generate",
        },
        {
          name: "llama3",
          type: "generate",
        }
      ],
      serverAddress: "http://127.0.0.1:11434", // default ollama local address
    }),
  ],
  logLevel: "debug",
  enableTracingAndMetrics: true,
});

const quesSuggestionFlow = defineFlow(
  {
    name: "quesSuggestionFlow",
    inputSchema: z.object({
      cname: z.string(),
      cdetails: z.string(),
      pname: z.string(),
      pdetails: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ cname, cdetails, pname, pdetails }) => {
    const llmResponse = await generate({
      prompt: `Please generate a list of 5 questions that can be used to gather customer feedback on the product "${pname}". This product is made by the company "${cname}". Here are the company details: ${cdetails}. Here are the product details: ${pdetails}. The questions should be a mix of multiple choice and short answer types. These questions should help the company understand how customers feel about the product, their experience using it, and how it can be improved. The questions should focus on customer satisfaction, product features, usability, and areas for improvement.`,
      model: "ollama/gemma:2b",
      config: {
        temperature: 1,
      },
    });

    return llmResponse.text();
  }
);


const answerValidationFlow = defineFlow(
  {
    name: "answerValidationFlow",
    inputSchema: z.object({
      question: z.string(),
    }),
    outputSchema: z.string(),
  },
  async ({ question }) => {
    const llmResponse = await generate({
      prompt: `Below are multiple questions and their corresponding answers. Your job is to validate the question-answer set. For each set, determine if the answer is correct for the given question. Respond with "yes" if the answer is correct or "no" if it is not.
      For example:1)If the Question is how is the battery life of the product? and the answer is "The battery life is 10 hours", then the response should be "yes".
      2)If the question is how much do you like the product and the answer is "I love this product a lot and its features are amazing", then the response should be "yes".
      3)If the question is what are the good features of the product and the answer is "Good build quality,etc related to the product", then the response should be "yes".
      4)If the question is what are the bad features of the product and the answer is "My name is John" or "avqudkbefbrk" or something not related to the question, then the response should be "no".
      5)If the question is how is the customer service of the company and the answer is "The product is amazing" or any random text which is not related to the question, then the response should be "no".
      6)If the question is how is the product and the answer is "The product is amazing" then the response should be "yes".
      Final response from the LLM should be yes yes yes no no yes for the above set of question-answers.

${question}

Provide your response for each question-answer pair on a separate line..The number of response should be equal to number of question-answer set.
`,
      model: "ollama/llama3",
      config: {
        temperature: 0,
      },
    });

    return llmResponse.text();
  }
);


const answerValidationFlow1 = defineFlow(
  {
    name: "answerValidationFlow",
    inputSchema: z.object({
      question: z.string(),
      answer: z.string()
    }),
    outputSchema: z.string(),
  },
  async ({ question,answer }) => {
    const llmResponse = await generate({
      prompt: `Below is a question and its answer, give me response if the answer is correct then "yes" else give the response "no".
      For example:1)If the Question is how is the battery life of the product? and the answer is "The battery life is 10 hours", then the response should be "yes".
      2)If the question is how much do you like the product and the answer is i like it a lot, then the response should be "yes" but if the answer was totally unrelatable to the question like 3)How was the design of phone? and the answer given is "my name is sattwik" then response should be no as it is not even relatable.

      The question and answer to be checked is: Question: ${question} -> Answer: ${answer}
`,
      model: "ollama/llama3",
      config: {
        temperature: 0,
      },
    });

    return llmResponse.text();
  }
);

app.post("/generate-questions", async (req, res) => {
  const { pname, cname, pdetails, cdetails } = req.body;
  console.log(req.body);
  try {
    const response = await runFlow(quesSuggestionFlow, {
      cname: cname,
      cdetails: cdetails,
      pname: pname,
      pdetails: pdetails,
    });

    res.status(200).json({ questions: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

app.post("/validate-answer", async (req, res) => {
  const { qna } = req.body;
  console.log(req.body);
  try {
    var all = "";
    for (let i = 0; i < qna.length; i++) {
      all +=
        "Question " +
        (i + 1) +
        ": " +
        qna[i].question +
        " and -> its answer: " +
        qna[i].answer +
        ". ->  ";
    }
    console.log(all);
    const response = await runFlow(answerValidationFlow, {
      question: all,
    });
    res.status(200).json({ validation: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to validate answer" });
  }
});

app.post("/validate-answer2", async (req, res) => {
  const { qna } = req.body;
  console.log(req.body);
  try {
    var all = "";
    for (let i = 0; i < qna.length; i++) {
      const response = await runFlow(answerValidationFlow1, {
        question: qna[i].question,
        answer: qna[i].answer,
      });
      all +=response;
      all +=" ,,,, "; 
    }
    console.log(all);
    
    res.status(200).json({ validation: all});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to validate answer" });
  }
});
 //103   837506


 //103   837506

// Start the server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  //startFlowsServer();
});
