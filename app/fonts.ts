import { Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google';

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
}); 