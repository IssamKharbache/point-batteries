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
import { useUserAvatarStore } from "@/context/store";
import { signupSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

interface UpdateUserProps {
  userData: User;
}

const UpdateUserForm = ({ userData }: UpdateUserProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isChangingPwd, setIsChangingPwd] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const { setNom, setPrenom } = useUserAvatarStore();

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
        setLoading(false);
        return;
      }
      const res = await axios.put(`/api/user/${userData.identifiant}`, data);
      if (res.statusText === "updated") {
        localStorage.setItem("nom", data.nom);
        localStorage.setItem("prenom", data.prenom);
        setNom(data.nom);
        setPrenom(data.prenom);
        setLoading(false);
        toast.success(res.data.message);
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 ">
      <h1 className="text-xl text-start text-gray-600 ">
        Modifier mon profile
      </h1>
      <hr className="text-gray-400 " />
      {/* {error && (
      <div>
        <p className="bg-red-500 text-white rounded p-2 text-center text-sm mt-6">
          {error}
        </p>
      </div>
    )} */}
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
          {isChangingPwd && (
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
                          placeholder="******"
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
          <Button
            type="button"
            onClick={() => setIsChangingPwd((prev) => !prev)}
          >
            Changer le mot de passe
          </Button>

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
