"use client";

import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { X } from "lucide-react";

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
  const handleRemoveImage = () => {
    setImage("");
    setImageKey("");
  };
  return (
    <>
      {image ? (
        <div className="relative mt-8">
          {" "}
          {/* This wrapper is crucial */}
          <Button
            className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center p-0"
            onClick={handleRemoveImage}
          >
            <X />
          </Button>
          <Image
            src={image}
            alt="product image"
            width={1000}
            height={667}
            className="w-full h-72 object-cover rounded-md"
          />
        </div>
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
