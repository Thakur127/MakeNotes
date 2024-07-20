import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req) {
  const body = await req.json();
  const { videoId, summary, detailed_note, title, image_url } = body;
  const clerkUser = await currentUser();

  //   console.log(videoId, title, image_url);

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

  try {
    const classroomResponse = await prisma.classroom.create({
      data: {
        videoId,
        title,
        image_url,
        transcript: "",
        summary,
        detailed_note,
        UserClassroom: {
          create: [
            {
              user: {
                connect: { id: user.id },
              },
            },
          ],
        },
      },
      select: {
        id: true,
        createdAt: true,
        title: true,
        videoId: true,
        image_url: true,
      },
    });
    return new Response(JSON.stringify({ classroom: classroomResponse }), {
      status: 201,
    });
  } catch (error) {
    console.log("error creating classroom", error);
  }
}
