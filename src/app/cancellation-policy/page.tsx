import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cancellation Policy | Sri Shirdi Saibaba Religious Trust",
  description: "Cancellation policy for Sri Shirdi Saibaba Religious Trust Seva and donations.",
};

export default function CancellationPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-amber-200/60">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Cancellation Policy
        </h1>
        <p className="text-sm text-amber-700 font-semibold mb-8">
          Sri Shirdi Saibaba Religious Trust • Effective Date: September 2026
        </p>

        <div className="space-y-6 text-gray-700 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">1. Seva & Pooja Bookings</h2>
            <p>
              Contributions for specific Seva offerings, Pooja services, Annadhanam, or Special Aarti prayers are immediately allocated toward temple preparations and ritual arrangements.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-2">2. Cancellation Guidelines</h2>
            <p>
              Since ritual arrangements and food preparations begin upon receipt of Seva bookings, cancellation requests made on or after the day of Seva cannot be fulfilled. If you wish to reschedule a Seva booking to a future date due to unforeseen circumstances, please contact temple administration at least <strong>48 hours</strong> in advance.
            </p>
          </section>

          <section className="pt-4 border-t border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-2">3. Contact Us</h2>
            <p>
              For cancellation or rescheduling inquiries:
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
