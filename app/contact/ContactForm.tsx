'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Send, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { submitMessage } from '@/services/messages.service';
import { CONTACT_PROJECT_TYPES, CONTACT_BUDGET_RANGES } from '@/constants/contact';
import { ROUTES } from '@/constants/routes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';

const initialForm = {
  name: '', email: '', company: '', projectType: CONTACT_PROJECT_TYPES[0] as string, budget: '', message: '',
};

type FieldName = 'name' | 'email' | 'message';
type FieldErrors = Partial<Record<FieldName, string>>;

const fieldLabel = 'mb-1.5 block text-[0.85rem] font-semibold text-foreground';
const fieldError = 'mt-1.5 text-[0.85rem] font-medium text-danger';

/** Order matters: the first invalid field in this order receives focus. */
const FIELD_ORDER: FieldName[] = ['name', 'email', 'message'];

function validate(form: typeof initialForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = 'Enter your name.';
  if (!form.email.trim()) errors.email = 'Enter your work email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errors.email = 'Enter a valid email address, for example name@company.com.';
  if (!form.message.trim()) errors.message = 'Describe your project so we can review it.';
  return errors;
}

export default function ContactForm() {
  const [form, setForm]       = useState(initialForm);
  const [website, setWebsite] = useState(''); // honeypot — real users never see or fill this
  const [state, setState]     = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errors, setErrors]   = useState<FieldErrors>({});
  const [errorMsg, setErrorMsg] = useState('');

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const shouldRefocusName = useRef(false);

  // After a successful submit the form is replaced by the confirmation — move focus to it so
  // keyboard/screen-reader users aren't left on a control that no longer exists.
  useEffect(() => {
    if (state === 'success') successRef.current?.focus();
    if (state === 'idle' && shouldRefocusName.current) {
      shouldRefocusName.current = false;
      nameRef.current?.focus();
    }
  }, [state]);

  const set = (key: keyof typeof initialForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    if (key in errors) setErrors(prev => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (state === 'loading') return;
    if (website.trim()) {
      // Honeypot triggered — silently pretend success to not tip off bots.
      setState('success');
      return;
    }
    const found = validate(form);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setErrorMsg('');
      setState('error');
      const first = FIELD_ORDER.find(k => found[k]);
      if (first) ({ name: nameRef, email: emailRef, message: messageRef })[first].current?.focus();
      return;
    }
    setState('loading');
    setErrors({});
    setErrorMsg('');
    try {
      await submitMessage(form);
      setState('success');
      setForm(initialForm);
    } catch (err) {
      console.error(err);
      setErrorMsg('Something went wrong and your message was not sent. Please try again.');
      setState('error');
    }
  };

  const invalidCount = FIELD_ORDER.filter(k => errors[k]).length;
  const describedBy = (k: FieldName) => (errors[k] ? `contact-${k}-error` : undefined);

  return (
    <Card hover={false} className="p-10">
      <h2 className="mb-7 text-2xl font-extrabold text-foreground">Discuss Your Project</h2>

      {state === 'success' ? (
        <div
          ref={successRef}
          tabIndex={-1}
          role="status"
          className="animate-fade-in py-12 text-center outline-none"
        >
          <CheckCircle size={52} color="var(--primary-light)" className="mx-auto mb-4 opacity-90" aria-hidden="true" />
          <h3 className="mb-2 font-extrabold text-foreground">Message Sent</h3>
          <p className="mb-6 text-muted">Your project details have been sent. We&apos;ll review them and get back to you using the contact information provided.</p>
          <Button
            variant="outline"
            onClick={() => {
              shouldRefocusName.current = true;
              setState('idle');
            }}
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate aria-busy={state === 'loading'} className="flex flex-col gap-5">
          {/* Honeypot — hidden from real users via CSS, off-screen for a11y; bots tend to fill every field */}
          <div className="absolute left-[-9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={e => setWebsite(e.target.value)} />
          </div>

          <p className="text-[0.85rem] text-muted">Fields marked with an asterisk (*) are required.</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-name" className={fieldLabel}>Name *</label>
              <Input
                ref={nameRef}
                id="contact-name"
                type="text"
                value={form.name}
                onChange={set('name')}
                placeholder="John Doe"
                autoComplete="name"
                aria-required="true"
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy('name')}
              />
              {errors.name && <p id="contact-name-error" className={fieldError}>{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="contact-email" className={fieldLabel}>Work Email *</label>
              <Input
                ref={emailRef}
                id="contact-email"
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="john@company.com"
                autoComplete="email"
                aria-required="true"
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy('email')}
              />
              {errors.email && <p id="contact-email-error" className={fieldError}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="contact-company" className={fieldLabel}>Company / Organization</label>
            <Input id="contact-company" type="text" value={form.company} onChange={set('company')} placeholder="Acme Inc." autoComplete="organization" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="contact-type" className={fieldLabel}>What can we help with? *</label>
              <Select id="contact-type" value={form.projectType} onChange={set('projectType')} aria-required="true">
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
              ref={messageRef}
              id="contact-message"
              rows={5}
              value={form.message}
              onChange={set('message')}
              placeholder="Tell us what you're looking to build, improve or integrate, and any important context we should know."
              aria-required="true"
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy('message')}
            />
            {errors.message && <p id="contact-message-error" className={fieldError}>{errors.message}</p>}
          </div>

          {/* Announced immediately when it appears (role="alert"); the per-field messages above
              are read when focus lands on each field via aria-describedby. */}
          {state === 'error' && (invalidCount > 0 || errorMsg) && (
            <div role="alert" className="flex items-start gap-2 rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-medium text-danger">
              <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
              <span>
                {invalidCount > 0
                  ? `Your message was not sent. ${invalidCount === 1 ? 'One field needs' : `${invalidCount} fields need`} your attention.`
                  : errorMsg}
              </span>
            </div>
          )}

          {/* Polite status for the loading state */}
          <div role="status" aria-live="polite" className="sr-only">
            {state === 'loading' ? 'Sending your project details…' : ''}
          </div>

          <Button
            id="contact-submit-btn"
            type="submit"
            disabled={state === 'loading'}
            aria-disabled={state === 'loading'}
            fullWidth
            className="justify-center"
          >
            {state === 'loading' ? (
              <>
                <Loader2 size={16} className="animate-spin-fast" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                Send Project Details <Send size={15} aria-hidden="true" />
              </>
            )}
          </Button>

          <p className="text-center text-[0.8rem] text-muted">
            We use your details only to respond to your enquiry. See our{' '}
            <Link href={ROUTES.privacy} className="font-semibold text-primary underline-offset-4 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      )}
    </Card>
  );
}
