"use client";

import { Lock, User, Eye, EyeOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ThemeToggle } from "@/presentation/components/theme-toggle";
import { useLoginViewModel } from "@/presentation/viewmodels/useLoginViewModel";

export default function AuthPage() {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    toggleShowPassword,
    errorMessage,
    getValidationError,
    getFormErrorMessage,
    t,
    dir,
  } = useLoginViewModel();

  return (
    <div dir={dir} className="relative flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4 py-12">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {t("welcome_back")}
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            {t("credentials_desc")}
          </p>
        </div>

        <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl text-zinc-900 dark:text-zinc-50">
              {t("sign_in")}
            </CardTitle>
            <CardDescription className="text-center text-zinc-500 dark:text-zinc-400">
              {t("sign_in_desc")}
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-3 text-center text-sm font-medium text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/50">
                  {getFormErrorMessage(errorMessage)}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username" className="text-zinc-700 dark:text-zinc-350">{t("username")}</Label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"} flex items-center text-zinc-400`}>
                    <User className="h-5 w-5" />
                  </span>
                  <Input
                    id="username"
                    type="text"
                    placeholder={t("username_placeholder")}
                    className={`${dir === "rtl" ? "pr-10" : "pl-10"} text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-650 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400 bg-white dark:bg-zinc-950`}
                    disabled={isSubmitting}
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-650 dark:text-red-400">{getValidationError(errors.username.message)}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-zinc-700 dark:text-zinc-350">{t("password")}</Label>
                <div className="relative">
                  <span className={`absolute inset-y-0 ${dir === "rtl" ? "right-0 pr-3" : "left-0 pl-3"} flex items-center text-zinc-400`}>
                    <Lock className="h-5 w-5" />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`${dir === "rtl" ? "px-10" : "px-10"} text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-650 border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-400 bg-white dark:bg-zinc-955`}
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={toggleShowPassword}
                    className={`absolute inset-y-0 ${dir === "rtl" ? "left-0 pl-3" : "right-0 pr-3"} flex items-center text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50`}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-650 dark:text-red-400">{getValidationError(errors.password.message)}</p>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 font-semibold active:scale-[0.98] transition-all"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Spinner className="h-4 w-4 text-zinc-900 dark:text-zinc-50" />
                    <span>{t("please_wait")}</span>
                  </div>
                ) : (
                  t("sign_in")
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}


