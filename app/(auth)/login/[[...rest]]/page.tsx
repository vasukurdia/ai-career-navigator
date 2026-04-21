import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <SignIn
      appearance={{
        elements: {
          rootBox: "shadow-xl",
          card: "bg-white/90 backdrop-blur-sm border border-white/80 shadow-none rounded-2xl",
          headerTitle: "font-display text-2xl font-semibold",
          headerSubtitle: "text-muted-foreground",
          formButtonPrimary:
            "gradient-primary text-white hover:opacity-90 transition-opacity font-medium",
          formFieldInput:
            "bg-slate-50 border-slate-200 focus:border-teal-400 focus:ring-teal-400/20 rounded-xl",
          footerActionLink: "text-teal-600 hover:text-teal-700 font-medium",
          dividerLine: "bg-slate-200",
          dividerText: "text-muted-foreground text-xs",
          socialButtonsBlockButton:
            "bg-white border-slate-200 hover:bg-slate-50 text-foreground font-medium rounded-xl",
        },
      }}
    />
  );
}
