import { redirect } from "next/navigation";

/** Dashboard racine → module Projet (chantier en exécution) */
export default function HomePage() {
  redirect("/projet");
}
