// components/layout/Footer.tsx
import Link from "next/link";
import { Github, Twitter, Youtube } from "lucide-react";

const links = [
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Support", href: "/support" },
];

const socials = [
  { icon: Twitter, href: "https://twitter.com/reelforge", label: "Twitter" },
  { icon: Youtube, href: "https://youtube.com/@reelforge", label: "YouTube" },
  { icon: Github, href: "https://github.com/reelforge", label: "GitHub" },
];

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0f] border-t border-[#2a2a3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                ReelForge
              </span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Create viral faceless videos on autopilot. Powered by AI.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Links</h3>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Follow Us</h3>
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-[#2a2a3e]">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} ReelForge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
