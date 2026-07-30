import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/presentation/components/language-provider";

export const loginFormSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;

export function useLoginViewModel() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { t, dir } = useLanguage();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error || "Invalid username or password");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Connection error, please try again");
    }
  };

  const getValidationError = (message: string | undefined) => {
    if (!message) return undefined;
    if (message === "Username is required") return t("username_required");
    if (message === "Password is required") return t("password_required");
    return t(message);
  };

  const getFormErrorMessage = (message: string | null) => {
    if (!message) return null;
    if (message === "Invalid username or password") return t("invalid_credentials");
    if (message === "Connection error, please try again") return t("connection_error");
    return t(message);
  };

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    showPassword,
    toggleShowPassword,
    errorMessage,
    getValidationError,
    getFormErrorMessage,
    t,
    dir,
  };
}
