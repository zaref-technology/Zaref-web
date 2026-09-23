import { FaGithub, FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa6';
import type { IconType } from 'react-icons';
import type { SiteSettings } from '@/types/settings';

export interface SocialPlatform {
  /** Key into SiteSettings holding this platform's URL. */
  key: keyof SiteSettings;
  label: string;
  icon: IconType;
  placeholder: string;
}

/** All social platforms configurable from Site Settings — always rendered as external links. */
export const SOCIAL_PLATFORMS: SocialPlatform[] = [
  { key: 'github', label: 'GitHub', icon: FaGithub, placeholder: 'https://github.com/...' },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, placeholder: 'https://linkedin.com/in/...' },
  { key: 'twitter', label: 'Twitter / X', icon: FaTwitter, placeholder: 'https://twitter.com/...' },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, placeholder: 'https://instagram.com/...' },
  { key: 'facebook', label: 'Facebook', icon: FaFacebook, placeholder: 'https://facebook.com/...' },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, placeholder: 'https://youtube.com/@channel' },
];
