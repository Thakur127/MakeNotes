import { prisma } from "@/prismaClient";
import { headers } from "next/headers";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || "";

async function validateRequest(request) {
  const payloadString = await request.text();
  const headerPayload = headers();

  const svixHeaders = {
    "svix-id": headerPayload.get("svix-id"),
    "svix-timestamp": headerPayload.get("svix-timestamp"),
    "svix-signature": headerPayload.get("svix-signature"),
  };
  const wh = new Webhook(webhookSecret);
  return wh.verify(payloadString, svixHeaders);
}

export async function POST(request) {
  const event = await validateRequest(request);

  const data = event.data;

  switch (event.type) {
    case "user.created":
      try {
        const user = await prisma.user.create({
          data: {
            clerkId: data.id,
            email: data.email_addresses?.[0].email_address,
          },
        });
        console.log("User created successfully, with clerkId: ", user.clerkId);
        return new Response(
          JSON.stringify({
            userId: user.id,
          }),
          {
            status: 201,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error("User creation failed:", error);
        return new Response("Internal Server Error", { status: 500 });
      }

    case "user.deleted":
      try {
        const user = await prisma.user.findUnique({
          where: {
            clerkId: data.id,
          },
        });

        if (!user) {
          return new Response("User not found", { status: 404 });
        }

        const deleteUserClassroom = prisma.userClassroom.deleteMany({
          where: {
            userId: user.id,
          },
        });

        const deleteUser = prisma.user.delete({
          where: {
            id: user.id,
          },
        });

        await prisma.$transaction([deleteUserClassroom, deleteUser]);

        console.log("User deleted successfully, with clerkId: ", data.id);
        return new Response("User deleted successfully", { status: 200 });
      } catch (error) {
        console.error("User deletion failed:", error);
        return new Response("Internal Server Error", { status: 500 });
      }
    case "user.updated":
      return new Response("OK", { status: 200 });
    default:
      return new Response("Event type not supported", { status: 400 });
  }
}
