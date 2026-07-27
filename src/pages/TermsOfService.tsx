import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const TermsOfService = () => {
  const lastUpdated = "27 July 2026";

  return (
    <div className="min-h-screen">
      <SEO
        title="Terms of Service"
        description="Terms of service governing the use of the Lum Tech Building Solutions website and our construction, renovation, and maintenance services."
        path="/terms-of-service"
      />
      <Header />
      <main>
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">
              Terms of Service
            </h1>
            <div className="w-24 h-1 bg-construction-blue mx-auto mb-8" />
            <p className="text-xl font-open-sans text-gray-200">
              Please read these terms carefully before using our website or services
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose-content font-open-sans text-gray-700 leading-relaxed space-y-8">
              <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>

              <p>
                These Terms of Service ("Terms") govern your use of the Lum Tech Building
                Solutions website (the "Site") and your engagement of construction, renovation,
                and maintenance services from Lum Tech Building Solutions (Pty) Ltd ("Lum Tech
                Building Solutions", "we", "us", "our"). By using the Site or requesting a
                quotation, you agree to these Terms.
              </p>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  1. Use of This Website
                </h2>
                <p>
                  This Site is provided for the purpose of showcasing our services, portfolio, and
                  company information, and for allowing prospective clients to request quotations
                  and contact us. You agree not to use the Site for any unlawful purpose, to
                  attempt to gain unauthorised access to any part of the Site or its underlying
                  systems, or to submit false or misleading information through our forms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  2. Quotations &amp; Estimates
                </h2>
                <p>
                  Quotations provided through the Site, by email, WhatsApp, or in person are
                  estimates based on the information available at the time and are subject to
                  change following a full site inspection and confirmation of scope. Quotations
                  are valid for the period stated on the quotation document and do not constitute
                  a binding contract until formally accepted in writing by both parties.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  3. Project Work &amp; Scheduling
                </h2>
                <p>
                  Site inspection dates, project start dates, and completion timelines communicated
                  through our website, CRM notifications, or staff are indicative and may be
                  affected by factors outside our control, including weather, material availability,
                  municipal approvals, and third-party contractor availability. Specific project
                  terms, milestones, and payment schedules will be set out in a separate written
                  agreement for each project.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  4. Automated Communications
                </h2>
                <p>
                  By submitting an enquiry or quote request, you consent to receive service-related
                  communications from us via WhatsApp, SMS, and email, including enquiry
                  acknowledgments, site inspection confirmations, and quote follow-ups. See our{" "}
                  <a href="/privacy-policy" className="text-accent hover:underline">
                    Privacy Policy
                  </a>{" "}
                  for details on how we handle your personal information.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  5. Intellectual Property
                </h2>
                <p>
                  All content on this Site, including text, images, logos, portfolio photographs,
                  and design elements, is the property of Lum Tech Building Solutions or its
                  licensors and is protected by South African copyright and trademark law. You may
                  not reproduce, distribute, or use this content for commercial purposes without
                  our prior written consent.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  6. Testimonials &amp; Portfolio
                </h2>
                <p>
                  Testimonials submitted through our website are reviewed before publication and
                  may be edited for length or clarity while preserving their original meaning.
                  Portfolio photographs are shared with the consent of the relevant client where
                  required and may not depict the exact appearance of a completed project on any
                  specific site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  7. Limitation of Liability
                </h2>
                <p>
                  While we take care to ensure the information on this Site is accurate and
                  up to date, we make no warranties as to its completeness or accuracy, and it
                  should not be relied upon as a substitute for a formal quotation or site
                  assessment. To the extent permitted by law, Lum Tech Building Solutions will not
                  be liable for any indirect or consequential loss arising from use of this Site.
                  Nothing in these Terms limits any liability that cannot be excluded under South
                  African law, including in respect of the Consumer Protection Act 68 of 2008
                  where it applies to our services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  8. Third-Party Links
                </h2>
                <p>
                  This Site may contain links to third-party websites, including our social media
                  pages. We are not responsible for the content or privacy practices of any
                  third-party site.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  9. Governing Law
                </h2>
                <p>
                  These Terms are governed by the laws of the Republic of South Africa. Any
                  disputes arising from these Terms or your use of the Site will be subject to the
                  jurisdiction of the South African courts.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  10. Changes to These Terms
                </h2>
                <p>
                  We may update these Terms from time to time. Continued use of the Site after any
                  changes constitutes acceptance of the revised Terms. The "last updated" date at
                  the top of this page reflects when it was last revised.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  11. Contact Us
                </h2>
                <p>
                  If you have any questions about these Terms, please contact us:
                </p>
                <p className="mt-2">
                  Lum Tech Building Solutions (Pty) Ltd
                  <br />
                  5 Woodford Pl, Hayfields, Pietermaritzburg, 3201, South Africa
                  <br />
                  Email:{" "}
                  <a href="mailto:projects@lumtechsolutions.co.za" className="text-accent hover:underline">
                    projects@lumtechsolutions.co.za
                  </a>
                  <br />
                  Phone: +27 63 412 7228
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

export default TermsOfService;
