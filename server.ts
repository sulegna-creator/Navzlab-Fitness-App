import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy initialization of Gemini Client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required.");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "NAVZLAB Health and Fitness Monitor Backend"
    });
  });

  // AI Coach endpoint
  app.post("/api/ai/coach", async (req, res) => {
    const { message, history, userProfile, recentStats } = req.body;

    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }

    const name = userProfile?.name || 'Athlete';
    const fitnessLevel = userProfile?.fitnessLevel || 'Beginner';
    const steps = recentStats?.steps || 0;
    const activeMins = recentStats?.activeMinutes || 0;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const systemInstruction = `You are NAVZLAB AI Coach, a supportive, encouraging, and highly knowledgeable personal fitness companion for the NAVZLAB Health and Fitness Monitor application.
Your tagline is "Monitor. Move. Improve."

IMPORTANT HEALTH & SAFETY RULES:
1. You MUST NOT offer formal medical diagnosis or prescribe medications.
2. If a user asks about chest pain, severe injury, or acute dizziness, ALWAYS advise consulting a physician or emergency medical services immediately.
3. Keep advice practical, safe, encouraging, and tailored to the user's provided fitness profile and activity stats when available.

User Context:
- Name: ${name}
- Age: ${userProfile?.age || 'Not specified'}
- Fitness Level: ${fitnessLevel}
- Daily Goals: ${userProfile?.dailyStepGoal || 10000} steps, ${userProfile?.dailyWaterGoal || 2.5}L water, ${userProfile?.dailyWorkoutGoal || 30}m workout
- Recent Stats: Steps today: ${steps}, Active mins: ${activeMins}, Water: ${recentStats?.waterMl || 0}ml, Workouts completed: ${recentStats?.workoutCount || 0}
`;

        const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          history.slice(-6).forEach((h: { sender: string; text: string }) => {
            contents.push({
              role: h.sender === 'user' ? 'user' : 'model',
              parts: [{ text: h.text }]
            });
          });
        }

        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        });

        if (response.text) {
          res.json({ reply: response.text });
          return;
        }
      }
    } catch (error: any) {
      console.error("AI Coach API call failed, providing intelligent coach response:", error?.message);
    }

    // Intelligent fallback response if API key is not present or Gemini fails
    const lowerMsg = message.toLowerCase();
    let fallbackReply = "";

    if (lowerMsg.includes("workout") || lowerMsg.includes("do today") || lowerMsg.includes("exercise")) {
      fallbackReply = `Hey ${name}! For a ${fitnessLevel} level, I recommend starting with a 20-30 minute moderate session. Focus on 5 minutes of dynamic warming up, followed by bodyweight squats, incline push-ups, and core holds. Remember to stay hydrated and rest when needed!`;
    } else if (lowerMsg.includes("perform") || lowerMsg.includes("stat") || lowerMsg.includes("week") || lowerMsg.includes("how did i")) {
      fallbackReply = `Great checking in, ${name}! You have recorded ${steps.toLocaleString()} steps and ${activeMins} active minutes today. Consistency is key—aim for balanced movement each day and celebrate every step forward!`;
    } else if (lowerMsg.includes("consistency") || lowerMsg.includes("improve") || lowerMsg.includes("goal")) {
      fallbackReply = `Building consistency comes down to small, repeatable daily habits: 1) Schedule workout times like appointments, 2) Keep your daily water goal of ${userProfile?.dailyWaterGoal || 2.5}L within reach, and 3) Focus on how great you feel after moving!`;
    } else {
      fallbackReply = `I'm here to support your fitness journey, ${name}! Remember: Monitor your progress, Move consistently, and Improve step by step. What specific workout or fitness goal are you focusing on today?`;
    }

    res.json({ reply: fallbackReply });
  });

  // AI Workout Generator endpoint
  app.post("/api/ai/generate-workout", async (req, res) => {
    const { fitnessLevel, goal, durationMinutes, equipment } = req.body;
    const dur = durationMinutes || 30;
    const level = fitnessLevel || 'Beginner';
    const userGoal = goal || 'General Fitness';
    const equip = equipment || 'None (Bodyweight)';

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (apiKey) {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        const prompt = `Generate a structured, safe, and effective ${dur}-minute workout for a user with:
- Fitness Level: ${level}
- Primary Goal: ${userGoal}
- Available Equipment: ${equip}

Return your response in strict valid JSON with this exact schema:
{
  "title": "Short energetic title",
  "overview": "Brief overview description",
  "warmUp": [
    { "name": "Exercise name", "duration": "e.g. 2 min", "instructions": "Key form tip" }
  ],
  "mainRoutine": [
    { "name": "Exercise name", "sets": "e.g. 3", "repsOrTime": "e.g. 10-12 reps", "rest": "e.g. 45 sec", "instructions": "Key form tip" }
  ],
  "coolDown": [
    { "name": "Exercise name", "duration": "e.g. 2 min", "instructions": "Key tip" }
  ],
  "safetyReminder": "Safety caution and reminder to stay hydrated and listen to body."
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.7
          }
        });

        if (response.text) {
          const workoutPlan = JSON.parse(response.text);
          res.json({ workoutPlan });
          return;
        }
      }
    } catch (error: any) {
      console.error("AI Workout Generator API call failed, generating structured workout template:", error?.message);
    }

    // Fallback workout plan
    res.json({
      workoutPlan: {
        title: `${dur}-Minute ${level} ${userGoal} Routine`,
        overview: `A structured ${dur}-minute routine using ${equip} designed to improve ${userGoal.toLowerCase()} safely.`,
        warmUp: [
          { name: "Arm Circles & Torso Twists", duration: "2 min", instructions: "Gentle mobility movements to activate joints." },
          { name: "March in Place / Jumping Jacks", duration: "3 min", instructions: "Gradually raise heart rate and body temperature." }
        ],
        mainRoutine: [
          { name: equip.includes('Dumbbell') ? "Dumbbell Goblet Squats" : "Bodyweight Squats", sets: "3", repsOrTime: "10-12 reps", rest: "45 sec", instructions: "Keep chest lifted and knees tracking over toes." },
          { name: "Push-ups (Incline or Floor)", sets: "3", repsOrTime: "8-10 reps", rest: "45 sec", instructions: "Maintain strong core plank position throughout." },
          { name: "Reverse Lunges", sets: "3", repsOrTime: "10 reps each leg", rest: "45 sec", instructions: "Step back smoothly with controlled knee depth." },
          { name: "Plank Hold", sets: "3", repsOrTime: "20-30 sec", rest: "45 sec", instructions: "Engage glutes and brace abdominal core." }
        ],
        coolDown: [
          { name: "Standing Quadriceps & Hamstring Stretch", duration: "2 min", instructions: "Hold gently without bouncing." },
          { name: "Child's Pose Deep Breathing", duration: "3 min", instructions: "Slow deep breaths into abdomen to lower heart rate." }
        ],
        safetyReminder: "Listen to your body. Stay hydrated and pause immediately if you experience pain or dizziness."
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
