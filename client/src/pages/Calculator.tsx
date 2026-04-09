import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Droplet, RotateCcw, Copy, Check, Clock, AlertCircle,
  ChevronDown, ChevronRight, ChevronLeft, User, Activity,
  Thermometer, Target, Baby, Scale, ArrowRight, Sparkles
} from "lucide-react";
import { setPageMeta } from "@/lib/seo";

const HYDRATION_TIPS = [
  { text: "Start your morning with a full glass of water before coffee or tea.", icon: "🌅" },
  { text: "Keep a reusable water bottle on your desk as a visual reminder.", icon: "🍶" },
  { text: "Drink a glass of water before each meal — it helps with digestion too.", icon: "🥗" },
  { text: "Set hourly phone reminders until drinking water becomes habit.", icon: "⏰" },
  { text: "Add slices of lemon, cucumber, or mint to make water more enjoyable.", icon: "🍋" },
  { text: "Drink an extra glass after every 30 minutes of exercise.", icon: "🏃" },
  { text: "Check your urine color — pale yellow means you're well-hydrated.", icon: "✅" },
  { text: "Eat water-rich foods like cucumber, watermelon, and celery.", icon: "🥒" },
  { text: "Drink more water in hot weather — your body loses fluids faster. ☀️", icon: "☀️" },
  { text: "Carry a water bottle everywhere you go — out of sight, out of mind.", icon: "💧" },
];

const CLIMATE_TIPS: Record<string, string> = {
  mild: "Mild weather — stick to your calculated intake for balanced hydration.",
  warm: "Warm weather increases sweat. Add an extra glass or two throughout the day. ☀️",
  hot: "Hot weather means more fluid loss! Drink water every 30 minutes and avoid sugary drinks. 🌡️",
  very_hot: "Extreme heat warning! Drink water frequently, stay in shade, and consider electrolytes. 🔥",
};

interface CalcResult {
  liters: number;
  ml: number;
  glasses: number;
  cups: number;
  reminderHours: number;
  tip: { text: string; icon: string };
  breakdown: { label: string; value: string }[];
}

function calcWaterIntake(
  weightVal: number, unit: string, gender: string, age: number,
  activity: string, climate: string, pregnancy: string, goal: string
): CalcResult {
  const weightKg = unit === "lbs" ? weightVal / 2.205 : weightVal;
  let base = weightKg * 0.033;
  const breakdown: { label: string; value: string }[] = [
    { label: "Base (weight × 0.033)", value: `${base.toFixed(2)}L` },
  ];

  if (gender === "female") { base -= 0.1; breakdown.push({ label: "Gender adjustment (female)", value: "−0.10L" }); }
  if (age >= 55) { base -= 0.15; breakdown.push({ label: "Age adjustment (55+)", value: "−0.15L" }); }
  else if (age <= 18) { base -= 0.1; breakdown.push({ label: "Age adjustment (under 18)", value: "−0.10L" }); }

  const activityMap: Record<string, { add: number; label: string }> = {
    low: { add: 0, label: "+0.00L" }, moderate: { add: 0.35, label: "+0.35L" },
    active: { add: 0.65, label: "+0.65L" }, very_active: { add: 1.0, label: "+1.00L" },
  };
  if (activityMap[activity]?.add > 0) {
    base += activityMap[activity].add;
    breakdown.push({ label: `Activity (${activity.replace("_", " ")})`, value: activityMap[activity].label });
  }

  const climateMap: Record<string, { add: number; label: string }> = {
    mild: { add: 0, label: "+0.00L" }, warm: { add: 0.3, label: "+0.30L" },
    hot: { add: 0.7, label: "+0.70L" }, very_hot: { add: 1.0, label: "+1.00L" },
  };
  if (climateMap[climate]?.add > 0) {
    base += climateMap[climate].add;
    breakdown.push({ label: `Climate (${climate.replace("_", " ")})`, value: climateMap[climate].label });
  }

  if (pregnancy === "pregnant") { base += 0.3; breakdown.push({ label: "Pregnancy", value: "+0.30L" }); }
  else if (pregnancy === "breastfeeding") { base += 0.7; breakdown.push({ label: "Breastfeeding", value: "+0.70L" }); }

  if (goal === "fitness") { base += 0.3; breakdown.push({ label: "Goal (fitness performance)", value: "+0.30L" }); }
  else if (goal === "hot_weather") { base += 0.5; breakdown.push({ label: "Goal (hot weather support)", value: "+0.50L" }); }

  const liters = Math.round(base * 4) / 4;
  const ml = Math.round(liters * 1000);
  const glasses = Math.ceil(liters * 4);
  const cups = Math.ceil((liters * 1000) / 240);
  const reminderHours = Math.round((16 / glasses) * 10) / 10;
  const tip = HYDRATION_TIPS[Math.floor(Math.random() * HYDRATION_TIPS.length)];
  return { liters, ml, glasses, cups, reminderHours, tip, breakdown };
}

