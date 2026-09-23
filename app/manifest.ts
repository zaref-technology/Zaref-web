import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/constants/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Zaref',
    description: 'Zaref is a software development company building custom software, web platforms, mobile applications and business systems for businesses and organizations.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0b1018',
    theme_color: '#175cd3',
    icons: [
      { src: '/icon.png', sizes: '64x64', type: 'image/png' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
