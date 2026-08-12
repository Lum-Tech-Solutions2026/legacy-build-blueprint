import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle, Award, Users, Clock, Target, Heart, Eye, HardHat, ShieldCheck } from "lucide-react";
import SEO from "@/components/SEO";

const About = () => {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-accent" />,
      title: "Quality Workmanship",
      description: "We never compromise on quality. Every project is executed with precision and attention to detail."
    },
    {
      icon: <Heart className="h-8 w-8 text-accent" />,
      title: "Honest Communication", 
      description: "Transparent, clear communication throughout every phase of your project."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Customer Satisfaction Above All",
      description: "Your satisfaction is our top priority. We're not done until you're completely happy."
    }
  ];

  return (
    <div className="min-h-screen">
      <SEO
        title="About Us"
        description="Learn about Lum Tech Building Solutions - over 10 years delivering quality residential and commercial construction in Pietermaritzburg, KZN."
        path="/about"
      />
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
                About Lum Tech Building Solutions
              </h1>
              <div className="w-24 h-1 bg-construction-blue mx-auto mb-8"></div>
              <p className="text-xl font-open-sans text-gray-200 leading-relaxed">
                Building dreams, creating legacies, and serving the KwaZulu-Natal community 
                with exceptional construction services for over a decade.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary">
                    Our Story
                  </h2>
                  <p className="font-open-sans text-gray-600 leading-relaxed text-lg">
                    Lum Tech Building Solutions was founded with one mission: to deliver exceptional quality in every brick we lay. 
                    With over a decade in the construction industry, we have built a strong reputation for professionalism, 
                    reliability, and attention to detail.
                  </p>
                  <p className="font-open-sans text-gray-600 leading-relaxed">
                    Starting as a small local contractor, we've grown to become one of KwaZulu-Natal's most trusted 
                    construction companies. Our journey has been built on the foundation of satisfied clients, quality 
                    workmanship, and unwavering commitment to excellence.
                  </p>
                  <p className="font-open-sans text-gray-600 leading-relaxed">
                    Today, we continue to uphold the values that established us, while embracing modern construction 
                    techniques and technologies to deliver the best possible results for our clients.
                  </p>
                </div>

                <div className="space-y-8">
                  <div className="bg-construction-light p-6 rounded-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <Clock className="h-12 w-12 text-accent" />
                      <div>
                        <h3 className="text-xl font-poppins font-bold text-primary">10+ Years</h3>
                        <p className="font-open-sans text-gray-600">of Excellence</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-construction-light p-6 rounded-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <Award className="h-12 w-12 text-accent" />
                      <div>
                        <h3 className="text-xl font-poppins font-bold text-primary">NHBRC</h3>
                        <p className="font-open-sans text-gray-600">Registered & Certified</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-construction-light p-6 rounded-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <Users className="h-12 w-12 text-accent" />
                      <div>
                        <h3 className="text-xl font-poppins font-bold text-primary">100+</h3>
                        <p className="font-open-sans text-gray-600">Satisfied Clients</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary mb-6">
                  Our Vision &amp; Mission
                </h2>
                <div className="w-24 h-1 bg-construction-blue mx-auto" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-construction-light p-10 rounded-lg border-t-4 border-accent">
                  <Eye className="h-12 w-12 text-accent mb-6" />
                  <h3 className="text-2xl font-poppins font-bold text-primary mb-4">Our Vision</h3>
                  <p className="font-open-sans text-gray-600 leading-relaxed text-lg">
                    To be KwaZulu-Natal's most trusted construction partner — recognised for
                    setting the standard in quality, innovation, and integrity, while shaping
                    communities through buildings that stand the test of time.
                  </p>
                </div>
                <div className="bg-primary p-10 rounded-lg border-t-4 border-accent text-white">
                  <Target className="h-12 w-12 text-accent mb-6" />
                  <h3 className="text-2xl font-poppins font-bold mb-4">Our Mission</h3>
                  <p className="font-open-sans text-gray-200 leading-relaxed text-lg">
                    To deliver exceptional construction services through skilled craftsmanship,
                    transparent communication, and unwavering commitment to safety and quality —
                    turning every client's vision into a lasting legacy, on time and within budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* Our Values */}
        <section className="py-20 bg-construction-light">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary mb-6">
                  Our Values
                </h2>
                <div className="w-24 h-1 bg-construction-blue mx-auto mb-8"></div>
                <p className="text-lg font-open-sans text-gray-600 max-w-3xl mx-auto">
                  These core values guide everything we do and every decision we make.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-white p-8 rounded-lg shadow-lg text-center hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-center mb-6">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-poppins font-bold text-primary mb-4">
                      {value.title}
                    </h3>
                    <p className="font-open-sans text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Safety Commitment */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <HardHat className="h-16 w-16 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-poppins font-bold text-primary mb-6">
                Our Safety Commitment
              </h2>
              <div className="w-24 h-1 bg-construction-blue mx-auto mb-8"></div>
              <p className="text-lg font-open-sans text-gray-600 leading-relaxed mb-10">
                Safety is a non-negotiable part of how we work. Every site is managed with strict
                adherence to South African occupational health and safety requirements, protecting
                our team, our clients, and the public throughout every project.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto text-left">
                {[
                  "Compliance with the Occupational Health and Safety Act (OHSA)",
                  "Site-specific safety plans and risk assessments",
                  "Personal protective equipment (PPE) enforced on all sites",
                  "Regular safety inspections throughout each project",
                  "Trained and safety-briefed site personnel",
                  "Secure, hazard-managed sites to protect the public and property",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                    <span className="font-open-sans text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NHBRC Registration */}
        <section className="py-20 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Award className="h-20 w-20 text-accent mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
                NHBRC Registered
              </h2>
              <p className="text-xl font-open-sans text-gray-200 leading-relaxed mb-8">
                We are proud members of the National Home Builders Registration Council, ensuring your project 
                meets all required safety and quality standards. This registration provides you with peace of mind 
                and protection for your investment.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                <div className="space-y-4">
                  <h3 className="text-xl font-poppins font-semibold text-accent">What NHBRC Registration Means:</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-open-sans text-gray-200">Compliance with building standards</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-open-sans text-gray-200">Warranty protection for your home</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-open-sans text-gray-200">Dispute resolution services</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-poppins font-semibold text-accent">Your Benefits:</h3>
                  <div className="space-y-3 text-left">
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-open-sans text-gray-200">Professional accountability</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-open-sans text-gray-200">Quality assurance guarantee</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="font-open-sans text-gray-200">Peace of mind investment</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 pt-12 border-t border-white/20">
                <h3 className="text-2xl font-poppins font-bold mb-6">Warranty Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-white/10 rounded-lg p-5">
                    <p className="font-poppins font-bold text-accent text-2xl mb-1">3 Months</p>
                    <p className="font-open-sans text-gray-200 text-sm">
                      Defects liability period for any deviation from the agreed plans, specifications,
                      workmanship, or materials on new NHBRC-enrolled homes.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-5">
                    <p className="font-poppins font-bold text-accent text-2xl mb-1">1 Year</p>
                    <p className="font-open-sans text-gray-200 text-sm">
                      Roof leak cover from the date of occupation on new NHBRC-enrolled homes.
                    </p>
                  </div>
                  <div className="bg-white/10 rounded-lg p-5">
                    <p className="font-poppins font-bold text-accent text-2xl mb-1">5 Years</p>
                    <p className="font-open-sans text-gray-200 text-sm">
                      Cover against major structural defects from the date of occupation on new
                      NHBRC-enrolled homes.
                    </p>
                  </div>
                </div>
                <p className="font-open-sans text-gray-300 text-sm mt-6 max-w-3xl">
                  These statutory warranty periods apply to new homes enrolled with the NHBRC in
                  terms of the Housing Consumers Protection Measures Act. For renovations,
                  extensions, commercial work, and maintenance projects, the specific workmanship
                  warranty terms are set out in your project agreement — just ask us and we'll
                  confirm what applies to your project.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;