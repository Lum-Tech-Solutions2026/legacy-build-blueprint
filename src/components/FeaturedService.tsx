import { Star, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import renovationImage from "@/assets/renovation-mix.jpg";

const FeaturedService = () => {
  const renovationServices = [
    "Home Extensions",
    "Kitchen Renovations",
    "Bathroom Renovations",
    "Interior & Exterior Upgrades",
    "Ceiling & Drywall Installation",
    "Tiling & Flooring",
    "Painting & Decorative Finishes",
    "Roofing Repairs & Replacement",
    "Structural Alterations",
    "Complete Home Makeovers",
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${renovationImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-construction-primary/95 via-construction-primary/90 to-construction-primary/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-3xl text-white">
          <div className="inline-flex items-center gap-2 bg-gradient-accent text-accent-foreground rounded-full px-5 py-2.5 mb-6 shadow-gold-glow animate-pulse">
            <Star className="h-5 w-5 fill-accent-foreground text-accent-foreground" />
            <span className="font-poppins font-bold text-sm md:text-base tracking-wide uppercase">
              Most Requested Service
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-poppins font-extrabold mb-6 leading-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.75)]">
            Home Renovations &amp; <span className="text-construction-gold-text">Extensions</span>
          </h2>

          <p className="font-open-sans text-gray-100 leading-relaxed mb-8 text-lg [text-shadow:0_1px_6px_rgba(0,0,0,0.8)]">
            Whether you're modernising your home, expanding your living space, or restoring an
            older property, Lum Tech Building Solutions delivers renovations that combine quality
            craftsmanship with practical design. From structural alterations to premium interior
            finishes, we transform existing spaces into homes that are functional, durable, and
            built to suit your lifestyle.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mb-10">
            {renovationServices.map((item) => (
              <div key={item} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                <span className="font-open-sans text-gray-100">{item}</span>
              </div>
            ))}
          </div>

          <Button
            asChild
            size="lg"
            className="bg-gradient-accent hover:opacity-90 text-accent-foreground font-poppins font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-gold-glow group"
          >
            <Link to="/services#home-renovations-extensions">
              Explore Renovation Services
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedService;
