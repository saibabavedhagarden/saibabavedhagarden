import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Sri Shirdi Saibaba Religious Trust",
  description: "Privacy policy for Sri Shirdi Saibaba Religious Trust website visitors and donors.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-amber-200/60">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Privacy Policy
        </h1>
        <p className="text-sm text-amber-700 font-semibold mb-8">
          Sri Shirdi Saibaba Religious Trust • Effective Date: September 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Information We Collect</h2>
            <p>
              Sri Shirdi Saibaba Religious Trust collects personal information provided voluntarily by donors and devotees when filling out donation forms or contact requests. This includes:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Mobile Number / Phone Number</li>
              <li>Selected Seva Category & Donation Amount</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. How We Use Your Information</h2>
            <p>
              The information collected is strictly used for:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Issuing official donation receipts and payment acknowledgments via email</li>
              <li>Responding to temple contact inquiries and prasadam/seva coordination</li>
              <li>Sharing temple event updates, festival announcements, and trust activities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Payment & Data Security</h2>
            <p>
              All financial transactions are handled securely through Razorpay. We do not store financial credentials (card numbers, UPI PINs, banking passwords) on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Information Sharing & Confidentiality</h2>
            <p>
              We do not sell, rent, trade, or share donor personal information with third parties. Your details remain confidential within Sri Shirdi Saibaba Religious Trust.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Contact Information</h2>
            <p>
              If you have any questions regarding your personal privacy, please reach out to us:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Email:</strong> saibabavedhagarden@gmail.com</li>
              <li><strong>Phone:</strong> +91 9566263596</li>
              <li><strong>Address:</strong> Sai Baba Vedha Garden, Mamandoor, Tamil Nadu, India</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
