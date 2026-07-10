import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: formData.name,
        email: formData.email || null,
        phone: formData.phone || null,
        project_type: formData.subject || null,
        message: formData.message || null,
        source: "contact_page",
      });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    } catch (err: any) {
      toast({ title: "Something went wrong", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
                Contact Us
              </h1>
              <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
              <p className="text-xl font-open-sans text-gray-200 leading-relaxed">
                Ready to start your construction project? Get in touch with our expert team today. 
                We're here to help bring your vision to life.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-poppins font-bold text-primary mb-4">
                      Send Us a Message
                    </h2>
                    <p className="font-open-sans text-gray-600">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="text-center py-10 bg-construction-light rounded-lg">
                      <CheckCircle2 className="h-14 w-14 text-accent mx-auto mb-4" />
                      <h3 className="font-poppins font-bold text-xl text-primary mb-2">
                        Thank you, {formData.name.split(" ")[0]}!
                      </h3>
                      <p className="font-open-sans text-gray-600 max-w-sm mx-auto">
                        Your message has been received. Our team will get back to you within 24 hours.
                      </p>
                    </div>
                  ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-poppins font-medium">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="font-open-sans"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-poppins font-medium">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="font-open-sans"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="font-poppins font-medium">Phone Number</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="font-open-sans"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="font-poppins font-medium">Project Type</Label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="e.g., New Home Construction"
                          className="font-open-sans"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-poppins font-medium">Project Details</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={5}
                        placeholder="Tell us about your project requirements, timeline, and any specific needs..."
                        required
                        className="font-open-sans"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full bg-gradient-accent hover:opacity-90 text-white font-poppins font-semibold py-3 shadow-gold-glow"
                    >
                      {submitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Send className="mr-2 h-5 w-5" />}
                      {submitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                  )}
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-poppins font-bold text-primary mb-4">
                      Get In Touch
                    </h2>
                    <p className="font-open-sans text-gray-600">
                      Reach out to us through any of the following methods. We're always ready to help with your construction needs.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start space-x-4 p-6 bg-construction-light rounded-lg">
                      <MapPin className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-poppins font-semibold text-primary mb-2">Our Location</h3>
                        <p className="font-open-sans text-gray-600">
                          5 Wooford Pl, Hayfields<br />
                          Pietermaritzburg KZN<br />
                          South Africa
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start space-x-4 p-6 bg-construction-light rounded-lg">
                      <Phone className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-poppins font-semibold text-primary mb-2">Call Us</h3>
                        <a 
                          href="tel:+27634127228" 
                          className="font-open-sans text-gray-600 hover:text-accent transition-colors text-lg"
                        >
                          +27 63 412 7228
                        </a>
                        <p className="font-open-sans text-sm text-gray-500 mt-1">
                          Click to call directly
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start space-x-4 p-6 bg-construction-light rounded-lg">
                      <Mail className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-poppins font-semibold text-primary mb-2">Email Us</h3>
                        <a
                          href="mailto:projects@lumtechsolutions.co.za"
                          className="font-open-sans text-gray-600 hover:text-accent transition-colors break-all"
                        >
                          projects@lumtechsolutions.co.za
                        </a>
                        <p className="font-open-sans text-sm text-gray-500 mt-1">
                          Click to send email
                        </p>
                      </div>
                    </div>

                    {/* Hours */}
                    <div className="flex items-start space-x-4 p-6 bg-construction-light rounded-lg">
                      <Clock className="h-8 w-8 text-accent mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="font-poppins font-semibold text-primary mb-2">Business Hours</h3>
                        <div className="font-open-sans text-gray-600 space-y-1">
                          <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
                          <p>Saturday: 8:00 AM - 2:00 PM</p>
                          <p>Sunday: Emergency calls only</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <h3 className="font-poppins font-semibold text-primary">Quick Actions</h3>
                    <div className="space-y-3">
                      <a 
                        href="tel:+27634127228"
                        className="flex items-center justify-center space-x-2 w-full bg-accent hover:bg-accent/90 text-white py-3 rounded-lg transition-colors"
                      >
                        <Phone className="h-5 w-5" />
                        <span className="font-poppins font-semibold">Call Now</span>
                      </a>
                      <a
                        href="mailto:projects@lumtechsolutions.co.za"
                        className="flex items-center justify-center space-x-2 w-full border-2 border-accent text-accent hover:bg-accent hover:text-white py-3 rounded-lg transition-colors"
                      >
                        <Mail className="h-5 w-5" />
                        <span className="font-poppins font-semibold">Send Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-construction-light">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-poppins font-bold text-primary mb-6">
                Find Us
              </h2>
              <p className="font-open-sans text-gray-600 mb-8">
                Located in the heart of Pietermaritzburg, we serve clients throughout KwaZulu-Natal.
              </p>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-16 w-16 text-accent mx-auto mb-4" />
                    <h3 className="font-poppins font-semibold text-primary mb-2">Interactive Map</h3>
                    <p className="font-open-sans text-gray-600">
                      5 Wooford Pl, Hayfields, Pietermaritzburg KZN
                    </p>
                    <p className="font-open-sans text-sm text-gray-500 mt-2">
                      Google Maps integration would be placed here
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;