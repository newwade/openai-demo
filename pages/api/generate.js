import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (!configuration.apiKey) {
      const error = {
        response: {
          status: 500,
          data: {
            error: {
              type: "internal_server_error",
              message: "OpenAI API key not configured",
            },
          },
        },
      };
      throw error;
    }
    const { textInput } = req.body;
    if (textInput.trim().length === 0) {
      const error = {
        response: {
          status: 400,
          data: {
            error: {
              type: "invalid_request_error",
              message: "Input value is empty",
            },
          },
        },
      };
      throw error;
    }

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
      console.error(error.message);
      res.status(500).json({
        error: {
          message: error.message,
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
        "You are a virtual assistant named K9, an implementation of a language model trained by OpenAI",
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
