import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonials from "@/components/Testimonials";
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
        <About />
        <Services />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
