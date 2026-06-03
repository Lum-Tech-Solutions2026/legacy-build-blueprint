import { Home, Building, Hammer, Shield, Palette, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: <Home className="h-12 w-12 text-accent" />,
      title: "Residential Construction",
      description: "New homes built to your specifications with expert craftsmanship and attention to detail.",
      features: ["Custom home design", "Foundation to finish", "Quality materials", "Professional supervision"]
    },
    {
      icon: <Building className="h-12 w-12 text-accent" />,
      title: "Commercial Construction",
      description: "Offices, shops, and industrial spaces designed for functionality and durability.",
      features: ["Office buildings", "Retail spaces", "Industrial facilities", "Commercial renovations"]
    },
    {
      icon: <Hammer className="h-12 w-12 text-accent" />,
      title: "Home Renovations & Extensions",
      description: "Transform your existing property with our comprehensive renovation services.",
      features: ["Room additions", "Kitchen renovations", "Bathroom upgrades", "Structural modifications"]
    },
    {
      icon: <Shield className="h-12 w-12 text-accent" />,
      title: "Roofing & Waterproofing",
      description: "Long-lasting protection from the elements with professional roofing solutions.",
      features: ["Roof installations", "Roof repairs", "Waterproofing", "Gutter systems"]
    },
    {
      icon: <Palette className="h-12 w-12 text-accent" />,
      title: "Tiling & Painting",
      description: "High-quality finishes for interiors and exteriors that enhance your property's appeal.",
      features: ["Interior painting", "Exterior painting", "Tile installation", "Decorative finishes"]
    },
    {
      icon: <Ruler className="h-12 w-12 text-accent" />,
      title: "Custom Interior & Exterior Design",
      description: "Tailored design solutions that reflect your personal style and preferences.",
      features: ["Design consultation", "3D visualization", "Material selection", "Project coordination"]
    }
  ];

  return (
    <section className="py-20 bg-construction-light">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-primary mb-6">
              Our Services
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-lg font-open-sans text-gray-600 max-w-3xl mx-auto">
              We offer a complete range of building and renovation solutions to meet all your construction needs.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-accent"
              >
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-poppins font-bold text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="font-open-sans text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span className="font-open-sans text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button variant="outline" className="w-full border-accent text-accent hover:bg-accent hover:text-white font-poppins font-semibold">
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center bg-white p-12 rounded-lg shadow-lg">
            <h3 className="text-3xl font-poppins font-bold text-primary mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="font-open-sans text-gray-600 mb-8 max-w-2xl mx-auto">
              Get in touch with our expert team today for a free consultation and detailed quote. 
              We're here to turn your vision into reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold px-8 py-3">
                <Link to="/contact">Request Free Quote</Link>
              </Button>
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-poppins font-semibold px-8 py-3">
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;