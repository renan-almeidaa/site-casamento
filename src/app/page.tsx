"use client";

import { useState } from "react";
import { IntroOverlay } from "@/components/sections/IntroOverlay";
import { Hero } from "@/components/sections/Hero";
import { Navbar } from "@/components/layout/Navbar";
import { NossaHistoria } from "@/components/sections/NossaHistoria";
import { OGrandeDia } from "@/components/sections/OGrandeDia";
import { Galeria } from "@/components/sections/Galeria";
import { RsvpCta } from "@/components/sections/RsvpCta";
import { PresentesCta } from "@/components/sections/PresentesCta";
import { Agradecimento } from "@/components/sections/Agradecimento";
import { Footer } from "@/components/layout/Footer";
import { RsvpModal } from "@/components/rsvp/RsvpModal";

export default function HomePage() {
  const [rsvpOpen, setRsvpOpen] = useState(false);
  return (
    <main>
      <IntroOverlay />
      <Navbar />
      <Hero />
      <NossaHistoria />
      <OGrandeDia />
      <Galeria />
      <RsvpCta onOpenRsvp={() => setRsvpOpen(true)} />
      <PresentesCta />
      <Agradecimento />
      <Footer />
      <RsvpModal open={rsvpOpen} onClose={() => setRsvpOpen(false)} />
    </main>
  );
}
