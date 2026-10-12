import { Hero } from "./_components/sections/Hero";
import { About } from "./_components/sections/About";
import { History } from "./_components/sections/History";
import { Customers } from "./_components/sections/Customers";
import { Collections } from "./_components/sections/Collections";
import { InquirySection } from "./_components/sections/InquirySection";

/**
 * One-page scroll home (REFERENCE_SITES.md "tmentor" v2 사이트맵).
 *
 * Former separate routes (`/about`, `/collections/women`,
 * `/collections/men`, `/inquiry`, `/contact`) are gone — everything now
 * lives as an anchored section on `/`, assembled here from
 * `_components/sections/*`.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Collections />
      <About />
      <History />
      <Customers />
      <InquirySection />
    </>
  );
}
