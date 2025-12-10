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
  const [createMenu] = useMutation(CreateMenuDocument, {
    onCompleted: (data) => {
      console.log(data);
    },
  });
  const params = useParams();
  const restaurantId = params.restaurantId as string;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    if (!name) {
      return;
    }
    await createMenu({
      variables: {
        name,
        restaurantId,
      },
    });
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
