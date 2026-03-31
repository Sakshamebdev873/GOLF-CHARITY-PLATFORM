import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Golf Charity Platform | Play. Win. Give.",
  description:
    "A subscription-based golf platform combining performance tracking, monthly prize draws, and charitable giving.",
  keywords: "golf, charity, subscription, draw, prize, stableford",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}