"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!isSupabaseConfigured()) {
      if (demoMode) {
        router.push("/");
        router.refresh();
        return;
      }
      setError("Supabase non configuré. Activez NEXT_PUBLIC_DEMO_MODE=true.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#003F72] to-[#0891B2] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>ARCHI HOSP</CardTitle>
          <CardDescription>
            Polyclinique Nassib — pilotage chantier K&apos;BIO
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="kader@kbio-conseil.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
            {demoMode && (
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => {
                  router.push("/");
                  router.refresh();
                }}
              >
                Accès démo (sans Supabase)
              </Button>
            )}
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            <Link href="/forgot-password" className="text-[#0891B2] hover:underline">
              Mot de passe oublié
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
