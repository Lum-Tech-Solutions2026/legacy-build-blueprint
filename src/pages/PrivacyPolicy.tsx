import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const PrivacyPolicy = () => {
  const lastUpdated = "27 July 2026";

  return (
    <div className="min-h-screen">
      <SEO
        title="Privacy Policy"
        description="Lum Tech Building Solutions' privacy policy, describing how we collect, use, and protect your personal information in accordance with POPIA."
        path="/privacy-policy"
      />
      <Header />
      <main>
        <section className="bg-primary text-white py-20">
          <div className="container mx-auto px-4 text-center max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Privacy Policy</h1>
            <div className="w-24 h-1 bg-construction-blue mx-auto mb-8" />
            <p className="text-xl font-open-sans text-gray-200">
              How we collect, use, and protect your personal information
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose-content font-open-sans text-gray-700 leading-relaxed space-y-8">
              <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>

              <p>
                Lum Tech Building Solutions (Pty) Ltd ("Lum Tech Building Solutions", "we", "us",
                "our") is committed to protecting your personal information in accordance with the
                Protection of Personal Information Act 4 of 2013 ("POPIA"). This policy explains
                what personal information we collect, why we collect it, how we use it, and the
                rights you have over it.
              </p>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  1. Who We Are
                </h2>
                <p>
                  Lum Tech Building Solutions is a construction company based in Pietermaritzburg,
                  KwaZulu-Natal, South Africa. For the purposes of POPIA, Lum Tech Building
                  Solutions is the "responsible party" for the personal information described in
                  this policy.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  2. Information We Collect
                </h2>
                <p>We collect personal information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Name, phone number, and email address submitted via our contact form, quote request forms, or WhatsApp;</li>
                  <li>Details about your property and project (address, project type, description of works requested);</li>
                  <li>Communication history, including messages, calls, and site inspection notes;</li>
                  <li>Client and billing information for quotes, invoices, and payments (for existing clients);</li>
                  <li>Testimonials and reviews you choose to submit for publication on our site;</li>
                  <li>Basic technical information collected automatically by our website (such as pages visited), used only for site functionality and analytics.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  3. Why We Collect It
                </h2>
                <p>We process your personal information to:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Respond to enquiries and provide quotations for construction, renovation, and maintenance services;</li>
                  <li>Schedule site inspections and coordinate project work;</li>
                  <li>Send you service-related communications, such as quote confirmations, appointment reminders, and invoice follow-ups, via WhatsApp, SMS, or email;</li>
                  <li>Maintain client and project records for the duration of a business relationship;</li>
                  <li>Comply with legal, tax, and regulatory obligations; and</li>
                  <li>Improve our services and website.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  4. Automated Communications
                </h2>
                <p>
                  When you submit an enquiry through our website, our systems may automatically
                  send you an acknowledgment via WhatsApp or SMS, and may automatically follow up
                  by email regarding an outstanding quotation. These messages relate solely to the
                  enquiry or project you have engaged us for. You can opt out of further automated
                  messages at any time by replying "STOP" or by contacting us directly using the
                  details in section 8 below.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  5. Sharing Your Information
                </h2>
                <p>
                  We do not sell your personal information. We may share limited personal
                  information with trusted third-party service providers who help us operate our
                  business, strictly for the purposes described in this policy, including:
                </p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Our website hosting and database provider, for secure storage of enquiry, client, and project records;</li>
                  <li>Our messaging provider, to deliver WhatsApp/SMS acknowledgments and alerts;</li>
                  <li>Our email delivery provider, to send quote and invoice-related email communications.</li>
                </ul>
                <p className="mt-2">
                  Some of these service providers may process data on servers located outside
                  South Africa. Where this occurs, we take reasonable steps to ensure your
                  information receives a level of protection consistent with POPIA.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  6. Data Retention
                </h2>
                <p>
                  We retain personal information only for as long as necessary to fulfil the
                  purposes described in this policy, or as required by law (for example, financial
                  records retained for tax purposes). Enquiry information from leads that do not
                  proceed to a project may be retained for a reasonable period for follow-up
                  purposes, after which it is deleted or anonymised.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  7. Your Rights Under POPIA
                </h2>
                <p>You have the right to:</p>
                <ul className="list-disc pl-6 space-y-1 mt-2">
                  <li>Request access to the personal information we hold about you;</li>
                  <li>Request that we correct or update inaccurate or incomplete information;</li>
                  <li>Request the deletion or destruction of personal information we are not legally required to retain;</li>
                  <li>Object to the processing of your personal information for direct marketing purposes;</li>
                  <li>Withdraw consent to processing where consent is the basis for that processing; and</li>
                  <li>Lodge a complaint with the Information Regulator of South Africa if you believe your rights under POPIA have been infringed.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  8. Security
                </h2>
                <p>
                  We implement reasonable technical and organisational measures to protect your
                  personal information against loss, unauthorised access, alteration, or
                  disclosure, including access controls and secure storage of client and project
                  data.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  9. Cookies
                </h2>
                <p>
                  Our website may use basic cookies or similar technologies to support core
                  functionality and understand how visitors use our site. You can control cookies
                  through your browser settings.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  10. Changes to This Policy
                </h2>
                <p>
                  We may update this policy from time to time to reflect changes in our practices
                  or legal requirements. The "last updated" date at the top of this page indicates
                  when it was last revised.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-poppins font-bold text-primary mb-3">
                  11. Contact Us / Information Officer
                </h2>
                <p>
                  If you have questions about this policy, or wish to exercise any of your rights
                  under POPIA, please contact our Information Officer:
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
                <p className="mt-4">
                  You may also contact the Information Regulator of South Africa at{" "}
                  <a
                    href="https://inforegulator.org.za"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    inforegulator.org.za
                  </a>
                  .
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

export default PrivacyPolicy;
