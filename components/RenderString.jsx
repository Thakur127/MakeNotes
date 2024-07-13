import DOMPurify from "dompurify";

const RenderString = ({ content }) => {
  const sanitizedContent = DOMPurify.sanitize(
    content?.replace(/\n/g, "<br />")
  );

  return (
    <div
      dangerouslySetInnerHTML={{
        __html: sanitizedContent,
      }}
    />
  );
};

export default RenderString;
