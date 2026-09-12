import { useState } from 'react';
import { ToolInput, ToolButton, CopyButton } from '@/components/ToolUI';

// === Privacy Policy Generator ===
export function PrivacyPolicyGenerator() {
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = company || 'Your Company';
    const site = website || 'your-website.com';
    const contact = email || 'contact@' + site;
    setOutput(`PRIVACY POLICY

Last updated: ${new Date().toLocaleDateString()}

This Privacy Policy describes how ${name} ("we", "us", or "our") collects, uses, and discloses your information when you visit or use our website at ${site} (the "Service").

1. Information We Collect
We may collect personal information that you voluntarily provide to us, such as your name, email address, and any other details you choose to provide. We also automatically collect certain non-personal information such as browser type, IP address, device information, and usage data through cookies and similar technologies.

2. How We Use Your Information
We use the collected information to:
- Provide, operate, and maintain the Service
- Improve, personalize, and expand the Service
- Understand and analyze how you use the Service
- Respond to your comments, questions, and customer service requests

3. Cookies
We use cookies and similar tracking technologies to track the activity on our Service and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.

4. Third-Party Services
We may employ third-party companies and individuals to facilitate the Service. These third parties have access to your Personal Information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.

5. Data Security
We take reasonable measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.

6. Your Rights
Depending on your location, you may have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at ${contact}.

7. Changes to This Privacy Policy
We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.

8. Contact Us
If you have any questions about this Privacy Policy, please contact us at ${contact}.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="acme.com" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="privacy@acme.com" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate}>Generate Privacy Policy</ToolButton>
      {output && <><ToolInput label="Privacy Policy" value={output} onChange={() => {}} rows={16} readOnly /><CopyButton text={output} /></>}
    </div>
  );
}

// === Terms and Conditions Generator ===
export function TermsAndConditionGenerator() {
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = company || 'Your Company';
    const site = website || 'your-website.com';
    const contact = email || 'contact@' + site;
    setOutput(`TERMS AND CONDITIONS

Last updated: ${new Date().toLocaleDateString()}

Please read these Terms and Conditions ("Terms", "Terms and Conditions") carefully before using the ${site} website (the "Service") operated by ${name} ("us", "we", or "our").

1. Acceptance of Terms
By accessing or using the Service, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the Service.

2. Use of the Service
You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the Service.

3. Intellectual Property
The Service and its original content, features, and functionality are owned by ${name} and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.

4. Termination
We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason whatsoever.

5. Limitation of Liability
In no event shall ${name} be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.

6. Disclaimer
The Service is provided on an "AS IS" and "AS AVAILABLE" basis. You use the Service at your own risk and we do not warrant that the Service will be uninterrupted or error-free.

7. Changes to Terms
We reserve the right to modify these Terms at any time. We will alert you about any changes by posting the new Terms on this page and updating the "Last updated" date.

8. Contact Us
If you have any questions about these Terms, please contact us at ${contact}.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="acme.com" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="legal@acme.com" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate}>Generate Terms & Conditions</ToolButton>
      {output && <><ToolInput label="Terms and Conditions" value={output} onChange={() => {}} rows={16} readOnly /><CopyButton text={output} /></>}
    </div>
  );
}

// === Disclaimer Generator ===
export function DisclaimerGenerator() {
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const name = company || 'Your Company';
    const site = website || 'your-website.com';
    setOutput(`DISCLAIMER

Last updated: ${new Date().toLocaleDateString()}

The information provided by ${name} on ${site} is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.

Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.

The Site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us.

The information on the Site is not intended to be a substitute for professional advice. You should always seek the advice of a qualified professional regarding any questions you may have.

For any questions about this Disclaimer, you can contact us at ${name}.`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Company Name</label>
          <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Website</label>
          <input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="acme.com" className="w-full rounded-lg bg-slate-900 border border-slate-700 px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/40" />
        </div>
      </div>
      <ToolButton onClick={generate}>Generate Disclaimer</ToolButton>
      {output && <><ToolInput label="Disclaimer" value={output} onChange={() => {}} rows={12} readOnly /><CopyButton text={output} /></>}
    </div>
  );
}
