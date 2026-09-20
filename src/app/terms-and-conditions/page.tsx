import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Sri Shirdi Saibaba Religious Trust",
  description: "Terms and conditions for Sri Shirdi Saibaba Religious Trust website and donation services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-amber-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-amber-200/60">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Terms & Conditions
        </h1>
        <p className="text-sm text-amber-700 font-semibold mb-8">
          Sri Shirdi Saibaba Religious Trust • Effective Date: September 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Overview</h2>
            <p>
              Welcome to Sri Shirdi Saibaba Religious Trust (Sai Baba Vedha Garden). By accessing our website (https://www.saibabavedhagarden.com) or making a donation for Seva, Pooja, Annadhanam, or Temple Development, you agree to comply with and be bound by the following terms and conditions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Voluntary Donations & Seva Contributions</h2>
            <p>
              All contributions made on this website are voluntary donations dedicated to supporting the religious, spiritual, charitable, Annadhanam, and infrastructural activities of Sri Shirdi Saibaba Religious Trust. Donations do not constitute commercial transactions for goods or services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Payment Gateway Security</h2>
            <p>
              Online payments and donations are processed securely via Razorpay payment gateway. The Trust does not store credit/debit card details, UPI PINs, or banking credentials on its servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. User Responsibilities</h2>
            <p>
              Donors are responsible for providing accurate contact details (Full Name, Email, Mobile Number) during donation submission to enable valid receipt generation and communication.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">5. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of India. Any disputes arising shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">6. Contact Us</h2>
            <p>
              For any queries regarding these terms, please contact us:
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
