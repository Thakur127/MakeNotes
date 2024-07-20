"use client";

import { axiosInstance } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import ReactPlayer from "react-player/lazy";
import RenderMarkdown from "@/components/RenderMarkdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import SkeletonForClassroom from "@/components/Skeletons/SkeletonForClassroom";
import { formatDate } from "@/lib/formatDate";
import Chatroom from "@/components/Chatroom";

const Page = ({ params }) => {
  const { data: classroom } = useQuery({
    queryKey: ["classroom", params.classroomId],
    queryFn: async () => {
      const res = await axiosInstance.get("/classroom", {
        params: {
          classroomId: params.classroomId,
        },
      });
      // console.log(res.data.classroom);
      return res.data.classroom;
    },
  });

  if (!classroom) return <SkeletonForClassroom />;

  return (
    <div className="p-4">
      <ResizablePanelGroup direction="horizontal" className={"min-h-svh"}>
        <ResizablePanel defaultSize={80} minSize={10}>
          <section>
            <h2 className="text-xl font-semibold text-gray-900">
              {classroom?.title}
            </h2>
            <span className="text-sm text-gray-600">
              Created at: {formatDate(classroom?.createdAt)}
            </span>
          </section>
          <section className="mt-6 flex">
            <ReactPlayer
              url={"https://youtube.com/watch?v=" + classroom?.videoId}
              controls={true}
              light={false}
              style={{
                margin: "auto",
              }}
            />
          </section>
          <section>
            <Accordion type="multiple" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="">
                  <h3 className="font-medium text-xl text-gray-900">Summary</h3>
                </AccordionTrigger>
                <AccordionContent className="text-gray-800 font-serif text-base">
                  <RenderMarkdown content={classroom?.summary} />
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <h3 className="font-medium text-xl text-gray-900">
                    Detailed Note
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="text-gray-800 font-serif text-base">
                  <RenderMarkdown content={classroom?.detailed_note} />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={20} minSize={5}>
          <Chatroom
            classroomId={params.classroomId}
            initialText={classroom?.transcript}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Page;
