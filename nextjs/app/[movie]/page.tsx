import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { StageWrapper } from '../../components/StageWrapper';
import { getMovieBySlug, MOVIE_ROUTES, SITE_NAME, SITE_URL } from '../../lib/movies';

export const dynamic = 'force-static';
export const dynamicParams = false;

interface MoviePageProps {
  params: Promise<{ movie: string }>;
}

export function generateStaticParams(): Array<{ movie: string }> {
  return MOVIE_ROUTES.map((entry) => ({
    movie: entry.slug,
  }));
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const { movie } = await params;
  const entry = getMovieBySlug(movie);

  if (!entry) {
    return {
      title: 'Stage Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const canonicalPath = `/${entry.slug}`;
  const canonicalUrl = `${SITE_URL}${canonicalPath}`;

  return {
    title: entry.title,
    description: entry.description,
    keywords: entry.keywords,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      type: 'website',
      locale: 'en_GB',
      url: canonicalUrl,
      siteName: SITE_NAME,
      title: `${entry.title} | ${SITE_NAME}`,
      description: entry.description,
      images: [
        {
          url: '/icon-512.png',
          width: 512,
          height: 512,
          alt: `${entry.title} on ${SITE_NAME}`,
        },
      ],
    },
    twitter: {
      card: 'summary',
      title: `${entry.title} | ${SITE_NAME}`,
      description: entry.description,
      images: ['/icon-512.png'],
    },
  };
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { movie } = await params;
  const entry = getMovieBySlug(movie);

  if (!entry) {
    notFound();
  }

  return (
    <section
      aria-label={`${entry.title} Flash Stage`}
      style={{
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
      }}
    >
      <StageWrapper
        movie={entry.movie}
        slug={entry.slug}
        loop={entry.loop}
        speed={entry.speed}
        showHomeButton={entry.showHomeButton}
      />
    </section>
  );
}
