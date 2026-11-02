import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administravimas",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return <div className="min-h-full flex-1 bg-slate-100">{children}</div>;
}
