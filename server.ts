import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 1. Setup Environment
dotenv.config();
const app = express();

// 2. Middleware
// CORS is critical - it allows your mobile APK to talk to this server
app.use(cors());
app.use(express.json());

// 3. Initialize Gemini AI
// Make sure to add GOOGLE_API_KEY to your Render Environment Variables!
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// --- ROUTE 1: AI COACH CHAT ---
app.post('/api/ai/coach', async (req, res) => {
  try {
    const { message, history, userProfile } = req.body;

    // Create a context-aware prompt for the "Premium" experience
    const contextPrompt = `
      You are the NAVZLAB AI Fitness Coach. 
      User Profile: ${userProfile.displayName}, Age: ${userProfile.age}, Level: ${userProfile.fitnessLevel}.
      Goal: ${userProfile.dailyWorkoutGoalMin} mins daily.
      Be encouraging, professional, and safety-focused.
      User says: ${message}
    `;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({ reply: text });
  } catch (error) {
    console.error("Coach Error:", error);
    res.status(500).json({ error: "AI Coach is resting. Try again later." });
  }
});

// --- ROUTE 2: AI WORKOUT GENERATOR ---
app.post('/api/ai/generate-workout', async (req, res) => {
  try {
    const { fitnessLevel, goal, durationMinutes, equipment } = req.body;

    const prompt = `
      Generate a structured JSON workout plan for a ${fitnessLevel} athlete.
      Goal: ${goal}. Duration: ${durationMinutes} minutes. Equipment: ${equipment}.
      Return ONLY a JSON object with this structure:
      {
        "title": "Workout Name",
        "overview": "Short description",
        "warmUp": [{"name": "Exercise", "duration": "Time", "instructions": "How to"}],
        "mainRoutine": [{"name": "Exercise", "sets": "3", "repsOrTime": "10", "rest": "60s", "instructions": "How to"}],
        "coolDown": [{"name": "Exercise", "duration": "Time", "instructions": "How to"}],
        "safetyReminder": "Safety tip"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean up Gemini's markdown if necessary
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    res.json({ workoutPlan: JSON.parse(text) });
  } catch (error) {
    console.error("Generator Error:", error);
    res.status(500).json({ error: "Failed to generate plan." });
  }
});

// --- BASE ROUTE (For Health Check) ---
app.get('/', (req, res) => {
  res.send("NAVZLAB AI Backend is ONLINE 🚀");
});

// 4. Start Server
// Render/Railway provide a PORT variable automatically
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
