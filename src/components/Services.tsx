import { Home, Building2, Expand, Palette, Wrench, ClipboardList, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Services = () => {
  const services = [
    {
      slug: "residential-construction",
      icon: <Home className="h-10 w-10 text-accent" />,
      title: "New Home Construction",
    },
    {
      slug: "commercial-construction",
      icon: <Building2 className="h-10 w-10 text-accent" />,
      title: "Commercial Construction",
    },
    {
      slug: "home-renovations-extensions",
      icon: <Expand className="h-10 w-10 text-accent" />,
      title: "Building Extensions",
    },
    {
      slug: "roofing-waterproofing",
      icon: <Palette className="h-10 w-10 text-accent" />,
      title: "Painting & Waterproofing",
    },
    {
      slug: "tiling-painting",
      icon: <Wrench className="h-10 w-10 text-accent" />,
      title: "Maintenance & Repairs",
    },
    {
      slug: "project-management",
      icon: <ClipboardList className="h-10 w-10 text-accent" />,
      title: "Project Management",
    },
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
            <div className="w-24 h-1 bg-construction-blue mx-auto mb-8"></div>
            <p className="text-lg font-open-sans text-gray-600 max-w-3xl mx-auto">
              Beyond renovations, we offer a complete range of building solutions to meet all your
              construction needs.
            </p>
          </div>

          {/* Services Icon Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-14">
            {services.map((service) => (
              <Link
                key={service.slug}
                to={`/services#${service.slug}`}
                className="group bg-white p-6 md:p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-t-4 border-accent flex flex-col items-center text-center gap-3"
              >
                {service.icon}
                <h3 className="text-base md:text-lg font-poppins font-bold text-primary group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Button
              asChild
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground font-poppins font-semibold px-8 py-3"
            >
              <Link to="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
