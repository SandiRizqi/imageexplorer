// src/app/components/auth/EditProfileModal.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

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
        throw new Error("Failed to fetch user profile");
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
      setError("Failed to load profile");
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
      setError("Failed to update profile. Please try again.");
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
              <p className="text-white mt-4 text-sm">Loading, please wait...</p>
            </div>
          </div>
        ) : (
          <DialogPanel className="mx-auto max-w-md w-full bg-[rgb(33,37,41)] rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <DialogTitle className="text-base font-semibold text-white">
                EDIT PROFILE
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
                  Profile updated successfully!
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Name
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
                  Email
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
                  Email cannot be changed
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Company
                </label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenmaincolor text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-greenmaincolor text-black"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter your address"
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
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-greensecondarycolor text-black rounded-md hover:bg-greenmaincolor disabled:bg-blue-300"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </DialogPanel>
        )}
      </div>
    </Dialog>
  );
}
