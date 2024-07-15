import MaxWidthWrapper from "./MaxWidthWrapper";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

const FAQ = () => {
  return (
    <MaxWidthWrapper className="">
      <h1 className="text-center font-semibold text-3xl">
        Frequently Asked question
      </h1>
      <Accordion type="multiple" collapsible className="max-w-4xl m-auto">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-green-500">
            What is classroom?
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <p>
              The classroom is the central hub of our website where you can
              access a variety of learning tools. In classroom, you can:
            </p>
            <ul className="indent-4 list-disc list-inside space-y-1">
              <li>
                <span className="font-semibold">Summarize YouTube Videos:</span>{" "}
                Get concise summaries of YouTube videos to quickly understand
                the main points.
              </li>
              <li>
                <span className="font-semibold">Detailed Notes:</span> Recieve
                comprehensive, bullet-pointed notes on the topics discussed in
                the videos.
              </li>
              <li>
                <span className="font-semibold">Interactive Q/A:</span> Ask
                question related to the video content and receive answers
                through our advanced retrieval-augmented generation (RAG)
                systems.
              </li>
            </ul>
            <p>
              This interactive space is designed to enhance your learning
              experience by making video content more accessible and engaging.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger className="text-green-500">
            How can I create a classroom?
          </AccordionTrigger>
          <AccordionContent className="space-y-2">
            <p>
              First, create your account on notes. Then, follow these steps.
            </p>
            <ol className="indent-4 list-decimal list-inside space-y-1">
              <li>
                <span className="font-semibold">Enter YouTube Url:</span> GOn
                the dashboard, input the video URL into the provided input box.
              </li>
              <li>
                <span className="font-semibold">Start Processing:</span> Press
                the &quot;Start&quot; button.
              </li>
              <li>
                <span className="font-semibold">Relax and wait:</span> Sit back
                and let us do the work. Once the Classroom is ready, a new entry
                will appear in the &quot;Available Classrooms&quot; section on
                your dashboard.
              </li>
            </ol>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </MaxWidthWrapper>
  );
};

export default FAQ;
