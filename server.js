require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Allow requests from your deployed frontend's domain.
// Set FRONTEND_URL in your environment (e.g. https://your-app.vercel.app)
// You can list multiple comma-separated origins if needed.
const allowedOrigins = (process.env.FRONTEND_URL || '*')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins.includes('*') ? '*' : allowedOrigins
}));
app.use(express.json());

// NEVER hardcode API keys in source code — read from environment instead.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System instructions: keep the assistant focused on study-related help only.
const SYSTEM_INSTRUCTION = `
You are "LearnHub Assistant", a friendly study helper inside the LearnHub learning app.

Your job is to help students with academic / study-related topics ONLY. This includes:
- Explaining concepts from school/college subjects (math, science, history, languages, programming, etc.)
- Helping with homework, practice problems, and exam preparation
- Summarizing or clarifying study material, notes, and definitions
- Giving study tips, revision strategies, and learning techniques

If the user asks about anything that is NOT related to studying or education
(e.g. general chit-chat, entertainment, personal advice, news, etc.),
politely respond that you can only help with study-related questions,
and invite them to ask something about their studies instead.
Keep that reply short and friendly — do not lecture the user.

Keep all answers clear, accurate, and appropriately concise for a student.
Never provide harmful, unsafe, or inappropriate content.
`.trim();

app.post('/chat', async (req, res) => {
  try {
    const userMessage = (req.body.message || '').toString().trim();

    if (!userMessage) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: SYSTEM_INSTRUCTION
    });

    const result = await model.generateContent(userMessage);
    const reply = result.response.text();
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Gemini error: ' + e.message });
  }
});

// Health check — useful for confirming the deployed backend is reachable
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Most hosting platforms (Render, Railway, etc.) assign the port via env var
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Chat server running on port ${PORT}`));