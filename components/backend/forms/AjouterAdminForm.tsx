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
import { addAdminSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

const AjouterAdminForm = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const form = useForm<z.infer<typeof addAdminSchema>>({
    resolver: zodResolver(addAdminSchema),
    defaultValues: {
      email: "",
      password: "",
      nom: "",
      prenom: "",
      tel: "",
    },
  });
  const router = useRouter();
  const handleSubmit = async (data: z.infer<typeof addAdminSchema>) => {
    setLoading(true);
    const formData = {
      ...data,
      role: "SMALLADMIN",
    };

    try {
      const response = await axios.post("/api/admin/add", formData);
      if (response.status === 201) {
        setLoading(false);
        setError(null);
        form.reset();
        router.push("/notre-staff");
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
      <h1 className="text-xl text-start text-gray-600 ">Ajouter admin</h1>
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
          {loading ? (
            <LoadingButton textColor="text-white" bgColor="bg-black" />
          ) : (
            <Button
              type="submit"
              className="mt-4 px-4 py-2 rounded-md bg-black text-white w-full text-md"
            >
              Ajouter
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default AjouterAdminForm;
