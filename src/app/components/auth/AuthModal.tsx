//src/app/components/auth/AuthModal.tsx
"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useAuth } from "../context/AuthProrider";
import { FcGoogle } from 'react-icons/fc';
import Image from "next/image";
import { ChevronDownIcon } from "lucide-react";
import EditProfileModal from "./EditProfileModal";
import { useLanguage } from "../context/LanguageProvider";
import { translations } from "../../translations";


export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { session, status, signIn, signOut } = useAuth();
  const { language } = useLanguage();
  const t = translations[language];
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleProfileUpdated = () => {
    // Optional: refresh session atau reload user data
    console.log("Profile updated successfully");
  };


  return (
    <div>
      {/* Button to Open Modal */}
      {status === "unauthenticated" ? (
        <button
          className="bg-greenmaincolor px-4 py-2 rounded-md text-gray-800 shadow-md text-sm font-semibold mr-4
                        hover:bg-greensecondarycolor transition-colors duration-200 flex items-center space-x-2"
          onClick={() => setIsOpen(true)}
        >
          <span>{t.login}</span>
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-1 focus:outline-none mr-4"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt="avatar"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              ) : (
                <span className="text-sm font-medium text-gray-600">
                  {session?.user?.name?.[0] || 'U'}
                </span>
              )}
            </div>

            <ChevronDownIcon className="w-4 h-4 text-gray-300" />
          </button>

          {/* User dropdown menu */}
          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white  shadow-lg py-1 z-10">
              {session ? (
                <>
                  <div className="w-full text-left px-4 py-2 text-sm text-gray-900">
                    Username : {session?.user?.name || 'Guest'}
                  </div>
                  <button
                    onClick={() => {
                      window.location.replace('/dashboard')
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t.editProfile}
                  </button>
                  <button
                    onClick={() => {
                      signOut();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {t.logout}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    signIn();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {t.signInWithGoogle}
                </button>
              )}
            </div>
          )}

          {/* Tambahkan EditProfileModal di akhir component, sebelum closing tag */}
          <EditProfileModal
            isOpen={isEditProfileOpen}
            onClose={() => setIsEditProfileOpen(false)}
            userId={session?.user?.id || ""}
            onProfileUpdated={handleProfileUpdated}
          />
        </div>

      )}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <DialogPanel className="bg-maincolor text-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            {/* Modal Header */}
            <DialogTitle className="text-xl font-semibold text-greenmaincolor text-center mb-6">
              {t.welcomeBack}
            </DialogTitle>

            {/* Content */}
            <div className="text-center text-gray-300 mb-8">
              <p className="mb-2">{t.signInToAccess}</p>
              <p className="text-sm text-gray-400">{t.useGoogleAccount}</p>
            </div>

            {/* Google Sign In Button */}
            <button
              onClick={signIn}
              disabled={status === "loading"}
              className="w-full bg-white text-gray-800 py-3 px-4 rounded-md shadow-md hover:bg-gray-100 
                                     transition-colors duration-200 flex items-center justify-center space-x-3
                                     disabled:bg-gray-200 disabled:cursor-not-allowed"
            >
              {status === "loading" ? (
                <div className="w-5 h-5 border-t-2 border-b-2 border-gray-800 rounded-full animate-spin" />
              ) : (
                <>
                  <FcGoogle className="w-5 h-5" />
                  <span className="font-medium">{t.continueWithGoogle}</span>
                </>
              )}
            </button>

            {/* Footer Text */}
            <p className="mt-6 text-xs text-center text-gray-400">
              {t.agreePolicy}{' '}
              <a href="/privacy-policy" className="text-greenmaincolor hover:text-greensecondarycolor">{t.privacyPolicy}</a>
            </p>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Click outside detector */}
      {(isUserMenuOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </div>
  );
}
