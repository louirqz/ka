import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '20mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const getAiClient = () => {
  if (!process.env.GEMINI_API_KEY) return null;
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// API endpoint for general Gemini prompt
app.post('/api/gemini/generate', async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        text: 'API Key not configured on server. Fallback response generated.'
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: systemInstruction ? { systemInstruction } : undefined
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: error.message || 'Failed to process AI generation',
      fallback: true
    });
  }
});

// AI Skin Tone analysis route with Gemini vision if image is provided
app.post('/api/analyze/skin', async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    const ai = getAiClient();

    if (ai && imageBase64) {
      try {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');
        const prompt = `Analyze this face photo for personal color and skin tone undertone.
Categorize into exactly one of: 'Warm Tone', 'Cool Tone', 'Neutral Tone'.
Return JSON format:
{
  "tone": "Warm Tone" | "Cool Tone" | "Neutral Tone",
  "confidence": number,
  "description": "Thai explanation of skin undertone and radiant highlights",
  "bestColors": [{"name": "string", "hex": "#hexcode"}],
  "tryColors": [{"name": "string", "hex": "#hexcode"}],
  "contrastColors": [{"name": "string", "hex": "#hexcode"}]
}`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: 'image/jpeg',
                  data: cleanBase64
                }
              },
              { text: prompt }
            ]
          }
        });

        const text = geminiRes.text || '';
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return res.json({ skinTone: parsed });
        }
      } catch (geminiErr) {
        console.warn('Gemini vision call failed, using algorithmic fallback:', geminiErr);
      }
    }

    // Default fallback
    res.json({
      skinTone: null
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString()
  });
});

// Mount Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`StyleMatch AI server listening on http://0.0.0.0:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
