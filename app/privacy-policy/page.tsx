import type { Metadata } from 'next';
import { LegalPage, OwnerContact, OwnerEmailLink, legal } from '@/components/LegalPage';
import { DEFAULT_OG_IMAGES, SITE_URL } from '@/constants/site';
import { ROUTES } from '@/constants/routes';
import { OWNER } from '@/constants/legal';

const title = 'Privacy Policy';
const description = 'How Zaref collects, uses, stores and protects the information you share through this website and its contact form.';

/** Bump whenever the policy text below materially changes. */
const LAST_UPDATED = '21 October 2026';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: ROUTES.privacy },
  openGraph: { title, description, url: ROUTES.privacy, images: DEFAULT_OG_IMAGES },
  twitter: { title, description, images: DEFAULT_OG_IMAGES },
};

const { h2, p, ul, strong, link } = legal;

// Every statement below reflects what the site actually does in code: the contact form writes to
// Firestore (services/messages.service.ts), the only browser storage is the `theme` key
// (app/context/ThemeContext.tsx), there are no analytics or advertising scripts, and project pages
// may embed YouTube videos. Update this page whenever any of that changes.
const sections = [
  { id: 'who-we-are', label: 'Who we are' },
  { id: 'information-we-collect', label: 'Information we collect' },
  { id: 'how-we-use-it', label: 'How we use your information' },
  { id: 'cookies', label: 'Cookies and local storage' },
  { id: 'third-parties', label: 'Service providers and third parties' },
  { id: 'retention', label: 'How long we keep it' },
  { id: 'security', label: 'Security' },
  { id: 'your-rights', label: 'Your rights' },
  { id: 'children', label: "Children's privacy" },
  { id: 'changes', label: 'Changes to this policy' },
  { id: 'contact', label: 'Contact us' },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title={title}
      path={ROUTES.privacy}
      intro="We collect only what we need to respond to your enquiry, and we never sell it."
      lastUpdated={LAST_UPDATED}
      sections={sections}
    >
      <p className={p}>
        This Privacy Policy explains how Zaref (&ldquo;Zaref&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) handles personal information when you visit{' '}
        <span className={strong}>{SITE_URL.replace(/^https?:\/\//, '')}</span> or get in touch with us through it. By using this website, you agree to the practices described here.
      </p>

      <h2 id="who-we-are" className={h2}>Who we are</h2>
      <p className={p}>
        Zaref is a <span className={strong}>sole proprietorship</span> owned and operated by{' '}
        <span className={strong}>{OWNER.name}</span>, who is responsible for the personal information collected through this website.
      </p>

      <h2 id="information-we-collect" className={h2}>Information we collect</h2>
      <p className={p}>
        <span className={strong}>Information you give us.</span> When you submit the contact form, we collect:
      </p>
      <ul className={ul}>
        <li>Your name and email address</li>
        <li>Your company or organization name, if you provide it</li>
        <li>The type of project you are interested in and, if you choose to share it, your budget range</li>
        <li>The project details and any other information you include in your message</li>
      </ul>
      <p className={p}>
        Please do not include sensitive personal information (such as financial, health or government ID details) in your message.
      </p>
      <p className={p}>
        <span className={strong}>Information collected automatically.</span> Like most websites, our hosting and infrastructure providers may record standard technical data when you load a page, such as your IP address, browser type, device information and the pages requested. This is used to deliver the site and keep it secure. We do not use analytics, advertising or tracking tools to build profiles of visitors.
      </p>

      <h2 id="how-we-use-it" className={h2}>How we use your information</h2>
      <p className={p}>We use the information you provide to:</p>
      <ul className={ul}>
        <li>Read and respond to your enquiry</li>
        <li>Discuss, scope and quote for a potential project</li>
        <li>Communicate with you about work we are doing together</li>
        <li>Protect the website from spam, abuse and security threats</li>
        <li>Comply with legal obligations</li>
      </ul>
      <p className={p}>
        We do not sell, rent or trade your personal information, and we do not add you to marketing lists without your consent.
      </p>

      <h2 id="cookies" className={h2}>Cookies and local storage</h2>
      <p className={p}>
        This website does not use advertising or analytics cookies. We store a single preference in your browser&apos;s local storage — your choice of light or dark theme — so the site looks the way you left it. It contains no personal information and never leaves your device. You can clear it at any time through your browser settings.
      </p>
      <p className={p}>
        Some project pages include embedded YouTube videos. When you view or play an embedded video, YouTube (Google) may set its own cookies and collect data under{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={link}>Google&apos;s Privacy Policy</a>.
      </p>

      <h2 id="third-parties" className={h2}>Service providers and third parties</h2>
      <p className={p}>
        We rely on a small number of trusted providers to run this website. They process data on our behalf and only as needed to provide their services:
      </p>
      <ul className={ul}>
        <li><span className={strong}>Google Firebase</span> — stores contact form submissions securely in our database.</li>
        <li><span className={strong}>Cloudinary</span> — hosts and delivers images shown on the site.</li>
        <li><span className={strong}>YouTube</span> — provides embedded project videos.</li>
        <li><span className={strong}>Our hosting provider</span> — serves the website and keeps standard server logs.</li>
      </ul>
      <p className={p}>
        These providers may store or process data on servers outside your country. We may also disclose information if required by law, or to protect our rights, users or the public.
      </p>
      <p className={p}>
        This website links to external sites, such as our social media profiles. We are not responsible for the privacy practices of those sites.
      </p>

      <h2 id="retention" className={h2}>How long we keep it</h2>
      <p className={p}>
        We keep contact form submissions for as long as needed to respond to your enquiry and maintain our business relationship with you, and to meet any legal or accounting requirements. When information is no longer needed, we delete it. You can ask us to delete your information sooner at any time.
      </p>

      <h2 id="security" className={h2}>Security</h2>
      <p className={p}>
        The website is served over HTTPS, and access to stored submissions is restricted to authorized Zaref team members. While we take reasonable measures to protect your information, no method of transmission or storage over the internet is completely secure.
      </p>

      <h2 id="your-rights" className={h2}>Your rights</h2>
      <p className={p}>Depending on where you live, you may have the right to:</p>
      <ul className={ul}>
        <li>Access the personal information we hold about you</li>
        <li>Ask us to correct inaccurate or incomplete information</li>
        <li>Ask us to delete your information</li>
        <li>Withdraw your consent or object to how we use your information</li>
        <li>Raise a concern with your local data protection authority</li>
      </ul>
      <p className={p}>
        To exercise any of these rights, contact us at <OwnerEmailLink />. We will respond within a reasonable time.
      </p>

      <h2 id="children" className={h2}>Children&apos;s privacy</h2>
      <p className={p}>
        This website is intended for businesses and is not directed at children. We do not knowingly collect personal information from anyone under 18. If you believe a child has sent us information, please contact us and we will delete it.
      </p>

      <h2 id="changes" className={h2}>Changes to this policy</h2>
      <p className={p}>
        We may update this policy from time to time. When we do, we will change the &ldquo;Last updated&rdquo; date at the top of this page. Significant changes will be made clear on this page.
      </p>

      <h2 id="contact" className={h2}>Contact us</h2>
      <p className={p}>
        If you have any questions about this Privacy Policy or how we handle your information, please contact:
      </p>
      <OwnerContact />
    </LegalPage>
  );
}
