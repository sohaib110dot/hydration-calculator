import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AlertCircle } from "lucide-react";
import { setPageMeta } from "@/lib/seo";

export function Terms() {
  useEffect(() => {
    setPageMeta("terms");
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-1">
            <AlertCircle className="w-7 h-7 text-blue-600" />
            <h1 className="text-2xl font-bold text-slate-800">Terms &amp; Disclaimer</h1>
          </div>
          <p className="text-slate-400 text-xs mb-8">Last updated: March 2026</p>

          {/* Prominent Medical Disclaimer */}
          <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-6 mb-10">
            <p className="text-amber-900 font-bold mb-2 text-sm">⚠️ Important Medical Disclaimer</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              This tool is for <strong>informational purposes only</strong>. It is <strong>not medical advice</strong>. The hydration recommendations provided are general estimates based on widely-used formulas. They should not be used as a substitute for professional medical guidance. Please consult a qualified healthcare professional before making significant changes to your fluid intake, especially if you have any underlying health conditions, take medications, or are pregnant.
            </p>
          </div>

          <div className="space-y-7 text-slate-600 text-sm leading-relaxed">
            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Use of This Tool</h2>
              <p className="">
                The Hydration Calculator is provided as a free informational resource. By using this website, you agree that:
              </p>
              <ul className="list-disc list-inside space-y-2 mt-3 ml-2">
                <li>Results are estimates, not precise medical measurements.</li>
                <li>Individual hydration needs vary and may differ from calculator outputs.</li>
                <li>You will not rely solely on this tool for medical decisions.</li>
                <li>You take full responsibility for how you use the information provided.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">No Medical Advice</h2>
              <p className="">
                Nothing on this website constitutes medical advice, diagnosis, or treatment. The Hydration Calculator and its creators are not medical professionals. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary requirement.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Accuracy of Results</h2>
              <p className="">
                While we strive to use accurate, well-established formulas, we cannot guarantee that results are appropriate for every individual. Health conditions, medications, altitude, humidity, individual metabolism, and diet all affect actual hydration needs in ways a general calculator cannot fully account for.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">User Responsibility</h2>
              <p className="">
                You are solely responsible for any decisions or actions you take based on the information provided by this calculator. We are not liable for any harm, injury, or health consequences resulting from your use of this tool.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Limitation of Liability</h2>
              <p className="">
                To the fullest extent permitted by law, Hydration Calculator and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, this website or its content.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Age Requirement</h2>
              <p className="">
                This website is intended for users aged 13 and older. By using this site, you represent that you meet this requirement.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Changes to Terms</h2>
              <p className="">
                We reserve the right to update these terms at any time. Continued use of the website after changes are posted constitutes your acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-base font-bold text-slate-800 mb-3">Contact</h2>
              <p className="">
                For questions about these terms, please <a href="/contact" className="text-blue-600 font-semibold hover:underline">contact us</a>.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
