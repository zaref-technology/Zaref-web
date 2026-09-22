import Hero from './components/Hero';

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '3+',  label: 'Years Experience'   },
  { value: '99%', label: 'Client Satisfaction' },
  { value: '24h', label: 'Response Time'       },
];

const services = [
  {
    icon: '🎨',
    title: 'UI/UX Design',
    desc: 'Pixel-perfect interfaces with intuitive user experiences that delight and convert.',
  },
  {
    icon: '⚡',
    title: 'Web Development',
    desc: 'Blazing-fast, scalable web apps built with modern frameworks and best practices.',
  },
  {
    icon: '📱',
    title: 'Responsive Design',
    desc: 'Flawlessly adaptive layouts that look stunning on every device and screen size.',
  },
  {
    icon: '🚀',
    title: 'Performance',
    desc: 'Optimized code and assets delivering sub-second load times and smooth interactions.',
  },
  {
    icon: '🔒',
    title: 'Security',
    desc: 'Enterprise-grade security standards built into every layer of your application.',
  },
  {
    icon: '🛠️',
    title: 'Maintenance',
    desc: 'Ongoing support, updates, and iterative improvements to keep your site running smoothly.',
  },
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

      {/* Services */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div className="badge" style={{ margin: '0 auto 1rem' }}>What I Do</div>
            <h2 className="section-title">Services I Offer</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              End-to-end solutions tailored to your goals — from concept to launch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {services.map(s => (
              <div key={s.title} className="card">
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{s.icon}</div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--foreground)', marginBottom: '0.5rem' }}>{s.title}</h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--muted)', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '1rem', color: 'var(--foreground)' }}>
            Ready to build something{' '}
            <span style={{ color: 'var(--primary-light)' }}>amazing?</span>
          </h2>
          <p style={{ color: 'var(--muted)', marginBottom: '2rem', fontSize: '1.05rem' }}>
            Let's turn your idea into a stunning digital product.
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
