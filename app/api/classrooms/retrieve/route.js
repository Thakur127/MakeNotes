import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";

export async function GET(req) {
  const user = await currentUser();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  //   console.log(userId);

  // console.log(user);
  if (!userId) {
    return new Response(
      JSON.stringify({
        msg: "User not found",
        type: "error",
      }),
      { status: 404 }
    );
  }

  try {
    const userWithClassrooms = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        UserClassroom: {
          orderBy: [{ createdAt: "desc" }],
          include: {
            classroom: {
              select: {
                id: true,
                title: true,
                image_url: true,
              },
            },
          },
        },
      },
    });

    // Extract the classroom details
    const classrooms = userWithClassrooms?.UserClassroom.map(
      (uc) => uc.classroom
    );

    // console.log(classrooms);
    return new Response(JSON.stringify(classrooms), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ msg: "Not found for the user", type: "error" }),
      {
        status: 400,
      }
    );
  }
}
