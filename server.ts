import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, userProfile } = req.body;
    const prompt = `Context: User ${userProfile?.displayName || 'Athlete'} at Navzlab Fitness. Prompt: ${message}`;
    const result = await model.generateContent(prompt);
    res.json({ reply: result.response.text() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI is processing. Try again." });
  }
});

app.get('/', (req, res) => res.send("NAVZLAB ONLINE 🚀"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server live on ${PORT}`));
