'use client';

import React from 'react';
import AppLayout from '../components/AppLayout';

export default function PrivacyPolicyPage() {
  return (
    <AppLayout title="Privacy Policy - Skywinners Gaming">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-700">
            <h1 className="text-2xl font-bold text-white">Privacy Policy</h1>
            <p className="mt-1 text-sm text-blue-100">
              Last updated: May 7, 2025
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 prose prose-blue max-w-none">
            <p className="text-gray-700">
              At Skywinners Gaming, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your information when you use our services.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">1. Information We Collect</h2>
            <p>
              We may collect the following types of information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Personal Information:</strong> Username, game IDs, and cryptocurrency wallet addresses.</li>
              <li><strong>Transaction Data:</strong> Information about deposits, withdrawals, and other financial transactions.</li>
              <li><strong>Device Information:</strong> IP address, browser type, device type, and operating system.</li>
              <li><strong>Usage Information:</strong> How you interact with our services, including gameplay data and preferences.</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
            <p>
              We use your information for the following purposes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To provide and maintain our services</li>
              <li>To process transactions and manage accounts</li>
              <li>To improve and personalize your experience</li>
              <li>To communicate with you about your account, promotions, and updates</li>
              <li>To prevent fraud and ensure the security of our platform</li>
              <li>To comply with legal obligations</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">3. Information Sharing and Disclosure</h2>
            <p>
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Service Providers:</strong> With third-party service providers who help us operate our services (e.g., payment processors, customer support).</li>
              <li><strong>Legal Requirements:</strong> When required by law or in response to valid legal processes.</li>
              <li><strong>Protection of Rights:</strong> When necessary to protect our rights, safety, or property, or those of our users or others.</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets.</li>
            </ul>
            <p>
              We do not sell your personal information to third parties.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">5. Your Rights</h2>
            <p>
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>The right to access and receive a copy of your personal information</li>
              <li>The right to rectify or update your personal information</li>
              <li>The right to delete your personal information</li>
              <li>The right to restrict or object to the processing of your personal information</li>
              <li>The right to data portability</li>
            </ul>
            <p>
              To exercise these rights, please contact us through our support channels.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">6. Cookies and Similar Technologies</h2>
            <p>
              We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookies through your browser settings, but disabling certain cookies may limit your ability to use some features of our services.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">7. Children's Privacy</h2>
            <p>
              Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete that information.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. When we transfer your information, we will take appropriate measures to protect it.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">9. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on our website and updating the "Last Updated" date. We encourage you to review our Privacy Policy periodically.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us via our support channel or WhatsApp button.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}