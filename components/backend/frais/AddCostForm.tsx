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
import { addCostSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import LoadingButton from "@/components/frontend/buttons/LoadingButton";

const AddCostForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  const router = useRouter();
  const today = new Date();

  const form = useForm<z.infer<typeof addCostSchema>>({
    resolver: zodResolver(addCostSchema),
    defaultValues: {
      natureDuFrais: "",
      date: today.toISOString(),
      montant: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof addCostSchema>) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/frais", data);
      if (res.status === 201) {
        setLoading(false);
        setError("");
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.push("/dashboard/frais");
      }
    } catch (error) {
      setLoading(false);
      setError(
        "Une erreur s'est produite, réessayez plus tard ou contactez le support"
      );
      toast({
        title: "Une erreur s'est produite",
        description: "Réessayez plus tard ou contactez le support",
        variant: "error",
      });
    }
  };
  return (
    <div className="space-y-2 bg-white p-10 rounded-md border-2 mt-4">
      <h1 className="text-xl text-start text-gray-600 ">Ajouter Frais</h1>
      <hr className="text-gray-400 " />
      <Form {...form}>
        <form className="space-y-8" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col gap-4 mt-4 ">
            <FormField
              name="natureDuFrais"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nature des frais</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Nature des frais"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="montant"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Montant</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="mt-2 px-4"
                        placeholder="Montant"
                        min={0}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="date"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          {field.value
                            ? format(new Date(field.value), "PPP", {
                                locale: fr,
                              })
                            : "Choisir une date"}
                          <CalendarIcon className="ml-2 h-4 w-4" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        className="py-5"
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString() || "")
                        }
                        initialFocus
                        locale={fr}
                        disabled={(date) => {
                          const today = new Date();
                          const firstDayOfMonth = new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            1
                          );
                          const lastDayOfMonth = new Date(
                            today.getFullYear(),
                            today.getMonth() + 1,
                            0
                          );
                          return (
                            date < firstDayOfMonth || date > lastDayOfMonth
                          );
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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

export default AddCostForm;
