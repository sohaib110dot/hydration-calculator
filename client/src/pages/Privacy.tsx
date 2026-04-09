import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield } from "lucide-react";
import { setPageMeta } from "@/lib/seo";

export function Privacy() {
  useEffect(() => {
    setPageMeta("privacy");
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-1">
            <Shield className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Privacy Policy</h1>
          </div>
          <p className="text-slate-400 text-xs mb-8">Last updated: March 2026</p>

          <div className="space-y-7 text-slate-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Overview</h2>
              <p>
                Hydration Calculator is a free online tool. We are committed to protecting your privacy. This page explains what data we collect (if any), how it is used, and your rights.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Data We Collect</h2>
              <p className="mb-3">
                The Hydration Calculator runs entirely in your browser. <strong>We do not collect, store, or transmit the inputs you enter</strong> (weight, age, activity level, etc.). Your data stays on your device.
              </p>
              <p className="">
                If you submit a message through our Contact page, we collect your name, email address, and message content solely to respond to your inquiry.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Cookies & Analytics</h2>
              <p className="">
                We may use standard analytics tools (such as Google Analytics) to understand how users interact with the site — for example, which pages are most visited. This data is aggregated and anonymous. We also display Google AdSense advertisements, which may use cookies to show relevant ads. You can manage cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Third-Party Advertising</h2>
              <p className="">
                We use Google AdSense to display advertisements. Google may use cookies to serve ads based on your prior visits to this and other websites. You can opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Data Security</h2>
              <p className="">
                We take appropriate technical measures to protect any data submitted via our contact form. We do not sell or share your personal information with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Your Rights</h2>
              <p className="">
                You have the right to request access to, correction of, or deletion of any personal data we hold about you. To exercise these rights, please <a href="/contact" className="text-blue-600 font-semibold hover:underline">contact us</a>.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Changes to This Policy</h2>
              <p className="">
                We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date. Continued use of the site constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Contact Us</h2>
              <p className="">
                For any privacy-related questions, please <a href="/contact" className="text-blue-600 font-semibold hover:underline">contact us</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
