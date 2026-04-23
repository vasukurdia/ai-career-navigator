import { Compass } from "lucide-react";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen gradient-hero flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 dot-pattern opacity-25 pointer-events-none" />
      <Link href="/" className="relative flex items-center gap-2.5 mb-8">
        <div className="w-9 h-9 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <span className="font-display text-2xl font-semibold text-foreground">
          AI Career<span className="text-gradient"> Navigator</span>
        </span>
      </Link>
      <div className="relative">{children}</div>
    </div>
  );
}
