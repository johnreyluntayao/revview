"use client"
import { Button } from '@/lib/client-imports';
import React, { useState } from 'react';

interface UserFormData {
  fullName: string;
  username: string;
  email: string;
}

interface AccountInfo {
  createdAt: string;       // e.g. "January 15, 2024"
  lastLogin: string;       // e.g. "Today at 2:30 PM"
  status: 'Active' | 'Inactive' | 'Suspended' | string;
}

interface AccountSettingsProps {
  initialData: UserFormData;
  accountInfo: AccountInfo;
  // You can add more later (onSave callback, etc.)
}

const AccountSettings = ({ initialData, accountInfo }: AccountSettingsProps) => {
  const [formData, setFormData] = useState<UserFormData>(initialData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // → Real app: call your update API here
    setIsSaving(false);
    setIsEditing(false);
    alert('Profile updated! (mock save)');
  };

  const handleCancel = () => {
    setFormData(initialData); // reset to original passed values
    setIsEditing(false);
  };

  // Determine status color class
  const statusColorClass =
    accountInfo.status === 'Active'
      ? 'text-success'
      : 'text-destructive';

  return (
    <div className="w-full p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account information and security settings
        </p>
      </div>

      {/* Personal Information Section */}
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
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-muted-foreground mb-1.5"
            >
              Full Name
            </label>
            {isEditing ? (
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Enter your full name"
              />
            ) : (
              <p className="text-base font-medium py-2.5">{formData.fullName}</p>
            )}
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-muted-foreground mb-1.5"
            >
              Username
            </label>
            {isEditing ? (
              <div className="flex items-center gap-3">
                <span className="text-base text-muted-foreground">@</span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                  placeholder="username"
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2.5">
                <p className="text-base font-medium">@{formData.username}</p>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground mb-1.5"
            >
              Email Address
            </label>
            {isEditing ? (
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="your@email.com"
              />
            ) : (
              <p className="text-base font-medium py-2.5">{formData.email}</p>
            )}
          </div>

          <p className="text-sm text-muted-foreground italic pt-2 border-t border-border">
            To change your password, use the Edit Profile flow or go to the Security section.
          </p>
        </div>
      </div>

      {/* Account Information (read-only) */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold">Account Information</h2>
        </div>

        <div className="px-6 py-6">
          <div className="border-b border-border flex justify-between items-center py-4 px-6">
            <label className="font-medium text-muted-foreground">
              Account Created:
            </label>
            <p className="py-2.5">{accountInfo.createdAt}</p>
          </div>

          <div className="border-b border-border flex justify-between items-center py-4 px-6">
            <label className="font-medium text-muted-foreground">
              Last Login:
            </label>
            <p className="py-2.5">{accountInfo.lastLogin}</p>
          </div>

          <div className="border-b border-border flex justify-between items-center py-4 px-6">
            <label className="font-medium text-muted-foreground">
              Account Status:
            </label>
            <p className={`py-2.5 font-medium ${statusColorClass}`}>
              {accountInfo.status}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;