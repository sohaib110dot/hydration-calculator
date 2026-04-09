import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Shield, Eye, Database, Cookie, Users, Lock, Mail, RefreshCw } from "lucide-react";
import { setPageMeta } from "@/lib/seo";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-slate-100 pb-7 last:border-0 last:pb-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-blue-50 rounded-lg p-2 shrink-0">{icon}</div>
        <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      </div>
      <div className="text-slate-600 text-sm leading-relaxed space-y-3 ml-11">{children}</div>
    </section>
  );
}

export function Privacy() {
  useEffect(() => { setPageMeta("privacy"); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/15 rounded-full p-3">
              <Shield className="w-8 h-8 text-blue-100" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-blue-100 text-sm">Last updated: April 2026 &nbsp;·&nbsp; Hydration Calculator</p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6">

        {/* Quick Summary */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 flex gap-4">
          <span className="text-2xl shrink-0">✅</span>
          <div>
            <p className="font-bold text-green-800 text-sm mb-1">Quick Summary</p>
            <p className="text-green-700 text-sm leading-relaxed">
              We do <strong>not</strong> collect your calculator inputs (weight, age, activity, etc.). Your data stays on your device. The only personal data we store is what you voluntarily submit through the Contact form.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-7">

          <Section icon={<Eye className="w-5 h-5 text-blue-600" />} title="What Information We Collect">
            <p><strong className="text-slate-700">Calculator inputs:</strong> None. Weight, age, gender, activity level, and all other calculator inputs are processed entirely in your browser. We never see or store them.</p>
            <p><strong className="text-slate-700">Contact form:</strong> If you reach out to us, we collect:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Your message content and selected topic</li>
            </ul>
            <p><strong className="text-slate-700">Automatic data:</strong> Like most websites, our server may log basic technical information such as your IP address, browser type, and the pages you visit. This helps us keep the site running properly.</p>
          </Section>

          <Section icon={<Database className="w-5 h-5 text-blue-600" />} title="How We Use Your Information">
            <p>We use the information you provide only to:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Respond to your contact form messages</li>
              <li>Improve the website based on general usage patterns</li>
              <li>Maintain the security and reliability of the site</li>
            </ul>
            <p>We do <strong>not</strong> use your data for marketing, profiling, or selling to third parties.</p>
          </Section>

          <Section icon={<Cookie className="w-5 h-5 text-blue-600" />} title="Cookies & Tracking">
            <p>We may use the following types of cookies and tracking technologies:</p>
            <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-semibold text-slate-700 text-sm mb-1">📊 Analytics (Google Analytics)</p>
                <p>Helps us understand which pages are popular, how long users stay, and where they come from. All data is anonymous and aggregated — we cannot identify individual users.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="font-semibold text-slate-700 text-sm mb-1">💰 Advertising (Google AdSense)</p>
                <p>We display ads to keep the tool free. Google AdSense may use cookies to show ads relevant to your interests based on your browsing history. You can opt out at <a href="https://www.google.com/settings/ads" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.</p>
              </div>
            </div>
            <p>You can manage or disable cookies through your browser settings at any time. Disabling cookies won't affect the calculator — it works without them.</p>
          </Section>

          <Section icon={<Users className="w-5 h-5 text-blue-600" />} title="Third-Party Sharing">
            <p>We <strong>do not sell</strong> your personal information. We may share limited data only in these cases:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong>Google Analytics & AdSense</strong> — for site analytics and ad display (see above)</li>
              <li><strong>Hosting providers</strong> — our platform providers may process data as part of running the website</li>
              <li><strong>Legal requirements</strong> — if required by law or to protect the rights and safety of users</li>
            </ul>
            <p>All third-party services we use have their own privacy policies. We encourage you to review them.</p>
          </Section>

          <Section icon={<Lock className="w-5 h-5 text-blue-600" />} title="Data Security">
            <p>We take reasonable steps to protect any data you submit, including:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Encrypted connections (HTTPS) for all pages</li>
              <li>Secure storage for contact form submissions</li>
              <li>Limited access to personal data</li>
            </ul>
            <p>No method of transmission over the internet is 100% secure. While we do our best, we cannot guarantee absolute security.</p>
          </Section>

          <Section icon={<Shield className="w-5 h-5 text-blue-600" />} title="Your Rights">
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li><strong>Access</strong> — request a copy of any personal data we hold about you</li>
              <li><strong>Correction</strong> — ask us to fix inaccurate information</li>
              <li><strong>Deletion</strong> — request that we delete your personal data</li>
              <li><strong>Opt out</strong> — opt out of personalized advertising via Google Ads Settings</li>
            </ul>
            <p>To exercise any of these rights, please <a href="/contact" className="text-blue-600 font-semibold hover:underline">contact us</a>. We will respond within a reasonable time.</p>
          </Section>

          <Section icon={<RefreshCw className="w-5 h-5 text-blue-600" />} title="Changes to This Policy">
            <p>We may update this Privacy Policy occasionally. When we do, we'll update the "Last updated" date at the top. Continued use of the website after changes are posted means you accept the updated policy.</p>
            <p>We recommend checking this page periodically for any updates.</p>
          </Section>

          <Section icon={<Mail className="w-5 h-5 text-blue-600" />} title="Contact Us">
            <p>Have a question about your privacy or this policy? We'd love to hear from you.</p>
            <div className="mt-2">
              <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                <Mail className="w-4 h-4" /> Get in Touch
              </a>
            </div>
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
