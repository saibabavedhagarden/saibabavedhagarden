import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Sri Shirdi Saibaba Religious Trust",
  description: "Refund policy for Sri Shirdi Saibaba Religious Trust online donations.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-amber-200/60">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Refund Policy
        </h1>
        <p className="text-sm text-amber-700 font-semibold mb-8">
          Sri Shirdi Saibaba Religious Trust • Effective Date: September 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Voluntary Donations</h2>
            <p>
              Sri Shirdi Saibaba Religious Trust relies on voluntary contributions from devotees for religious Seva, Annadhanam, temple maintenance, and community development. As donations are voluntary offerings, refunds are generally not entertained once a contribution is successfully processed.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Erroneous or Duplicate Payments</h2>
            <p>
              In the event of an unintended duplicate transaction, incorrect amount entry, or technical payment error:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Donors may submit a refund request within <strong>7 days</strong> of the transaction date.</li>
              <li>Please email us at <strong>saibabavedhagarden@gmail.com</strong> with payment proof, Razorpay Payment ID, and donor contact details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Refund Processing Timeline</h2>
            <p>
              Once a valid refund request is reviewed and approved by trust management, the refund will be initiated back to the original source payment method (Bank Account / UPI / Card) within <strong>5 to 7 business days</strong> via Razorpay gateway.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">4. Support Contact</h2>
            <p>
              For refund assistance or transaction verification, reach out to our team:
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
