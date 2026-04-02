import NavBar from "../../components/landing-page/Navbar";
import Hero from "../../components/landing-page/Hero";
import SectionA from "../../components/landing-page/section-one";
import SectionB from "../../components/landing-page/section-two";
import Features from "../../components/landing-page/Features";
import HowItWorks from "../../components/landing-page/HowItWorks";
import WhySection from "../../components/landing-page/WhySection";
import SectionC from "../../components/landing-page/section-three";
import PricingSection from "../../components/landing-page/Pricing";
import Footer from "../../components/Footer";

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
