import { getUser } from "@/lib/user";

export default async function DashboardPage() {
  const user = await getUser();
  console.log(user);

  // const userRestaurants = false;

  // if (!userRestaurants) {
  //   return <div>Vous n'avez pas de restaurant</div>;
  // }

  // return <div>Vous avez un restaurant</div>;
}
