import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/lumtech-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Portfolio", path: "/portfolio" },
    { name: "Blog", path: "/blog" },
    { name: "Contact", path: "/contact" },
  ];

  const isActivePage = (path: string) => location.pathname === path;

  return (
    <header className="bg-background shadow-sm border-b border-border sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="hidden md:block bg-primary text-primary-foreground py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <a href="tel:+27634127228" className="flex items-center space-x-2 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" />
              <span>+27 63 412 7228</span>
            </a>
            <a href="mailto:projects@lumtechsolutions.co.za" className="flex items-center space-x-2 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" />
              <span>projects@lumtechsolutions.co.za</span>
            </a>
          </div>
          <div className="text-sm font-medium">
            NHBRC Registered • Over 10 Years Experience
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="Lum Tech Building Solutions logo" className="h-12 md:h-14 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-poppins font-medium text-foreground transition-colors hover:text-accent ${
                  isActivePage(item.path) ? "text-accent" : ""
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Button asChild variant="default" size="sm" className="font-poppins font-semibold bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link to="/contact">Request Quote</Link>
            </Button>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-border mt-2">
            <div className="space-y-1 pt-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-2 px-4 rounded-md font-poppins text-foreground transition-colors hover:text-accent ${
                    isActivePage(item.path) ? "text-accent bg-secondary" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-2 px-4">
                <Button asChild variant="default" size="sm" className="w-full font-poppins font-semibold bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)}>Request Quote</Link>
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
