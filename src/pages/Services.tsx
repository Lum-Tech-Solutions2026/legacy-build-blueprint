import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Home, Building, Hammer, Shield, Palette, Ruler, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      icon: <Home className="h-16 w-16 text-accent" />,
      title: "Residential Construction",
      description: "New homes built to your specifications with expert craftsmanship and attention to detail. From foundation to finish, we create the home of your dreams.",
      features: [
        "Custom home design and planning",
        "Foundation and structural work", 
        "Electrical and plumbing installation",
        "Roofing and exterior finishing",
        "Interior finishing and painting",
        "Landscaping and final touches"
      ],
      process: "We start with a detailed consultation to understand your vision, then provide comprehensive planning, obtain necessary permits, and execute the build with regular progress updates."
    },
    {
      icon: <Building className="h-16 w-16 text-accent" />,
      title: "Commercial Construction",
      description: "Offices, shops, and industrial spaces designed for functionality and durability. We understand the unique requirements of commercial projects.",
      features: [
        "Office buildings and complexes",
        "Retail stores and shopping centers",
        "Industrial and warehouse facilities", 
        "Restaurant and hospitality spaces",
        "Medical and educational facilities",
        "Commercial renovations and fit-outs"
      ],
      process: "Commercial projects require specialized expertise. We handle all aspects from planning and permits to completion, ensuring minimal disruption to your business operations."
    },
    {
      icon: <Hammer className="h-16 w-16 text-accent" />,
      title: "Home Renovations & Extensions",
      description: "Transform your existing property with our comprehensive renovation services. Breathe new life into your space while adding value to your home.",
      features: [
        "Room additions and extensions",
        "Kitchen and bathroom renovations",
        "Living space remodeling",
        "Structural modifications",
        "Garage conversions",
        "Outdoor living spaces"
      ],
      process: "Renovations require careful planning to minimize disruption. We work around your schedule, provide temporary solutions when needed, and ensure your home remains livable throughout the process."
    },
    {
      icon: <Shield className="h-16 w-16 text-accent" />,
      title: "Roofing & Waterproofing",
      description: "Long-lasting protection from the elements with professional roofing solutions. Quality materials and expert installation ensure years of reliable protection.",
      features: [
        "New roof installations",
        "Roof repairs and maintenance",
        "Waterproofing systems",
        "Gutter installation and repair",
        "Insulation services",
        "Emergency roof repairs"
      ],
      process: "Roofing projects begin with a thorough inspection and assessment. We provide detailed quotes, use only quality materials, and ensure proper installation for maximum longevity."
    },
    {
      icon: <Palette className="h-16 w-16 text-accent" />,
      title: "Tiling & Painting",
      description: "High-quality finishes for interiors and exteriors that enhance your property's appeal. Professional application ensures lasting beauty and durability.",
      features: [
        "Interior and exterior painting",
        "Ceramic and porcelain tile installation",
        "Natural stone work",
        "Decorative finishes and textures",
        "Floor preparation and leveling",
        "Protective coatings and sealers"
      ],
      process: "Finishing work requires precision and attention to detail. We prepare surfaces properly, use premium materials, and apply techniques that ensure professional, long-lasting results."
    },
    {
      icon: <Ruler className="h-16 w-16 text-accent" />,
      title: "Custom Interior & Exterior Design",
      description: "Tailored design solutions that reflect your personal style and preferences. From concept to completion, we bring your vision to life.",
      features: [
        "Design consultation and planning",
        "3D visualization and renderings",
        "Material and color selection",
        "Space planning and optimization",
        "Custom millwork and cabinetry",
        "Project coordination and management"
      ],
      process: "Design projects start with understanding your lifestyle and preferences. We create detailed plans, provide visualizations, and coordinate all trades to ensure seamless execution."
    }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
                Our Services
              </h1>
              <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
              <p className="text-xl font-open-sans text-gray-200 leading-relaxed">
                Comprehensive construction and renovation solutions tailored to your needs. 
                Quality workmanship and professional service on every project.
              </p>
            </div>
          </div>
        </section>

        {/* Services Detail */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto space-y-20">
              {services.map((service, index) => (
                <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center space-x-4">
                      {service.icon}
                      <h2 className="text-3xl font-poppins font-bold text-primary">
                        {service.title}
                      </h2>
                    </div>
                    
                    <p className="font-open-sans text-gray-600 leading-relaxed text-lg">
                      {service.description}
                    </p>

                    <div>
                      <h3 className="text-xl font-poppins font-semibold text-primary mb-4">What We Include:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start space-x-2">
                            <ArrowRight className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                            <span className="font-open-sans text-gray-600">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-construction-light p-6 rounded-lg">
                      <h4 className="font-poppins font-semibold text-primary mb-2">Our Process:</h4>
                      <p className="font-open-sans text-gray-600">{service.process}</p>
                    </div>

                    <Button className="bg-accent hover:bg-accent/90 text-white font-poppins font-semibold">
                      Get Quote for {service.title}
                    </Button>
                  </div>

                  {/* Image Placeholder */}
                  <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="bg-construction-light rounded-lg p-12 text-center">
                      <div className="flex justify-center mb-4">
                        {service.icon}
                      </div>
                      <h3 className="text-xl font-poppins font-bold text-primary mb-2">
                        {service.title}
                      </h3>
                      <p className="font-open-sans text-gray-600">
                        Professional {service.title.toLowerCase()} services
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl font-open-sans text-gray-200 mb-8 leading-relaxed">
                Get in touch with our expert team today for a free consultation and detailed quote. 
                We're here to turn your vision into reality with professional service and quality workmanship.
              </p>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <Button className="bg-accent hover:bg-accent/90 text-white font-poppins font-bold px-8 py-4 text-lg">
                  Request Free Consultation
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-poppins font-semibold px-8 py-4 text-lg">
                  View Our Gallery
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Services;