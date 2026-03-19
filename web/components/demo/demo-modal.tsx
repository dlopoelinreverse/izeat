"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { Zap, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CreateDemoAccountDocument } from "@/graphql/__generated__/graphql";
import { APP_URL } from "@/lib/domains";
import { signUp } from "@/lib/auth-client";

const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

// ─── Demo trigger button ─────────────────────────────────────────────────────

interface DemoButtonProps {
  variant?: "hero" | "subtle";
  onClick: () => void;
}

export function DemoButton({ variant = "subtle", onClick }: DemoButtonProps) {
  if (!isDemoMode) return null;

  if (variant === "hero") {
    return (
      <button
        onClick={onClick}
        className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-800 dark:text-white text-lg font-semibold rounded-full border-2 border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700 transition-all duration-300 transform hover:scale-105"
      >
        <FlaskConical className="h-5 w-5" />
        Tester l&apos;app
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="text-sm text-muted-foreground hover:text-orange-600 transition-colors underline-offset-4 hover:underline"
    >
      Accéder à la démo sans créer de compte
    </button>
  );
}

// ─── Demo modal ──────────────────────────────────────────────────────────────

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

export function DemoModal({ open, onClose }: DemoModalProps) {
  if (!isDemoMode) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createDemo] = useMutation(CreateDemoAccountDocument, {
    onCompleted: (data) => {
      window.location.href = `${APP_URL}/dashboard/${data.createDemoAccount.restaurantId}/service`;
    },
    onError: (err) => {
      setIsSubmitting(false);
      toast.error(err.message ?? "Erreur lors de la création de la démo");
    },
  });

  const form = useForm({
    defaultValues: { restaurantName: "" },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      const slug = value.restaurantName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const email = `${slug}@demo-izeat.com`;
      const password =
        Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);

      const { error } = await signUp.email({
        email,
        password,
        name: value.restaurantName,
      });

      if (error) {
        setIsSubmitting(false);
        toast.error(error.message ?? "Impossible de créer le compte démo");
        return;
      }

      await createDemo({ variables: { restaurantName: value.restaurantName } });
    },
  });

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FlaskConical className="h-5 w-5 text-orange-600" />
            </div>
            <DialogTitle className="text-xl font-bold">Mode démo</DialogTitle>
          </div>
          <DialogDescription>
            Accédez à un environnement de test préconfiguré et entièrement
            modifiable. Aucun compte réel ne sera créé.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-5 pt-2"
        >
          <form.Field
            name="restaurantName"
            validators={{
              onBlur: ({ value }) =>
                !value?.trim() ? "Le nom du restaurant est requis." : undefined,
              onSubmit: ({ value }) =>
                !value?.trim() ? "Le nom du restaurant est requis." : undefined,
            }}
          >
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="demo-restaurant" className="text-sm font-medium">
                  Nom du restaurant
                </Label>
                <Input
                  id="demo-restaurant"
                  type="text"
                  placeholder="ex: Le Bistrot Parisien"
                  autoFocus
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-11"
                />
                {field.state.meta.errors.length > 0 && (
                  <p className="text-sm text-destructive">
                    {String(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>

          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11"
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="flex-1 h-11 font-semibold gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Lancer la démo
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pb-1">
            Aucun vrai compte créé · Données fictives · Environnement isolé
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
