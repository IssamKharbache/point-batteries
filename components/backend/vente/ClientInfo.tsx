import LoadingButton from "@/components/frontend/buttons/LoadingButton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStepFormStore } from "@/context/store";
import { useToast } from "@/hooks/use-toast";
import { getData } from "@/lib/getData";
import { addClientVenteSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyClient } from "@prisma/client";
import axios from "axios";
import { ChevronLeft } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ClientInfo = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState("ESPECE");
  const [companyClient, setCompanyClients] = useState<CompanyClient[]>([]);
  const [isChoosingFromClient, setIsChoosingFromClient] =
    useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<CompanyClient | null>(
    null
  );
  const [generateFacture, setGenerateFacture] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanyClient = async () => {
      try {
        const companyClients = await getData("/user/companyClient");
        setCompanyClients(companyClients);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCompanyClient();
  }, []);

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
      generateFacture: false,
    },
  });

  const { toast } = useToast();
  const { currentStep, setCurrentStep, productsToSubmit } = useStepFormStore();

  // Function to generate a unique facture code
  const generateUniqueFactureCode = () => {
    return `FTA-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

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

  const handleSelectClient = (clientId: string) => {
    const selected = companyClient.find((client) => client.id === clientId);
    if (selected) {
      setSelectedClient(selected);
      // Fill the form with selected client data
      form.setValue("clientNom", selected.nom);
      form.setValue("clientPrenom", selected.prenom);
      form.setValue("clientTel", selected.tel);
    }
  };
  const handleSubmit = async (data: z.infer<typeof addClientVenteSchema>) => {
    setLoading(true);
    const allData = {
      ...data,
      userId,
      paymentType: value,
      products: productsToSubmit,
      nomDuCaissier,
      factureCode: data.generateFacture ? generateUniqueFactureCode() : null,
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

        if (data.generateFacture) {
          router.push(`/dashboard/vente/facture/${allData.factureCode}`);
        } else {
          router.push("/dashboard/vente");
        }
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
                        disabled={isChoosingFromClient} // Disable input when selecting client
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
                        disabled={isChoosingFromClient} // Disable input when selecting client
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
                        disabled={isChoosingFromClient} // Disable input when selecting client
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <div className="flex gap-12 items-center">
              <div>
                <Label>Mode de paiment</Label>
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
              </div>
              <Button
                type="button"
                onClick={() => setIsChoosingFromClient((prev) => !prev)}
                className="mt-6"
              >
                Choisir parmi les clients enregistrés
              </Button>

              {isChoosingFromClient ? (
                <div>
                  <Label>Client enregistré</Label>
                  <Select onValueChange={handleSelectClient}>
                    <SelectTrigger className="w-[100px] md:w-[150px] ">
                      <SelectValue placeholder={"Sélectionner un client"} />
                    </SelectTrigger>
                    <SelectContent>
                      {companyClient.map((client, idx) => (
                        <SelectItem key={idx} value={client.id}>
                          {client.nom} {client.prenom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
            <FormField
              name="generateFacture"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Générer une facture</FormLabel>
                </FormItem>
              )}
            />
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
