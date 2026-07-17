import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  path: string; // e.g. "/about" or "/blog/my-post-slug"
  image?: string;
  noIndex?: boolean;
}

const SITE_URL = "https://building.lumtechsolutions.co.za";
const DEFAULT_IMAGE = "/lumtech-og-image.png";

const SEO = ({ title, description, path, image = DEFAULT_IMAGE, noIndex = false }: SEOProps) => {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title.includes("Lum Tech") ? title : `${title} | Lum Tech Building Solutions`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image.startsWith("http") ? image : `${SITE_URL}${image}`} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image.startsWith("http") ? image : `${SITE_URL}${image}`} />
    </Helmet>
  );
};

export default SEO;
