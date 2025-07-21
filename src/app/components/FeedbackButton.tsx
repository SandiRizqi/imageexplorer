import React from "react";
import { MdFeedback } from "react-icons/md";

interface FeedbackButtonProps {
    url?: string;
    size?: number;
    className?: string;
    text?: string;
    showText?: boolean;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
    url = "https://ruangbumi.com/feedback",
    // url = "http://localhost:3000/feedback",
    size = 24,
    className = "",
}) => {
    const openFeedbackSite = () => {
        window.open(url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={openFeedbackSite}
            className={`w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-300 transition-colors ${className}`}
            title="Give Feedback"
            aria-label="Feedback button"
        >
            <MdFeedback size={size} />
        </button>
    );
};

export default FeedbackButton;
