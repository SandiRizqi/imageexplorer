import { useState, useEffect } from "react";
import { XCircle, CheckCircle, AlertTriangle, X } from "lucide-react";

type AlertProps = {
  category: "success" | "error" | "warning";
  message: string | null;
  setClose: React.Dispatch<React.SetStateAction<string | null>>;
  duration?: number; // Duration in milliseconds before auto-close
};

const Alert: React.FC<AlertProps> = ({ category, message, setClose, duration = 2000 }) => {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const fadeOutTimer = setTimeout(() => setFadeOut(true), duration - 500); // Start fade-out before closing
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

  const icons: Record<AlertProps["category"], JSX.Element> = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />, 
    error: <XCircle className="w-5 h-5 text-red-600" />, 
    warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className={`flex items-center p-4 border-l-4 max-w-[90%] rounded-lg shadow-md transition-all duration-500 transform ${fadeOut ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"} ${alertStyles[category]}`}> 
        {icons[category]}
        <span className="ml-3 flex-1 text-sm font-medium">{message}</span>
        <button onClick={() => {
          setFadeOut(true);
          setTimeout(() => {
            setVisible(false);
            setClose(null);
            setFadeOut(false);
          }, 500);
        }} className="ml-3 text-gray-600 hover:text-gray-800">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Alert;
