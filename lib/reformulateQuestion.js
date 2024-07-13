import { generativeModel } from "@/gemini/models";

export const reformulateQuestion = async (question, chatHistory) => {
  try {
    const chat = generativeModel.startChat({ history: chatHistory || [] });

    const prompt = `Given a chat history and the latest user question which might reference context in the chat history, formulate a question which is complete on its own, without needing any previous context. just reformulate it if needed and otherwise return it as is.

    CHAT HISTORY: ${chatHistory}\n\n
    QUESTION: ${question}
      `;
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.log("couldn't reformulate question");
    console.log(error);
    return error;
  }
};
