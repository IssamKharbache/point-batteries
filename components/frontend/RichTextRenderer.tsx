"use client";

import DOMPurify from "dompurify";

type RichTextRendererProps = {
  content: string;
  className?: string;
};

export const RichTextRenderer = ({
  content,
  className = "",
}: RichTextRendererProps) => {
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};
