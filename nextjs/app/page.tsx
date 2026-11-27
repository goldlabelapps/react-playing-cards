import { StageWrapper } from '../components/StageWrapper';

export const revalidate = 60;

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
      <StageWrapper />
    </section>
  );
}
