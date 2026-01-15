
import { GoogleGenAI } from "@google/genai";
import { AppState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getAIInsights = async (state: AppState, userQuery: string) => {
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
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، حدث خطأ أثناء معالجة طلبك الذكي. يرجى المحاولة لاحقاً.";
  }
};
