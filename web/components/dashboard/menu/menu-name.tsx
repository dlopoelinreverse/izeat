"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateMenuDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { redirect, useRouter } from "next/navigation";
import { toast } from "sonner";

interface MenuNameProps {
  restaurantId: string;
  isCreation?: boolean;
  menuName?: string;
}

export const MenuName = ({
  restaurantId,
  isCreation,
  menuName,
}: MenuNameProps) => {
  if (isCreation) {
    return <CreationMenuForm restaurantId={restaurantId} />;
  }
  return <div>{menuName}</div>;
};

const CreationMenuForm = ({ restaurantId }: { restaurantId: string }) => {
  const router = useRouter();
  const [createMenu, { loading }] = useMutation(CreateMenuDocument, {
    onCompleted: (data) => {
      const { success, message, menu } = data.createMenu;
      if (success) {
        toast.success(message);

        return router.push(`/app/dashboard/${restaurantId}/menu/${menu?.id}`);
      }
      return toast.error(message);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    createMenu({
      variables: {
        name,
        restaurantId,
      },
    });
  };

  return (
    <form className="flex items-center gap-4 max-w-1/3" onSubmit={handleSubmit}>
      <Input placeholder="Nom du menu" name="name" />
      <Button type="submit" disabled={loading}>
        Créer
      </Button>
    </form>
  );
};
