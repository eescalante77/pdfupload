require('dotenv').config();
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI connection...');
    console.log('API Key (first 5 chars):', process.env.OPENAI_API_KEY.substring(0, 5) + '...');
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello world' }
      ],
      max_tokens: 5
    });
    
    console.log('OpenAI Response:', response.choices[0].message.content);
    console.log('Connection successful!');
  } catch (error) {
    console.error('Error connecting to OpenAI:');
    console.error(error.message);
    console.error(error.stack);
  }
}

testOpenAI(); 