function OptionCard({
  selected, onClick, icon, label, sublabel, testId
}: {
  selected: boolean; onClick: () => void; icon?: React.ReactNode;
  label: string; sublabel?: string; testId?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={testId}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 ${
        selected
          ? "border-blue-500 bg-blue-50 shadow-md scale-[1.01]"
          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
      }`}
    >
      {icon && (
        <span className={`shrink-0 text-xl ${selected ? "text-blue-600" : "text-slate-400"}`}>
          {icon}
        </span>
      )}
      <span className="flex-1 min-w-0">
        <span className={`block text-sm font-semibold leading-snug ${selected ? "text-blue-700" : "text-slate-700"}`}>
          {label}
        </span>
        {sublabel && (
          <span className={`block text-xs mt-0.5 ${selected ? "text-blue-500" : "text-slate-400"}`}>
            {sublabel}
          </span>
        )}
      </span>
      <span className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
        selected ? "border-blue-500 bg-blue-500" : "border-slate-300"
      }`}>
        {selected && <span className="w-2 h-2 rounded-full bg-white block" />}
      </span>
    </button>
  );
}

function StepIndicator({ current, total }: { current: number; total: number }) {
  const steps = [
    { label: "Body Info", icon: <User className="w-4 h-4" /> },
    { label: "Lifestyle", icon: <Activity className="w-4 h-4" /> },
    { label: "Results", icon: <Droplet className="w-4 h-4" /> },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => {
        const stepNum = i + 1;
        const isDone = stepNum < current;
        const isActive = stepNum === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                isDone ? "bg-blue-600 text-white shadow-md" :
                isActive ? "bg-blue-600 text-white ring-4 ring-blue-100 shadow-md" :
                "bg-slate-200 text-slate-500"
              }`}>
                {isDone ? <Check className="w-4 h-4" /> : step.icon}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${
                isActive ? "text-blue-600" : isDone ? "text-blue-500" : "text-slate-400"
              }`}>{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-12 sm:w-20 h-1 mx-1 sm:mx-2 mb-4 sm:mb-3 rounded-full transition-all duration-500 ${
                stepNum < current ? "bg-blue-500" : "bg-slate-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function WaterGauge({ liters, maxLiters = 5 }: { liters: number; maxLiters?: number }) {
  const pct = Math.min((liters / maxLiters) * 100, 100);
  const color = pct < 40 ? "#60a5fa" : pct < 70 ? "#3b82f6" : "#1d4ed8";
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <div className="relative w-20 h-32 sm:w-24 sm:h-40">
        <svg viewBox="0 0 80 130" className="w-full h-full drop-shadow-lg" aria-hidden>
          <defs>
            <clipPath id="bottleClip">
              <path d="M26,8 L54,8 L60,22 L66,30 L66,118 Q66,124 60,124 L20,124 Q14,124 14,118 L14,30 L20,22 Z" />
            </clipPath>
          </defs>
          <path d="M26,8 L54,8 L60,22 L66,30 L66,118 Q66,124 60,124 L20,124 Q14,124 14,118 L14,30 L20,22 Z"
            fill="white" stroke="#cbd5e1" strokeWidth="2" />
          <rect x="14" y={124 - (94 * pct / 100)} width="52" height={94 * pct / 100}
            fill={color} clipPath="url(#bottleClip)" opacity="0.9">
            <animate attributeName="y" from="124" to={124 - (94 * pct / 100)} dur="1.2s" fill="freeze" />
            <animate attributeName="height" from="0" to={94 * pct / 100} dur="1.2s" fill="freeze" />
          </rect>
          <path d="M14,70 Q27,65 40,70 Q53,75 66,70" fill="none" stroke="white" strokeWidth="2" opacity="0.6" />
          <path d="M26,8 L54,8 L60,22 L66,30 L66,118 Q66,124 60,124 L20,124 Q14,124 14,118 L14,30 L20,22 Z"
            fill="none" stroke="#94a3b8" strokeWidth="2" />
          <rect x="28" y="2" width="24" height="8" rx="2" fill="#94a3b8" />
        </svg>
      </div>
      <span className="text-xs text-blue-100 font-semibold bg-white/20 px-2 py-0.5 rounded-full">
        {Math.round(pct)}% of max
      </span>
    </div>
  );
}

function GlassIcons({ glasses }: { glasses: number }) {
  const show = Math.min(glasses, 16);
  return (
    <div className="flex flex-wrap gap-1.5 justify-center mt-1">
      {Array.from({ length: show }).map((_, i) => (
        <span key={i} className="text-xl leading-none" title="1 glass (250ml)">🥛</span>
      ))}
      {glasses > 16 && (
        <span className="text-xs text-blue-400 self-center font-semibold">+{glasses - 16} more</span>
      )}
    </div>
  );
}

function ProgressBar({ liters, maxLiters = 5 }: { liters: number; maxLiters?: number }) {
  const pct = Math.min((liters / maxLiters) * 100, 100);
  const color = pct < 40 ? "from-sky-400 to-blue-400" : pct < 70 ? "from-blue-500 to-blue-600" : "from-blue-600 to-indigo-600";
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-blue-200 mb-1.5 font-medium">
        <span>0L</span>
        <span>{liters}L daily goal</span>
        <span>{maxLiters}L max</span>
      </div>
      <div className="h-3 bg-white/20 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function Calculator() {
  useEffect(() => { setPageMeta("calculator"); }, []);

  const [step, setStep] = useState(1);
  const [weightVal, setWeightVal] = useState(70);
  const [unit, setUnit] = useState("kg");
  const [gender, setGender] = useState("male");
  const [age, setAge] = useState(30);
  const [activity, setActivity] = useState("moderate");
  const [climate, setClimate] = useState("mild");
  const [pregnancy, setPregnancy] = useState("none");
  const [goal, setGoal] = useState("basic");
  const [result, setResult] = useState<CalcResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [calcAnimating, setCalcAnimating] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const topRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const goToStep = (n: number) => { setStep(n); scrollToTop(); };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    const min = unit === "kg" ? 20 : 44;
    const max = unit === "kg" ? 250 : 550;
    if (!weightVal || weightVal < min || weightVal > max) {
      errs.weight = `Please enter a valid weight (${min}–${max} ${unit})`;
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNextStep1 = () => {
    if (validateStep1()) goToStep(2);
  };

  const handleCalculate = () => {
    setCalcAnimating(true);
    setTimeout(() => {
      const r = calcWaterIntake(weightVal, unit, gender, age, activity, climate, pregnancy, goal);
      setResult(r);
      setStep(3);
      scrollToTop();
      setCalcAnimating(false);
    }, 600);
  };

  const handleReset = () => {
    setWeightVal(70); setUnit("kg"); setGender("male"); setAge(30);
    setActivity("moderate"); setClimate("mild"); setPregnancy("none"); setGoal("basic");
    setResult(null); setShowBreakdown(false); setStep(1); setErrors({}); scrollToTop();
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(
      `My daily hydration goal: ${result.liters}L (${result.ml}ml) — about ${result.glasses} glasses per day. Reminder every ${result.reminderHours} hours.`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <Navbar />
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-white/15 rounded-full p-4 shadow-lg">
              <Droplet className="w-10 h-10 text-blue-100" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 leading-tight">
            Hydration Calculator
          </h1>
          <p className="text-blue-100 text-base sm:text-lg max-w-lg mx-auto">
            Answer a few questions and get your personalized daily water intake in seconds.
          </p>
        </div>
      </section>
      {/* Ad Banner */}
      <div className="bg-slate-50 border-b border-slate-200 py-2 px-4 text-center">
        <p className="text-slate-400 text-xs uppercase tracking-widest">Advertisement</p>
        <div className="min-h-[50px] flex items-center justify-center max-w-4xl mx-auto" id="ad-banner-top">
          <p className="text-slate-300 text-xs">[Google AdSense — 728×90 Leaderboard]</p>
        </div>
      </div>
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 text-[25px]" ref={topRef}>

        {/* Step Indicator */}
        <StepIndicator current={step} total={3} />

        {/* ── Step 1: Body Info ── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2.5">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Step 1: Body Information</h2>
                  <p className="text-blue-100 text-sm mt-0.5">Tell us about your body to personalise your results.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-7 space-y-7">
              {/* Weight */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-500" /> Body Weight
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={unit === "kg" ? 20 : 44}
                    max={unit === "kg" ? 250 : 550}
                    value={weightVal}
                    onChange={(e) => { setWeightVal(Number(e.target.value)); setErrors({}); }}
                    data-testid="input-weight"
                    className={`flex-1 px-4 py-3.5 border-2 rounded-xl focus:outline-none text-slate-800 text-lg font-bold transition-colors ${
                      errors.weight ? "border-red-400 bg-red-50 focus:border-red-500" : "border-slate-200 focus:border-blue-500"
                    }`}
                    placeholder={`Enter weight in ${unit}`}
                  />
                  <div className="flex rounded-xl border-2 border-slate-200 overflow-hidden">
                    {["kg", "lbs"].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => {
                          if (u !== unit) {
                            setUnit(u);
                            setWeightVal(u === "lbs"
                              ? Math.round(weightVal * 2.205)
                              : Math.round(weightVal / 2.205));
                          }
                        }}
                        className={`px-5 py-3.5 text-sm font-bold transition-all ${
                          unit === u ? "bg-blue-600 text-white" : "bg-white text-slate-500 hover:bg-slate-50"
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                {errors.weight && (
                  <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {errors.weight}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" /> Gender
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <OptionCard
                    selected={gender === "male"}
                    onClick={() => setGender("male")}
                    icon={<span>👨</span>}
                    label="Male"
                    sublabel="Standard male hydration"
                    testId="select-gender-male"
                  />
                  <OptionCard
                    selected={gender === "female"}
                    onClick={() => setGender("female")}
                    icon={<span>👩</span>}
                    label="Female"
                    sublabel="Adjusted for women"
                    testId="select-gender-female"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-500" />
                  Age
                  <span className="ml-auto text-blue-600 font-bold text-lg bg-blue-50 px-3 py-0.5 rounded-lg">{age} years</span>
                </label>
                <div className="px-1">
                  <input
                    type="range" min={5} max={90} step={1} value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    data-testid="input-age"
                    className="w-full h-2.5 accent-blue-600 cursor-pointer rounded-full"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 px-0.5">
                    <span>5</span>
                    <span>Under 18</span>
                    <span>Adult</span>
                    <span>55+</span>
                    <span>90</span>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  {[
                    { label: "Teen", range: "5–17", val: 15, icon: "🧒" },
                    { label: "Adult", range: "18–54", val: 30, icon: "🧑" },
                    { label: "Senior", range: "55+", val: 60, icon: "👴" },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setAge(preset.val)}
                      className={`flex-1 px-2 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                        age === preset.val
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
                          : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50/50"
                      }`}
                    >
                      <span className="block text-base mb-0.5">{preset.icon}</span>
                      {preset.label}
                      <span className="block text-slate-400 font-normal text-xs">{preset.range}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={handleNextStep1}
                data-testid="button-next-step1"
                className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 active:scale-95 transition-all shadow-md hover:shadow-lg"
              >
                Next: Lifestyle <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Lifestyle ── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 rounded-xl p-2.5">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Step 2: Lifestyle & Environment</h2>
                  <p className="text-blue-100 text-sm mt-0.5">Your habits and environment affect how much water you need.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-7 space-y-7">
              {/* Activity Level */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" /> Activity Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { val: "low", label: "Sedentary", sublabel: "Desk job, little movement", icon: "🪑" },
                    { val: "moderate", label: "Moderate", sublabel: "Light exercise 1–3×/week", icon: "🚶" },
                    { val: "active", label: "Active", sublabel: "Exercise 4–5×/week", icon: "🏃" },
                    { val: "very_active", label: "Very Active", sublabel: "Daily intense training", icon: "⚡" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.val}
                      selected={activity === opt.val}
                      onClick={() => setActivity(opt.val)}
                      icon={<span>{opt.icon}</span>}
                      label={opt.label}
                      sublabel={opt.sublabel}
                      testId={`select-activity-${opt.val}`}
                    />
                  ))}
                </div>
              </div>

              {/* Climate */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-blue-500" /> Climate / Weather
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { val: "mild", label: "Mild", icon: "🌤️", sub: "Under 20°C" },
                    { val: "warm", label: "Warm", icon: "☀️", sub: "20–28°C" },
                    { val: "hot", label: "Hot", icon: "🌡️", sub: "28–35°C" },
                    { val: "very_hot", label: "Very Hot", icon: "🔥", sub: "35°C+" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setClimate(opt.val)}
                      data-testid={`select-climate-${opt.val}`}
                      className={`flex flex-col items-center justify-center gap-1.5 py-4 px-2 rounded-xl border-2 transition-all text-sm font-bold ${
                        climate === opt.val
                          ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md scale-[1.02]"
                          : "border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50/40"
                      }`}
                    >
                      <span className="text-3xl leading-none">{opt.icon}</span>
                      <span className="text-xs font-bold">{opt.label}</span>
                      <span className="text-xs text-slate-400 font-normal">{opt.sub}</span>
                    </button>
                  ))}
                </div>
                {/* Climate tip */}
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
                  <span className="text-base shrink-0">💡</span>
                  <span>{CLIMATE_TIPS[climate]}</span>
                </div>
              </div>

              {/* Pregnancy */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <Baby className="w-4 h-4 text-blue-500" /> Pregnancy / Breastfeeding
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { val: "none", label: "Not applicable", icon: "✗" },
                    { val: "pregnant", label: "Pregnant", icon: "🤰" },
                    { val: "breastfeeding", label: "Breastfeeding", icon: "🍼" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.val}
                      selected={pregnancy === opt.val}
                      onClick={() => setPregnancy(opt.val)}
                      icon={<span>{opt.icon}</span>}
                      label={opt.label}
                      testId={`select-pregnancy-${opt.val}`}
                    />
                  ))}
                </div>
              </div>

              {/* Goal */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2.5 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-500" /> Hydration Goal
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {[
                    { val: "basic", label: "Basic Hydration", sublabel: "Stay healthy & functional", icon: "💧" },
                    { val: "fitness", label: "Fitness Performance", sublabel: "Support training & recovery", icon: "🏋️" },
                    { val: "hot_weather", label: "Hot Weather", sublabel: "Compensate for sweat loss", icon: "🏜️" },
                  ].map((opt) => (
                    <OptionCard
                      key={opt.val}
                      selected={goal === opt.val}
                      onClick={() => setGoal(opt.val)}
                      icon={<span>{opt.icon}</span>}
                      label={opt.label}
                      sublabel={opt.sublabel}
                      testId={`select-goal-${opt.val}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-5 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-100 flex justify-between items-center gap-3">
              <button
                type="button"
                onClick={() => goToStep(1)}
                className="flex items-center gap-2 px-5 py-3 text-slate-600 bg-white border-2 border-slate-200 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all hover:border-slate-300"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={handleCalculate}
                data-testid="button-calculate"
                disabled={calcAnimating}
                className={`flex items-center gap-2.5 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl ${
                  calcAnimating ? "opacity-80 scale-95" : "active:scale-95 hover:scale-[1.02]"
                }`}
              >
                {calcAnimating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Calculate Water Intake
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === 3 && result && (
          <div className="space-y-5">

            {/* Main Results Card */}
            <div className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 px-6 py-7">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-5">
                  <div className="text-center sm:text-left flex-1">
                    <p className="text-blue-200 text-sm font-semibold uppercase tracking-wide mb-2">
                      Your daily water intake goal
                    </p>
                    <p className="text-white text-6xl font-bold tracking-tight leading-none mb-1">
                      {result.liters}L
                    </p>
                    <p className="text-blue-100 text-xl font-semibold mt-2">
                      You should drink <strong className="text-white">{result.liters} Liters</strong> per day
                    </p>
                    <p className="text-blue-200 text-base mt-1">{result.ml.toLocaleString()} ml daily</p>
                    <div className="mt-5 max-w-xs">
                      <ProgressBar liters={result.liters} maxLiters={5} />
                    </div>
                  </div>
                  <WaterGauge liters={result.liters} maxLiters={5} />
                </div>
              </div>

              {/* Metric tiles */}
              <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                {[
                  { label: "Glasses", value: result.glasses, sub: "× 250ml", icon: "🥛" },
                  { label: "Cups", value: result.cups, sub: "× 240ml", icon: "☕" },
                  { label: "Milliliters", value: result.ml.toLocaleString(), sub: "total", icon: "💧" },
                ].map((m, i) => (
                  <div key={i} className="px-4 py-5 text-center">
                    <span className="text-2xl">{m.icon}</span>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-700 mt-1">{m.value}</p>
                    <p className="text-xs font-bold text-slate-600 mt-0.5">{m.label}</p>
                    <p className="text-xs text-slate-400">{m.sub}</p>
                  </div>
                ))}
              </div>

              {/* Glass Icons Visual */}
              <div className="px-5 py-5 border-b border-slate-100 text-center">
                <p className="text-sm font-bold text-slate-700 mb-3">
                  That's <span className="text-blue-600">{result.glasses} glasses</span> of water per day
                </p>
                <GlassIcons glasses={result.glasses} />
              </div>

              {/* Reminder bar */}
              <div className="flex items-center gap-4 px-5 py-4 bg-gradient-to-r from-blue-50 to-sky-50 border-b border-slate-100">
                <div className="bg-blue-600 rounded-xl p-2.5 shrink-0 shadow-sm">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Drink reminder schedule</p>
                  <p className="text-sm text-slate-600 mt-0.5">
                    One glass every <strong className="text-blue-700">{result.reminderHours} hours</strong> during your waking hours
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 px-5 py-4">
                <button
                  onClick={handleCopy}
                  data-testid="button-copy"
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm active:scale-95"
                >
                  {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Results"}
                </button>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-all font-bold text-sm active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" /> Start Over
                </button>
                <button
                  onClick={() => goToStep(2)}
                  className="flex items-center gap-2 px-4 py-2.5 text-blue-600 border-2 border-blue-200 rounded-xl hover:bg-blue-50 transition-all font-bold text-sm ml-auto active:scale-95"
                >
                  Edit Inputs
                </button>
              </div>
            </div>

            {/* Hydration Tip */}
            <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-200 rounded-2xl p-5 flex gap-4 shadow-sm" data-testid="result-tip">
              <div className="text-3xl shrink-0 self-start">{result.tip.icon}</div>
              <div>
                <p className="text-sm font-bold text-blue-800 mb-1.5 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Hydration Tip
                </p>
                <p className="text-sm text-slate-700 leading-relaxed">{result.tip.text}</p>
              </div>
            </div>

            {/* Extra Tips */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <span className="text-base">💡</span> More Hydration Tips
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { tip: "Drink more water in hot weather ☀️", icon: "🌞" },
                  { tip: "Water before meals reduces overeating", icon: "🥗" },
                  { tip: "Caffeinated drinks don't fully count as hydration", icon: "☕" },
                  { tip: "Thirst means you're already slightly dehydrated", icon: "⚠️" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2.5 bg-slate-50 rounded-xl px-3 py-2.5">
                    <span className="text-base shrink-0">{t.icon}</span>
                    <span className="text-xs text-slate-700 font-medium leading-relaxed">{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculation Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform duration-200 ${showBreakdown ? "rotate-180" : ""}`} />
                  How is this calculated?
                </span>
                <span className="text-xs text-slate-400 font-normal">{result.breakdown.length} factors</span>
              </button>
              {showBreakdown && (
                <div className="border-t border-slate-100">
                  <ul className="divide-y divide-slate-50">
                    {result.breakdown.map((b, i) => (
                      <li key={i} className="flex justify-between items-center px-6 py-3 text-sm">
                        <span className="text-slate-600">{b.label}</span>
                        <span className={`font-bold ${b.value.startsWith("−") ? "text-rose-500" : b.value.startsWith("+") ? "text-emerald-600" : "text-blue-700"}`}>{b.value}</span>
                      </li>
                    ))}
                    <li className="flex justify-between items-center px-6 py-3 text-sm bg-blue-50">
                      <span className="font-bold text-slate-800">Total (rounded to nearest 0.25L)</span>
                      <span className="font-bold text-blue-700 text-base">{result.liters}L</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* Disclaimer */}
            <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3.5">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Not medical advice.</strong> Results are general estimates based on established hydration formulas. Individual needs vary — consult a healthcare professional for personalised guidance.
              </p>
            </div>

            {/* In-content Ad */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl py-3 text-center">
              <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Advertisement</p>
              <div className="min-h-[180px] flex items-center justify-center" id="ad-in-content">
                <p className="text-slate-300 text-xs">[Google AdSense — 300×250 In-Content]</p>
              </div>
            </div>
          </div>
        )}

        {/* ── FAQ Section ── */}
        <section className="mt-14" aria-label="Frequently Asked Questions">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-800 mb-6">
            Common Questions
          </h2>
          <div className="space-y-2">
            {[
              {
                q: "How much water should I drink per day?",
                a: "Most adults need between 2 and 3.5 liters of water per day. The exact amount depends on your weight, activity level, climate, and individual health. Our calculator gives you a personalised estimate.",
              },
              {
                q: "How is daily water intake calculated?",
                a: "We start with body weight (kg) × 0.033 liters as a base, then adjust for activity level, climate, gender, age, pregnancy status, and your hydration goal.",
              },
              {
                q: "Does activity level affect hydration needs?",
                a: "Yes. Physical activity significantly increases sweat production. Very active individuals may need up to 1 extra liter per day vs someone sedentary of the same weight.",
              },
              {
                q: "Does hot weather increase water needs?",
                a: "Absolutely. In hot or humid climates your body sweats more, increasing fluid loss by up to 1 liter or more per day depending on heat intensity.",
              },
              {
                q: "How many glasses should I drink daily?",
                a: "Based on a standard 250ml glass, most adults need 8–14 glasses per day. Your exact count is shown in your results after calculating.",
              },
              {
                q: "Is this calculator accurate?",
                a: "It provides a reliable evidence-based estimate. Individual needs vary due to health conditions, diet, and medications — always consult a doctor for medical guidance.",
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between px-4 py-4 sm:px-5 cursor-pointer font-bold text-slate-700 hover:text-blue-600 transition-colors list-none gap-3">
                  <span className="font-bold text-base sm:text-xl md:text-[30px] leading-snug">{q}</span>
                  <ChevronDown className="w-5 h-5 text-blue-400 shrink-0 group-open:rotate-180 transition-transform duration-200" />
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Bottom Ad */}
        <div className="mt-10 bg-slate-50 border border-slate-200 rounded-xl py-3 text-center">
          <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Advertisement</p>
          <div className="min-h-[90px] flex items-center justify-center" id="ad-calculator-bottom">
            <p className="text-slate-300 text-xs">[Google AdSense — 728×90]</p>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
