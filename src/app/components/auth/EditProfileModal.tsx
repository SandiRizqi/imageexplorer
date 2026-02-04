// src/app/components/auth/EditProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onProfileUpdated: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  userId,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    if (isOpen && userId) {
      fetchUserProfile();
    }
  }, [isOpen, userId]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(t.failedLoadProfile);
      }

      const data = await response.json();
      setFormData({
        name: data.name || "",
        email: data.email || "",
        company: data.company || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      setError(t.failedLoadProfile);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user?id=${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      setSuccess(true);
      onProfileUpdated();

      // Close modal after 1.5 seconds
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(t.failedUpdateProfile);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        {loading ? (
          <div className="overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-greensecondarycolor border-t-transparent rounded-full animate-spin"></div>
              <p className="text-white mt-4 text-sm">{t.loadingWait}</p>
            </div>
          </div>
        ) : (
          <DialogPanel className="mx-auto max-w-md w-full bg-[rgb(33,37,41)] rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <DialogTitle className="text-base font-semibold text-white">
                {t.editProfileTitle}
              </DialogTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <hr className="border-t-2 border-gray-400" />
            <hr className="border-t border-gray-400 mt-1" />
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-black text-greenmaincolor px-4 py-3 rounded-md text-sm">
                  {t.profileUpdatedSuccess}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  {t.yourName}
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenmaincolor text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  {t.emailAddress}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-black"
                  disabled
                />
                <p className="text-xs text-white-500 mt-1">
                  {t.emailCannotChange}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  {t.company}
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder={t.enterCompanyName}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenmaincolor text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  {t.phoneNumber}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t.enterPhoneNumber}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenmaincolor text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  {t.address}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder={t.enterAddress}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenmaincolor text-black"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-white hover:bg-red-600 bg-red-500"
                  disabled={loading}
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-greensecondarycolor text-black rounded-md hover:bg-greenmaincolor disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? t.saving : t.saveChanges}
                </button>
              </div>
            </form>
          </DialogPanel>
        )}
      </div>
    </Dialog>
  );
}
