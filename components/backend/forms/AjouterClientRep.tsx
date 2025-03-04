"use client";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";
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
import { useToast } from "@/hooks/use-toast";
import { addClientRepSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const AjouterClientRep = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");

  const { toast } = useToast();
  const form = useForm<z.infer<typeof addClientRepSchema>>({
    resolver: zodResolver(addClientRepSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      tel: "",
    },
  });
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof addClientRepSchema>) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/register/client-rep", data);
      if (res.status === 201) {
        setLoading(false);
        setError(null);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        form.reset();
        router.push("/dashboard/client-rep");
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 ">
      <h1 className="text-xl text-start text-gray-600 ">Ajouter Client Rep</h1>
      <hr className="text-gray-400 " />
      {error && (
        <div>
          <p className="bg-red-500 text-white rounded p-2 text-center text-md mt-6">
            {error}
          </p>
        </div>
      )}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4 mt-4 md:flex-row">
            <FormField
              name="nom"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Nom de famille"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="prenom"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Prénom"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <FormField
            name="tel"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Numéro de téléphone"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          {loading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-6  bg-black text-white w-full text-md"
            >
              Ajouter
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AjouterClientRep;
