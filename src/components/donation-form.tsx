"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { loadRazorpayScript } from "@/lib/razorpay-client";

const donationAmounts = [500, 1000, 2500, 5000];

type PaymentStatus = "idle" | "loading" | "success" | "error";

export function DonationForm() {
  const { language } = useLanguage();
  const t = translations[language].donations.form;
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const successCardRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sevaCategory: "",
  });

  const sevaCategories = [
    translations[language].donations.categories.general.title,
    translations[language].donations.categories.annadanam.title,
    translations[language].donations.categories.festival.title,
    translations[language].donations.categories.pooja.title,
    translations[language].donations.categories.development.title,
    translations[language].donations.categories.goshala.title,
  ];

  const getDonationAmountInRupees = () => {
    if (selectedAmount) return selectedAmount;
    const parsed = Number(customAmount);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const amountInRupees = getDonationAmountInRupees();
    const amountInPaise = Math.round(amountInRupees * 100);

    if (amountInPaise < 100) {
      setPaymentStatus("error");
      setErrorMessage(t.minAmount);
      return;
    }

    setPaymentStatus("loading");

    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error(t.paymentError);
      }

      const orderResponse = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInPaise,
          sevaCategory: formData.sevaCategory || "General Donation",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || t.paymentError);
      }

      const razorpayKey = orderData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error(t.paymentError);
      }

      const description = `Donation - ${formData.sevaCategory || "General"} | ${formData.name} (${formData.email})`;

      let paymentCompleted = false;

      const razorpay = new window.Razorpay({
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "SRI SHIRDI SAIBABA RELIGIOUS TRUST",
        description,
        order_id: orderData.order_id,
        notes: {
          "Donor Name": formData.name,
          "Donor Email": formData.email,
          "Donor Phone": formData.phone,
          "Seva Category": formData.sevaCategory || "General Donation",
          "Payment Purpose": "Donation",
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#f59e0b",
        },
        handler: async (response) => {
          paymentCompleted = true;
          try {
            const verifyResponse = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                donor_name: formData.name,
                donor_email: formData.email,
                donor_phone: formData.phone,
                amount: amountInRupees,
                seva_category: formData.sevaCategory || "General",
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.success) {
              throw new Error(verifyData.error || t.paymentFailed);
            }

            setPaymentStatus("success");
            setSelectedAmount(null);
            setCustomAmount("");
            setFormData({
              name: "",
              email: "",
              phone: "",
              sevaCategory: "",
            });
          } catch (error) {
            setPaymentStatus("error");
            setErrorMessage(
              error instanceof Error ? error.message : t.paymentFailed
            );
          }
        },
        modal: {
          ondismiss: () => {
            if (!paymentCompleted) {
              setErrorMessage(t.paymentCancelled);
            }
          },
        },
      });

      razorpay.on("payment.failed", (response) => {
        setPaymentStatus("error");
        setErrorMessage(response.error.description || t.paymentFailed);
      });

      setPaymentStatus("idle");
      razorpay.open();
    } catch (error) {
      setPaymentStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : t.paymentError
      );
    }
  };

  const isProcessing = paymentStatus === "loading";
  const donationAmount = getDonationAmountInRupees();

  useEffect(() => {
    if (paymentStatus !== "success") return;

    const timer = window.setTimeout(() => {
      successCardRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 100);

    return () => window.clearTimeout(timer);
  }, [paymentStatus]);

  if (paymentStatus === "success") {
    return (
      <div ref={successCardRef}>
        <Card className="p-6 md:p-8">
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-divine-cream mb-4">
            {language === "en" && (
              <CheckCircle className="w-8 h-8 text-divine-saffron" />
            )}
          </div>
          <p className="text-lg text-gray-700 font-medium">{t.paymentSuccess}</p>
          <Button
            type="button"
            className="mt-6 bg-divine-saffron hover:bg-divine-saffron-dark"
            onClick={() => {
              setPaymentStatus("idle");
              setErrorMessage("");
            }}
          >
            {t.title}
          </Button>
        </div>
        </Card>
      </div>
    );
  }

  return (
    <Card className="p-6 md:p-8">
      <div className="text-center mb-8">
        <h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 900,
          }}
        >
          {t.title}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Donation Amount */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            {t.donationAmount}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
            {donationAmounts.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                  setErrorMessage("");
                }}
                className={`p-4 rounded-lg border-2 font-semibold transition-all ${
                  selectedAmount === amount
                    ? "border-divine-saffron bg-divine-cream text-divine-saffron"
                    : "border-gray-200 hover:border-divine-saffron/50 text-gray-700"
                }`}
              >
                ₹{amount.toLocaleString()}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <input
              type="number"
              min="1"
              step="1"
              placeholder={t.customAmount}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
                setErrorMessage("");
              }}
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
            />
          </div>
        </div>

        {/* Donor Details */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">{t.donorDetails}</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.fullName} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                placeholder={t.fullName}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.email} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                placeholder={t.email}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.mobile} *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                placeholder={t.mobile}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t.sevaCategory}
              </label>
              <select
                value={formData.sevaCategory}
                onChange={(e) =>
                  setFormData({ ...formData, sevaCategory: e.target.value })
                }
                className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none bg-white"
              >
                <option value="">{t.sevaCategory}</option>
                {sevaCategories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Accepted payment methods — selection happens in Razorpay checkout */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-2">{t.paymentMethods}</h3>
          <p className="text-sm text-gray-600 mb-4">{t.paymentMethodsNote}</p>
          <div className="flex flex-wrap gap-2">
            {[t.upi, t.debitCard, t.creditCard, t.netBanking].map((method) => (
              <span
                key={method}
                className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-gray-700"
              >
                {method}
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 flex items-center gap-2">
            {language === "en" && <Shield className="w-4 h-4 text-divine-saffron" />}
            {t.secureNote}
          </p>
        </div>

        <Button
          type="submit"
          className="w-full py-4 text-lg font-semibold bg-divine-saffron hover:bg-divine-saffron-dark"
          disabled={isProcessing || donationAmount < 1}
        >
          {isProcessing ? t.processing : t.proceed}
        </Button>
      </form>
    </Card>
  );
}
