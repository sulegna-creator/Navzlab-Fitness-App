var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = 3e3;
app.use(import_express.default.json());
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new import_genai.GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "NAVZLAB Health and Fitness Monitor" });
});
app.post("/api/ai/coach", async (req, res) => {
  try {
    const { message, history, userProfile, recentStats } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required." });
      return;
    }
    const ai = getGeminiClient();
    const systemInstruction = `You are NAVZLAB AI Coach, a supportive, encouraging, and highly knowledgeable personal fitness companion for the NAVZLAB Health and Fitness Monitor application.
Your tagline is "Monitor. Move. Improve."

IMPORTANT HEALTH & SAFETY RULES:
1. Provide general fitness, workout, nutrition concept, and motivation guidance ONLY.
2. DO NOT diagnose medical conditions, prescribe treatments, or make medical claims.
3. If the user mentions concerning medical symptoms (e.g. chest pain, dizziness, severe pain, shortness of breath, fainting, severe discomfort), IMMEDIATELY and clearly advise them to stop exercising, rest, and consult a qualified healthcare professional or emergency service.
4. Keep advice practical, safe, encouraging, and tailored to the user's provided fitness profile and activity stats when available.

User Context:
- Name: ${userProfile?.name || "Athlete"}
- Age: ${userProfile?.age || "Not specified"}
- Fitness Level: ${userProfile?.fitnessLevel || "Beginner"}
- Daily Goals: ${userProfile?.dailyStepGoal || 1e4} steps, ${userProfile?.dailyWaterGoal || 2.5}L water, ${userProfile?.dailyWorkoutGoal || 30}m workout
- Recent Stats: Steps today: ${recentStats?.steps || 0}, Active mins: ${recentStats?.activeMinutes || 0}, Water: ${recentStats?.waterMl || 0}ml, Workouts completed: ${recentStats?.workoutCount || 0}
`;
    const contents = [];
    if (Array.isArray(history)) {
      history.slice(-6).forEach((h) => {
        contents.push({
          role: h.sender === "user" ? "user" : "model",
          parts: [{ text: h.text }]
        });
      });
    }
    contents.push({
      role: "user",
      parts: [{ text: message }]
    });
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 800
      }
    });
    res.json({ reply: response.text || "I'm here to support your fitness journey. How can I help you train safely today?" });
  } catch (error) {
    console.error("AI Coach Error:", error);
    res.status(500).json({
      reply: "NAVZLAB AI Coach is temporarily unavailable. Please check your network or API settings and try again.",
      error: error.message
    });
  }
});
app.post("/api/ai/generate-workout", async (req, res) => {
  try {
    const { fitnessLevel, goal, durationMinutes, equipment } = req.body;
    const ai = getGeminiClient();
    const prompt = `Generate a structured, safe, and effective ${durationMinutes || 30}-minute workout for a user with:
- Fitness Level: ${fitnessLevel || "Beginner"}
- Primary Goal: ${goal || "General Fitness"}
- Available Equipment: ${equipment || "None (Bodyweight)"}

Return your response in strict valid JSON with this exact schema:
{
  "title": "Short descriptive workout title",
  "overview": "2-sentence summary of the routine",
  "warmUp": [
    { "name": "Exercise name", "duration": "e.g. 2 min", "instructions": "Brief form tip" }
  ],
  "mainRoutine": [
    { "name": "Exercise name", "sets": "e.g. 3", "repsOrTime": "e.g. 10 reps or 30 sec", "rest": "30 sec", "instructions": "Form tip" }
  ],
  "coolDown": [
    { "name": "Stretch name", "duration": "e.g. 2 min", "instructions": "Brief instruction" }
  ],
  "safetyReminder": "Safety caution and reminder to stay hydrated and listen to body."
}`;
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7
      }
    });
    const workoutPlan = JSON.parse(response.text || "{}");
    res.json({ workoutPlan });
  } catch (error) {
    console.error("AI Workout Generator Error:", error);
    res.status(500).json({
      error: error.message,
      fallbackWorkout: {
        title: `${req.body.durationMinutes || 30}-Minute ${req.body.fitnessLevel || "Beginner"} ${req.body.goal || "Fitness"} Workout`,
        overview: "A well-balanced total body routine designed to build endurance and strength safely.",
        warmUp: [
          { name: "Arm Circles & Torso Twists", duration: "2 min", instructions: "Gentle movements to activate joints." },
          { name: "Jumping Jacks / March in Place", duration: "3 min", instructions: "Gradually raise heart rate." }
        ],
        mainRoutine: [
          { name: "Bodyweight Squats", sets: "3", repsOrTime: "10-12 reps", rest: "45 sec", instructions: "Keep chest lifted and knees tracking over toes." },
          { name: "Push-ups (Incline or Knees)", sets: "3", repsOrTime: "8-10 reps", rest: "45 sec", instructions: "Maintain strong core plank position." },
          { name: "Reverse Lunges", sets: "3", repsOrTime: "10 reps each leg", rest: "45 sec", instructions: "Step back smoothly with controlled depth." },
          { name: "Plank Hold", sets: "3", repsOrTime: "20-30 sec", rest: "45 sec", instructions: "Engage glutes and core." }
        ],
        coolDown: [
          { name: "Standing Hamstring & Quadriceps Stretch", duration: "2 min", instructions: "Hold gently without bouncing." },
          { name: "Child's Pose Deep Breathing", duration: "3 min", instructions: "Slow deep breaths into abdomen." }
        ],
        safetyReminder: "Listen to your body. Stay hydrated and pause immediately if you experience pain or dizziness."
      }
    });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NAVZLAB server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
