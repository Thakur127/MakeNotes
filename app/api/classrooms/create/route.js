import { createEmbedding } from "@/gemini/createEmbedding.mjs";
import { generativeModel } from "@/gemini/models";
import { axiosInstance } from "@/lib/axios";
import makeTranscript from "@/lib/makeTranscript";
import { createIndex } from "@/pinecone/createIndex.mjs";
import { upsertVectorToIndex } from "@/pinecone/upsertVectorToIndex.mjs";
import { prisma } from "@/prismaClient";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const YOUTUBE_API_URL_FOR_VIDEO =
  "https://youtube.googleapis.com/youtube/v3/videos";

export async function POST(res) {
  const body = await res.json();

  const { videoId } = body;
  const activeUser = await currentUser();

  //   console.log(videoId);
  // console.log(activeUser);

  if (!activeUser)
    return new Response(
      JSON.stringify({ msg: "Not authenticated", type: "error" }),
      { status: 401 }
    );

  // check user exist for the given clerk id
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

  // if classroom already exist add user into the class
  if (classroom) {
    try {
      const res = await prisma.userClassroom.create({
        data: {
          classroom: {
            connect: { id: classroom.id },
          },
          user: {
            connect: {
              clerkId: activeUser.id,
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
      return new Response(
        JSON.stringify({
          msg: "Classroom not created for the user",
          type: "error",
        }),
        { status: 500 }
      );
    }
  }

  // classroom doesn't exist create new classroom and add the user

  let transcript = "";
  let summary = "";
  let detailed_note = "";
  // fetch caption for the video
  try {
    const { data } = await axiosInstance.get("/caption-from-video", {
      params: {
        videoId,
        lang: "en",
      },
    });
    // console.log(data);
    transcript = await makeTranscript(data.data);
  } catch (error) {
    console.log("Failed for fetch captions for video: ", videoId);
    return new Response(
      JSON.stringify({
        msg: "Can not create classroom for the video",
        type: "success",
      }),
      {
        status: 200,
      }
    );
  }

  // generate summary and detailed note of transcript
  if (transcript != "") {
    // summary
    const chat = generativeModel.startChat({ history: [] });
    try {
      const summaryMsg = `Give the summary for the provided context below, max in 200-250 words.
        CONTEXT: ${transcript}
      `;
      // transcript +
      //   "\n\nGive the summary of the above conversation max in 200-250 words.";
      const result = await chat.sendMessage(summaryMsg);
      const response = result.response;
      summary = response.text();
      // console.log(summary);

      // detailed note
      const detaileNoteMsg = `Return the detailed note for the information provided in the below context. Use Heading, subheadings, bulletpoint to make it concise and clear to understand.
      
      CONTEXT = ${transcript}
      `;
      // transcript +
      //   "\n\n write the detailed note pointwise with heading, subheading and alls. and return the markdown syntax for this";
      const dnResult = await chat.sendMessage(detaileNoteMsg);
      const dnResponse = dnResult.response;
      detailed_note = dnResponse.text();
      // console.log(detailed_note);
    } catch (error) {
      console.log("error creating summary and detailed note", error);
      return new Response(
        JSON.stringify({
          msg: " Could not create summary or detailed note",
          type: "error",
        }),
        { status: 500 }
      );
    }
  }

  try {
    // fetch info about the video from youtube
    const videoResponse = await axios.get(YOUTUBE_API_URL_FOR_VIDEO, {
      params: {
        id: videoId,
        part: "snippet",
        key: process.env.YOUTUBE_API_KEY,
      },
    });

    // extract required video info
    const video = videoResponse.data?.items?.[0];
    const title = video.snippet.title;
    const image_url = video.snippet.thumbnails?.default.url;

    // create new class and register currentUser
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
          transcript: true,
        },
      });

      // create vector index for the classroom
      try {
        const textSplitter = new RecursiveCharacterTextSplitter({
          chunkSize: 5000,
          chunkOverlap: 1000,
        });

        const splits = await textSplitter.splitText(transcript);
        let upsertData = [];

        for (let i = 0; i < splits.length; i++) {
          const embedding = await createEmbedding(splits[i]);
          upsertData.push({
            id: i.toString(), // Ensure the ID is a string
            values: Array.from(embedding), // Ensure values is an array of numbers
            metadata: {
              text: splits[i],
            },
          });
        }
        const indexName = `classroom-${classroomResponse.id}`;
        await createIndex(indexName);
        await upsertVectorToIndex(indexName, upsertData);
      } catch (error) {
        console.log(error);
        throw error;
      }

      // console.log(classroomResponse);
      return new Response(JSON.stringify({ classroom: classroomResponse }), {
        status: 201,
      });
    } catch (error) {
      console.log("Error creating classroom:", error);
      return new Response(
        JSON.stringify({
          msg: "Error creating classroom",
          type: "error",
        }),
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching video data or creating classroom:", error);
    return new Response(JSON.stringify(error));
  }
}
