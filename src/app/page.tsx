import { Hero } from "@/components/hero";
import { DailyAartiTimings } from "@/components/daily-aarti-timings";
import { TodaysMessage } from "@/components/todays-message";
import { QuickDevotionalLinks } from "@/components/quick-devotional-links";
import { UpcomingEvents } from "@/components/upcoming-events";
import { DonationCTA } from "@/components/donation-cta";
import { OAuthRedirectHandler } from "@/components/oauth-redirect-handler";

export default function Home() {
  return (
    <div className="flex flex-col">
      <OAuthRedirectHandler />
      <Hero />
      <DailyAartiTimings />
      <TodaysMessage />
      <QuickDevotionalLinks />
      <UpcomingEvents />
      <DonationCTA />
    </div>
  );
}
