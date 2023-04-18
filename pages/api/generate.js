import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { textInput } = req.body;
  if (textInput.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid request",
      },
    });
    return;
  }

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: generateMessage(textInput),
      temperature: 0.6,
    });
    res.status(200).json({ result: completion.data.choices[0].message });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

const generateMessage = (textInput) => {
  return [
    {
      role: "system",
      content:
        "You are a virtual assistant an implementation of a language model trained by OpenAI",
    },
    { role: "user", content: textInput },
  ];
};

const sendAndSleep = function (response, counter) {
  if (counter > 10) {
    response.end();
  } else {
    response.write(`{ data: ${counter} }`);
    counter++;
    setTimeout(function () {
      sendAndSleep(response, counter);
    }, 1000);
  }
};
