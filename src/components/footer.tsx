"use client";

import Link from "next/link";
import { Heart, Facebook, Instagram, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { GRADIENTS, SOCIAL_LINKS } from "@/lib/constants";
import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const navT = t.nav;
  const footerT = t.footer;
  return (
    <footer 
      className="border-t border-amber-300/50"
      style={{
        background: GRADIENTS.light
      }}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Sai Baba Vedha Garden
            </h3>
            <p className="text-gray-700">
              {footerT.description}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {footerT.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.home}
                </Link>
              </li>
              <li>
                <Link
                  href="/about-sai-baba"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.aboutSaiBaba}
                </Link>
              </li>
              <li>
                <Link
                  href="/temple-info"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.templeInfo}
                </Link>
              </li>
              <li>
                <Link
                  href="/aarti-bhajans"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.aartiBhajans}
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.events}
                </Link>
              </li>
              <li>
                <Link
                  href="/gallery"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.gallery}
                </Link>
              </li>
              <li>
                <Link
                  href="/goshla"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.goshala}
                </Link>
              </li>
              <li>
                <Link
                  href="/donations"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.donations}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-700 hover:text-divine-saffron transition-colors"
                >
                  {navT.contact}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              {footerT.contact}
            </h4>
            <p className="text-gray-700 mb-4">
              {footerT.visitUs}
              <br />
              <span className="text-divine-saffron font-medium">
                {footerT.omSaiRam}
              </span>
            </p>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                {footerT.followUs}
              </h4>
              <p className="text-gray-600 text-sm mb-3">
                {footerT.socialMedia}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href={SOCIAL_LINKS.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#25D366] text-divine-saffron hover:text-[#25D366] transition-all duration-300"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-5 h-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#1877F2] text-divine-saffron hover:text-[#1877F2] transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#E4405F] text-divine-saffron hover:text-[#E4405F] transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href={SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-10 h-10 bg-white rounded-lg border border-divine-cream shadow-sm hover:shadow-md hover:border-[#FF0000] text-divine-saffron hover:text-[#FF0000] transition-all duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-amber-300/50 pt-8 text-center">
          <p className="text-gray-700 flex items-center justify-center gap-2">
            {footerT.madeWith} <Heart className="w-4 h-4 text-divine-saffron" /> {footerT.forDevotees}
          </p>
          <p className="text-gray-600 text-sm mt-2">
            © {new Date().getFullYear()} Sai Baba Vedha Garden. {footerT.copyright}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600 mt-4">
            <Link href="/terms-and-conditions" className="hover:text-divine-saffron underline transition-colors">
              Terms & Conditions
            </Link>
            <span>•</span>
            <Link href="/privacy-policy" className="hover:text-divine-saffron underline transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-divine-saffron underline transition-colors">
              Refund Policy
            </Link>
            <span>•</span>
            <Link href="/cancellation-policy" className="hover:text-divine-saffron underline transition-colors">
              Cancellation Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

