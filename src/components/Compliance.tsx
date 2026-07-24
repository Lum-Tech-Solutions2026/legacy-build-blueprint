import { FileCheck2 } from "lucide-react";

const Compliance = () => {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <FileCheck2 className="h-12 w-12 text-accent mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
            Committed to Quality and Regulatory Compliance
          </h2>
          <div className="w-24 h-1 bg-accent mx-auto mb-8"></div>
          <p className="font-open-sans text-gray-200 leading-relaxed mb-6 text-lg">
            At Lum Tech Building Solutions, we believe that exceptional construction begins with
            proper planning, skilled workmanship and strict adherence to recognised industry
            standards. Every project is executed in accordance with the applicable requirements of
            the South African National Building Regulations (SANS 10400), relevant municipal
            by-laws, approved building plans where required, and recognised construction best
            practices.
          </p>
          <p className="font-open-sans text-gray-200 leading-relaxed text-lg">
            Our commitment to quality extends beyond meeting regulatory requirements — we strive to
            deliver durable, safe and functional spaces that provide lasting value for our clients.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Compliance;
