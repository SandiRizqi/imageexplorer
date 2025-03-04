"use client";

import { useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

export default function AuthModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/signup

  return (
    <div>
      {/* Button to Open Modal */}
      <button
        className="bg-yellow-500 px-3 py-2 rounded-md text-gray-800 shadow-md text-xs font-semibold mr-4"
        onClick={() => setIsOpen(true)}
      >
        LOGIN/SIGNUP
      </button>

      {/* Modal */}
      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <DialogPanel className="bg-maincolor text-white rounded-lg p-6 w-[90%] max-w-md shadow-xl">
            

            {/* Modal Header */}
            <DialogTitle className="text-lg font-semibold text-yellow-500 text-center">
              {isLogin ? "Login" : "Signup"}
            </DialogTitle>

            {/* Toggle Login/Signup */}
            <div className="flex mt-4 border-b border-gray-600 text-xs">
              <button
                className={`w-1/2 py-2 text-center ${
                  isLogin ? "bg-secondarycolor text-white" : "text-gray-400"
                }`}
                onClick={() => setIsLogin(true)}
              >
                LOGIN
              </button>
              <button
                className={`w-1/2 py-2 text-center ${
                  !isLogin ? "bg-secondarycolor text-white" : "text-gray-400"
                }`}
                onClick={() => setIsLogin(false)}
              >
                SIGNUP
              </button>
            </div>

            {/* Form Fields */}
            <form className="mt-4 text-sm">
              {!isLogin && (
                <>
                  <div className="flex space-x-2">
                    <input type="text" placeholder="First Name *" className="input-style w-1/2" />
                    <input type="text" placeholder="Last Name *" className="input-style w-1/2" />
                  </div>
                  <input type="text" placeholder="Company" className="input-style mt-2" />
                </>
              )}
              <input type="email" placeholder="Email *" className="input-style mt-2" />
              <input type="password" placeholder="Password *" className="input-style mt-2" />
              {!isLogin && (
                <input type="password" placeholder="Confirm Password *" className="input-style mt-2" />
              )}

              {isLogin && <p className="text-xs text-gray-400 mt-2 cursor-pointer">Forgot your password?</p>}

              {/* Submit Button */}
              <button className="w-full bg-yellow-500 text-gray-800 py-2 mt-4 rounded-md shadow-md">
                {isLogin ? "LOGIN" : "SIGNUP"}
              </button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
