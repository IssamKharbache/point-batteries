"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addBannerSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import UploadImageButton from "../upload/UploadImageButton";
import { createSlug } from "@/lib/utils/index";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { Banner } from "@prisma/client";

interface BannerFormProps {
  bannerData?: Banner;
}

const AjouterBannerForm = ({ bannerData }: BannerFormProps) => {
  const [image, setImage] = useState(bannerData?.imageUrl);
  const [IsImageUploading, setIsImageUploading] = useState(false);
  const [imageKey, setImageKey] = useState(bannerData?.imageKey);
  //loading state
  const [loading, setLoading] = useState(false);
  //router

  const router = useRouter();

  const form = useForm<z.infer<typeof addBannerSchema>>({
    resolver: zodResolver(addBannerSchema),
    defaultValues: {
      title: bannerData?.title ?? "",
      link: bannerData?.link ?? "",
    },
  });
  //toast
  const { toast } = useToast();
  //image ref
  const imageRef = useRef<HTMLInputElement>(null);
  //

  const handleSubmit = async (data: z.infer<typeof addBannerSchema>) => {
    if (!image) {
      toast({
        title: "Image du bannière est obligatoire",
        variant: "error",
      });
      if (imageRef.current) {
        imageRef.current.textContent = "Image du bannière est obligatoire";
      }
      return;
    }
    setLoading(true);

    //creating the unique slug for the banner
    const slug = createSlug(data.title);
    //adding some data
    const allData = {
      ...data,
      imageUrl: image,
      imageKey,
      slug,
    };
    try {
      if (bannerData) {
        if (
          allData.title === bannerData.title &&
          allData.link === bannerData.link &&
          allData.imageUrl === bannerData.imageUrl
        ) {
          setLoading(false);
          return null;
        }
        const res = await axios.put(`/api/banner/${bannerData.slug}`, allData);
        if (res.status === 201) {
          setLoading(false);
          toast({
            title: "L'opération est terminée avec succès",
            description: res.data.message,
            variant: "success",
            className: "toast-container",
          });
          router.push("/dashboard/banniere");
        }
      } else {
        const res = await axios.post("/api/banner/add", allData);
        if (res.status === 201) {
          setLoading(false);
          toast({
            title: "L'opération est terminée avec succès",
            description: res.data.message,
            variant: "success",
            className: "toast-container",
          });
        }
        router.push("/dashboard/banniere");
      }
    } catch (__error) {
      setLoading(false);
      toast({
        title: "Une erreur s'est produite",
        description: "Réessayez plus tard ou contactez le support",
        variant: "error",
      });
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 mt-4">
      <h1 className="text-xl text-start text-gray-600 ">Ajouter Bannière</h1>
      <hr className="text-gray-400 " />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4 mt-4 md:flex-row">
            <FormField
              name="title"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Titre de bannière"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="link"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Lien</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Lien de redirection"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div>
            {bannerData && (
              <Button
                className="flex items-end justify-end mb-6"
                type="button"
                onClick={() => {
                  setImage("");
                }}
              >
                Modifier l&apos;image du produit
              </Button>
            )}
            <p
              ref={imageRef}
              className="text-red-500 text-sm font-semibold"
            ></p>

            <UploadImageButton
              image={image}
              setImage={setImage}
              isImageUploading={IsImageUploading}
              setIsImageUploading={setIsImageUploading}
              imageKey={imageKey}
              setImageKey={setImageKey}
            />
          </div>
          {loading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-6  bg-black text-white w-full text-md"
            >
              {bannerData ? "Modifier" : "Ajouter "}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AjouterBannerForm;
