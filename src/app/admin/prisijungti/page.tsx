import { Suspense } from "react";
import { connection } from "next/server";
import LoginForm from "./LoginForm";
import { adminConfigured } from "@/lib/auth";

// ADMIN_PASSWORD tikrinamas užklausos metu, o ne kompiliuojant.
async function LoginBody() {
  await connection();
  if (!adminConfigured()) {
    return (
      <p className="mt-4 text-sm text-red-700">
        Administravimas išjungtas: nustatykite aplinkos kintamąjį <code>ADMIN_PASSWORD</code>.
      </p>
    );
  }
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Administravimas</h1>
        <Suspense>
          <LoginBody />
        </Suspense>
      </div>
    </main>
  );
}
