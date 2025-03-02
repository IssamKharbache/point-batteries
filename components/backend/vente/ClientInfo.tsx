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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepFormStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import { addClientVenteSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ClientInfo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("ESPECE");
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user.id;
  const nomDuCaissier = session?.user.nom;
  const form = useForm<z.infer<typeof addClientVenteSchema>>({
    resolver: zodResolver(addClientVenteSchema),
    defaultValues: {
      clientNom: "",
      clientPrenom: "",
      clientTel: "",
    },
  });
  const { toast } = useToast();
  const { currentStep, setCurrentStep, productsToSubmit } = useStepFormStore();

  const handlePrevious = () => {
    if (currentStep === 1) {
      return;
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const resetData = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("selectedProducts");
    }
    form.reset();
  };
  const onChange = (selectedValue: "ESPECE" | "CHECK" | "VIREMENT") => {
    setValue(selectedValue);
  };

  const handleSubmit = async (data: z.infer<typeof addClientVenteSchema>) => {
    setLoading(true);
    const allData = {
      ...data,
      userId,
      paymentType: value,
      products: productsToSubmit,
      nomDuCaissier,
    };

    try {
      const res = await axios.post("/api/vente", allData);
      if (res.status === 201) {
        setCurrentStep(0);
        setLoading(false);
        resetData();
        toast({
          title: "L'opération est terminée avec succès",
          description: res.data.message,
          variant: "success",
          className: "toast-container",
        });
        router.push("/dashboard/vente");
      }
    } catch (__error) {
      setLoading(false);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue",
        variant: "error",
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mb-8">
      <div className="space-y-2 bg-white p-10 rounded-md border-2 md:w-[750px] mt-8 ">
        <h1 className="text-xl text-start text-gray-600 ">Details du client</h1>
        <hr className="text-gray-400 " />
        <Form {...form}>
          <form
            className="space-y-8"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <FormField
              name="clientNom"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Nom du client"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />{" "}
            <FormField
              name="clientPrenom"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Prenom</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Prenom du client"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="clientTel"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Telephone</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        className="mt-2 px-4"
                        placeholder="Telephone du client"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Select onValueChange={onChange} value={value}>
              <SelectTrigger className="w-[100px] md:w-[150px] ">
                <SelectValue placeholder={"Espece"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ESPECE">Espece</SelectItem>
                <SelectItem value="CHECK">Check</SelectItem>
                <SelectItem value="VIREMENT">Virement</SelectItem>
              </SelectContent>
            </Select>
            {loading ? (
              <LoadingButton bgColor="bg-black" textColor="text-white" />
            ) : (
              <Button
                type="submit"
                className="mt-4 px-4 py-3  bg-black text-white w-full text-md"
              >
                Créer
              </Button>
            )}
          </form>
        </Form>
      </div>

      <Button
        className="mt-6"
        disabled={currentStep === 1}
        onClick={handlePrevious}
      >
        <ChevronLeft />
        <span>Précédent</span>
      </Button>
    </div>
  );
};

export default ClientInfo;
