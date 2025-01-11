"use client";
import { ClipboardCheck, Copy } from "lucide-react";
import React, { useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const ShareProduct = () => {
  const [copied, setCopied] = useState<boolean>(false);

  // Function to copy the current URL to clipboard
  const copyToClipboard = () => {
    if (typeof window !== "undefined") {
      const currentUrl = window.location.href;
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          setCopied(true); // Show success feedback
          setTimeout(() => setCopied(false), 4000); // Reset feedback after 2 seconds
        })
        .catch((error) => {
          console.error("Failed to copy: ", error); // Handle errors
        });
    }
  };
  const getCurrentUrl = () => {
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };
  const currentUrl = getCurrentUrl();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <FacebookShareButton url={currentUrl}>
        <button className="flex gap-2 items-center justify-center px-4 rounded  bg-blue-600 hover:bg-blue-700 duration-300 py-1">
          <FacebookIcon size={15} className="h-8 w-8 rounded-full p-1" />
          <span className="text-white font-medium text-sm">Partager</span>
        </button>
      </FacebookShareButton>
      <WhatsappShareButton url={currentUrl}>
        <button className="flex gap-2 items-center justify-center px-4 rounded  bg-green-500 hover:bg-green-600 duration-300 py-1">
          <WhatsappIcon size={15} className="h-8 w-8 rounded-full p-1" />
          <span className="text-white font-medium text-sm">Partager</span>
        </button>
      </WhatsappShareButton>
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 bg-slate-800 rounded text-white font-semibold text-sm px-5"
      >
        {copied ? (
          <>
            <ClipboardCheck size={15} />
            <span>Copié</span>
          </>
        ) : (
          <>
            <Copy size={15} />
            <span>Copie</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareProduct;
