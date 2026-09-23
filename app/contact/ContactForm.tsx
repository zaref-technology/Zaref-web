'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { submitMessage } from '@/services/messages.service';
import { CONTACT_PROJECT_TYPES, CONTACT_BUDGET_RANGES } from '@/constants/contact';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

const initialForm = {
  name: '', email: '', company: '', projectType: CONTACT_PROJECT_TYPES[0] as string, budget: '', message: '',
};

const fieldLabel = 'mb-1.5 block text-[0.85rem] font-semibold text-foreground';

export default function ContactForm() {
  const [form, setForm]       = useState(initialForm);
  const [website, setWebsite] = useState(''); // honeypot — real users never see or fill this
  const [state, setState]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const set = (key: keyof typeof initialForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (website.trim()) {
      // Honeypot triggered — silently pretend success to not tip off bots.
      setState('success');
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please fill in Name, Work Email, and Project Details.');
      setState('error');
      return;
    }
    setState('loading');
    setErrorMsg('');
    try {
      await submitMessage(form);
      setState('success');
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong. Please try again.');
      setState('error');
    }
  };

  return (
    <Card hover={false} className="p-10">
      <h2 className="mb-7 text-2xl font-extrabold text-foreground">Discuss Your Project</h2>

      {state === 'success' ? (
        <div className="animate-fade-in py-12 text-center">
          <CheckCircle size={52} color="var(--primary-light)" className="mx-auto mb-4 opacity-90" />
          <h3 className="mb-2 font-extrabold text-foreground">Message Sent!</h3>
          <p className="mb-6 text-muted">Thanks for reaching out. We&apos;ll get back to you as soon as possible.</p>
          <Button variant="outline" onClick={() => setState('idle')}>
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Honeypot — hidden from real users via CSS, off-screen for a11y; bots tend to fill every field */}
          <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className={fieldLabel}>Name *</label>
              <Input id="contact-name" type="text" value={form.name} onChange={set('name')} placeholder="John Doe" autoComplete="name" />
            </div>
            <div>
              <label htmlFor="contact-email" className={fieldLabel}>Work Email *</label>
              <Input id="contact-email" type="email" value={form.email} onChange={set('email')} placeholder="john@company.com" autoComplete="email" />
            </div>
          </div>

          <div>
            <label htmlFor="contact-company" className={fieldLabel}>Company / Organization</label>
            <Input id="contact-company" type="text" value={form.company} onChange={set('company')} placeholder="Acme Inc." autoComplete="organization" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-type" className={fieldLabel}>What can we help with? *</label>
              <Select id="contact-type" value={form.projectType} onChange={set('projectType')}>
                {CONTACT_PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </Select>
            </div>
            <div>
              <label htmlFor="contact-budget" className={fieldLabel}>Budget</label>
              <Select id="contact-budget" value={form.budget} onChange={set('budget')}>
                <option value="">Prefer not to say</option>
                {CONTACT_BUDGET_RANGES.map(b => <option key={b} value={b}>{b}</option>)}
              </Select>
            </div>
          </div>

          <div>
            <label htmlFor="contact-message" className={fieldLabel}>Project Details *</label>
            <Textarea
              id="contact-message"
              rows={5}
              value={form.message}
              onChange={set('message')}
              placeholder="Tell us about your project..."
            />
          </div>

          {state === 'error' && (
            <div className="flex items-center gap-2 rounded-xl border border-red-600/30 bg-red-600/10 px-4 py-3 text-sm text-red-500">
              <AlertTriangle size={14} /> {errorMsg}
            </div>
          )}

          <Button
            id="contact-submit-btn"
            type="submit"
            disabled={state === 'loading'}
            fullWidth
            className="justify-center"
          >
            {state === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin-fast" />
                Sending…
              </>
            ) : (
              <>
                Send Project Details <Send size={15} />
              </>
            )}
          </Button>
        </form>
      )}
    </Card>
  );
}
