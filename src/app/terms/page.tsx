'use client';

import React from 'react';
import AppLayout from '../components/AppLayout';

export default function TermsOfServicePage() {
  return (
    <AppLayout title="Terms of Service - Lagoons Gaming">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-purple-700">
            <h1 className="text-2xl font-bold text-white">Terms of Service</h1>
            <p className="mt-1 text-sm text-blue-100">
              Last updated: May 7, 2025
            </p>
          </div>
          
          <div className="px-4 py-5 sm:p-6 prose prose-blue max-w-none">
            <p className="text-gray-700">
              Welcome to Lagoons Gaming. Please read these Terms of Service ("Terms") carefully before using our website and services.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">1. Acceptance of Terms</h2>
            <p>
              By accessing or using our services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our services.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">2. Eligibility</h2>
            <p>
              You must be at least 18 years old to use our services. By using our services, you represent and warrant that you are at least 18 years old and that your use of our services does not violate any applicable law or regulation.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">3. Account Registration</h2>
            <p>
              When you register for an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account information, including your password, and for all activity that occurs under your account.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">4. Payment and Withdrawals</h2>
            <p>
              We accept Bitcoin and Lightning Network for payments. All deposits and withdrawals are subject to verification procedures. Withdrawal requests are typically processed within 15 minutes but may take longer depending on network congestion and verification requirements.
            </p>
            <p>
              We reserve the right to refuse or cancel withdrawal requests if we suspect fraudulent activity or violations of our Terms.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">5. Prohibited Activities</h2>
            <p>
              You agree not to use our services for any illegal purposes or in any manner that could damage, disable, overburden, or impair our services. Prohibited activities include but are not limited to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Using automated systems or software to extract data from our services</li>
              <li>Attempting to gain unauthorized access to our systems or other users' accounts</li>
              <li>Using our services for money laundering or other financial crimes</li>
              <li>Engaging in fraudulent activities or providing false information</li>
              <li>Violating the intellectual property rights of others</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">6. Intellectual Property</h2>
            <p>
              All content on our services, including but not limited to text, graphics, logos, icons, images, audio clips, and software, is the property of Lagoons Gaming or its licensors and is protected by copyright, trademark, and other intellectual property laws.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">7. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by law, Lagoons Gaming shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Your use of or inability to use our services</li>
              <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
              <li>Any interruption or cessation of transmission to or from our services</li>
              <li>Any bugs, viruses, trojan horses, or the like that may be transmitted to or through our services</li>
            </ul>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will provide notice of any material changes by posting the new Terms on our website and updating the "Last Updated" date. Your continued use of our services after such modifications constitutes your acceptance of the modified Terms.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">9. Termination</h2>
            <p>
              We reserve the right to terminate or suspend your account and access to our services at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">10. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Lagoons Gaming operates, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-xl font-bold text-gray-900 mt-8">11. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us via our support channel or WhatsApp button.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}