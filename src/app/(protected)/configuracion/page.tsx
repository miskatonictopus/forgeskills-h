import { NameOnboarding } from "@/components/settings/NameOnboarding";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ConfiguracionPage() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center p-6">
      <NameOnboarding />
    </main>
  );
}
