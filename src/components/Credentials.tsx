import { ShieldCheck, BadgeCheck } from "lucide-react";
import cidbLogoWebp from "@/assets/cidb-logo.webp";
import cidbLogoPng from "@/assets/cidb-logo.png";
import nhbrcLogoWebp from "@/assets/nhbrc-logo.webp";
import nhbrcLogoPng from "@/assets/nhbrc-logo.png";

const Credentials = () => {
  const badges = [
    {
      type: "logo" as const,
      webp: nhbrcLogoWebp,
      png: nhbrcLogoPng,
      alt: "NHBRC Registered",
      label: "NHBRC Registered",
    },
    {
      type: "logo" as const,
      webp: cidbLogoWebp,
      png: cidbLogoPng,
      alt: "CIDB Registered",
      label: "CIDB Registered",
    },
    {
      type: "icon" as const,
      icon: <ShieldCheck className="h-8 w-8 text-accent" />,
      label: "100% Black-Owned South African Business",
    },
    {
      type: "icon" as const,
      icon: <BadgeCheck className="h-8 w-8 text-accent" />,
      label: "Level 1 B-BBEE Contributor",
    },
  ];

  return (
    <section className="py-12 bg-construction-light border-y border-black/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-primary">
            Trusted. Registered. Committed to Excellence.
          </h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 max-w-4xl mx-auto">
          {badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              {badge.type === "logo" ? (
                <picture>
                  <source srcSet={badge.webp} type="image/webp" />
                  <img
                    src={badge.png}
                    alt={badge.alt}
                    width={100}
                    height={50}
                    loading="lazy"
                    className="h-10 w-auto rounded"
                  />
                </picture>
              ) : (
                badge.icon
              )}
              <span className="font-poppins font-semibold text-primary text-sm md:text-base">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Credentials;
