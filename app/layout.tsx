import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Wander far. Rest easy.',
  description:
    'Find quiet fjords, cozy cabins, and the slow, wild mornings you came for, all here in one place.',
  openGraph: {
    title: 'Wander far. Rest easy.',
    description:
      'Find quiet fjords, cozy cabins, and the slow, wild mornings you came for, all here in one place.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wander far. Rest easy.',
    description:
      'Find quiet fjords, cozy cabins, and the slow, wild mornings you came for, all here in one place.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#FEFEFE] text-[#222223]" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
