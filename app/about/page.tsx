import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — Zaref',
  description: 'Learn more about Zaref — the person behind the pixels.',
};

const skills = [
  { name: 'React / Next.js', level: 95 },
  { name: 'TypeScript',      level: 90 },
  { name: 'UI/UX Design',    level: 85 },
  { name: 'Node.js',         level: 80 },
  { name: 'CSS / Animation', level: 92 },
  { name: 'Performance',     level: 88 },
];

const timeline = [
  { year: '2024', title: 'Senior Developer', company: 'Studio XYZ', desc: 'Leading front-end architecture for large-scale SaaS products.' },
  { year: '2022', title: 'Full-Stack Developer', company: 'Tech Agency', desc: 'Built end-to-end solutions for 20+ client projects.' },
  { year: '2020', title: 'Junior Developer', company: 'Startup Co.', desc: 'Started crafting interfaces and learned the ropes of modern web dev.' },
];

export default function About() {
  return (
    <div style={{ paddingTop: '70px' }}>
      {/* Header */}
      <section
        style={{
          position: 'relative',
          padding: '6rem 0 5rem',
          overflow: 'hidden',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="glow-blob" style={{ width: '500px', height: '500px', background: 'var(--primary)', top: '-200px', right: '-100px' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="badge">About Me</div>
          <h1 className="section-title">The Person Behind<br />the Pixels</h1>
          <p className="section-subtitle">
            A passionate developer and designer who believes great software is born at the intersection of logic and creativity.
          </p>
        </div>
      </section>

      {/* Bio + Photo placeholder */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            {/* Avatar Placeholder */}
            <div style={{ position: 'relative', aspectRatio: '1', maxWidth: '420px' }}>
              <div style={{
                width: '100%', height: '100%', minHeight: '360px',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)',
                borderRadius: '2rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '8rem',
              }}>
                👤
              </div>
              {/* Floating card */}
              <div style={{
                position: 'absolute', bottom: '-1.5rem', right: '-1.5rem',
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '1rem', padding: '1rem 1.5rem',
                boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              }}>
                <div style={{ fontWeight: 800, fontSize: '1.5rem', color: 'var(--primary)' }}>3+</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>Years Experience</div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--foreground)' }}>Hi, I&apos;m Zaref 👋</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                I&apos;m a creative developer with a passion for building beautiful, performant, and accessible web experiences. I specialize in modern JavaScript frameworks and love the craft of turning complex problems into elegant solutions.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                When I&apos;m not coding, you&apos;ll find me exploring new design trends, contributing to open source, or sipping coffee while sketching the next big idea.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a href="/portfolio" className="btn-primary">View Portfolio</a>
                <a href="/contact" className="btn-outline">Hire Me</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ margin: '0 auto 1rem' }}>Skills</div>
            <h2 className="section-title">What I Work With</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            {skills.map(skill => (
              <div key={skill.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>{skill.name}</span>
                  <span style={{ color: 'var(--primary-light)', fontWeight: 700 }}>{skill.level}%</span>
                </div>
                <div style={{ height: '6px', background: 'var(--surface-2)', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${skill.level}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-light))',
                    borderRadius: '999px',
                    transition: 'width 1s ease',
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="badge" style={{ margin: '0 auto 1rem' }}>Experience</div>
            <h2 className="section-title">My Journey</h2>
          </div>
          <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative' }}>
            {/* vertical line */}
            <div style={{
              position: 'absolute', left: '16px', top: 0, bottom: 0,
              width: '2px', background: 'linear-gradient(to bottom, var(--primary), transparent)',
            }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingLeft: '3rem' }}>
              {timeline.map(item => (
                <div key={item.year} style={{ position: 'relative' }}>
                  {/* Dot */}
                  <div style={{
                    position: 'absolute', left: '-2.6rem', top: '0.3rem',
                    width: '14px', height: '14px', borderRadius: '50%',
                    background: 'var(--primary)', border: '3px solid var(--background)',
                    boxShadow: '0 0 0 3px var(--primary-glow)',
                  }} />
                  <div style={{ color: 'var(--primary-light)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{item.year}</div>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--foreground)', marginBottom: '0.2rem' }}>{item.title}</h3>
                  <div style={{ color: 'var(--muted)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{item.company}</div>
                  <p style={{ color: 'var(--muted)', fontSize: '0.925rem', lineHeight: 1.7 }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
