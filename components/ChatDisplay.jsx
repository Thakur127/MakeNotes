import { cn } from "@/lib/utils";
import RenderMarkdown from "./RenderMarkdown";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const ChatDisplay = ({ role, text, loading }) => {
  return (
    <Card>
      <CardHeader className="p-3 pb-2">
        <CardTitle
          className={cn(
            "text-base font-medium flex gap-2 items-center",
            role === "user" ? "text-green-500" : "text-cyan-500"
          )}
        >
          <h1>{role}</h1> <span>{loading}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <p className="text-sm">
          <RenderMarkdown content={text} />
        </p>
      </CardContent>
    </Card>
  );
};

export default ChatDisplay;
