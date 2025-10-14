import { listarAsignaturasDashboard, type AsignaturaDash } from "@/data/asignaturas.repo";
import AsignaturasGridClient from "./AsignaturasGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AsignaturasGridServer() {
  const asignaturas: AsignaturaDash[] = await listarAsignaturasDashboard();
  return <AsignaturasGridClient data={asignaturas} />;
}