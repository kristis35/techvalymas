"use server";

import { redirect } from "next/navigation";
import { refresh } from "next/cache";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/auth";
import { ORDER_STATUSES, updateOrderStatus, type OrderStatus } from "@/lib/orders";

export async function login(_prev: { error?: string }, fd: FormData): Promise<{ error?: string }> {
  const password = fd.get("password");
  if (typeof password !== "string" || !checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // lėtiname slaptažodžio spėliojimą
    return { error: "Neteisingas slaptažodis" };
  }
  await startSession();
  redirect("/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/prisijungti");
}

export async function setStatus(fd: FormData) {
  if (!(await isAdmin())) redirect("/admin/prisijungti");
  const id = fd.get("id");
  const status = fd.get("status");
  if (typeof id !== "string" || !ORDER_STATUSES.includes(status as OrderStatus)) return;
  await updateOrderStatus(id, status as OrderStatus);
  refresh();
}
