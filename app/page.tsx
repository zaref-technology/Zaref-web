import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import ProjectsSection from './components/ProjectsSection';
import TestimonialsSection from './components/TestimonialsSection';

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3+',  label: 'Years Experience'   },
  { value: '99%', label: 'Client Satisfaction' },
  { value: '24h', label: 'Response Time'       },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Stats Strip */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {stats.map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--muted)', marginTop: '0.4rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services — live from Firestore, 4 cards, horizontal scroll on mobile */}
      <ServicesSection />

      {/* Projects — live from Firestore, 4 cards, horizontal scroll on mobile */}
      <ProjectsSection />

      {/* Testimonials — live from Firestore, 4 cards, horizontal scroll on mobile */}
      <TestimonialsSection />

      {/* CTA Banner */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--foreground)' }}>
            Ready to build something{' '}
            <span style={{ color: 'var(--primary-light)' }}>amazing?</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Let&apos;s turn your idea into a stunning digital product.
          </p>
          <a href="/contact" className="btn-primary" style={{ display: 'inline-flex' }}>
            Start a Project
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
        </div>
      </section>
    </>
  );
}
