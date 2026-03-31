"use client";

import { Trophy, Heart } from "lucide-react";
import Link from "next/link";

const links = {
  Platform: [
    { name: "How It Works", href: "#how-it-works" },
    { name: "Charities", href: "#charities" },
    { name: "Prize Pool", href: "#prizes" },
    { name: "Pricing", href: "#pricing" },
  ],
  Account: [
    { name: "Dashboard", href: "/dashboard" },
    { name: "My Scores", href: "/dashboard/scores" },
    { name: "My Winnings", href: "/dashboard/winnings" },
    { name: "Settings", href: "/dashboard/settings" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "Responsible Play", href: "/responsible-play" },
  ],
};

export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-dark-950" />
              </div>
              <span className="font-display font-bold text-xl">
                Golf<span className="text-brand-400">Charity</span>
              </span>
            </Link>
            <p className="text-dark-500 text-sm leading-relaxed max-w-xs mb-6">
              A subscription platform combining golf performance tracking,
              monthly prize draws, and charitable giving. Play with purpose.
            </p>
            <div className="flex items-center gap-2 text-dark-600 text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
              <span>for golf & charity</span>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-display font-semibold text-sm text-dark-300 mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-dark-500 hover:text-white text-sm transition-colors duration-300"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-dark-600 text-xs">
            &copy; {new Date().getFullYear()} GolfCharity Platform. All rights reserved.
          </p>
          <p className="text-dark-700 text-xs">
            This is not a gambling platform. Draws are prize-based subscription rewards.
          </p>
        </div>
      </div>
    </footer>
  );
}