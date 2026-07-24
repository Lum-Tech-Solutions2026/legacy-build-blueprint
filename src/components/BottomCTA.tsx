import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BottomCTA = () => {
  return (
    <section className="py-20 bg-gradient-accent">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-poppins font-bold text-accent-foreground mb-6">
          Let's Build Something Exceptional Together
        </h2>
        <p className="font-open-sans text-accent-foreground/90 max-w-2xl mx-auto mb-10 text-lg leading-relaxed">
          Whether you are planning a new home, extending your property, renovating an existing
          space or undertaking a commercial project, our experienced team is ready to help bring
          your vision to life.
        </p>
        <Button
          asChild
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white font-poppins font-bold text-lg px-10 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg group"
        >
          <Link to="/contact">
            Request Your Free Consultation Today
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default BottomCTA;
