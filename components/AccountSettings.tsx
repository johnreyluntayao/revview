"use client"
import { Button, InputField } from '@/lib/client-imports';
import React, { useState } from 'react';

interface UserFormData {
  fullName: string;
  username?: string;
  email: string;
  password: string;
}

interface AccountSettingsProps {
  userInfo: UserFormData;
  role?: "user" | "admin";
}

const AccountSettings = ({ userInfo, role = "user" }: AccountSettingsProps) => {
  const [formData, setFormData] = useState<UserFormData>(userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isAdmin = role === "admin";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSaving(false);
    setIsEditing(false);
    alert('Profile updated! (mock save)');
  };

  const handleCancel = () => {
    setFormData(userInfo);
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
                text={isSaving ? 'Saving...' : 'Save Changes'}
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

          {/* Full Name */}
          <div>
            {isEditing ? (
              <InputField
                name="fullName"
                label="Full Name"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={handleChange}
              />
            ) : (
              <InputField
                name="fullName"
                label="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                state="readonly"
              />
            )}
          </div>

          {/* Username (ONLY FOR USER ROLE) */}
          {!isAdmin && (
            <div>
              {isEditing ? (
                <InputField
                  name="username"
                  label="Username"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                  type="username"
                />
              ) : (
                <InputField
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                  type="username"
                  state="readonly"
                />
              )}
            </div>
          )}

          {/* Email */}
          <div>
            {isEditing ? (
              <InputField
                name="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            ) : (
              <InputField
                name="email"
                label="Email"
                value={formData.email}
                onChange={handleChange}
                state="readonly"
              />
            )}
          </div>

          {/* Password */}
          <div>
            {isEditing ? (
              <InputField
                name="password"
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                type="password"
              />
            ) : (
             <></>
            )}
          </div>

          <p className="text-sm text-muted-foreground italic pt-2 border-t border-border">
            To change your password, use the Edit Profile flow or go to the Security section.
          </p>

        </div>
      </div>
    </div>
  );
};

export default AccountSettings;