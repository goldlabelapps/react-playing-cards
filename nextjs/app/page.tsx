import { StageWrapper } from '../components/StageWrapper';

export const revalidate = 60;

export default function HomePage() {
  return (
    <section aria-label="Flash Stage">
      <StageWrapper />
    </section>
  );
}
