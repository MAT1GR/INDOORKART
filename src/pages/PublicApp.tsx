import React, { useState, useEffect } from "react";
import { useApi } from "../hooks/useApi";
import { Branch } from "../types";
import Hero from "../components/public/Hero";
import BookingWizard from "../components/booking/BookingWizard";
import PlansSection from "../components/public/PlansSection";
import HowItWorksSection from "../components/public/HowItWorksSection";
import RequirementsSection from "../components/public/RequirementsSection";
import GallerySection from "../components/public/GallerySection";
import LocationSection from "../components/public/LocationSection";
import FAQSection from "../components/public/FAQSection";
import Footer from "../components/public/Footer";

const PublicApp: React.FC = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { data: branch, loading } = useApi<Branch>("/public/branch");

  if (loading || !branch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900 to-orange-900">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl">Cargando experiencia de karting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Hero onBookingClick={() => setIsBookingOpen(true)} />
      <PlansSection />
      <HowItWorksSection />
      <RequirementsSection />
      <GallerySection />
      <LocationSection branch={branch} />
      <FAQSection />
      <Footer />

      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        branch={branch}
      />
    </div>
  );
};

export default PublicApp;
