import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/toaster';
import { FormValidationProvider } from '@/components/ui/form-validation-provider';

export const metadata: Metadata = {
  title: "CMG - CRM",
  description: "Lead, client, operations, and reporting platform for CMG — Immigration Simplified.",
  icons: {
    icon: [
      { url: '/cmg-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/cmg-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/cmg-icon-180.png',
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
              <FormValidationProvider />
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
