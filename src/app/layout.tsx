import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from '@/components/providers/QueryProvider';

export const metadata: Metadata = {
  title: "DMC Middle East - CRM",
  description: "Lead, client, operations, and reporting platform for DMC Middle East.",
  icons: {
    icon: '/dmc-logo.jpg',
    apple: '/dmc-logo.jpg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" suppressHydrationWarning>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
