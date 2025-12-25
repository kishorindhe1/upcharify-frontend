import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link to="/login" className="inline-flex items-center text-slate-600 hover:text-teal-600 mb-6 transition-colors">
          <ArrowLeftOutlined className="mr-2" />
          Back to Login
        </Link>

        <div className="glass-morphism rounded-3xl p-8 md:p-12 shadow-2xl">
          <h1 className="text-4xl font-bold text-slate-800 mb-8 text-center">Terms of Service</h1>
          
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 mb-6">Last updated: December 24, 2025</p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing and using Upcharify hospital management system, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">2. Use License</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                Permission is granted to temporarily access Upcharify for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software</li>
                <li>Remove any copyright or other proprietary notations</li>
                <li>Transfer the materials to another person or mirror the materials on any other server</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">3. Data Privacy and Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We are committed to protecting your data. All patient and hospital information is encrypted and stored securely. We comply with HIPAA and other relevant healthcare data protection regulations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">4. User Responsibilities</h2>
              <p className="text-slate-600 leading-relaxed mb-4">
                As a user of Upcharify, you agree to:
              </p>
              <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized use</li>
                <li>Use the system in compliance with all applicable laws</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">5. Service Availability</h2>
              <p className="text-slate-600 leading-relaxed">
                While we strive for 99.9% uptime, we do not guarantee uninterrupted availability of the service. Scheduled maintenance will be announced in advance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">6. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                Upcharify shall not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">7. Modifications to Terms</h2>
              <p className="text-slate-600 leading-relaxed">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">8. Contact Information</h2>
              <p className="text-slate-600 leading-relaxed">
                For questions about these Terms, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <p className="text-slate-700">Email: legal@upcharify.com</p>
                <p className="text-slate-700">Phone: +91 1800-UPCHARIFY</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
