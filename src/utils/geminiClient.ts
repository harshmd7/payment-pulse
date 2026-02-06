// src/utils/geminiClient.ts

// 1. DEFINE THE BRAIN 🧠
// This tells the AI exactly how your app works.
const APP_CONTEXT = `
You are the AI Assistant for "Payment Pulse", a B2B Debt Recovery Dashboard.
Your goal is to help users manage customer risk, analyze debts, and suggest recovery strategies.

--- APP CONTEXT ---
1. TECH STACK:
   - Frontend: React (Vite) + TypeScript + Tailwind CSS
   - Icons: Lucide React (e.g., Crown, Brain, TrendingUp)
   - Backend: Supabase (PostgreSQL)
   - Auth: Supabase Auth (Google & Email)

2. CORE FEATURES:
   - Risk Analysis: Scores customers 0-100 (High Risk >= 70, Moderate >= 40, Low < 40).
   - "Royal UI": A premium theme using Deep Blue (#1b4079), Steel Blue, and Gold colors.
   - Smart Ranking: Customers are sorted by "Advanced Risk Score" (weighted by days overdue & amount).
   - Integration: Supports CSV uploads and Simulated GPay/UPI sync.

3. DATA STRUCTURE (Customer):
   - id, name, email, phone
   - outstanding_amount (in INR ₹)
   - days_overdue (integer)
   - risk_score (calculated 0-100)
   - status ('active', 'resolved', 'high_risk')

4. YOUR BEHAVIOR:
   - Be concise, professional, and strategic.
   - Use financial terminology (e.g., "DSO", "Recovery Rate", "Liquidity").
   - If asked about code, assume React/TypeScript.
   - Always formatted responses nicely (use bullet points or bold text).
`;

export async function sendToGemini(
  prompt: string, 
  dynamicContext?: string // Optional: Pass current page data here (e.g., selected customer)
): Promise<string | null> {
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  if (!apiKey) {
    console.error("Gemini API Key is missing");
    return null;
  }

  // Target the Flash model for speed
  const model = "gemini-2.5-flash";
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // 2. COMBINE CONTEXT + USER PROMPT
  // We combine the static App Context, any dynamic data (like current customer), and the user's question.
  const fullPrompt = `
    ${APP_CONTEXT}
    
    ${dynamicContext ? `--- CURRENT PAGE DATA ---\n${dynamicContext}\n` : ''}

    --- USER QUESTION ---
    ${prompt}
  `;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: fullPrompt }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.7 // Slightly creative but focused
        }
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error("Gemini API Error:", errorData);
      return null;
    }

    const data = await res.json();

    if (data.candidates && data.candidates.length > 0) {
      const content = data.candidates[0].content;
      if (content && content.parts && content.parts.length > 0) {
        return content.parts[0].text;
      }
    }

    return null;
  } catch (err) {
    console.error("Network Error:", err);
    return null;
  }
}