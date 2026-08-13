import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, userProfile } = req.body;
    const prompt = `Navzlab AI Coach: Answer "${message}" for ${userProfile?.displayName || 'User'}`;
    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    res.status(500).json({ error: "AI Busy" });
  }
});

app.get('/', (req, res) => res.send("NAVZLAB ONLINE 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Live on ${PORT}`));
