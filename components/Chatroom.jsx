import { SendHorizonalIcon, User } from "lucide-react";
import { Button } from "./ui/button";
import ChatDisplay from "./ChatDisplay";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { generativeModel } from "@/gemini/models";
import ReactTextareaAutosize from "react-textarea-autosize";
import Image from "next/image";
import { reformulateQuestion } from "@/lib/reformulateQuestion";
import { createEmbedding } from "@/gemini/createEmbedding.mjs";
import { searchIndexForContext } from "@/pinecone/searchIndexForContext.mjs";

const Chatroom = ({ classroomId }) => {
  const [query, setQuery] = useState("");

  const [tempQuery, setTempQuery] = useState("");
  const [tempResponse, setTempResponse] = useState("");

  const queryClient = useQueryClient();

  const { data: chatHistory } = useQuery({
    queryKey: ["chat-history", classroomId],
    queryFn: async () => {
      const res = await axiosInstance.get("/chat-history", {
        params: {
          classroomId,
        },
      });
      // console.log(res.data);
      return res.data;
    },
  });

  // scroll chatbox to the bottom
  const chatLogEndRef = useRef(null);
  const textAreaRef = useRef(null);
  const scrollToBottom = () => {
    chatLogEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
    textAreaRef.current?.focus();
  }, [chatHistory, tempQuery, tempResponse]);

  const { mutate: queryResponse, isPending: generatingResponse } = useMutation({
    mutationFn: async () => {
      const newQuery = await reformulateQuestion(query, chatHistory.slice(-10));
      // console.log(newQuery);
      // console.log("finding context");
      // search context for the question
      const embed = await createEmbedding(newQuery);
      const indexName = `classroom-${classroomId}`;
      const context = await searchIndexForContext(indexName, embed, "text");
      // console.log(context);

      // console.log("generating response...");
      // generate response for the query
      const chat = generativeModel.startChat({
        history: chatHistory.slice(-10),
      });
      const promptQuery = `Use the following pieces of context to answer the question. You must not answer a question not related to the documents. If you don't know the answer, just say "Unfortunately, I can't help you with that", don't try to make up an answer.

        CONTEXT: ${context}\n\n
        QUESION: ${newQuery}`;

      const result = await chat.sendMessageStream(promptQuery);
      let finalResponse = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        // console.log(chunkText);
        finalResponse += chunkText;
        setTempResponse((prevData) => {
          return (prevData += chunkText);
        });
      }
      // console.log(finalResponse);

      const res = await axiosInstance.post("/query/create", {
        query: query,
        response: finalResponse,
        classroomId,
      });

      // console.log(res.data);
      return res.data;
    },
    onSuccess: async (data) => {
      setQuery("");
      setTempResponse("");
      setTempQuery("");
      // console.log(data);
      await queryClient.setQueryData(
        ["chat-history", classroomId],
        (prevData) => {
          if (!prevData) return [...data];
          return [...prevData, ...data];
        }
      );
    },
    onError: async () => {
      setTempResponse("");
      setTempQuery("");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTempQuery(query);
    // console.log("running");
    queryResponse();
  };

  return (
    <div className="flex max-h-svh h-svh flex-col p-4 space-y-4">
      <div className="border flex flex-col flex-1 overflow-auto rounded-md bg-gray-100 space-y-2 p-4">
        <div className="flex-1 space-y-2">
          {chatHistory?.map((chat, idx) => {
            return (
              chat.parts[0].text && (
                <ChatDisplay
                  key={idx}
                  role={chat.role}
                  text={chat.parts[0].text}
                />
              )
            );
          })}
          {tempQuery && <ChatDisplay role={"user"} text={tempQuery} />}
          {tempQuery && (
            <ChatDisplay
              role={"model"}
              text={tempResponse}
              loading={
                generatingResponse && (
                  <Image
                    src={"/spinner.svg"}
                    alt="spinner"
                    width={18}
                    height={18}
                    className="animate-spin"
                  />
                )
              }
            />
          )}
          <div ref={chatLogEndRef} />
        </div>
        <div className="my-2">
          <form
            className="relative flex items-center"
            onSubmit={(e) => handleSubmit(e)}
          >
            <ReactTextareaAutosize
              ref={textAreaRef}
              minRows={1}
              maxRows={8}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              className="bg-white border w-full rounded-md p-2 px-4 outline-none pr-10 text-gray-800"
              placeholder="Write your queries here"
            />
            <Button
              disabled={generatingResponse}
              type="submit"
              className="absolute right-0 top-0 bg-transparent hover:bg-gray-300"
            >
              <SendHorizonalIcon size={18} className="text-gray-900" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
