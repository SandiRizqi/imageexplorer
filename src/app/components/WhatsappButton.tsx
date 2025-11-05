// WhatsAppButton.tsx
import React from "react";
import { FaWhatsapp } from "react-icons/fa";

interface WhatsAppButtonProps {
  phoneNumber?: string; 
  message?: string;
  size?: number;
  className?: string;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "6281298735585",
  // message = process.env.NEXT_PUBLIC_WHATSAPP_DEFAULT_MESSAGE || '',
  size = 24,
  className = "",
}) => {
  const openWhatsApp = () => {
    if (!phoneNumber) {
      console.error("WhatsApp number is not configured");
      return;
    }
    
    // const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}`;
    window.open(url, "_blank");
  };

  return (
    <button
      onClick={openWhatsApp}
      className={`w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors ${className}`}
      title="Contact via WhatsApp"
      aria-label="WhatsApp contact button"
      disabled={!phoneNumber}
    >
      <FaWhatsapp size={size} />
    </button>
  );
};

export default WhatsAppButton;