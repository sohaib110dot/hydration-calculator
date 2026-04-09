import { useEffect } from "react";
import { Link } from "wouter";
import { Droplet, Activity, Thermometer, Dumbbell, Smartphone, Calculator, CheckCircle, Zap, Brain, Heart } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { setPageMeta } from "@/lib/seo";

export function Home() {
  useEffect(() => {
    setPageMeta("home");
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-7">
            <div className="bg-white/10 rounded-full p-5">
              <Droplet className="w-14 h-14 text-blue-200" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-5 leading-tight">
            Hydration Calculator —<br className="hidden md:block" /> Calculate Your Daily Water Intake
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Find out how much water you need each day based on your body, lifestyle, and environment. Free, easy, and accurate.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm text-blue-200">
            {["Simple to use", "Free hydration calculator", "Mobile friendly", "Fast results"].map((b) => (
              <span key={b} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-blue-300" /> {b}
              </span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculator"
              data-testid="button-calculate-now"
              className="px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
            >
              Calculate Now
            </Link>
            <a
              href="#features"
              data-testid="button-learn-more"
              className="px-8 py-3.5 bg-blue-800/50 text-white border-2 border-blue-400 rounded-xl font-bold text-base hover:bg-blue-800 transition-colors"
            >
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-2 px-4 text-center">
        <p className="text-slate-400 text-xs uppercase tracking-wide">Advertisement</p>
        <div className="min-h-[60px] flex items-center justify-center max-w-5xl mx-auto" id="ad-home-top">
          <p className="text-slate-300 text-xs">[Google AdSense — 728×90 Leaderboard]</p>
        </div>
      </div>

      {/* ── Features ── */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
              Everything You Need to Stay Hydrated
            </h2>
            <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto">
              Our free water intake calculator adapts to your lifestyle so you always know exactly how much to drink.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Calculator className="w-7 h-7 text-blue-600" />,
                title: "Daily Water Intake Calculation",
                desc: "Get an accurate daily water intake recommendation based on your body weight using established hydration formulas.",
              },
              {
                icon: <Droplet className="w-7 h-7 text-blue-600" />,
                title: "Weight-Based Estimation",
                desc: "Supports both kg and lbs. Our water intake by weight formula adjusts your hydration needs precisely.",
              },
              {
                icon: <Thermometer className="w-7 h-7 text-blue-600" />,
                title: "Climate Adjustment",
                desc: "Hot weather increases sweat loss. We factor in your local climate for more accurate hydration needs.",
              },
              {
                icon: <Activity className="w-7 h-7 text-blue-600" />,
                title: "Activity-Based Water Needs",
                desc: "Whether you're sedentary or very active, your water requirement calculator adapts to your fitness level.",
              },
              {
                icon: <Dumbbell className="w-7 h-7 text-blue-600" />,
                title: "Easy Glass Conversion",
                desc: "Results shown in liters, milliliters, glasses, and cups so you can track your intake any way you prefer.",
              },
              {
                icon: <Smartphone className="w-7 h-7 text-blue-600" />,
                title: "Mobile-Friendly Hydration Tool",
                desc: "Designed to work beautifully on phones, tablets, and desktops. Calculate anywhere, anytime for free.",
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all"
              >
                <div className="bg-blue-50 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Why Proper Hydration Matters
            </h2>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              Drinking enough water daily has a remarkable impact on how you feel, think, and perform.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              {
                icon: <Zap className="w-8 h-8 text-yellow-500" />,
                title: "Better Energy",
                desc: "Even mild dehydration causes fatigue. Staying hydrated keeps your energy levels steady throughout the day.",
                bg: "bg-yellow-50 border-yellow-100",
              },
              {
                icon: <Brain className="w-8 h-8 text-purple-500" />,
                title: "Better Focus",
                desc: "Water is essential for brain function. Proper hydration improves concentration, memory, and mood.",
                bg: "bg-purple-50 border-purple-100",
              },
              {
                icon: <Dumbbell className="w-8 h-8 text-blue-500" />,
                title: "Workout Support",
                desc: "Muscles need water to perform. Hydrating before, during, and after exercise improves strength and recovery.",
                bg: "bg-blue-50 border-blue-100",
              },
              {
                icon: <Heart className="w-8 h-8 text-rose-500" />,
                title: "Daily Wellness",
                desc: "From digestion to skin health, adequate daily water intake supports nearly every function in your body.",
                bg: "bg-rose-50 border-rose-100",
              },
            ].map((b, i) => (
              <div key={i} className={`rounded-xl p-5 border ${b.bg}`}>
                <div className="mb-4">{b.icon}</div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{b.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* In-content ad */}
      <div className="bg-slate-50 border-y border-slate-200 py-2 px-4 text-center">
        <p className="text-slate-400 text-xs uppercase tracking-wide">Advertisement</p>
        <div className="min-h-[200px] flex items-center justify-center max-w-5xl mx-auto" id="ad-home-mid">
          <p className="text-slate-300 text-xs">[Google AdSense — 300×250 In-Content]</p>
        </div>
      </div>

      {/* ── FAQ ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3">
              Common Hydration Questions
            </h2>
            <p className="text-base text-slate-600">
              Everything you need to know about daily water needs and how to use our hydration calculator.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "How much water should I drink per day?",
                a: "Most healthy adults need between 2 and 3.5 liters of water daily. The exact amount depends on your weight, activity level, climate, and personal health. Use our free hydration calculator above to get a personalized recommendation.",
              },
              {
                q: "How is daily water intake calculated?",
                a: "The standard formula multiplies your body weight (in kg) by 0.033 to estimate your base daily water needs in liters. From there, adjustments are made for activity, climate, gender, age, and special conditions like pregnancy.",
              },
              {
                q: "Does activity level affect hydration needs?",
                a: "Yes. Physical activity increases sweat production and fluid loss. Someone who exercises heavily may need up to 1 extra liter of water per day compared to a sedentary person of the same weight.",
              },
              {
                q: "Does hot weather increase water needs?",
                a: "Absolutely. In hot or humid climates, your body sweats more to regulate temperature. This increases your daily water requirement by up to 1 liter or more, depending on heat intensity.",
              },
              {
                q: "How many glasses of water should I drink daily?",
                a: "Based on a standard 250ml glass, most adults need 8–14 glasses per day. Our calculator will show you your exact number of glasses, cups, milliliters, and liters based on your specific data.",
              },
              {
                q: "Is this hydration calculator accurate?",
                a: "It provides a reliable estimate based on well-established formulas used in nutrition and health science. Results are general guidelines, not medical prescriptions. For specific medical needs, please consult a healthcare provider.",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer font-semibold text-base text-slate-700 hover:text-blue-600 transition-colors list-none">
                  {q}
                  <span className="ml-4 shrink-0 text-blue-500 group-open:rotate-180 transition-transform text-xl">▾</span>
                </summary>
                <div className="px-6 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── About / CTA ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About This Hydration Tool</h2>
          <p className="text-base md:text-lg text-blue-100 leading-relaxed mb-4">
            The Hydration Calculator is a free online tool designed to help everyday people understand their daily water intake needs. We built it to be simple, accurate, and accessible — no sign-up, no subscription, no hassle.
          </p>
          <p className="text-base text-blue-100 leading-relaxed mb-8">
            Proper hydration supports energy, focus, physical performance, and long-term wellness. Our calculator factors in your weight, activity, climate, age, and goals to give you a personalized number you can actually act on.
          </p>
          <Link
            href="/calculator"
            data-testid="button-try-calculator"
            className="inline-block px-8 py-3.5 bg-white text-blue-700 rounded-xl font-bold text-base hover:bg-blue-50 transition-colors shadow-lg"
          >
            Try the Free Calculator
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
