import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Send, CheckCircle, AlertCircle, User, MessageSquare, AtSign } from "lucide-react";
import { setPageMeta } from "@/lib/seo";

type Subject = "General Questions" | "Report an Issue" | "Other";

interface FormData {
  name: string;
  email: string;
  subject: Subject;
  message: string;
}

interface FieldErrors {
  name?: string;
  email?: string;
  message?: string;
}

function validate(data: FormData): FieldErrors {
  const errors: FieldErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (data.name.trim().length > 100) {
    errors.name = "Name cannot exceed 100 characters.";
  }

  if (!data.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required.";
  } else if (data.message.trim().length < 10) {
    errors.message = `Message is too short — ${10 - data.message.trim().length} more character(s) needed.`;
  } else if (data.message.trim().length > 2000) {
    errors.message = "Message cannot exceed 2000 characters.";
  }

  return errors;
}

const MAX_MESSAGE = 2000;

export function Contact() {
  useEffect(() => {
    setPageMeta("contact");
  }, []);

  const [formData, setFormData] = useState<FormData>({ name: "", email: "", subject: "General Questions", message: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) {
      setFieldErrors(validate(updated));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setFieldErrors(validate(formData));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errors = validate(formData);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setServerError("");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          subject: formData.subject,
          message: formData.message.trim(),
        }),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "General Questions", message: "" });
        setTouched({});
        setFieldErrors({});
      } else {
        const data = await response.json().catch(() => ({}));
        setServerError(data.message || "Something went wrong. Please try again.");
        setSubmitStatus("error");
      }
    } catch {
      setServerError("Unable to send your message. Please check your connection and try again.");
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const msgLength = formData.message.length;
  const msgNearLimit = msgLength > MAX_MESSAGE * 0.85;

  function fieldClass(fieldName: keyof FieldErrors) {
    const err = touched[fieldName] && fieldErrors[fieldName];
    return `w-full px-4 py-3 border-2 rounded-xl focus:outline-none text-slate-800 text-sm transition-colors placeholder:text-slate-400 ${
      err
        ? "border-red-400 focus:border-red-400 bg-red-50/30"
        : "border-slate-200 focus:border-blue-400 bg-white"
    }`;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white/15 rounded-full p-3.5">
              <Mail className="w-9 h-9 text-blue-100" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Contact Us</h1>
          <p className="text-blue-100 text-base">
            Have a question or feedback? We'd love to hear from you.
          </p>
        </div>
      </section>

      <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">

        {/* Success State */}
        {submitStatus === "success" ? (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
            <div className="flex flex-col items-center text-center px-8 py-12">
              <div className="bg-green-100 rounded-full p-5 mb-5">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Message Sent!</h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
                Thank you for reaching out. Your message has been saved and we'll get back to you as soon as possible.
              </p>
              <button
                onClick={() => setSubmitStatus("idle")}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Card Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-sky-50">
              <h2 className="text-base font-bold text-slate-800">Send us a message</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                All fields are required. We typically respond within 24–48 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5" noValidate>

              {/* Topic Selector */}
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">What's this about?</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(["General Questions", "Report an Issue", "Other"] as Subject[]).map((option) => {
                    const icons: Record<Subject, string> = {
                      "General Questions": "💬",
                      "Report an Issue": "🐛",
                      "Other": "✉️",
                    };
                    const descs: Record<Subject, string> = {
                      "General Questions": "How the calculator works",
                      "Report an Issue": "Bug or something broken",
                      "Other": "Anything else",
                    };
                    const isActive = formData.subject === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, subject: option }))}
                        className={`text-left px-3 py-3 rounded-xl border-2 transition-all ${
                          isActive
                            ? "border-blue-500 bg-blue-50"
                            : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="text-lg">{icons[option]}</span>
                        <p className={`text-xs font-bold mt-1 ${isActive ? "text-blue-700" : "text-slate-700"}`}>{option}</p>
                        <p className="text-xs text-slate-400 leading-snug mt-0.5">{descs[option]}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                  <User className="w-3.5 h-3.5 text-blue-500" /> Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Jane Smith"
                  autoComplete="name"
                  className={fieldClass("name")}
                  data-testid="input-name"
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  aria-invalid={!!fieldErrors.name}
                />
                {touched.name && fieldErrors.name && (
                  <p id="name-error" className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                  <AtSign className="w-3.5 h-3.5 text-blue-500" /> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className={fieldClass("email")}
                  data-testid="input-email"
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  aria-invalid={!!fieldErrors.email}
                />
                {touched.email && fieldErrors.email && (
                  <p id="email-error" className="flex items-center gap-1 mt-1.5 text-xs text-red-500 font-medium">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 mb-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Tell us what's on your mind... (minimum 10 characters)"
                  rows={6}
                  maxLength={MAX_MESSAGE}
                  className={`${fieldClass("message")} resize-none`}
                  data-testid="input-message"
                  aria-describedby="message-help"
                  aria-invalid={!!fieldErrors.message}
                />
                <div className="flex items-start justify-between mt-1.5 gap-2">
                  {touched.message && fieldErrors.message ? (
                    <p id="message-error" className="flex items-center gap-1 text-xs text-red-500 font-medium">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      {fieldErrors.message}
                    </p>
                  ) : (
                    <p id="message-help" className="text-xs text-slate-400">Minimum 10 characters</p>
                  )}
                  <span className={`text-xs shrink-0 tabular-nums font-medium ${msgNearLimit ? "text-amber-500" : "text-slate-400"}`}>
                    {msgLength}/{MAX_MESSAGE}
                  </span>
                </div>
              </div>

              {/* Server Error Banner */}
              {submitStatus === "error" && serverError && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{serverError}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                data-testid="button-submit"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <p className="text-center text-xs text-slate-400">
                Your message is stored securely and will never be shared with third parties.
              </p>
            </form>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
