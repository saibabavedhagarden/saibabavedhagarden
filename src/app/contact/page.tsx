"use client";

import { GRADIENTS, SOCIAL_LINKS } from "@/lib/constants";
import { TempleMap } from "@/components/temple-map";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Clock, CheckCircle, Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const footerT = translations[language].footer;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
        await supabase.from("contact_submissions").insert([
          {
            full_name: formData.name,
            email: formData.email,
            phone: formData.phone,
            subject: formData.subject,
            message: formData.message,
          },
        ]);
      }
    } catch (err) {
      console.error("Supabase contact submit error:", err);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 5000);
  };

  return (
    <div className="min-h-screen" style={{ background: GRADIENTS.light }}>
      {/* Hero Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-800"
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
              }}
            >
              {t.hero.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-6 max-w-3xl mx-auto">
              {t.hero.subtitle}
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {t.hero.intro}
            </p>
          </div>
        </div>
      </section>

      {/* Contact info (vertical) + Send message form (side by side on large screens) */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 items-start">
              {/* Left side stacked one-by-one: phone + email + address + map */}
              <div className="flex flex-col gap-6 order-2 lg:order-1">
                <Card className="p-6 bg-white shadow-lg border border-amber-200/40 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {language === "en" && <Phone className="w-6 h-6 text-divine-saffron shrink-0" />}
                    <h3 className="text-xl font-bold text-gray-800">{t.info.phone.title}</h3>
                  </div>
                  <p className="text-lg font-semibold text-divine-saffron mb-2">{t.info.phone.number}</p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    {language === "en" && <Clock className="w-4 h-4 shrink-0" />}
                    {t.info.phone.note}
                  </p>
                </Card>

                <Card className="p-6 bg-white shadow-lg border border-amber-200/40 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {language === "en" && <Mail className="w-6 h-6 text-divine-saffron shrink-0" />}
                    <h3 className="text-xl font-bold text-gray-800">{t.info.email.title}</h3>
                  </div>
                  <p className="text-lg font-semibold text-divine-saffron mb-2 break-all">{t.info.email.address}</p>
                  <p className="text-sm text-gray-600">{t.info.email.note}</p>
                </Card>

                <Card className="p-6 bg-white shadow-lg border border-amber-200/40 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    {language === "en" && <MapPin className="w-6 h-6 text-divine-saffron shrink-0" />}
                    <h3 className="text-xl font-bold text-gray-800">{t.info.address.title}</h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {t.info.address.line1}
                    {t.info.address.line2 ? (
                      <>
                        <br />
                        {t.info.address.line2}
                      </>
                    ) : null}
                  </p>
                </Card>

                <Card className="p-6 bg-white shadow-lg border border-amber-200/40 hover:shadow-xl transition-shadow">
                  <TempleMap title={t.map.title} />
                </Card>

                <Card className="p-6 bg-white shadow-lg border border-amber-200/40 hover:shadow-xl transition-shadow">
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{footerT.followUs}</h3>
                  <p className="text-gray-600 text-sm mb-4">{footerT.socialMedia}</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={SOCIAL_LINKS.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#25D366] text-divine-saffron hover:text-[#25D366] transition-all duration-300"
                      aria-label="WhatsApp"
                    >
                      <FaWhatsapp className="w-5 h-5" />
                    </a>
                    <a
                      href={SOCIAL_LINKS.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#FF0000] text-divine-saffron hover:text-[#FF0000] transition-all duration-300"
                      aria-label="YouTube"
                    >
                      <Youtube className="w-5 h-5" />
                    </a>
                    <a
                      href={SOCIAL_LINKS.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#1877F2] text-divine-saffron hover:text-[#1877F2] transition-all duration-300"
                      aria-label="Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={SOCIAL_LINKS.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-11 h-11 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#E4405F] text-divine-saffron hover:text-[#E4405F] transition-all duration-300"
                      aria-label="Instagram"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  </div>
                </Card>
              </div>

              {/* Send Us a Message */}
              <div className="order-1 lg:order-2">
            <Card className="p-6 md:p-8 bg-white shadow-lg border border-amber-200/40">
              <div className="text-center mb-6">
                <h2
                  className="text-3xl md:text-4xl font-bold mb-3 text-gray-800"
                  style={{
                    fontFamily: "var(--font-playfair)",
                    fontWeight: 900,
                  }}
                >
                  {t.form.title}
                </h2>
                <p className="text-gray-600">{t.form.helperText}</p>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-divine-cream mb-4">
                    {language === "en" && <CheckCircle className="w-8 h-8 text-divine-saffron" />}
                  </div>
                  <p className="text-lg text-gray-700 font-medium">{t.form.successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.form.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                      placeholder={t.form.fullName}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.form.email} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                      placeholder={t.form.email}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.form.phone}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                      placeholder={t.form.phone}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.form.subject}
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none"
                      placeholder={t.form.subject}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t.form.message} *
                    </label>
                    <textarea
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      className="w-full p-4 border-2 border-gray-200 rounded-lg focus:border-divine-saffron focus:outline-none resize-none"
                      placeholder={t.form.message}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-4 text-lg font-semibold bg-divine-saffron hover:bg-divine-saffron-dark"
                  >
                    {t.form.sendMessage}
                  </Button>
                </form>
              )}
            </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Information Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-800 text-center"
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 900,
              }}
            >
              {t.trust.title}
            </h2>
            <Card className="p-6 md:p-8 bg-white shadow-lg border border-amber-200/40">
              <p className="text-lg text-gray-700 mb-6 leading-relaxed text-center">
                {t.trust.description}
              </p>
              <div className="space-y-4 text-center">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{t.trust.templeName}</p>
                  <p className="text-lg text-gray-800">{t.trust.templeNameValue}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{t.trust.registeredName}</p>
                  <p className="text-lg text-gray-800">{t.trust.registeredNameValue}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{t.trust.registrationNumber}</p>
                  <p className="text-lg text-gray-800">{t.trust.registrationNumberValue}</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{t.trust.yearEstablished}</p>
                  <p className="text-lg text-gray-800">{t.trust.yearEstablishedValue}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer Blessing Note */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-lg border border-amber-200/40 text-center">
              <blockquote
                className="text-2xl md:text-3xl text-divine-saffron italic mb-4 leading-relaxed"
                style={{
                  fontFamily: "var(--font-playfair)",
                }}
              >
                &ldquo;{t.blessing.quote}&rdquo;
              </blockquote>
              <p className="text-xl text-gray-700 font-semibold">{t.blessing.author}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
