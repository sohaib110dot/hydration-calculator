export interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
}

export const pages: Record<string, PageMeta> = {
  home: {
    title: "Hydration Calculator – Calculate Your Daily Water Intake | Free Tool",
    description: "Free hydration calculator to find your daily water intake needs based on weight, activity, climate, age, and gender. Easy, fast, and accurate.",
    canonical: "https://hydrationcalculator.replit.app/",
  },
  calculator: {
    title: "Water Intake Calculator – Personalized Daily Hydration Goals",
    description: "Calculate your daily water intake in seconds. Our hydration calculator considers your weight, activity level, climate, age, and goals to provide accurate hydration recommendations.",
    canonical: "https://hydrationcalculator.replit.app/calculator",
  },
  about: {
    title: "About Hydration Calculator – Free Water Intake Tool",
    description: "Learn how our hydration calculator works, the science behind water intake formulas, and why proper hydration matters for your health and wellness.",
    canonical: "https://hydrationcalculator.replit.app/about",
  },
  contact: {
    title: "Contact Us – Hydration Calculator Support",
    description: "Have questions or feedback? Contact the Hydration Calculator team. We're here to help with any inquiries about our free water intake calculator.",
    canonical: "https://hydrationcalculator.replit.app/contact",
  },
  privacy: {
    title: "Privacy Policy – Hydration Calculator",
    description: "Read our privacy policy to understand how we protect your data. The Hydration Calculator runs entirely in your browser—your data stays private.",
    canonical: "https://hydrationcalculator.replit.app/privacy",
  },
  terms: {
    title: "Terms & Disclaimer – Hydration Calculator",
    description: "Read our terms of service and medical disclaimer. Results are estimates only and not a substitute for professional medical advice.",
    canonical: "https://hydrationcalculator.replit.app/terms",
  },
};

export function setPageMeta(page: keyof typeof pages) {
  const meta = pages[page];
  
  // Set title
  document.title = meta.title;
  
  // Set/update meta description
  let descMeta = document.querySelector('meta[name="description"]');
  if (!descMeta) {
    descMeta = document.createElement("meta");
    descMeta.setAttribute("name", "description");
    document.head.appendChild(descMeta);
  }
  descMeta.setAttribute("content", meta.description);
  
  // Set canonical URL
  if (meta.canonical) {
    let canonicalMeta = document.querySelector('link[rel="canonical"]');
    if (!canonicalMeta) {
      canonicalMeta = document.createElement("link");
      canonicalMeta.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalMeta);
    }
    canonicalMeta.setAttribute("href", meta.canonical);
  }
}
