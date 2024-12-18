"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { signupSchema } from "@/lib/utils/validation";
import axios from "axios";
import { useState } from "react";
import LoadingButton from "../buttons/LoadingButton";

const SignupForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      nom: "",
      prenom: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true);
    const role = "USER";
    const formData = {
      ...data,
      role,
    };
    try {
      const response = await axios.post("/api/user/register", formData);
      if (response.status === 201) {
        setLoading(false);
        setError(null);
        form.reset();
      }
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        // AxiosError contains the response and other details
        setError(error.response?.data?.message || "Une erreur est survenue");
      } else {
        setError("Une erreur est survenue");
      }
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 ">
      <h1 className="text-xl text-start text-gray-600 ">Inscription</h1>
      <hr className="text-gray-400 " />
      {error && (
        <div>
          <p className="bg-red-500 text-white rounded p-2 text-center text-sm mt-6">
            {" "}
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
            name="email"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Address email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="password"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      className="mt-2 px-4"
                      placeholder="********"
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
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
            >
              S'inscrire
            </Button>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex gap-2  text-[12px]  text-gray-500">
              <p className="">Vous avez deja un compte ? </p>
              <Link
                href="/connecter"
                className="hover:underline hover:text-black duration-200"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;
