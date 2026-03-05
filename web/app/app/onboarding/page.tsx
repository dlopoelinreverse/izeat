"use client";

import Link from "next/link";
import { Store } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CreateRestaurantDocument,
  CreateCheckoutSessionDocument,
} from "@/graphql/__generated__/graphql";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";

const FEATURES = [
  "Gestion complète des menus et catégories",
  "QR codes pour toutes vos tables",
  "Prise de commandes en temps réel",
  "Tableau de bord et suivi des commandes",
  "Support prioritaire 7j/7",
];

export default function OnboardingPage() {
  const [createCheckoutSession] = useMutation(CreateCheckoutSessionDocument);
  const [createRestaurant] = useMutation(CreateRestaurantDocument);

  const form = useForm({
    defaultValues: { restaurantName: "" },
    onSubmit: async ({ value }) => {
      console.log("Submitting form with value:", value);
      try {
        await createRestaurant({
          variables: { name: value.restaurantName.trim() },
        });

        console.log(
          "Restaurant created successfully, creating checkout session...",
        );
        const { data } = await createCheckoutSession();
        if (data?.createCheckoutSession.url) {
          window.location.href = data.createCheckoutSession.url;
        }
      } catch {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    },
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-lg relative z-10">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 mb-8 group"
        >
          <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <span className="text-white font-bold text-2xl">iE</span>
          </div>
          <span className="text-3xl font-bold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            izEat
          </span>
        </Link>

        <Card className="backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-orange-100 dark:border-orange-900/30 shadow-2xl">
          <CardHeader className="text-center space-y-3 pb-2">
            <div className="mx-auto w-14 h-14 bg-linear-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-2xl flex items-center justify-center">
              <Store className="w-7 h-7 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Lancez votre restaurant
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
              Nommez votre établissement et activez votre accès izEat
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="space-y-6"
            >
              <form.Field
                name="restaurantName"
                validators={{
                  onBlur: ({ value }) =>
                    !value.trim()
                      ? "Le nom du restaurant est requis."
                      : undefined,
                  onSubmit: ({ value }) =>
                    !value.trim()
                      ? "Le nom du restaurant est requis."
                      : undefined,
                }}
              >
                {(field) => (
                  <div className="space-y-2">
                    <Label
                      htmlFor="restaurantName"
                      className="text-slate-700 dark:text-slate-300 font-semibold"
                    >
                      Nom du restaurant
                    </Label>
                    <Input
                      id="restaurantName"
                      type="text"
                      placeholder="Le Bistrot Parisien"
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

              {/* Subscription summary */}
              <div className="rounded-xl border border-orange-100 dark:border-orange-900/30 bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 p-4 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Abonnement mensuel
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      19,99€
                    </span>
                    <span className="text-xs text-slate-500">/mois</span>
                  </div>
                </div>
                <ul className="space-y-1.5">
                  {FEATURES.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400"
                    >
                      <div className="w-4 h-4 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Résiliable à tout moment · Paiement sécurisé par{" "}
                  <span className="font-semibold">Stripe</span>
                </p>
              </div>

              <form.Subscribe selector={(state) => state.isSubmitting}>
                {(isSubmitting) => (
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Création en cours...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        S&apos;abonner maintenant
                        <svg
                          className="w-5 h-5"
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
                )}
              </form.Subscribe>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
