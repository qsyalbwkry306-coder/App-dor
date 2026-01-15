
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

// This script expects the API key to be available as `process.env.API_KEY`.
// In the AI Studio environment, this is injected automatically.
const API_KEY = process.env.API_KEY;

export const getAIInsights = async (state: AppState, userQuery: string): Promise<string> => {
  if (!API_KEY) {
    return "عذراً، خدمة المساعد الذكي غير مفعلة. يرجى التأكد من إعداد مفتاح API الخاص بك.";
  }
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const model = "gemini-3-flash-preview";
  
  const systemPrompt = `
    أنت مساعد محاسبي ذكي متخصص في ورش تصنيع الأبواب. 
    لديك البيانات التالية عن الورشة:
    - الطلبات: ${JSON.stringify(state.orders)}
    - المصاريف: ${JSON.stringify(state.expenses)}
    - المخزون: ${JSON.stringify(state.inventory)}
    
    قم بالإجابة على أسئلة المستخدم باللغة العربية بأسلوب احترافي ومختصر. 
    حلل البيانات لتقديم نصائح حول الربحية، ترشيد التكاليف، أو حالة المخزون.
    إذا سألك عن "ملخص العمل"، قدم تقرير أداء مالي سريع.
    تأكد من تنسيق الردود بشكل جيد باستخدام Markdown، مثلاً استخدم العناوين والنقاط لجعل الإجابة سهلة القراءة.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });
    const text = response.text;
    if (text) {
      return text;
    }
    return "لم أتمكن من الحصول على إجابة. حاول مرة أخرى.";

  } catch (error) {
    console.error("Gemini Error:", error);
    if (error instanceof Error) {
        return `عذراً، حدث خطأ: ${error.message}`;
    }
    return "عذراً، حدث خطأ غير معروف أثناء معالجة طلبك الذكي.";
  }
};
