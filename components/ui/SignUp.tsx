"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Email, Password, Username, AtSign } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import { InputField, Button } from "@/lib/imports"


export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { data: signUpData, error: signUpError } = await createClient.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name.trim() },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    if (signUpData.user) {
      const { error: profileError } = await createClient
        .from("profiles")
        .insert({
          id: signUpData.user.id,
          username: username.trim(),
          full_name: name.trim(),
        });

      if (profileError) {
        setError(profileError.message || "Failed to create profile");
        setIsLoading(false);
        return;
      }
    }

    router.push("/login?registered=true");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex flex-col w-full">

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Get Started</h1>
            <p className="text-muted-foreground">Create your account to begin reviewing</p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <InputField
              label="Full Name"
              placeholder="John Doe"
              icon={<Username className="w-5 h-5" />}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <InputField
              label="Username"
              placeholder="johndoe123"
              icon={<AtSign className="w-5 h-5" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <InputField
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={<Email className="w-5 h-5" />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <InputField
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={<Password className="w-5 h-5" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />

            {error && <p className="text-red-600 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              isDisabled={isLoading}
              backgroundColor="bg-primary text-primary-foreground"
              className="w-full"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}