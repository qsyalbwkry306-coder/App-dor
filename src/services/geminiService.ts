
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

export const getAIInsights = async (state: AppState, userQuery: string): Promise<string> => {
  // FIX: Aligned with Gemini API guidelines by removing manual API key constant and checks.
  // The API key is now sourced directly from process.env.API_KEY during initialization.
  // This change also resolves the TypeScript error 'Property 'env' does not exist on type 'ImportMeta''.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
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
    return "عذراً، حدث خطأ أثناء معالجة طلبك الذكي. يرجى المحاولة لاحقاً.";
  }
};
