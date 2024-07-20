import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  const body = await req.json();
  const { videoId } = body;
  const clerkUser = await currentUser();

  //   console.log(clerkUser);

  if (!clerkUser)
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
      clerkId: clerkUser.id,
    },
  });

  //   console.log(user);

  if (!user)
    return new Response(
      JSON.stringify({
        msg: "User not found",
      }),
      {
        status: 403,
      }
    );

  // check classroom exist for the given video Id
  const classroom = await prisma.classroom.findUnique({
    where: {
      videoId: videoId,
    },
  });

  if (user && classroom) {
    // if user is already in the class return that instance
    try {
      const userClassroom = await prisma.userClassroom.findUnique({
        where: {
          userId_classroomId: {
            userId: user.id,
            classroomId: classroom.id, // Ensure classroomId is an integer
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
            },
          },
        },
      });
      return new Response(
        JSON.stringify({
          classroom: userClassroom.classroom,
          msg: "Already Created",
        }),
        { status: 201 }
      );
    } catch (error) {}
  }

  // console.log(classroom);

  // if classroom already exist, add user into the class
  if (classroom) {
    try {
      const res = await prisma.userClassroom.create({
        data: {
          classroom: {
            connect: { id: classroom.id },
          },
          user: {
            connect: {
              id: user.id,
            },
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
            },
          },
        },
      });
      console.log(res);

      return new Response(JSON.stringify({ classroom: res.classroom }), {
        status: 201,
      });
    } catch (error) {
      //   console.log(error);
      return new Response(
        JSON.stringify({
          msg: "Classroom not created for the user",
          type: "error",
        }),
        { status: 500 }
      );
    }
  }

  return new Response(JSON.stringify({ msg: "new classroom" }), {
    status: 200,
  });
}
