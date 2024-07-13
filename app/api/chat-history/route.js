import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const classroomId = searchParams.get("classroomId");
  // console.log(classroomId);

  if (!classroomId) {
    return new Response(
      JSON.stringify({
        msg: "Classroom id required",
        type: "error",
      }),
      { status: 400 }
    );
  }

  const classroom = await prisma.classroom.findUnique({
    where: {
      id: parseInt(classroomId, 10),
    },
  });

  // console.log(classroom);

  if (!classroom)
    return new Response(
      JSON.stringify({
        msg: "classroom not found with the given classroom id",
        type: "error",
      }),
      {
        status: 400,
      }
    );

  const activeUser = await currentUser();
  // console.log(activeUser);

  if (!activeUser)
    return new Response(
      JSON.stringify({
        msg: "Not authenticated",
      }),
      {
        status: 401,
      }
    );

  const user = await prisma.user.findUnique({
    where: {
      clerkId: activeUser.id,
    },
  });

  if (!user) {
    return new Response(
      JSON.stringify({
        msg: "User not exist",
        type: "error",
      }),
      { status: 401 }
    );
  }

  try {
    const queryResponse = await prisma.query.findMany({
      where: {
        userId: user.id,
        classroomId: classroom.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const chatHistory = queryResponse.flatMap((item) => [
      { role: "user", parts: [{ text: item.query }] },
      { role: "model", parts: [{ text: item.response }] },
    ]);

    // console.log(chatHistory);
    return new Response(JSON.stringify(chatHistory), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify(error), { status: 500 });
  }
}
