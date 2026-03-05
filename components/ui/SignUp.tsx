"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Email, Password, Username, AtSign } from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import { InputField, Button } from "@/lib/client-imports";

export default function SignUp() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);       
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    if (!username.trim() || username.length < 3) {
      setError("Username must be at least 3 characters");
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
          data: {
            name: name.trim(),
            username: username.trim(),
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      if (!signUpData.session) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login?registered=true");
        }, 5000);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50 flex flex-col w-full">
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-border p-8 relative">

          {/* Success Toast / Banner */}
          {success && (
            <div className="absolute -top-20 left-0 right-0 mx-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-md animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <strong className="font-semibold">Account created!</strong>
                  <p className="text-sm mt-1">
                    Please check your email (including spam/junk folder) to confirm your account before logging in.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSuccess(false);
                    router.push("/login?registered=true");
                  }}
                  className="ml-4 text-green-700 hover:text-green-900 font-medium"
                >
                  Go to login →
                </button>
              </div>
            </div>
          )}

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

            <InputField
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={<Password className="w-5 h-5" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPasswordToggle
              required
            />

            {error && <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded">{error}</p>}

            <Button
              type="submit"
              isDisabled={isLoading}
              textColor="text-primary-foreground"
              backgroundColor="bg-primary"
              className="w-full"
              text={isLoading ? "Creating account..." : "Create Account"}
            />

          </form>
        </div>
      </div> 
    </div>
  );
}