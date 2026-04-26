import NavBar from "../components/landing_page/Navbar";
import Hero from "../components/landing_page/Hero";
import SectionA from "../components/landing_page/section-one";
import SectionB from "../components/landing_page/section-two";
import Features from "../components/landing_page/Features";
import HowItWorks from "../components/landing_page/HowItWorks";
import WhySection from "../components/landing_page/WhySection";
import SectionC from "../components/landing_page/section-three";
import PricingSection from "../components/landing_page/Pricing";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <main className="px-12">
        <NavBar/>
        <Hero/>
        <SectionA/>
        <SectionB/>
        <Features/>
        <HowItWorks/>
        <WhySection/>
        <SectionC/> 
        {/* there is a component here */}
        <PricingSection/>
      </main>
      <Footer/>
    </>
  );
}
