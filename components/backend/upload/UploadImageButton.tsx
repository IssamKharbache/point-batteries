"use client";

import { UploadDropzone } from "@/lib/uploadthing";

import Image from "next/image";

interface UploadImageButtonProps {
  image?: string;
  setImage: (image: string) => void;
  isImageUploading?: boolean;
  setIsImageUploading: (isImageUploading: boolean) => void;
  imageKey?: string;
  setImageKey: (imageKey: string) => void;
}

const UploadImageButton = ({
  image,
  setImage,
  setIsImageUploading,
  setImageKey,
}: UploadImageButtonProps) => {
  return (
    <>
      {image ? (
        <>
          <Image
            src={image}
            alt="product image"
            width={1000}
            height={667}
            className="w-full h-72 object-cover overflow-hidden rounded-md mt-8"
          />
        </>
      ) : (
        <UploadDropzone
          onUploadBegin={() => {
            setIsImageUploading(true);
          }}
          onUploadProgress={() => console.log("Uploading")}
          className="border-2 rounded-lg border-dashed border-slate-300 cursor-pointer  hover:bg-slate-100 duration-300"
          onClientUploadComplete={(res) => {
            setImageKey(res[0].key);
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
