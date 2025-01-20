"use client";
import { User } from "@/app/(backend)/dashboard/client/columns";
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
import { signupSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import * as z from "zod";

interface UpdateUserProps {
  userData: User;
  typeForm?: string;
}

const UpdateUserForm = ({ userData, typeForm }: UpdateUserProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChangingPwd, setIsChangingPwd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { update } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(
      signupSchema.extend({
        password: isChangingPwd
          ? z.string().min(1, "Mot de passe est obligatoire")
          : z.string().optional(),
      })
    ),
    defaultValues: {
      ...userData,
      password: "",
    },
  });
  const handleSubmit = async (data: z.infer<typeof signupSchema>) => {
    setLoading(true);

    try {
      //check if the data is same as the old one
      if (
        data.nom === userData.nom &&
        data.email === userData.email &&
        data.prenom === userData.prenom &&
        !isChangingPwd
      ) {
        setError("");
        setLoading(false);
        return;
      }

      const res = await axios.put(`/api/user/${userData.identifiant}`, data);

      if (res.statusText === "updated") {
        setError("");
        setLoading(false);
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.refresh();
        //update the session after updating
        update();
        setIsChangingPwd(false);
      } else {
        setLoading(false);
        setError(res.data.message);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 m-6 md:m-0 pb-12">
      <h1 className="text-xl text-start text-gray-600 ">
        Modifier mon profile
      </h1>
      <hr className="text-gray-400 " />
      {error && (
        <div className="">
          <p className=" bg-red-500 text-white rounded p-2 text-center text-sm mt-6 font-semibold ">
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
          {typeForm !== "client" && isChangingPwd && (
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="mt-2 px-4"
                          placeholder="Mot de passe"
                          {...field}
                          autoComplete="new-password"
                        />
                        {showPassword ? (
                          <Eye
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            size={17}
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                            size={17}
                            onClick={() => setShowPassword(true)}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
          {typeForm !== "client" && (
            <Button
              type="button"
              onClick={() => setIsChangingPwd((prev) => !prev)}
            >
              Changer le mot de passe
            </Button>
          )}
          {loading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
            >
              Modifier
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UpdateUserForm;
