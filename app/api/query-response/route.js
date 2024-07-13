import { createEmbedding } from "@/gemini/createEmbedding.mjs";
import { generativeModel } from "@/gemini/models";
import { reformulateQuestion } from "@/lib/reformulateQuestion";
import { searchIndexForContext } from "@/pinecone/searchIndexForContext.mjs";
import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

// For generating reponse at backend and the send to client
// it will increase the waiting time at server for response
export async function POST(req) {
  const body = await req.json();
  const query = body.query;
  const classroomId = body.classroomId;

  const clerkUser = await currentUser();

  if (!clerkUser) {
    return new Response(
      JSON.stringify({
        msg: "Not authenticated",
      }),
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        msg: "User not found",
      }),
      { status: 401 }
    );
  }

  const classroom = await prisma.classroom.findUnique({
    where: {
      id: parseInt(classroomId, 10),
    },
  });

  if (!classroom) {
    return new Response(
      JSON.stringify({
        msg: "Classroom does not exist",
      }),
      { status: 400 }
    );
  }

  const userClassroom = await prisma.userClassroom.findUnique({
    where: {
      userId_classroomId: {
        userId: user.id,
        classroomId: classroom.id,
      },
    },
  });

  console.log(userClassroom);

  if (!userClassroom) {
    return new Response(
      JSON.stringify({
        msg: "You do not have access to this classroom",
      }),
      { status: 403 }
    );
  }

  // Retrieve chat history
  const queryResponses = await prisma.query.findMany({
    where: {
      userId: user.id,
      classroomId: classroom.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });

  const chatHistory = queryResponses.flatMap((item) => [
    { role: "user", parts: [{ text: item.query }] },
    { role: "model", parts: [{ text: item.response }] },
  ]);

  console.log(chatHistory);
  // save query without response
  const queryResponse = await prisma.query.create({
    data: {
      query,
      response: "",
      User: {
        connect: {
          id: user.id,
        },
      },
      Classroom: {
        connect: {
          id: classroom.id,
        },
      },
      UserClassroom: {
        connect: {
          userId_classroomId: {
            userId: user.id,
            classroomId: classroom.id,
          },
        },
      },
    },
  });

  // reformulate question, to context free from previous chats
  console.log("reformulating question");
  const newQuestion = await reformulateQuestion(chatHistory, query);
  console.log(newQuestion);

  console.log("finding context");
  // search context for the question
  const embed = await createEmbedding(newQuestion);
  const indexName = `classroom-${classroom.id}`;
  const context = await searchIndexForContext(indexName, embed);

  console.log("generating response...");
  // generate response for the query
  const chat = generativeModel.startChat({ history: chatHistory });
  const promptQuery = `You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. Don't mention anything about the context in your response, respond like you already know it. If you don't know the answer, respond from your prior knowledge with statement before your response "Best of my knowledge" and then your response fro next line.Answer should be undertandable and concise.
    CONTEXT: ${context}
    QUESION: ${newQuestion}`;

  const result = await chat.sendMessage(promptQuery);
  const response = result.response.text();
  console.log(response);

  // update response for the query
  await prisma.query.update({
    where: {
      id: queryResponse.id,
    },
    data: {
      response,
    },
  });
  return new Response(
    JSON.stringify([
      { role: "user", text: query },
      { role: "model", text: response },
    ])
  );
}
