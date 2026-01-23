import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Software Engineer | Full Stack Developer | Product Engineer",
    template: "%s | Portfolio",
  },
  description:
    "Engineering-focused portfolio showcasing system design, architecture patterns, and technical decision-making. Explore interactive demos, tradeoff analyses, and engineering insights.",
  keywords: [
    "Software Engineer",
    "Full Stack Engineer",
    "Product Engineer",
    "Next.js Developer",
    "SaaS Engineer",
    "System Design",
    "Architecture",
    "Engineering",
  ],
  authors: [{ name: "Nishchal" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Engineering Portfolio",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={false}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
