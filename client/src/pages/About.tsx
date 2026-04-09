import { useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Droplet, Target, Calculator, Heart } from "lucide-react";
import { Link } from "wouter";
import { setPageMeta } from "@/lib/seo";

export function About() {
  useEffect(() => {
    setPageMeta("about");
  }, []);
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/15 rounded-full p-3.5">
              <Droplet className="w-9 h-9 text-blue-100" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">About Hydration Calculator</h1>
          <p className="text-blue-100 text-base max-w-xl mx-auto">
            A free tool built to help everyone understand their daily water intake needs — simply, accurately, and without any sign-up.
          </p>
        </div>
      </section>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-5">

        {/* Mission */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 rounded-lg p-2 shrink-0">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Our Mission</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed">
            The Hydration Calculator was built with a single purpose: to make it easy for anyone to understand how much water they should drink each day. Staying properly hydrated is one of the simplest things you can do for your health — but knowing exactly how much to drink can be confusing. We cut through the noise with a clear, personalized recommendation based on your body and lifestyle.
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-blue-600 rounded-lg p-2 shrink-0">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">How It Works</h2>
          </div>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Our daily water intake calculator uses a science-based formula as its foundation: <strong className="text-slate-700">body weight (kg) × 0.033 liters</strong>. From there, it factors in:
          </p>
          <ul className="space-y-2 ml-1">
            {[
              "Weight (supports kg and lbs)",
              "Gender — men and women have slightly different baseline needs",
              "Age — children and older adults have adjusted requirements",
              "Activity level — from sedentary to very active",
              "Climate / weather — from mild to very hot conditions",
              "Pregnancy or breastfeeding — additional fluid needs",
              "Your goal — basic hydration, fitness, or hot weather support",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                <span className="text-blue-500 font-bold mt-0.5 shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-slate-600 text-sm leading-relaxed mt-4">
            Results are shown in liters, milliliters, glasses (250ml), and cups (240ml) — along with a suggested reminder interval to help you spread intake throughout the day.
          </p>
        </div>

        {/* Values */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-600 rounded-lg p-2 shrink-0">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">What We Stand For</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: "Free Forever", desc: "No sign-up, no subscription. The calculator will always be free to use." },
              { title: "Privacy First", desc: "Your inputs are never stored or sent anywhere. Everything runs in your browser." },
              { title: "Science-Based", desc: "Our formulas are grounded in established nutrition and health science." },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-bold text-slate-800 text-sm mb-1.5">{title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-blue-600 text-white rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold mb-2">Ready to Find Your Hydration Goal?</h2>
          <p className="text-blue-100 text-sm mb-5">Takes less than 30 seconds. No sign-up required.</p>
          <Link
            href="/calculator"
            className="inline-block px-7 py-3 bg-white text-blue-700 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors shadow-md"
          >
            Use the Free Calculator
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
