import DataBase, { clearDB } from "./data-base";

export async function main() {
  await DataBase.initialize();
  await clearDB();

  console.log("Database cleared");
}

main();
