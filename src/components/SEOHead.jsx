import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, canonical, schema }) {
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
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:type" content="website" />
      {schema && (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      )}
    </Helmet>
  )
}

/** Build LocalBusiness schema for an examiner card */
export function buildExaminerSchema(examiner) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: examiner.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: examiner.address,
      addressLocality: examiner.city,
      addressRegion: 'OK',
      addressCountry: 'US',
    },
    telephone: examiner.phone,
    priceRange: examiner.price,
  }
}
