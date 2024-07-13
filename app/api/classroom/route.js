import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const classroomId = searchParams.get("classroomId");
  const activeUser = await currentUser();

  // console.log(activeUser);

  if (!activeUser) {
    return new Response(
      JSON.stringify({
        msg: "Not authenticated",
        type: "error",
      }),
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      clerkId: activeUser.id,
    },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ msg: "User not found", type: "error" }),
      {
        status: 401,
      }
    );
  }

  try {
    const userClassroom = await prisma.userClassroom.findUnique({
      where: {
        userId_classroomId: {
          userId: user.id,
          classroomId: parseInt(classroomId, 10), // Ensure classroomId is an integer
        },
      },
      include: {
        classroom: {
          select: {
            id: true,
            createdAt: true,
            videoId: true,
            title: true,
            image_url: true,
            summary: true,
            detailed_note: true,
            transcript: true,
            // Explicitly excluding the transcript field
            // transcript: false, // This is illustrative; Prisma does not support 'false' for exclusion
          },
        },
      },
    });

    if (!userClassroom) {
      return new Response(
        JSON.stringify({
          msg: "Classroom not found",
          type: "error",
        }),
        {
          status: 400,
        }
      );
    }
    // console.log(userClassroom);
    return new Response(
      JSON.stringify({ classroom: userClassroom?.classroom }),
      { status: 200 }
    );
  } catch (error) {
    console.log("error during fetching classroom for user", error);
    return error;
  }
}
