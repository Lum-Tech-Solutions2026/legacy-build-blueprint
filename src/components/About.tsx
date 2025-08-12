import { CheckCircle, Award, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  const features = [
    {
      icon: <Clock className="h-8 w-8 text-accent" />,
      title: "Over 10 Years of Experience",
      description: "A decade of successful projects and satisfied clients across KwaZulu-Natal."
    },
    {
      icon: <Award className="h-8 w-8 text-accent" />,
      title: "NHBRC Registered",
      description: "Peace of Mind Guaranteed with full registration and compliance."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Professional & Reliable Service",
      description: "Committed to delivering exceptional quality on every project."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-primary mb-6">
              Welcome to Legacy Home Builders SA
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-lg font-open-sans text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We are a trusted construction company based in Pietermaritzburg, KwaZulu-Natal, with more than 10 years 
              of experience in delivering exceptional building services. As an NHBRC registered builder, we guarantee 
              every project is built to the highest standards of safety, quality, and durability.
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-poppins font-semibold text-primary mb-4">
                  Our Commitment to Excellence
                </h3>
                <p className="font-open-sans text-gray-600 leading-relaxed">
                  Our skilled team is committed to turning your dream property into reality. We understand that building 
                  or renovating a home is one of life's biggest investments, which is why we approach every project with 
                  meticulous attention to detail and unwavering dedication to quality.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="text-xl font-poppins font-semibold text-primary mb-4">Why Choose Us?</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="font-open-sans text-gray-600">Expert craftsmanship with attention to detail</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="font-open-sans text-gray-600">Transparent communication throughout the project</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="font-open-sans text-gray-600">Competitive pricing with no hidden costs</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-6 w-6 text-accent mt-0.5 flex-shrink-0" />
                    <span className="font-open-sans text-gray-600">On-time project completion</span>
                  </div>
                </div>
              </div>

              <Button className="bg-accent hover:bg-accent/90 text-white font-poppins font-semibold px-8 py-3">
                Learn More About Us
              </Button>
            </div>

            {/* Right Content - Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="bg-construction-light p-6 rounded-lg border-l-4 border-accent hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h5 className="text-lg font-poppins font-semibold text-primary mb-2">
                        {feature.title}
                      </h5>
                      <p className="font-open-sans text-gray-600">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* NHBRC Registration Highlight */}
          <div className="bg-primary text-white p-8 rounded-lg text-center">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
              <Award className="h-12 w-12 text-accent" />
              <div>
                <h4 className="text-xl font-poppins font-bold mb-2">NHBRC Registered Builder</h4>
                <p className="font-open-sans text-gray-200">
                  We are proud members of the National Home Builders Registration Council, 
                  ensuring your project meets all required safety and quality standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;