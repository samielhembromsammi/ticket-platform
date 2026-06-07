"use client"
import React, { useState, useEffect, useRef } from "react";
import { Input, message } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import user_image from "@/src/assets/user.svg";
import Title from "@/src/components/reuseable/title";
import { useMyProfile, useUpdateProfile } from "@/src/hooks/dashboard/users";

export default function ProfileEdit() {
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [avatarPreview, setAvatarPreview] = useState<string>("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { profile } = useMyProfile();
  const { updateProfile, loading, error } = useUpdateProfile();

  // Set initial values when profile data loads
  useEffect(() => {
    if (profile) {
      setName((profile?.fullName as string) || "");
      setPhone((profile?.phoneNumber as string) || "");
      setAddress((profile?.address as string) || "");
      if (!avatarFile) {
        setAvatarPreview(profile?.profileUrl || "");
      }
    }
  }, [profile, avatarFile]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  // Show error message if update fails
  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      message.error("Please select a valid image file.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      message.error("Image must be smaller than 3MB.");
      return;
    }

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!name.trim() || !phone.trim()) {
      message.warning("Please fill in all fields");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", name.trim());
    formData.append("phoneNumber", phone.trim());
    formData.append("address", address?.trim() || "");

    if (avatarFile) {
      formData.append("file", avatarFile); // Must match backend `uploads.single('file')`
    }

    const result = await updateProfile(formData);

    if (result) {
      message.success("Profile updated successfully!");
      router.push("/dashboard/profile");
    }
  };

  return (
    <div className="bg-[#F5F7FB] h-full">
      <Title isShowBackButton title="Edit Personal Information" />

      <div className="py-10 px-4">
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-[#E4E7EC] p-8">
              <div className="flex flex-col items-center text-center gap-5">
                <div className="relative w-32 h-32 rounded-full overflow-hidden ring ring-primary/10 ">
                  <Image
                    src={avatarPreview || user_image}
                    alt="user"
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs font-semibold opacity-0 hover:opacity-100 transition cursor-pointer"
                  >
                    Change
                  </button>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Profile Owner</p>
                    <p className="text-2xl font-semibold text-gray-900">{profile?.fullName || "Your Name"}</p>
                    <p className="text-sm text-gray-500 mt-1">{profile?.email || "No email linked"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm font-medium text-primary hover:text-primary/80 cursor-pointer"
                    >
                      Upload new photo
                    </button>
                    {avatarFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(profile?.profileUrl || "");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-sm text-gray-400 hover:text-gray-600"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">PNG or JPG up to 3MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>
              </div>

              <div className="mt-8 grid gap-4">
                <div className="rounded-xl border border-[#F1F5F9] px-4 py-3 bg-[#F8FAFC]">
                  <p className="text-xs text-gray-500 uppercase">Phone</p>
                  <p className="text-base font-medium text-gray-900">{profile?.phoneNumber || "Not added"}</p>
                </div>
                <div className="rounded-xl border border-[#F1F5F9] px-4 py-3 bg-[#F8FAFC]">
                  <p className="text-xs text-gray-500 uppercase">Address</p>
                  <p className="text-base font-medium text-gray-900 break-words">
                    {profile?.address || "Add your primary address"}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gradient-to-r from-primary to-primary/80 text-white p-5">
                <p className="text-sm font-semibold">Tip</p>
                <p className="text-xs mt-1 opacity-90">
                  Keep your details up to date so customers and teammates can reach you quickly.
                </p>
              </div>
            </div>
          </aside>

          <section className="bg-white rounded-2xl shadow-sm border border-[#E4E7EC] p-6 lg:p-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500">Profile Information</p>
                <h2 className="text-3xl font-semibold text-gray-900 mt-2">Update your personal details</h2>
                <p className="text-sm text-gray-500 mt-1">This information will be visible to the services you manage.</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Changes save securely via encrypted connection
              </div>
            </div>

            <div className="grid gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <Input
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="rounded-full px-4 py-2 custom-textarea custom-input-profile"
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <Input
                    value={profile?.email || ""}
                    disabled
                    className="rounded-full px-4 py-2 custom-input-profile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <Input
                    value={phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="rounded-full px-4 py-2 custom-textarea custom-input-profile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address</label>
                <Input
                  value={address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
                  placeholder="Add your primary address"
                  className="rounded-full px-4 py-2 custom-textarea custom-input-profile"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end mt-10 pt-6 border-t border-[#F1F5F9]">
              <button
                type="button"
                onClick={() => router.push("/dashboard/settings/profile")}
                className="rounded-full border border-gray-300 px-10 py-2 font-medium text-gray-600 hover:bg-gray-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className={`flex items-center justify-center gap-3 bg-primary text-white py-2 px-14 rounded-full cursor-pointer transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5"
                  }`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}