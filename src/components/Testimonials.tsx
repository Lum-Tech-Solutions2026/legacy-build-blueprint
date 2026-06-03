import { Star, Quote } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Mr. Dlamini",
      location: "Pietermaritzburg",
      text: "Lum Tech Construction did an incredible job on our new home. Professional from start to finish! The quality of workmanship exceeded our expectations and they completed the project on time.",
      rating: 5,
      project: "New Home Construction"
    },
    {
      name: "Mrs. Naidoo", 
      location: "Durban",
      text: "The team's attention to detail is unmatched. Highly recommend them! They transformed our old house into a modern family home while respecting our budget and timeline.",
      rating: 5,
      project: "Home Renovation"
    },
    {
      name: "Mr. Smith",
      location: "Pietermaritzburg", 
      text: "Outstanding service and quality construction. Our commercial building project was completed to the highest standards. The team was professional, communicative, and delivered exactly what we envisioned.",
      rating: 5,
      project: "Commercial Construction"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-primary mb-6">
              Client Testimonials
            </h2>
            <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
            <p className="text-lg font-open-sans text-gray-600 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our satisfied clients have to say about our work.
            </p>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-construction-light p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4">
                  <Quote className="h-8 w-8 text-accent/30" />
                </div>

                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, starIndex) => (
                    <Star key={starIndex} className="h-5 w-5 text-accent fill-current" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="font-open-sans text-gray-600 leading-relaxed mb-6 italic">
                  "{testimonial.text}"
                </blockquote>

                {/* Project Type */}
                <div className="mb-4">
                  <span className="inline-block bg-accent text-white text-xs font-poppins font-semibold px-3 py-1 rounded-full">
                    {testimonial.project}
                  </span>
                </div>

                {/* Client Info */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-poppins font-semibold text-primary">
                        {testimonial.name}
                      </h4>
                      <p className="font-open-sans text-sm text-gray-500">
                        {testimonial.location}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                      <span className="text-white font-poppins font-bold text-lg">
                        {testimonial.name.split(' ')[0].charAt(0)}{testimonial.name.split(' ')[1]?.charAt(0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 bg-primary text-white p-8 rounded-lg">
            <div className="text-center">
              <h3 className="text-2xl font-poppins font-bold mb-4">
                Join Our Satisfied Clients
              </h3>
              <p className="font-open-sans text-gray-200 mb-6 max-w-2xl mx-auto">
                Experience the Lum Tech Construction difference. Quality workmanship, professional service, 
                and customer satisfaction guaranteed on every project.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
                <div className="text-center">
                  <div className="text-3xl font-poppins font-bold text-accent">10+</div>
                  <div className="font-open-sans text-sm">Years Experience</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-poppins font-bold text-accent">100+</div>
                  <div className="font-open-sans text-sm">Projects Completed</div>
                </div>
                <div className="hidden md:block w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-3xl font-poppins font-bold text-accent">100%</div>
                  <div className="font-open-sans text-sm">Client Satisfaction</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;