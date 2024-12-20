"use client";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { loginSchema } from "@/lib/utils/validation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import LoadingButton from "../buttons/LoadingButton";
import PasswordInput from "../inputs/PasswordInput";

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);
    const email = data.email;
    const password = data.password;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        setLoading(false);
        setError("Email ou mot de passe incorrect");
        return;
      }
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="space-y-4 bg-white p-10 md:p-16 rounded-md border-2 m-4 md:m-2">
      <h1 className="text-xl text-start text-gray-600 ">Se connecter</h1>
      <hr className="text-gray-400" />
      {error && (
        <div>
          <p className="bg-red-500 text-white rounded p-2 text-center text-sm mt-6">
            {error}
          </p>
        </div>
      )}
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
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
                      className="mt-2 px-4 "
                      placeholder="Address email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <PasswordInput form={form} name="password" formType="login" />

          {loading ? (
            <LoadingButton bgColor="bg-black" textColor="text-white" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full"
            >
              Se Connecter
            </Button>
          )}
          <div className="flex flex-col gap-4">
            <div className="flex gap-2  text-[12px]  text-gray-500">
              <p className="">Vous n'avez pas de compte ? </p>
              <Link
                href="/inscription"
                className="hover:underline hover:text-black duration-200"
              >
                S'inscrire
              </Link>
            </div>
            <Link
              className="flex text-[12px]  text-gray-500 hover:underline hover:text-black duration-200"
              href="/forgot-password"
            >
              Mot de passe perdu ?
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
