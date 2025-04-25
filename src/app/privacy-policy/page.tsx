import React from "react";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-maincolor flex flex-col text-gray-300">
      {/* Header */}
      <header className="bg-maincolor border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-greensecondarycolor">Privacy Policy</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-3xl space-y-6">
          <p className="text-gray-400">Effective Date: 2025-03-26</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">1. Introduction</h2>
          <p>Welcome to Ruang Bumi. We are committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your information.</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">2. Information We Collect</h2>
          <ul className="list-disc pl-6 text-gray-400">
            <li><strong>Personal Information:</strong> Name, email, phone number, company details, and billing information.</li>
            <li><strong>Technical Information:</strong> IP address, browser type, device details, and usage data.</li>
            <li><strong>Transactional Information:</strong> Purchase history and payment details.</li>
            <li><strong>Communications:</strong> Messages or inquiries sent to us.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">3. How We Use Your Information</h2>
          <ul className="list-disc pl-6 text-gray-400">
            <li>Provide and improve our services.</li>
            <li>Process transactions and manage accounts.</li>
            <li>Respond to inquiries and offer support.</li>
            <li>Enhance website functionality and security.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">4. Sharing Your Information</h2>
          <p>We do not sell your information. We may share data with:</p>
          <ul className="list-disc pl-6 text-gray-400">
            <li><strong>Service Providers:</strong> Payment processors, IT support, and cloud storage providers.</li>
            <li><strong>Legal Compliance:</strong> If required by law.</li>
            <li><strong>Business Transfers:</strong> In case of a company merger or acquisition.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">5. Data Security</h2>
          <p>We implement security measures to protect your data but cannot guarantee absolute security.</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">6. Your Rights</h2>
          <ul className="list-disc pl-6 text-gray-400">
            <li>Access, update, or delete your personal information.</li>
            <li>Opt out of marketing communications.</li>
            <li>Request a copy of your data.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">7. Cookies and Tracking</h2>
          <p>We use cookies to enhance user experience. You can manage cookie settings in your browser.</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">8. Third-Party Links</h2>
          <p>Our website may contain links to external sites. We are not responsible for their privacy practices.</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy. Any changes will be posted on this page with an updated effective date.</p>

          <h2 className="text-2xl font-semibold text-greensecondarycolor">10. Contact Us</h2>
          <p>If you have any questions, please contact us at:</p>
          <p>Ruang Bumi</p>
          <p>Email: admin@ruangbumi.com</p>
          <p>Phone: +6282170829587</p>
          
          <div className="text-center mt-6">
            <Link href="/" className="inline-flex items-center px-6 py-3 bg-greenmaincolor text-gray-900 rounded-lg hover:bg-greensecondarycolor transition-colors duration-200 font-semibold">
              Back to Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-maincolor border-t border-gray-700 p-4 text-center text-gray-400 text-sm">
        © 2025 ruangbumi. All rights reserved.
      </footer>
    </div>
  );
};






export default function page() {
  return (
    <div>
        <PrivacyPolicy />
    </div>
  )
}
