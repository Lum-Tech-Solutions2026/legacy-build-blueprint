import { Phone, Mail, MapPin, Clock, Facebook } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/lumtech-logo-dark.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={logo} alt="Lum Tech Building Solutions logo" className="h-16 w-auto" />
            </div>
            <p className="text-gray-300 font-open-sans">
              Over 10 years of experience in delivering exceptional building services. 
              NHBRC registered for your peace of mind.
            </p>
            <p className="text-accent font-open-sans italic text-sm border-l-2 border-accent pl-3">
              Our mission: to build lasting structures and lasting relationships through quality
              craftsmanship, integrity, and exceptional service.
            </p>
            <a
              href="https://facebook.com/Lumtechbuildingsolutions"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lum Tech Building Solutions on Facebook"
              className="inline-flex items-center space-x-2 text-gray-300 hover:text-accent transition-colors font-open-sans"
            >
              <Facebook className="h-5 w-5" />
              <span>Follow us on Facebook</span>
            </a>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-poppins font-semibold text-accent">Quick Links</h4>
            <nav className="space-y-2">
              <Link to="/" className="block text-gray-300 hover:text-accent transition-colors font-open-sans">
                Home
              </Link>
              <Link to="/about" className="block text-gray-300 hover:text-accent transition-colors font-open-sans">
                About Us
              </Link>
              <Link to="/services" className="block text-gray-300 hover:text-accent transition-colors font-open-sans">
                Our Services
              </Link>
              <Link to="/portfolio" className="block text-gray-300 hover:text-accent transition-colors font-open-sans">
                Portfolio
              </Link>
              <Link to="/blog" className="block text-gray-300 hover:text-accent transition-colors font-open-sans">
                Blog
              </Link>
              <Link to="/contact" className="block text-gray-300 hover:text-accent transition-colors font-open-sans">
                Contact
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-poppins font-semibold text-accent">Our Services</h4>
            <ul className="space-y-2 text-gray-300 font-open-sans">
              {["Residential Construction", "Commercial Construction", "Home Renovations", "Roofing & Waterproofing", "Tiling & Painting", "Custom Design"].map((s) => (
                <li key={s}>
                  <Link to="/services" className="hover:text-accent transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="text-lg font-poppins font-semibold text-accent">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-gray-300 font-open-sans">
                  5 Wooford Pl, Hayfields, Pietermaritzburg KZN, South Africa
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="tel:+27634127228" className="text-gray-300 hover:text-accent transition-colors font-open-sans">
                  +27 63 412 7228
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <a href="mailto:projects@lumtechsolutions.co.za" className="text-gray-300 hover:text-accent transition-colors font-open-sans break-all">
                  projects@lumtechsolutions.co.za
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-gray-300 font-open-sans">
                  Mon - Fri: 8:00 AM - 5:00 PM
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 font-open-sans text-sm">
            © {currentYear} Lum Tech Building Solutions. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-accent font-poppins font-semibold text-sm">NHBRC Registered</span>
            <span className="text-gray-300 text-sm">•</span>
            <span className="text-gray-300 font-open-sans text-sm">Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;