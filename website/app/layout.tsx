import './globals.css';

import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import type { ReactElement, ReactNode } from 'react';

import { NavigationIndicator } from '@/components/NavigationIndicator';
import { ThemeScript } from '@/components/Theme';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.BASE_URL!),
  title: {
    template: `%s – Crypto Frontmatter`,
    default: `Crypto Frontmatter`,
  },
  description: 'Crypto Frontmatter is a collection of frontmatter for crypto projects.',
};

export default function RootLayout(props: { children: ReactNode }): ReactElement {
  return (
    <html lang="en">
      <head>
        <ThemeScript />
      </head>
      <body className="text-mono-300 mx-auto w-full max-w-screen-lg px-4 sm:px-6 lg:px-8 xl:px-10">
        <NavigationIndicator />
        <header className="flex items-center justify-between py-6">
          <div className="text-mono-200 text-lg font-semibold">Crypto Frontmatter</div>
        </header>
        {props.children}
        <Analytics />
      </body>
    </html>
  );
}
