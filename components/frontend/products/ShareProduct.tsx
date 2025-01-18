"use client";
import { ClipboardCheck, Copy } from "lucide-react";
import React, { useState } from "react";
import {
  FacebookIcon,
  FacebookShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

import { FaFacebookF } from "react-icons/fa";
import { FaWhatsapp } from "react-icons/fa";
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 ">
      <FacebookShareButton url={currentUrl}>
        <div className="flex gap-2 items-center justify-center px-4 rounded  bg-blue-600 hover:bg-blue-700 duration-300 py-2">
          <FaFacebookF size={15} className="rounded-full text-white" />
          <span className="text-white font-medium text-sm">Partager</span>
        </div>
      </FacebookShareButton>
      <WhatsappShareButton url={currentUrl}>
        <div className="flex gap-2 items-center justify-center px-4 rounded  bg-green-500 hover:bg-green-600 duration-300 py-2">
          <FaWhatsapp size={15} className="rounded-full text-white" />
          <span className="text-white font-medium text-sm">Partager</span>
        </div>
      </WhatsappShareButton>
      <button
        onClick={copyToClipboard}
        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 duration-300 rounded text-white font-semibold text-sm px-5 py-2 justify-center"
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
