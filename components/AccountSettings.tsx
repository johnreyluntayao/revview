"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Chip, InputField } from "@/lib/client-imports";
import {
  AccountSettings as Settings,
  Email,
  Password,
  Success,
  Username as UserIcon,
} from "@/lib/icons";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface UserFormData {
  fullName: string;
  username: string;
  email: string;
}

interface AccountSettingsProps {
  userInfo: UserFormData;
  role?: "user" | "admin";
}

const AccountSettings = ({ userInfo, role = "user" }: AccountSettingsProps) => {
  const [supabase] = useState(() => createClient());
  const [savedProfile, setSavedProfile] = useState<UserFormData>(userInfo);
  const [formData, setFormData] = useState<UserFormData>(userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [identityLoading, setIdentityLoading] = useState(true);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const isAdmin = role === "admin";
  const initials = useMemo(() => {
    const source = savedProfile.fullName.trim() || savedProfile.username.trim() || "User";
    return source
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [savedProfile.fullName, savedProfile.username]);

  useEffect(() => {
    const fetchIdentityProvider = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsGoogleUser(Boolean(user?.identities?.some((identity) => identity.provider === "google")));
      setIdentityLoading(false);
    };

    void fetchIdentityProvider();
  }, [supabase]);

  const handleProfileChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handlePasswordChange = (
    field: "current" | "new" | "confirm",
    value: string,
  ) => {
    if (field === "current") setCurrentPassword(value);
    if (field === "new") setNewPassword(value);
    if (field === "confirm") setConfirmNewPassword(value);
    setPasswordError(null);
  };

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError(null);
  };

  const handleSave = async () => {
    if (isSaving) return;

    const normalizedProfile = {
      ...formData,
      fullName: formData.fullName.trim(),
      username: formData.username.trim().toLowerCase(),
    };

    if (!normalizedProfile.fullName) {
      toast.error("Full name is required");
      return;
    }

    if (!/^[a-z0-9_]{3,30}$/.test(normalizedProfile.username)) {
      toast.error("Username must be 3–30 characters using letters, numbers, or underscores");
      return;
    }

    setIsSaving(true);
    setPasswordError(null);

    try {
      const hasPasswordInput = Boolean(currentPassword || newPassword || confirmNewPassword);
      const needsPasswordUpdate = !isGoogleUser && hasPasswordInput;

      if (needsPasswordUpdate) {
        if (!currentPassword) {
          setPasswordError("Enter your current password");
          return;
        }
        if (newPassword.length < 6) {
          setPasswordError("New password must be at least 6 characters");
          return;
        }
        if (newPassword !== confirmNewPassword) {
          setPasswordError("New passwords do not match");
          return;
        }
        if (newPassword === currentPassword) {
          setPasswordError("New password must be different from your current password");
          return;
        }
      }

      const profileChanged =
        normalizedProfile.fullName !== savedProfile.fullName ||
        normalizedProfile.username !== savedProfile.username;

      if (!profileChanged && !needsPasswordUpdate) {
        toast.info("No changes to save");
        return;
      }

      if (needsPasswordUpdate) {
        const { error: verificationError } = await supabase.auth.signInWithPassword({
          email: savedProfile.email,
          password: currentPassword,
        });

        if (verificationError) {
          setPasswordError("Current password is incorrect");
          return;
        }

        const { error: passwordUpdateError } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (passwordUpdateError) {
          setPasswordError(passwordUpdateError.message || "Failed to update password");
          return;
        }
      }

      if (profileChanged) {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("Your session has expired. Please sign in again.");

        const { error: profileUpdateError } = await supabase
          .from("users")
          .update({
            name: normalizedProfile.fullName,
            username: normalizedProfile.username,
          })
          .eq("id", user.id);

        if (profileUpdateError) {
          if (profileUpdateError.code === "23505") {
            toast.error("That username is already taken");
            return;
          }
          throw profileUpdateError;
        }
      }

      setFormData(normalizedProfile);
      setSavedProfile(normalizedProfile);
      resetPasswordFields();
      setIsEditing(false);
      toast.success("Account updated successfully");
    } catch (error: unknown) {
      console.error("Failed to update account:", error);
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(savedProfile);
    resetPasswordFields();
    setIsEditing(false);
  };

  return (
    <main className="min-h-screen bg-primary/[0.025] px-4 pb-10 pt-20 md:px-6 md:pb-12 md:pt-24 lg:px-8 lg:pt-28">
      <div className="mx-auto max-w-screen-xl space-y-5 md:space-y-6">
        <header>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Settings className="size-3.5" />
            Account preferences
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">Account settings</h1>
          <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Keep your profile information accurate and your account secure.
          </p>
        </header>

        <div className="grid items-start gap-5 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="bg-linear-to-br from-primary/10 via-background to-secondary/10 p-5 text-center md:p-6">
              <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary text-2xl font-bold text-white shadow-lg shadow-primary/15">
                {initials}
              </div>
              <h2 className="mt-4 truncate text-base font-semibold text-foreground">{savedProfile.fullName || "RevView user"}</h2>
              <p className="mt-0.5 truncate text-sm text-muted-foreground">@{savedProfile.username}</p>
              <Chip
                text={isAdmin ? "Administrator" : "Learner"}
                className="mt-3 bg-primary/10 text-primary"
              />
            </div>

            <div className="space-y-3 border-t border-border/70 p-4 md:p-5">
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Email className="size-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">Email address</p>
                  <p className="mt-0.5 truncate text-sm text-foreground">{savedProfile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
                  <Success className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Sign-in method</p>
                  <p className="mt-0.5 text-sm text-foreground">
                    {identityLoading ? "Checking..." : isGoogleUser ? "Google account" : "Email and password"}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
            <div className="flex items-start justify-between gap-4 border-b border-border/70 px-4 py-4 md:px-6 md:py-5">
              <div>
                <h2 className="text-base font-semibold text-foreground md:text-lg">Profile information</h2>
                <p className="mt-0.5 text-xs text-muted-foreground md:text-sm">Update how your information appears across RevView.</p>
              </div>
              {!isEditing && (
                <Button
                  text="Edit profile"
                  backgroundColor="bg-primary/10"
                  textColor="text-primary"
                  onClick={() => setIsEditing(true)}
                  className="shrink-0"
                />
              )}
            </div>

            <div className="space-y-6 p-4 md:p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <InputField
                  name="fullName"
                  label="Full name"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleProfileChange}
                  icon={<UserIcon className="size-4" />}
                  state={isEditing ? "editable" : "readonly"}
                />
                <InputField
                  name="username"
                  label="Username"
                  placeholder="Enter username"
                  value={formData.username}
                  onChange={handleProfileChange}
                  type="username"
                  state={isEditing ? "editable" : "readonly"}
                />
                <InputField
                  name="email"
                  label="Email address"
                  value={formData.email}
                  icon={<Email className="size-4" />}
                  state="readonly"
                  className="md:col-span-2"
                />
              </div>

              {isEditing && !identityLoading && !isGoogleUser && (
                <section className="rounded-xl border border-border/80 bg-muted/20 p-4 md:p-5">
                  <div className="mb-5 flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Password className="size-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground md:text-base">Change password</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">Leave these fields empty to keep your current password.</p>
                    </div>
                  </div>

                  {passwordError && (
                    <div role="alert" className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive md:text-sm">
                      {passwordError}
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <InputField
                      label="Current password"
                      type="password"
                      showPasswordToggle
                      value={currentPassword}
                      onChange={(event) => handlePasswordChange("current", event.target.value)}
                      placeholder="Enter current password"
                      className="md:col-span-2"
                    />
                    <InputField
                      label="New password"
                      type="password"
                      showPasswordToggle
                      value={newPassword}
                      onChange={(event) => handlePasswordChange("new", event.target.value)}
                      placeholder="At least 6 characters"
                    />
                    <InputField
                      label="Confirm new password"
                      type="password"
                      showPasswordToggle
                      value={confirmNewPassword}
                      onChange={(event) => handlePasswordChange("confirm", event.target.value)}
                      placeholder="Repeat new password"
                    />
                  </div>
                </section>
              )}

              {isEditing && !identityLoading && isGoogleUser && (
                <div className="flex items-start gap-3 rounded-xl border border-primary/15 bg-primary/5 p-4">
                  <Success className="mt-0.5 size-4 shrink-0 text-primary" />
                  <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                    Your password is managed by Google. Profile details can still be updated here.
                  </p>
                </div>
              )}

              {isEditing && (
                <div className="flex flex-col-reverse gap-2 border-t border-border/70 pt-5 sm:flex-row sm:justify-end">
                  <Button
                    text="Cancel"
                    backgroundColor="bg-muted"
                    textColor="text-foreground"
                    onClick={handleCancel}
                    isDisabled={isSaving}
                    className="w-full sm:w-auto"
                  />
                  <Button
                    text={isSaving ? "Saving..." : "Save changes"}
                    backgroundColor="bg-primary"
                    textColor="text-primary-foreground"
                    onClick={() => void handleSave()}
                    isDisabled={isSaving}
                    className="w-full sm:w-auto"
                  />
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default AccountSettings;
