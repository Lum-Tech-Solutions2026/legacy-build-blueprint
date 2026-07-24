import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Credentials from "@/components/Credentials";
import About from "@/components/About";
import Compliance from "@/components/Compliance";
import FeaturedService from "@/components/FeaturedService";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
import BottomCTA from "@/components/BottomCTA";
import SEO from "@/components/SEO";

const Index = () => {
  return (
    <div className="min-h-screen">
      <SEO
        title="Lum Tech Building Solutions - Professional Construction Services in KZN"
        description="Over 10 years of experience in residential & commercial construction. NHBRC registered builders in Pietermaritzburg, KZN. Quality guaranteed."
        path="/"
      />
      <Header />
      <main>
        <Hero />
        <Credentials />
        <About />
        <Compliance />
        <FeaturedService />
        <Services />
        <Testimonials />
        <BottomCTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
