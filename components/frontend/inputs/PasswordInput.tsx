import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import React, { useState } from "react";
import { Path, UseFormReturn } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { loginSchema, signupSchema } from "@/lib/utils/validation";
import { z } from "zod";

type FormType = "signup" | "login";

type SchemaType<T extends FormType> = T extends "signup"
  ? z.infer<typeof signupSchema>
  : z.infer<typeof loginSchema>;

interface PasswordInputProps<T extends FormType> {
  formType: T;
  form: UseFormReturn<SchemaType<T>>;
  name: Path<SchemaType<T>>;
}

const PasswordInput = <T extends FormType>({
  form,
  name,
}: PasswordInputProps<T>) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <FormField
      name={name}
      control={form.control}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>Mot de passe</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  className="mt-2 px-4 pr-10"
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
  );
};

export default PasswordInput;
