import type { Metadata } from 'next';
import Link from 'next/link';
import { StageWrapper } from '../components/StageWrapper';
import { MOVIE_ROUTES, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '../lib/movies';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: {
    absolute: `${SITE_NAME} for Next.js`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: `${SITE_NAME} for Next.js`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    title: `${SITE_NAME} for Next.js`,
    description: SITE_DESCRIPTION,
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: 'en-GB',
};

export default function HomePage() {
  return (
    <section
      aria-label="Flash Stage"
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <nav aria-label="Modern Flash Routes" className="sr-only">
        <ul>
          {MOVIE_ROUTES.map((route) => (
            <li key={route.slug}>
              <Link href={`/${route.slug}`}>{route.title}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <StageWrapper movie="FlashStory" loop={false} speed={1} showHomeButton={false} />
    </section>
  );
}
