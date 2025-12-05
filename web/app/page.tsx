"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-amber-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-orange-100 dark:border-orange-900/30">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-xl">iE</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              izEat
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/sign-in">
              <button className="px-6 py-2 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 transition-all duration-300 font-medium">
                Connexion
              </button>
            </Link>
            <LogoutButton />
            <Link href="/auth/sign-up">
              <button className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 font-medium">
                Commencer
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <div
            className={`text-center transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-block mb-6 px-6 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full text-orange-600 dark:text-orange-400 font-medium animate-bounce-slow">
              🍽️ Solution Digitale pour Restaurants
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent leading-tight">
              Révolutionnez l&apos;Expérience
              <br />
              de Vos Clients
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Offrez à vos clients la possibilité de consulter votre menu,
              <br />
              commander et appeler directement depuis leur table.
            </p>
            <div className="flex gap-6 justify-center flex-wrap">
              <Link href="/auth/sign-up">
                <button className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white text-lg font-semibold rounded-full hover:shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-110 flex items-center gap-2">
                  Essai Gratuit
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
                </button>
              </Link>
              <button className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-lg font-semibold rounded-full border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all duration-300 transform hover:scale-105">
                Voir la Démo
              </button>
            </div>
          </div>

          {/* Animated Feature Cards */}
          <div
            className={`grid md:grid-cols-3 gap-8 mt-20 transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="group bg-white dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 dark:border-orange-900/30">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                Menu Digital
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Menu interactif accessible par QR code. Mises à jour en temps
                réel sans impression.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 dark:border-orange-900/30">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                Commande Directe
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Vos clients commandent depuis leur table. Réception instantanée
                en cuisine.
              </p>
            </div>

            <div className="group bg-white dark:bg-slate-800/50 backdrop-blur-xl p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-orange-100 dark:border-orange-900/30">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform duration-300">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-white">
                Appel Serveur
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Notification instantanée au personnel. Service rapide et
                efficace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-7xl">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Pourquoi Choisir izEat ?
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">⚡</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
                    Gain de Temps
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Réduisez le temps d&apos;attente et optimisez le service
                    pour satisfaire plus de clients.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">💰</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
                    Augmentation du CA
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Photos attractives et suggestions personnalisées augmentent
                    vos ventes de 30%.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">📊</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
                    Analyses Détaillées
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Tableau de bord complet pour suivre vos performances et
                    optimiser votre menu.
                  </p>
                </div>
              </div>
              <div className="flex gap-4 items-start group">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <span className="text-white font-bold text-xl">🌍</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">
                    Multi-langues
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Menu disponible dans plusieurs langues pour accueillir une
                    clientèle internationale.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-6xl font-bold mb-4">+250</div>
                <div className="text-2xl font-semibold mb-6">
                  Restaurants Partenaires
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Installation en 24h</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Support 7j/7</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                    <span>Satisfaction 98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjMxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAgMTBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Prêt à Transformer Votre Restaurant ?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Rejoignez des centaines de restaurateurs qui ont déjà fait le
                choix de l&apos;innovation.
              </p>
              <Link href="/auth/sign-up">
                <button className="px-10 py-5 bg-white text-orange-600 text-lg font-bold rounded-full hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
                  Démarrer Maintenant - Gratuit 30 jours
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 dark:bg-black text-white">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">iE</span>
              </div>
              <span className="text-2xl font-bold">izEat</span>
            </div>
            <div className="text-slate-400 text-center md:text-left">
              © 2025 izEat. Tous droits réservés.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
