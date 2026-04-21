import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-4">
      <div className="fixed inset-0 dot-pattern opacity-25 pointer-events-none" />
      <div className="relative text-center">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Compass className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-6xl font-semibold text-foreground mb-3">404</h1>
        <p className="text-lg text-muted-foreground mb-2">Page not found</p>
        <p className="text-sm text-muted-foreground mb-8 max-w-sm mx-auto">
          Looks like you've wandered off the career path. Let's get you back on track.
        </p>
        <Link href="/">
          <Button className="gradient-primary text-white border-0 hover:opacity-90 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
