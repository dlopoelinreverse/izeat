"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateRestaurantDocument } from "@/graphql/__generated__/graphql";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import { useOnboarding } from "@/contexts/onboarding-context";

export const CreateRestaurantForm = () => {
  const router = useRouter();
  const { refetchOnboarding } = useOnboarding();
  const [createRestaurant] = useMutation(CreateRestaurantDocument, {
    onCompleted: (data) => {
      refetchOnboarding();
      router.push(`/app/dashboard/${data.createRestaurant.id}`);
    },
    onError: (error) => {
      console.error("Error creating restaurant:", error);
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("restaurantName") as string;
    createRestaurant({
      variables: {
        name: name,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" name="restaurantName" placeholder="Restaurant name" />
      <Button type="submit">Create</Button>
    </form>
  );
};
