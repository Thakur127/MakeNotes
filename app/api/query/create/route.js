import { createEmbedding } from "@/gemini/createEmbedding.mjs";
import { generativeModel } from "@/gemini/models";
import { reformulateQuestion } from "@/lib/reformulateQuestion";
import { searchIndexForContext } from "@/pinecone/searchIndexForContext.mjs";
import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  const body = await req.json();
  const query = body.query;
  const classroomId = body.classroomId;
  const response = body.response;

  // console.log(classroomId, query, response);

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

  // console.log(userClassroom);

  if (!userClassroom) {
    return new Response(
      JSON.stringify({
        msg: "You do not have access to this classroom",
      }),
      { status: 403 }
    );
  }

  // save query
  const queryResponse = await prisma.query.create({
    data: {
      query,
      response,
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

  return new Response(
    JSON.stringify([
      { role: "user", parts: [{ text: query }] },
      { role: "model", parts: [{ text: response }] },
    ])
  );
}
