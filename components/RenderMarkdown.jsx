import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const RenderMarkdown = ({ content }) => {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
};

export default RenderMarkdown;
