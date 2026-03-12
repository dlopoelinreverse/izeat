"use client";

import { useRef } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import { Save } from "lucide-react";
import DashboardPageLayout from "@/components/dashboard/dashboard-page-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOnboarding } from "@/contexts/onboarding-context";
import {
  UpdateProfileDocument,
  MeDocument,
} from "@/graphql/__generated__/graphql";

export default function ProfilePage() {
  const { user, hasActiveSubscription, refetchOnboarding } = useOnboarding();
  const formRef = useRef<HTMLFormElement>(null);

  const [updateProfile, { loading }] = useMutation(UpdateProfileDocument, {
    refetchQueries: [{ query: MeDocument }],
  });

  const displayName = user?.name || "Utilisateur";

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const name = (formData.get("name") as string).trim();
    const image = (formData.get("image") as string).trim();

    try {
      await updateProfile({
        variables: {
          input: {
            name: name || undefined,
            image: image || undefined,
          },
        },
      });
      refetchOnboarding();
      toast.success("Profil mis à jour");
    } catch {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  return (
    <DashboardPageLayout title="Mon profil">
      <div className="mx-auto max-w-2xl space-y-6 p-4">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="size-16 rounded-lg">
                <AvatarImage
                  src={user?.image || undefined}
                  alt={displayName}
                />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{displayName}</CardTitle>
                <CardDescription>{user?.email}</CardDescription>
                <Badge
                  variant={hasActiveSubscription ? "default" : "secondary"}
                  className="mt-1"
                >
                  {hasActiveSubscription ? "Abonnement actif" : "Gratuit"}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form
              id="profile-form"
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="name">Nom</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={user?.name || ""}
                  placeholder="Votre nom"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ""}
                  disabled
                  className="opacity-60"
                />
                <p className="text-xs text-muted-foreground">
                  L&apos;email ne peut pas être modifié
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Photo de profil (URL)</Label>
                <Input
                  id="image"
                  name="image"
                  defaultValue={user?.image || ""}
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <Button type="submit" form="profile-form" disabled={loading}>
                <Save className="mr-2 size-4" />
                {loading ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
