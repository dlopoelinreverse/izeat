"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DemoButton, DemoModal } from "@/components/demo/demo-modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signIn } from "@/lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { APP_URL, AUTH_URL, LANDING_URL } from "@/lib/domains";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  const form = useForm({
    defaultValues: { email: "", password: "" },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        const { error } = await signIn.email({
          email: value.email,
          password: value.password,
        });
        if (error) {
          toast.error("Identifiants incorrects. Veuillez réessayer.");
        } else {
          window.location.href = `${APP_URL}/dashboard`;
        }
      } catch {
        toast.error("Identifiants incorrects. Veuillez réessayer.");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <Link
          href={LANDING_URL}
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white font-bold text-2xl">iE</span>
          </div>
          <span className="text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            izEat
          </span>
        </Link>

        {/* Main Card */}
        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-orange-100 dark:border-orange-900/30 shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Connexion
            </CardTitle>
            <CardDescription className="text-base text-slate-600 dark:text-slate-400">
              Accédez à votre tableau de bord izEat
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-5"
            >
              <form.Field
                name="email"
                validators={{
                  onBlur: ({ value }) =>
                    !value
                      ? "L'adresse email est requise."
                      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? "Adresse email invalide."
                        : undefined,
                  onSubmit: ({ value }) =>
                    !value
                      ? "L'adresse email est requise."
                      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
                        ? "Adresse email invalide."
                        : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Adresse email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 border-orange-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-orange-500/20 bg-white dark:bg-slate-800 transition-all duration-300"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onBlur: ({ value }) =>
                    !value ? "Le mot de passe est requis." : undefined,
                  onSubmit: ({ value }) =>
                    !value ? "Le mot de passe est requis." : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor="password"
                        className="text-slate-700 dark:text-slate-300 font-semibold"
                      >
                        Mot de passe
                      </Label>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                      >
                        Mot de passe oublié ?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="h-12 border-orange-200 dark:border-orange-900/30 focus:border-orange-500 focus:ring-orange-500/20 bg-white dark:bg-slate-800 transition-all duration-300"
                    />
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-sm text-red-500">
                        {String(field.state.meta.errors[0])}
                      </p>
                    )}
                  </div>
                )}
              </form.Field>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion en cours...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    Se connecter
                    <svg
                      className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-orange-200 dark:border-orange-900/30"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 font-medium">
                  Ou continuer avec
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    await signIn.social({
                      provider: "google",
                      callbackURL: `${APP_URL}/dashboard`,
                    });
                  } catch {
                    toast.error("Connexion Google échouée. Veuillez réessayer.");
                    setIsLoading(false);
                  }
                }}
                className="h-12 border-orange-200 dark:border-orange-900/30 hover:bg-orange-50 dark:hover:bg-orange-900/10 hover:border-orange-300 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuer avec Google
              </Button>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-slate-600 dark:text-slate-400">
              Pas encore de compte ?{" "}
              <Link
                href={`${AUTH_URL}/sign-up`}
                className="font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
              >
                Créer un compte gratuitement
              </Link>
            </div>
            <div className="pt-2 border-t border-border w-full flex justify-center">
              <DemoButton variant="subtle" onClick={() => setDemoOpen(true)} />
              <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
            </div>
          </CardFooter>
        </Card>

        {/* Additional Info */}
        <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
          <p>
            En vous connectant, vous acceptez nos{" "}
            <Link
              href="/terms"
              className="text-orange-600 dark:text-orange-400 hover:underline"
            >
              Conditions d&apos;utilisation
            </Link>{" "}
            et notre{" "}
            <Link
              href="/privacy"
              className="text-orange-600 dark:text-orange-400 hover:underline"
            >
              Politique de confidentialité
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
