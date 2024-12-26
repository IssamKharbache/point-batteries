"use client";
import { UploadDropzone } from "@/lib/uploadthing";

import Image from "next/image";
import { useState } from "react";

const UploadImageButton = () => {
  const [image, setImage] = useState("");

  return (
    <>
      {image ? (
        <Image
          src={image}
          alt="Item image"
          width={1000}
          height={667}
          className="w-full h-64 object-contain"
        />
      ) : (
        <UploadDropzone
          onUploadProgress={() => console.log("Uploading")}
          className="border-2 rounded-lg border-dashed border-slate-500 cursor-pointer  hover:bg-slate-200 duration-300"
          onClientUploadComplete={(res) => {
            alert("upload done");
            setImage(res[0].url);
          }}
          endpoint={"productImageProduct"}
          onUploadError={(error) => {
            console.log(`ERROR! ${error.message}`);
          }}
        />
      )}
    </>
  );
};

export default UploadImageButton;
