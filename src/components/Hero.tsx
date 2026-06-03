import { Button } from "@/components/ui/button";
import { Phone, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-construction.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-construction-primary/90 via-construction-primary/80 to-construction-primary/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold mb-6 leading-tight">
            Building Your Vision,{" "}
            <span className="text-accent">One Brick</span> at a Time
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl font-open-sans mb-8 text-gray-100 max-w-3xl mx-auto leading-relaxed">
            Over a Decade of Experience • NHBRC Registered • Quality Guaranteed
          </p>

          {/* Contact Info */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-10">
            <a 
              href="tel:+27634127228" 
              className="flex items-center space-x-3 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Phone className="h-5 w-5" />
              <span className="font-poppins font-semibold">Call Us Today: +27 63 412 7228</span>
            </a>
            <a 
              href="mailto:project@lumtechsolutions.co.za" 
              className="flex items-center space-x-3 bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              <Mail className="h-5 w-5" />
              <span className="font-poppins font-medium">project@lumtechsolutions.co.za</span>
            </a>
          </div>

          {/* CTA Button */}
          <Button 
            asChild
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-gold-glow group"
          >
            <Link to="/contact">
              Request a Quote
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>

          {/* Trust Indicators */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 text-gray-200">
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
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;