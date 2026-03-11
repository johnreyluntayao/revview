"use client";
import { Button, InputField } from "@/lib/client-imports";
import React, { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState<UserFormData>(userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [sameAsCurrentWarning, setSameAsCurrentWarning] = useState(false);

  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const supabase = createClient();
  const isAdmin = role === "admin";

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.identities?.some((id) => id.provider === "google")) {
        setIsGoogleUser(true);
      }
    };
    fetchUser();
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (field: "current" | "new" | "confirm", value: string) => {
    if (field === "current") setCurrentPassword(value);
    if (field === "new") {
      setNewPassword(value);
      setSameAsCurrentWarning(value === currentPassword && value.length > 0);
    }
    if (field === "confirm") setConfirmNewPassword(value);
    setPasswordError(null);
  };

  const resetPasswordFields = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    setPasswordError(null);
    setSameAsCurrentWarning(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setPasswordError(null);

    try {
      let needsPasswordUpdate = false;

      if (!isGoogleUser && (newPassword || confirmNewPassword || currentPassword)) {
        if (!currentPassword) {
          setPasswordError("Current password is required to change password");
          return;
        }
        if (newPassword !== confirmNewPassword) {
          setPasswordError("New passwords do not match");
          return;
        }
        if (newPassword === currentPassword) {
          setPasswordError("New password cannot be the same as current password");
          return;
        }
        if (newPassword.length < 6) {
          setPasswordError("New password must be at least 6 characters");
          return;
        }
        needsPasswordUpdate = true;
      }

      const profileUpdate: Partial<UserFormData> = {};
      if (formData.fullName !== userInfo.fullName) profileUpdate.fullName = formData.fullName.trim();
      if (formData.username !== userInfo.username) profileUpdate.username = formData.username.trim().toLowerCase();

      const shouldUpdateProfile = Object.keys(profileUpdate).length > 0;

      if (!shouldUpdateProfile && !needsPasswordUpdate) {
        toast.info("No changes to save");
        return;
      }

      if (needsPasswordUpdate) {
        const { error: authError } = await supabase.auth.updateUser({ password: newPassword });
        if (authError) {
          if (authError.message.includes("current password")) {
            setPasswordError("Current password is incorrect");
          } else {
            setPasswordError(authError.message || "Failed to update password");
          }
          return;
        }
      }

      if (shouldUpdateProfile) {
        const { error: dbError } = await supabase
          .from("users")
          .update({ name: profileUpdate.fullName, username: profileUpdate.username })
          .eq("id", (await supabase.auth.getUser()).data.user?.id);

        if (dbError) {
          console.error(dbError);
          if (dbError.code === "23505") toast.error("Username already taken");
          else toast.error("Failed to update profile");
          return;
        }
      }

      toast.success("Account updated successfully");
      setIsEditing(false);
      resetPasswordFields();

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userInfo);
    resetPasswordFields();
    setIsEditing(false);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and security settings
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden mb-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Personal Information</h2>
          {!isEditing ? (
            <Button
              text="Edit Profile"
              size="md"
              backgroundColor="bg-primary"
              textColor="text-primary-foreground"
              onClick={() => setIsEditing(true)}
            />
          ) : (
            <div className="flex gap-3">
              <Button
                text="Cancel"
                size="md"
                backgroundColor=""
                borderColor="border-border"
                textColor="text-foreground"
                onClick={handleCancel}
                isDisabled={isSaving}
              />
              <Button
                text={isSaving ? "Saving..." : "Save Changes"}
                size="md"
                backgroundColor="bg-primary"
                textColor="text-primary-foreground"
                onClick={handleSave}
                isDisabled={isSaving}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-6 space-y-6">
          <InputField
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleProfileChange}
            state={isEditing ? "editable" : "readonly"}
          />

          <InputField
            name="username"
            label="Username"
            placeholder="Enter username (no @)"
            value={formData.username}
            onChange={handleProfileChange}
            type="username"
            state={isEditing ? "editable" : "readonly"}
          />

          <InputField
            name="email"
            label="Email"
            value={formData.email}
            state="readonly"
          />

          {/* Password Section only for non-Google users */}
          {isEditing && !isGoogleUser && (
            <div className="pt-4 border-t border-border space-y-5">
              <h3 className="text-base font-medium">Change Password</h3>

              <InputField
                label="Current Password"
                type="password"
                showPasswordToggle
                value={currentPassword}
                onChange={(e) => handlePasswordChange("current", e.target.value)}
                placeholder="Enter current password"
                error={passwordError?.includes("current") ? passwordError : undefined}
              />

              <InputField
                label="New Password"
                type="password"
                showPasswordToggle
                value={newPassword}
                onChange={(e) => handlePasswordChange("new", e.target.value)}
                placeholder="Enter new password"
              />

              {sameAsCurrentWarning && newPassword && (
                <p className="text-amber-600 text-sm -mt-2">
                  New password is the same as current password
                </p>
              )}

              <InputField
                label="Confirm New Password"
                type="password"
                showPasswordToggle
                value={confirmNewPassword}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
                placeholder="Confirm new password"
                error={
                  passwordError?.includes("match") || passwordError?.includes("same")
                    ? passwordError
                    : undefined
                }
              />
            </div>
          )}

          {/* Info message for Google users */}
          {isEditing && isGoogleUser && (
            <p className="text-sm text-muted-foreground">
              Password cannot be changed for Google login accounts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;