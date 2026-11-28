import Link from 'next/link';

export default function NotFound() {
  return (
    <section
      aria-label="Stage Not Found"
      style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '24px',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 700, letterSpacing: '-0.02em' }}>
        Stage Not Found
      </h1>
      <p style={{ margin: 0, fontSize: '15px', color: '#9ca3af', maxWidth: '360px' }}>
        The requested Flash movie route does not exist on this stage.
      </p>
      <nav aria-label="Recovery Navigation" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '10px 22px',
            borderRadius: '9999px',
            backgroundColor: '#ffffff',
            color: '#000000',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          Modern Flash Home
        </Link>
        <Link
          href="/menu"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '44px',
            padding: '10px 22px',
            borderRadius: '9999px',
            backgroundColor: '#15868F',
            color: '#ffffff',
            border: '2px solid #2A2A2A',
            boxShadow: '3px 3px 0px 0px #2A2A2A',
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '15px',
          }}
        >
          Game Menu
        </Link>
      </nav>
    </section>
  );
}
