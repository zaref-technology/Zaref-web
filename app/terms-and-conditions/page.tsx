import type { Metadata } from 'next';
import Link from 'next/link';
import { LegalPage, OwnerContact, legal } from '@/components/LegalPage';
import { DEFAULT_OG_IMAGES, SITE_URL } from '@/constants/site';
import { ROUTES } from '@/constants/routes';
import { OWNER } from '@/constants/legal';

const title = 'Terms & Conditions';
const description = 'The terms that apply when you use the Zaref website, send us an enquiry or engage us for a software project.';

/** Bump whenever the terms below materially change. */
const LAST_UPDATED = '21 October 2026';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: ROUTES.terms },
  openGraph: { title, description, url: ROUTES.terms, images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

const { h2, p, ul, strong, link } = legal;

const sections = [
  { id: 'about', label: 'About these terms' },
  { id: 'use-of-website', label: 'Using this website' },
  { id: 'intellectual-property', label: 'Intellectual property' },
  { id: 'enquiries-and-quotes', label: 'Enquiries and quotes' },
  { id: 'project-engagements', label: 'Project engagements' },
  { id: 'third-party-links', label: 'Third-party links and services' },
  { id: 'disclaimer', label: 'Disclaimer' },
  { id: 'liability', label: 'Limitation of liability' },
  { id: 'privacy', label: 'Privacy' },
  { id: 'governing-law', label: 'Governing law' },
  { id: 'changes', label: 'Changes to these terms' },
  { id: 'contact', label: 'Contact us' },
];

export default function TermsAndConditions() {
  return (
    <LegalPage
      title={title}
      path={ROUTES.terms}
      intro="The ground rules for using this website and working with us — written to be read, not skimmed past."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    >
      <h2 id="about" className={h2}>About these terms</h2>
      <p className={p}>
        These Terms &amp; Conditions govern your use of{' '}
        <span className={strong}>{SITE_URL.replace(/^https?:\/\//, '')}</span> (the &ldquo;website&rdquo;). The website is operated by Zaref (&ldquo;Zaref&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a{' '}
        <span className={strong}>sole proprietorship</span> owned by <span className={strong}>{OWNER.name}</span>.
      </p>
      <p className={p}>
        By accessing or using the website, you agree to these terms. If you do not agree, please do not use the website.
      </p>

      <h2 id="use-of-website" className={h2}>Using this website</h2>
      <p className={p}>You may use this website for lawful purposes only. You agree not to:</p>
      <ul className={ul}>
        <li>Use the website in any way that breaks applicable laws or regulations</li>
        <li>Attempt to gain unauthorized access to the website, its admin area, servers or databases</li>
        <li>Introduce viruses, malware or any other harmful code</li>
        <li>Send spam, automated or bulk submissions through the contact form</li>
        <li>Copy, scrape or republish website content for commercial purposes without our written permission</li>
        <li>Impersonate any person or misrepresent your connection with any business</li>
      </ul>
      <p className={p}>
        We may restrict or block access to the website for anyone who breaks these terms.
      </p>

      <h2 id="intellectual-property" className={h2}>Intellectual property</h2>
      <p className={p}>
        Unless stated otherwise, the content on this website — including text, graphics, the Zaref name and logo, and the website design — belongs to Zaref and is protected by intellectual property laws. You may view and share links to our pages, but you may not reproduce, modify or distribute our content without written permission.
      </p>
      <p className={p}>
        Projects shown in our work portfolio are presented for showcase purposes. Names, logos, screenshots and other materials related to those projects may belong to our clients or other third parties, and remain their property.
      </p>

      <h2 id="enquiries-and-quotes" className={h2}>Enquiries and quotes</h2>
      <p className={p}>
        Sending us a message through the contact form does not create a contract or any obligation for either party. Please make sure the information you send is accurate, and avoid sharing confidential details until a confidentiality agreement is in place if you need one.
      </p>
      <p className={p}>
        Any estimate, timeline or price we share during early discussions is indicative only. It becomes binding only once it is confirmed in a written proposal or agreement accepted by both parties.
      </p>

      <h2 id="project-engagements" className={h2}>Project engagements</h2>
      <p className={p}>
        When you engage Zaref for software development or related services, the work is governed by a separate written proposal, quotation or agreement. That document sets out the scope, deliverables, timelines, fees, payment terms, ownership of work and any confidentiality obligations.
      </p>
      <p className={p}>
        If anything in that agreement conflicts with these website terms, <span className={strong}>the project agreement takes priority</span>.
      </p>

      <h2 id="third-party-links" className={h2}>Third-party links and services</h2>
      <p className={p}>
        The website may link to or embed content from third-party websites and services, such as YouTube videos, app store listings and our social media profiles. We do not control those services and are not responsible for their content, availability or privacy practices. Your use of them is subject to their own terms.
      </p>

      <h2 id="disclaimer" className={h2}>Disclaimer</h2>
      <p className={p}>
        The website and its content are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis for general information. While we work to keep it accurate and up to date, we make no guarantees that the website will be error-free, uninterrupted or free of harmful components, or that its content is complete or current.
      </p>
      <p className={p}>
        Nothing on this website is professional, legal or financial advice, and it should not be relied on as such.
      </p>

      <h2 id="liability" className={h2}>Limitation of liability</h2>
      <p className={p}>
        To the fullest extent permitted by law, Zaref and its owner will not be liable for any indirect, incidental, special or consequential loss — including loss of profits, data or business opportunity — arising from your use of, or inability to use, this website or any content on it.
      </p>
      <p className={p}>
        Liability relating to paid project work is governed by the relevant project agreement. Nothing in these terms limits any liability that cannot be limited under applicable law.
      </p>

      <h2 id="privacy" className={h2}>Privacy</h2>
      <p className={p}>
        How we collect and use personal information is explained in our{' '}
        <Link href={ROUTES.privacy} className={link}>Privacy Policy</Link>, which forms part of these terms.
      </p>

      <h2 id="governing-law" className={h2}>Governing law</h2>
      <p className={p}>
        These terms are governed by the laws of India. Any dispute arising from these terms or your use of the website will be subject to the exclusive jurisdiction of the competent courts in India.
      </p>

      <h2 id="changes" className={h2}>Changes to these terms</h2>
      <p className={p}>
        We may update these terms from time to time. When we do, we will change the &ldquo;Last updated&rdquo; date at the top of this page. Continuing to use the website after an update means you accept the revised terms.
      </p>

      <h2 id="contact" className={h2}>Contact us</h2>
      <p className={p}>
        If you have any questions about these terms, please contact:
      </p>
      <OwnerContact />
    </LegalPage>
  );
}
