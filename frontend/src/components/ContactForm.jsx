import { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { useLang } from "../context/LangContext";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" }; // "website" = champ anti-spam (honeypot)

/**
 * Props :
 *  - onSubmit(data) : fonction async qui envoie le message (throw en cas d'erreur).
 *    Si absente, on appelle POST {VITE_BACKEND_URL}/api/contact.
 */
export default function ContactForm({ onSubmit }) {
  const { t } = useLang();
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  const setField = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
    if (status !== "idle" && status !== "sending") setStatus("idle");
  };

  const validate = () => {
    const er = {};
    if (!form.name.trim()) er.name = t.fieldRequired;
    if (!form.email.trim()) er.email = t.fieldRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) er.email = t.invalidEmail;
    if (!form.message.trim()) er.message = t.fieldRequired;
    else if (form.message.trim().length < 10) er.message = t.messageTooShort;
    return er;
  };

  const defaultSend = async (data) => {
    const base = import.meta.env?.VITE_BACKEND_URL || "";
    const res = await fetch(`${base}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Request failed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;

    // Un robot remplit le champ caché : on fait semblant de réussir
    if (form.website) {
      setStatus("success");
      setForm(EMPTY);
      return;
    }

    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) return;

    setStatus("sending");
    try {
      const { website, ...data } = form;
      await (onSubmit || defaultSend)({
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      });
      setStatus("success");
      setForm(EMPTY);
    } catch {
      setStatus("error");
    }
  };

  const base =
    "w-full rounded-xl border bg-white px-4 py-3 text-sm text-primary placeholder:text-gray-30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-tertiary/40 focus:border-tertiary";
  const border = (key) => (errors[key] ? "border-red-400" : "border-gray-20");

  const Field = ({ id, label, children }) => (
    <div className="text-start">
      <label htmlFor={id} className="block mb-1.5 text-xs font-bold text-primary">
        {label}
      </label>
      {children}
      {errors[id] && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-2xl mx-auto bg-white rounded-3xl border border-gray-10 shadow-xl shadow-primary/5 p-6 sm:p-10 flex flex-col gap-5"
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field id="name" label={t.fullName}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={setField}
            placeholder={t.namePlaceholder}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={`${base} ${border("name")}`}
          />
        </Field>

        <Field id="email" label={t.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            dir="ltr"
            value={form.email}
            onChange={setField}
            placeholder={t.emailPlaceholder}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={`${base} ${border("email")} text-start`}
          />
        </Field>
      </div>

      <Field id="subject" label={t.subject}>
        <input
          id="subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={setField}
          placeholder={t.subjectPlaceholder}
          className={`${base} ${border("subject")}`}
        />
      </Field>

      <Field id="message" label={t.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={setField}
          placeholder={t.messagePlaceholder}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={`${base} ${border("message")} resize-y min-h-32`}
        />
      </Field>

      {/* Honeypot : invisible pour les humains */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={setField}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute opacity-0 pointer-events-none h-0 w-0"
      />

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-tertiary hover:shadow-lg active:scale-[.98] disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {status === "sending" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            {t.sending}
          </>
        ) : (
          <>
            {t.sendMessage}
            <Send className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:-scale-x-100 rtl:group-hover:-translate-x-1" />
          </>
        )}
      </button>

      <div aria-live="polite">
        {status === "success" && (
          <p className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {t.messageSent}
          </p>
        )}
        {status === "error" && (
          <p className="flex items-center justify-center gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-600">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {t.messageError}
          </p>
        )}
      </div>
    </form>
  );
}