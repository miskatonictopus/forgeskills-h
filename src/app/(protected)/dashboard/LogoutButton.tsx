"use client";
export function LogoutButton() {
  const onClick = async () => {
    try { await fetch("/api/auth/logout", { method: "POST" }); }
    finally { window.location.replace("/"); }
  };
  return (
    <button onClick={onClick} className="rounded-md border px-4 py-3 text-lg">
      Cerrar sesión
    </button>
  );
}