import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, canonical, schema, noindex = false }) {
  const fullTitle = title
    ? `${title} | FindDOTPhysical.com`
    : 'Find DOT Physical Examiners in Oklahoma | FindDOTPhysical.com'

  const metaDesc =
    description ||
    'Find FMCSA-certified DOT physical examiners near you in Oklahoma. Same-day appointments available. CDL medical cards fast.'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonical || 'https://www.finddotphysical.com'} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical || 'https://www.finddotphysical.com'} />
      <meta name="twitter:card" content="summary" />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  )
}

/** Build LocalBusiness schema for an examiner card */
export function buildExaminerSchema(examiner) {
  const businessName = examiner.practice_name || examiner.name

  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: businessName,
    alternateName: examiner.practice_name ? examiner.name : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: examiner.address,
      addressLocality: examiner.city,
      addressRegion: 'OK',
      addressCountry: 'US',
    },
    telephone: examiner.phone,
    url: examiner.website,
    priceRange: examiner.price,
  }
}
