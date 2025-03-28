"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";

import ToolBar from "../ToolBar";

type RichTextEditorProps = {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
};

export const RichTextEditor = ({
  content,
  onChange,
  placeholder,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure(),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-bold",
          levels: [2],
        },
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "rounded-md border border-gray-300 p-2 focus:outline-none focus:border-black text-sm min-h-[200px]",
      },
    },
    content: content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });
  return (
    <div>
      <ToolBar editor={editor} />
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  );
};
