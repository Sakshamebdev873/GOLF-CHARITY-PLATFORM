import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItworks";
import Charities from "@/components/landing/Charities";
import Prizes from "@/components/landing/Prizes";
import Pricing from "@/components/landing/Pricing";
import Footer from "@/components/landing/Footer";
import AuthModal from "@/components/landing/AuthModal";

export default function Home() {
  return (
    <main  className="overflow-hidden">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Charities />
      <Prizes />
      <Pricing />
      <AuthModal />
      <Footer />
    </main>
  );
}