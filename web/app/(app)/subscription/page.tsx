"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation } from "@apollo/client/react";
import { CreateCheckoutSessionDocument } from "@/graphql/__generated__/graphql";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  "Gestion complète des menus et catégories",
  "QR codes pour toutes vos tables",
  "Prise de commandes en temps réel",
  "Tableau de bord et suivi des commandes",
  "Support prioritaire 7j/7",
];

export default function SubscriptionPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [createCheckoutSession] = useMutation(CreateCheckoutSessionDocument);

  const handleSubscribe = async () => {
    setIsLoading(true);
    setError("");
    try {
      const { data } = await createCheckoutSession();
      if (data?.createCheckoutSession.url) {
        window.location.href = data.createCheckoutSession.url;
      }
    } catch (err) {
      console.error("Erreur lors de la création de la session:", err);
      setError("Une erreur est survenue. Veuillez réessayer.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
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
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-xs text-slate-400">Restaurant</span>
              </div>
              <div className="w-8 h-px bg-orange-200"></div>
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm shadow-orange-500/30">
                  <span className="text-white text-xs font-bold">2</span>
                </div>
                <span className="text-xs font-semibold text-orange-600">Abonnement</span>
              </div>
            </div>

            <CardTitle className="text-2xl font-extrabold bg-linear-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Activez votre restaurant
            </CardTitle>
            <CardDescription className="text-sm text-slate-600 dark:text-slate-400">
              Accès complet à toutes les fonctionnalités izEat
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Price */}
            <div className="text-center py-4 rounded-xl bg-linear-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/30 border border-orange-100 dark:border-orange-900/30">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-extrabold text-slate-900 dark:text-white">19,99€</span>
                <span className="text-slate-500 dark:text-slate-400 text-sm">/mois</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Résiliable à tout moment</p>
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300">
                  <div className="w-5 h-5 rounded-full bg-linear-to-br from-orange-500 to-amber-600 flex items-center justify-center shrink-0 shadow-sm">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  {feature}
                </li>
              ))}
            </ul>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* CTA */}
            <Button
              onClick={handleSubscribe}
              disabled={isLoading}
              className="w-full h-12 bg-linear-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold text-base shadow-lg hover:shadow-xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Redirection vers le paiement...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  S&apos;abonner maintenant
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              )}
            </Button>

            <p className="text-center text-xs text-slate-400 dark:text-slate-500">
              Paiement sécurisé par{" "}
              <span className="font-semibold text-slate-500 dark:text-slate-400">Stripe</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
