import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Gallery", path: "/gallery" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <header className="bg-primary text-primary-foreground shadow-construction sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="hidden md:block bg-construction-gold text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="tel:0611469246" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Phone className="h-4 w-4" />
              <span>061 146 9246</span>
            </a>
            <a href="mailto:info@legacyhomebuilderssa.co.za" className="flex items-center space-x-2 hover:text-primary transition-colors">
              <Mail className="h-4 w-4" />
              <span>info@legacyhomebuilderssa.co.za</span>
            </a>
          </div>
          <div className="text-sm font-medium">
            NHBRC Registered • Over 10 Years Experience
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">LH</span>
            </div>
            <div>
              <h1 className="text-xl font-poppins font-bold">Legacy Home Builders SA</h1>
              <p className="text-sm text-gray-300">Building Your Vision</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-poppins font-medium transition-colors hover:text-accent ${
                  isActivePage(item.path) ? "text-accent" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button variant="secondary" size="sm" className="font-poppins font-semibold">
              Request Quote
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-white/20 mt-4">
            <div className="space-y-2 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-2 px-4 font-poppins transition-colors hover:text-accent ${
                    isActivePage(item.path) ? "text-accent bg-white/10" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2">
                <Button variant="secondary" size="sm" className="w-full font-poppins font-semibold">
                  Request Quote
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;