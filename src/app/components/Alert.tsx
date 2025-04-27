import { useState, useEffect } from "react";
import { X } from "lucide-react";

type AlertProps = {
  category: "success" | "error" | "warning";
  message: string | null;
  setClose: React.Dispatch<React.SetStateAction<string | null>>;
  duration?: number; // Duration in milliseconds before auto-close
};

const Alert: React.FC<AlertProps> = ({ category, message, setClose, duration = 3000 }) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const fadeOutTimer = setTimeout(() => setFadeOut(true), duration - 400);
      const closeTimer = setTimeout(() => {
        setVisible(false);
        setClose(null);
        setFadeOut(false);
      }, duration);
      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(closeTimer);
      };
    }
  }, [message, duration, setClose]);

  if (!visible || message === null) return null;

  const alertStyles: Record<AlertProps["category"], string> = {
    success: "bg-green-100 border-green-500 text-green-700",
    error: "bg-red-100 border-red-500 text-red-700",
    warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  };


  const symbols: Record<AlertProps["category"], string> = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
      <div
        className={`flex items-start gap-3 p-5 border-l-4 max-w-md w-full mx-4 rounded-lg shadow-lg transform transition-all duration-500 ${
          fadeOut
            ? "opacity-0 scale-75 translate-y-5"
            : "opacity-100 scale-100 translate-y-0"
        } ${alertStyles[category]}`}
      >
        <div className="flex-shrink-0 flex flex-col items-center justify-center">
          <div className="text-2xl mt-1">{symbols[category]}</div>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className=" break-words whitespace-pre-wrap text-sm">{message}</p>
        </div>
        <button
          onClick={() => {
            setFadeOut(true);
            setTimeout(() => {
              setVisible(false);
              setClose(null);
              setFadeOut(false);
            }, 400);
          }}
          className="ml-2 text-gray-600 hover:text-gray-900 transition-transform hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
