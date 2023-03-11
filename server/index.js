const { Configuration, OpenAIApi } = require("openai");
const fastify = require('fastify')({ logger: true });
const fastifyCors = require('@fastify/cors');
const fs = require('fs').promises;
require('dotenv').config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

fastify.register(fastifyCors, {
  origin: true
});

const openai = new OpenAIApi(configuration);

let grace_prompt = [];

async function loadGracePrompt() {
    try {
        const data = await fs.readFile('./grace_prompt.json');
        grace_prompt = JSON.parse(data);
    } catch (err) {
        throw new Error('Failed to load Grace. Please refresh the app.');
    }
}
loadGracePrompt();

fastify.post('/', async (req, res) => {
  const data = req.body.prompt;
  console.log(data)
  let prompt;
  if (data.length === 1) {
    grace_prompt.push(data[0]);
    prompt = grace_prompt;
  } else {
    grace_prompt.push(...data);
    prompt = grace_prompt;
  }
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
    });
    console.log(completion.data.choices[0].message);
    res.send({
      message: completion.data.choices[0].message,
    });
  } catch (err) {
    console.error("Error calling OpenAI API:", err);
  }
});

fastify.listen({
  port: process.env.PORT || 3080,
  host: '0.0.0.0'
}, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);
});

