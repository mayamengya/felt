import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/fraunces/wght-italic.css";
import "@fontsource-variable/inter";
import "./globals.css";

export const metadata: Metadata = {
  title: "Felt: find your words",
  description: "Understand your body. Find your words. Be heard.",
};

export const viewport: Viewport = {
  themeColor: "#EFE6D8",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="felt-bg min-h-full">{children}</body>
    </html>
  );
}
