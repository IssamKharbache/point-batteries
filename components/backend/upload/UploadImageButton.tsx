"use client";
import { UploadDropzone } from "@/lib/uploadthing";

import Image from "next/image";

interface UploadImageButtonProps {
  image: string;
  setImage: (image: string) => void;
  isImageUploading: boolean;
  setIsImageUploading: (isImageUploading: boolean) => void;
}

const UploadImageButton = ({
  image,
  setImage,
  isImageUploading,
  setIsImageUploading,
}: UploadImageButtonProps) => {
  return (
    <>
      {image ? (
        <div className="mt-8">
          <Image
            src={image}
            alt="Item image"
            width={1000}
            height={667}
            className="w-full h-72 object-cover overflow-hidden rounded-md"
          />
        </div>
      ) : (
        <UploadDropzone
          onUploadBegin={() => setIsImageUploading(true)}
          onUploadProgress={() => console.log("Uploading")}
          className="border-2 rounded-lg border-dashed border-slate-500 cursor-pointer  hover:bg-slate-200 duration-300"
          onClientUploadComplete={(res) => {
            setImage(res[0].url);
            setIsImageUploading(false);
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
