import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import "./auth.css";
import SimpleErrorBoundary from '../components/SimpleErrorBoundary';
import { ThemeProvider } from './components/theme-provider';
import ClientErrorReporter from '../components/ClientErrorReporter';
import TopLoadingBar from '../components/TopLoadingBar';
import NavigationProgress from '../components/NavigationProgress';

export const metadata: Metadata = {
  title: 'CampusRunner',
  description: 'Run your campus smarter - Connect with verified student runners for food delivery, laundry service, package pickup, and more.',
  manifest: '/manifest.json',
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="theme-color" content="#f59e0b" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                document.documentElement.classList.remove('dark');
              }
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          <Suspense fallback={null}>
            <TopLoadingBar />
          </Suspense>
          <NavigationProgress />
          <ClientErrorReporter />
          <SimpleErrorBoundary>
            {children}
          </SimpleErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
