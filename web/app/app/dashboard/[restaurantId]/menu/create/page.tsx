"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormEventHandler } from "react";
import { useMutation } from "@apollo/client/react";
import { CreateMenuDocument } from "@/graphql/__generated__/graphql";
import { useParams } from "next/navigation";

export default function CreateMenuPage() {
  const [createMenu] = useMutation(CreateMenuDocument);
  const params = useParams();
  const restaurantId = params.restaurantId;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
  };
  return (
    <Card className="w-full h-full">
      <CardContent className="flex flex-col h-full">
        <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
          <Label>Nom du menu</Label>
          <Input name="name" />
          <Button type="submit">Créer</Button>
        </form>
      </CardContent>
    </Card>
  );
}
