import { prisma } from "@/prismaClient";
import { headers } from "next/headers";
import { Webhook } from "svix";

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || ``;

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
          {
            userId: user.id,
          },
          {
            status: 201,
          }
        );
      } catch (error) {
        console.log("User not created");
      }
  }
}
