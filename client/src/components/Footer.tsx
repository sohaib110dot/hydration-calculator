import { Droplet } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Droplet className="w-6 h-6 text-blue-400" />
              <span className="text-lg font-bold">Hydration Calculator</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              A free, easy-to-use hydration calculator to help you find your daily water intake needs based on your body, lifestyle, and environment.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wide">Pages</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/calculator" className="hover:text-blue-400 transition-colors">Hydration Calculator</Link></li>
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About</Link></li>
              <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-slate-200 mb-4 text-sm uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-slate-400">
          <p>&copy; {currentYear} Hydration Calculator. All rights reserved. Free Tool.</p>
          <p className="text-slate-500">
            Results are estimates only — not medical advice. Consult a healthcare professional.
          </p>
        </div>
      </div>
    </footer>
  );
}
