import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Hammer,
  Palette,
  Home as HomeIcon,
  Droplets,
  Wrench,
  Zap,
  Grid3x3,
  Ruler,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
  ArrowRight,
} from "lucide-react";

const Maintenance = () => {
  const services = [
    {
      icon: <Hammer className="h-10 w-10 text-accent" />,
      title: "General Building Repairs",
      description:
        "We carry out repairs to walls, ceilings, doors, windows, concrete surfaces, and other structural elements to keep your property safe and well maintained.",
    },
    {
      icon: <Palette className="h-10 w-10 text-accent" />,
      title: "Painting & Decorating",
      description:
        "Refresh and protect your property with professional interior and exterior painting, surface preparation, crack repairs, and protective coatings.",
    },
    {
      icon: <HomeIcon className="h-10 w-10 text-accent" />,
      title: "Roofing Maintenance",
      description:
        "Our roofing services include roof inspections, leak detection, roof repairs, waterproofing, flashing repairs, and gutter cleaning.",
    },
    {
      icon: <Droplets className="h-10 w-10 text-accent" />,
      title: "Waterproofing",
      description:
        "Prevent water damage with roof waterproofing, damp-proofing, balcony waterproofing, foundation sealing, and crack treatment.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-accent" />,
      title: "Plumbing Maintenance",
      description:
        "We repair leaking pipes, replace fittings, clear blocked drains, service geysers, and maintain bathrooms and kitchens.",
    },
    {
      icon: <Zap className="h-10 w-10 text-accent" />,
      title: "Electrical Maintenance",
      description:
        "Our electrical maintenance includes lighting repairs, socket replacements, DB board inspections, fault finding, and general electrical repairs.",
    },
    {
      icon: <Grid3x3 className="h-10 w-10 text-accent" />,
      title: "Tiling & Flooring",
      description:
        "We install and repair floor and wall tiles, replace damaged tiles, re-grout surfaces, and repair various flooring systems.",
    },
    {
      icon: <Ruler className="h-10 w-10 text-accent" />,
      title: "Carpentry & Joinery",
      description:
        "We repair and install doors, cupboards, shelving, skirting, wooden fittings, and custom timber work.",
    },
    {
      icon: <Building2 className="h-10 w-10 text-accent" />,
      title: "Renovations & Refurbishments",
      description:
        "From small upgrades to complete property refurbishments, we restore and improve residential and commercial spaces with minimal disruption.",
    },
  ];

  const preventativeBenefits = [
    "Extend the life of your property",
    "Reduce unexpected repair costs",
    "Improve safety",
    "Maintain property value",
    "Prevent major structural damage",
    "Keep your building looking professional",
  ];

  const whoWeServe = [
    "Residential Homes",
    "Apartment Complexes",
    "Office Buildings",
    "Commercial Properties",
    "Retail Stores",
    "Schools",
    "Churches",
    "Industrial Facilities",
    "Government Buildings",
  ];

  const whyChooseUs = [
    "Experienced and skilled maintenance team",
    "High-quality workmanship",
    "Fast response times",
    "Affordable and transparent pricing",
    "Reliable project management",
    "Residential and commercial expertise",
    "Safety-focused work practices",
    "Customer satisfaction commitment",
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="Building Maintenance Services"
        description="Professional building maintenance in Pietermaritzburg, KZN - repairs, painting, roofing, waterproofing, plumbing, electrical, tiling, carpentry and renovations."
        path="/maintenance"
      />
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
              Building Maintenance Services
            </h1>
            <div className="w-24 h-1 bg-construction-blue mx-auto mb-8" />
            <p className="text-xl font-open-sans text-gray-200 leading-relaxed">
              Keep Your Property Safe, Functional &amp; Looking Its Best
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <p className="max-w-4xl mx-auto text-center font-open-sans text-gray-600 text-lg leading-relaxed">
              At Lum Tech Building Solutions, we provide professional building maintenance
              services that help protect your investment and keep your property in excellent
              condition. Whether you need routine maintenance, urgent repairs, or preventative
              inspections, our experienced team delivers reliable workmanship with quality you
              can trust.
            </p>
          </div>
        </section>

        {/* Our Maintenance Services */}
        <section className="py-20 bg-construction-light">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary mb-6">
                Our Maintenance Services
              </h2>
              <div className="w-24 h-1 bg-construction-blue mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="bg-white p-6 rounded-lg shadow-lg border-t-4 border-accent"
                >
                  <div className="mb-4">{service.icon}</div>
                  <h3 className="text-lg font-poppins font-bold text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="font-open-sans text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Preventative Maintenance */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-poppins font-bold text-primary mb-4">
                  Preventative Maintenance
                </h2>
                <p className="font-open-sans text-gray-600 leading-relaxed">
                  Regular maintenance helps you protect your property and avoid costly surprises
                  down the line.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {preventativeBenefits.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                    <span className="font-open-sans text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Who We Serve */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">Who We Serve</h2>
              <div className="w-24 h-1 bg-construction-blue mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {whoWeServe.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 bg-white/10 rounded-lg px-4 py-3"
                >
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-open-sans text-gray-100">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary mb-6">
                Why Choose Lum Tech Building Solutions?
              </h2>
              <div className="w-24 h-1 bg-construction-blue mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {whyChooseUs.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0" />
                  <span className="font-open-sans text-gray-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-accent">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-poppins font-bold text-accent-foreground mb-4">
              Request a Maintenance Service
            </h2>
            <p className="font-open-sans text-accent-foreground/90 mb-2 text-lg">
              Whether you require a once-off repair or ongoing building maintenance, our team is
              ready to assist.
            </p>
            <p className="font-open-sans text-accent-foreground/90 mb-8 text-lg">
              Contact us today for a free quotation and professional maintenance solutions
              tailored to your property.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="tel:+27634127228"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg transition-colors font-poppins font-semibold"
              >
                <Phone className="h-5 w-5" />
                Call or WhatsApp: +27 63 412 7228
              </a>
              <a
                href="mailto:projects@lumtechsolutions.co.za"
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-accent-foreground px-6 py-3 rounded-lg transition-colors font-poppins font-medium backdrop-blur-sm"
              >
                <Mail className="h-5 w-5" />
                projects@lumtechsolutions.co.za
              </a>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-poppins font-bold px-8 py-4 text-lg group"
            >
              <Link to="/contact?service=Building%20Maintenance">
                Request a Free Quotation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Closing statement */}
        <section className="py-14 bg-construction-light">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h3 className="text-2xl font-poppins font-bold text-primary mb-3">
              Your Trusted Partner in Building Maintenance
            </h3>
            <p className="font-open-sans text-gray-600">
              Protect your investment with dependable maintenance services from Lum Tech Building
              Solutions.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Maintenance;
