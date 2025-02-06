"use client";

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
import { orderDetailsSchema } from "@/lib/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useCartStore } from "@/context/store";
import { useSession } from "next-auth/react";
import { generateOrderNumber } from "@/lib/utils/index";
import Swal from "sweetalert2";

const OrderDetailsForm = () => {
  const {
    submitForm,
    setSubmitForm,
    cartItems,
    setLoadingOrder,
    setLivraison,
    resetCart,
  } = useCartStore();
  const { toast } = useToast();
  const { data: session } = useSession();

  const form = useForm<z.infer<typeof orderDetailsSchema>>({
    resolver: zodResolver(orderDetailsSchema),
    defaultValues: {
      nom: "",
      prenom: "",
      telephone: "",
      adresse: "",
      codePostal: "",
      ville: "",
      email: "",
      notesCommande: "",
    },
  });
  const router = useRouter();
  //submit function
  const submit = async (data: z.infer<typeof orderDetailsSchema>) => {
    setLoadingOrder(true);
    try {
      const orderNumber = generateOrderNumber(10);

      const fullData = {
        formData: {
          ...data,
          userId: session?.user.id,
          orderNumber,
        },
        orderItems: cartItems,
      };

      const res = await axios.post("/api/order", fullData);
      if (res.statusText === "created") {
        setLoadingOrder(false);
        if (typeof window !== "undefined") {
          localStorage.removeItem("orderDetails");
          localStorage.removeItem("livraison");
        }
        Swal.fire({
          title: "Votre commande a été passée avec succès ",
          text: "Notre équipe vous contactera dès que possible pour confirmer votre commande !",
          icon: "success",
        });
        resetCart();
        setLivraison(0);
        router.push("/mes-commandes");
      }
    } catch (_error) {
      toast({
        title: "Une erreur s'est produite",
        description: "Réessayez plus tard ou contactez le support",
        variant: "error",
      });
      setLoadingOrder(false);
    }
  };
  //checking if the button commander is triggred
  useEffect(() => {
    if (submitForm) {
      form.handleSubmit(submit)();
      setSubmitForm(false);
    }
  }, [submitForm, setSubmitForm, form]);

  // Utility function to save form data to localStorage
  const saveToLocalStorage = (
    data: Partial<z.infer<typeof orderDetailsSchema>>
  ) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orderDetails", JSON.stringify(data));
    }
  };

  // Load saved data from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("orderDetails");
      if (savedData) {
        form.reset(JSON.parse(savedData));
      }
    }
  }, [form]);

  // Watch for changes in form fields and save to localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      saveToLocalStorage(value);
    });
    return () => subscription.unsubscribe(); //clean up
  }, [form]);

  return (
    <div className="space-y-2 bg-white p-10   mb-8">
      <h1 className="text-xl text-start text-gray-600">
        Détails de facturation
      </h1>
      <hr className="text-gray-400" />

      <Form {...form}>
        <form className="space-y-8 " onSubmit={form.handleSubmit(submit)}>
          <div className="flex flex-col gap-4 mt-4 md:flex-row justify-between">
            <FormField
              name="nom"
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem className="w-full">
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
                  <FormItem className="w-full">
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
            name="adresse"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Adresse, ex. : bd zerktouni numero 08 "
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="ville"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Nom de la ville"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="codePostal"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Code postal"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>E-mail adresse</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="mt-2 px-4"
                      placeholder="Email adresse"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            name="telephone"
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
            name="notesCommande"
            control={form.control}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Notes de commande (facultatif)</FormLabel>
                  <FormControl>
                    <Textarea
                      className="mt-2 px-4"
                      placeholder="Commentaires concernant votre commande, ex. : consignes de livraison"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
};

export default OrderDetailsForm;
