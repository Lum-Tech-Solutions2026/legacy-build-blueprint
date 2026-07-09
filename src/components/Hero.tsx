import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";
import QuoteForm from "@/components/QuoteForm";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden py-28 lg:py-0">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-construction-primary/95 via-construction-primary/85 to-construction-primary/60"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left: messaging */}
          <div className="lg:col-span-3 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6 leading-tight">
              Building Your Vision,{" "}
              <span className="text-accent">One Brick</span> at a Time
            </h1>

            <p className="text-xl md:text-2xl font-open-sans mb-8 text-gray-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Over a Decade of Experience • NHBRC Registered • Quality Guaranteed
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
              <a
                href="tel:+27634127228"
                className="flex items-center space-x-3 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Phone className="h-5 w-5" />
                <span className="font-poppins font-semibold">Call Us Today: +27 63 412 7228</span>
              </a>
              <a
                href="mailto:projects@lumtechsolutions.co.za"
                className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
              >
                <Mail className="h-5 w-5" />
                <span className="font-poppins font-medium">projects@lumtechsolutions.co.za</span>
              </a>
            </div>

            <Button
              asChild
              size="lg"
              className="hidden lg:inline-flex bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-gold-glow group"
            >
              <Link to="/contact">
                Request a Quote
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center lg:justify-start space-y-4 md:space-y-0 md:space-x-8 text-gray-200">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="font-open-sans">Over 10 Years of Experience</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="font-open-sans">NHBRC Registered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
                <span className="font-open-sans">Professional & Reliable Service</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Quote card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-md mx-auto">
              <h2 className="font-poppins font-bold text-2xl text-primary mb-1">Get a Free Quote</h2>
              <p className="text-gray-500 font-open-sans text-sm mb-5">
                Tell us about your project — we'll respond within 24 hours.
              </p>
              <QuoteForm source="hero_quick_quote" compact />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="hidden lg:flex absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
