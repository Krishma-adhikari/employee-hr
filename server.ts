import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { AGGREGATE_STATS } from './src/data/mockData.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Middleware to check API key
const checkApiKey = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is missing. Please configure it in Settings > Secrets.'
    });
  }
  next();
};

// API: Analyze individual employee risk
app.post('/api/gemini/analyze', checkApiKey, async (req, res) => {
  try {
    const { input } = req.body;
    if (!input) {
      return res.status(400).json({ error: 'Input profile is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: `Analyze the following employee profile for attrition risk. Assess how attributes like age, department, job role, monthly income, overtime, satisfaction ratings, and tenure affect their potential decision to stay or leave.
Profile:
- Age: ${input.age}
- Gender: ${input.gender}
- Marital Status: ${input.maritalStatus}
- Department: ${input.department}
- Job Role: ${input.jobRole}
- Monthly Income: $${input.monthlyIncome}
- Overtime: ${input.overTime}
- Job Satisfaction: ${input.jobSatisfaction}/4
- Work Life Balance: ${input.workLifeBalance}/4
- Environment Satisfaction: ${input.environmentSatisfaction}/4
- Years at Company: ${input.yearsAtCompany}
- Years Since Last Promotion: ${input.yearsSinceLastPromotion}
- Years with Current Manager: ${input.yearsWithCurrManager}
- Distance From Home: ${input.distanceFromHome} miles`,
      config: {
        systemInstruction: 'You are an elite HR Predictive Analytics AI Engine. Your goal is to assess attrition risk, assign a numerical risk score (0 to 100), classify risk levels (Low, Medium, High), detail major driving factors, and formulate at least 3 custom retention recommendations based on standard organizational psychology.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.INTEGER, description: 'Numerical risk score between 0 and 100.' },
            riskLevel: { type: Type.STRING, description: "Risk level: 'Low' (0-30), 'Medium' (31-70), or 'High' (71-100)." },
            factors: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  factor: { type: Type.STRING, description: 'The evaluation driver (e.g., Overtime, Tenure, Monthly Income).' },
                  impact: { type: Type.STRING, description: "Must be 'Positive' (reduces attrition), 'Negative' (increases attrition), or 'Neutral'." },
                  description: { type: Type.STRING, description: 'Explanation of how this factor influences this specific employee.' }
                },
                required: ['factor', 'impact', 'description']
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'At least 3 concrete, personalized, and practical retention actions for HR to implement.'
            }
          },
          required: ['riskScore', 'riskLevel', 'factors', 'recommendations']
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    res.json(JSON.parse(text.trim()));
  } catch (error: any) {
    console.error('Error analyzing attrition risk:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze employee risk' });
  }
});

// API: AI Assistant Chat
app.post('/api/gemini/chat', checkApiKey, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: messages,
      config: {
        systemInstruction: `You are 'Krishma', an elite HR Analytics & Talent Management AI Consultant. You help HR professionals, executives, and managers analyze organizational attrition, identify turnover root causes, and craft workplace improvement policies.
You have direct access to the company's real aggregate attrition findings:
- Total Company Staff size: ${AGGREGATE_STATS.totalEmployees}
- Attrition Rate: ${AGGREGATE_STATS.attritionRate} (${AGGREGATE_STATS.attritionCount} employees departed)
- Overtime Impact: Staff who work overtime experience a massive ${AGGREGATE_STATS.overtimeAttritionRate} attrition rate compared to only ${AGGREGATE_STATS.noOvertimeAttritionRate} for those who do not. Overtime is a strong attrition predictor.
- Attrition Rate by Department:
  * Sales: ${AGGREGATE_STATS.departmentStats.sales.rate} (${AGGREGATE_STATS.departmentStats.sales.attrition} of ${AGGREGATE_STATS.departmentStats.sales.total} left)
  * Research & Development: ${AGGREGATE_STATS.departmentStats.rd.rate} (${AGGREGATE_STATS.departmentStats.rd.attrition} of ${AGGREGATE_STATS.departmentStats.rd.total} left)
  * Human Resources: ${AGGREGATE_STATS.departmentStats.hr.rate} (${AGGREGATE_STATS.departmentStats.hr.attrition} of ${AGGREGATE_STATS.departmentStats.hr.total} left)
- Satisfaction Impact:
  * Attrition among employees with Low Job Satisfaction (Rating 1) is ${AGGREGATE_STATS.satisfactionStats.lowSatisfactionAttritionRate}.
  * Attrition among employees with High Job Satisfaction (Rating 4) is only ${AGGREGATE_STATS.satisfactionStats.highSatisfactionAttritionRate}.

You are also primed with 10 exact business questions and data-backed answers verified from the core Jupyter Notebook analysis:
1. Sales has the highest attrition rate (${AGGREGATE_STATS.departmentStats.sales.rate}), followed by HR (${AGGREGATE_STATS.departmentStats.hr.rate}), while R&D is lowest (${AGGREGATE_STATS.departmentStats.rd.rate}).
2. Overtime heavily increases attrition (127/416 overtime employees left, vs only 110/1054 non-overtime).
3. Lower salary (monthly income) is clearly linked to higher attrition.
4. Younger employees leave the most (median age 32 for left, 36 for stayed).
5. Job satisfaction has only a weak effect on attrition.
6. Environment satisfaction has a minimal/insignificant effect.
7. Longer tenure reduces attrition (newer employees are at highest risk).
8. Job roles with highest attrition are Sales Representatives, Laboratory Technicians, and Sales Executives.
9. Single employees have the highest attrition rate compared to married or divorced.
10. The most vulnerable cohort is younger, single employees working overtime with low satisfaction.

Maintain a professional, supportive, and analytical tone. Always offer specific, actionable workplace reforms (e.g., manager mentorship training, workload balancing, tenure raises, promotion transparent timelines) rather than generic suggestions.`
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Error in AI assistant chat:', error);
    res.status(500).json({ error: error.message || 'Failed to complete chat response' });
  }
});

// Vite Middleware for Dev and Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
