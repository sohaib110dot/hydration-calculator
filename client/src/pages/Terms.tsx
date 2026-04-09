import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FileText, UserCheck, BookOpen, ShieldOff, Scale, Globe, RefreshCw, Mail } from "lucide-react";
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

export function Terms() {
  useEffect(() => { setPageMeta("terms"); }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/15 rounded-full p-3">
              <FileText className="w-8 h-8 text-blue-100" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
          <p className="text-blue-100 text-sm">Last updated: April 2026 &nbsp;·&nbsp; Hydration Calculator</p>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6">

        {/* Medical Disclaimer Banner */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 mb-8 flex gap-4">
          <span className="text-2xl shrink-0">⚠️</span>
          <div>
            <p className="font-bold text-amber-800 text-sm mb-1">Important Medical Notice</p>
            <p className="text-amber-700 text-sm leading-relaxed">
              This tool is for <strong>informational purposes only</strong> and is <strong>not medical advice</strong>. Results are general estimates. Always consult a qualified healthcare professional before changing your fluid intake — especially if you have health conditions, take medications, or are pregnant.
            </p>
          </div>
        </div>

        {/* Intro */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 mb-6">
          <p className="text-slate-600 text-sm leading-relaxed">
            Welcome to <strong>Hydration Calculator</strong>. By accessing or using this website, you agree to be bound by these Terms & Conditions. Please read them carefully. If you do not agree, please stop using the site.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-7">

          <Section icon={<BookOpen className="w-5 h-5 text-blue-600" />} title="1. Use of This Website">
            <p>The Hydration Calculator is a free online tool provided for general informational and educational purposes. By using this site, you agree that:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>You will use the site only for lawful purposes</li>
              <li>You will not attempt to disrupt or damage the website or its servers</li>
              <li>You will not copy, resell, or misrepresent our content as your own</li>
              <li>You are at least 13 years old</li>
              <li>You take full responsibility for any decisions based on information provided here</li>
            </ul>
          </Section>

          <Section icon={<UserCheck className="w-5 h-5 text-blue-600" />} title="2. User Responsibilities">
            <p>As a user of this website, you are responsible for:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Providing accurate inputs to the calculator for better results</li>
              <li>Understanding that results are estimates, not medical measurements</li>
              <li>Consulting a healthcare professional before making health decisions</li>
              <li>Keeping your own devices and accounts secure</li>
            </ul>
            <p>We do not require account creation to use the Hydration Calculator. The tool is fully accessible without signing in.</p>
          </Section>

          <Section icon={<FileText className="w-5 h-5 text-blue-600" />} title="3. Intellectual Property">
            <p>All content on this website — including text, graphics, logos, icons, design, and code — is owned by or licensed to Hydration Calculator and is protected under applicable copyright laws.</p>
            <p>You may:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Share links to this website</li>
              <li>Quote small portions of content with proper credit and a link back</li>
            </ul>
            <p>You may <strong>not</strong>:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Copy or reproduce our content in bulk without permission</li>
              <li>Use our name, logo, or branding without written approval</li>
              <li>Build competing products that reproduce our calculator without permission</li>
            </ul>
          </Section>

          <Section icon={<Scale className="w-5 h-5 text-blue-600" />} title="4. No Payment or Subscriptions">
            <p>The Hydration Calculator is completely <strong>free to use</strong>. We do not charge any fees, require subscriptions, or process payments for using the calculator or any features on this website.</p>
            <p>We display third-party advertisements (Google AdSense) to keep the tool free. Clicking on ads is optional and not required to use the calculator.</p>
          </Section>

          <Section icon={<ShieldOff className="w-5 h-5 text-blue-600" />} title="5. Limitation of Liability">
            <p>To the fullest extent permitted by law, Hydration Calculator and its operators are <strong>not liable</strong> for:</p>
            <ul className="list-disc list-inside space-y-1.5 ml-2">
              <li>Any health decisions or outcomes resulting from using the calculator</li>
              <li>Inaccuracies or errors in the calculated results</li>
              <li>Any loss of data or technical issues while using the site</li>
              <li>Content on external websites linked from this site</li>
              <li>Any indirect, incidental, or consequential damages of any kind</li>
            </ul>
            <p>Our calculator provides <strong>general estimates only</strong>. Individual hydration needs vary based on health conditions, medications, diet, altitude, and other factors we cannot fully account for.</p>
          </Section>

          <Section icon={<Globe className="w-5 h-5 text-blue-600" />} title="6. Third-Party Links">
            <p>This website may contain links to external websites (such as Google Ads Settings or health reference resources). These links are provided for your convenience only.</p>
            <p>We have no control over the content of those websites and take no responsibility for their privacy practices, content, or accuracy. Visiting external links is entirely at your own discretion.</p>
          </Section>

          <Section icon={<Globe className="w-5 h-5 text-blue-600" />} title="7. Governing Law">
            <p>These Terms & Conditions are governed by and interpreted in accordance with general applicable laws. By using this website, you agree to resolve any disputes in good faith before pursuing legal action.</p>
            <p>If any part of these terms is found to be unenforceable, the remaining sections will continue to apply in full.</p>
          </Section>

          <Section icon={<RefreshCw className="w-5 h-5 text-blue-600" />} title="8. Changes to These Terms">
            <p>We may update these Terms & Conditions from time to time. When changes are made, we will update the "Last updated" date at the top of this page.</p>
            <p>Continued use of the website after changes are posted means you accept the revised terms. We recommend reviewing this page periodically.</p>
          </Section>

          <Section icon={<Mail className="w-5 h-5 text-blue-600" />} title="9. Contact Us">
            <p>If you have any questions or concerns about these Terms & Conditions, please reach out.</p>
            <div className="mt-2">
              <a href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-colors">
                <Mail className="w-4 h-4" /> Contact Us
              </a>
            </div>
          </Section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
