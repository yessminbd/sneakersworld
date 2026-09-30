import { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "react-toastify";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Your message has been sent!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-1">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
          className="w-full px-4 py-3 rounded-xl bg-gray-10 text-sm text-primary outline-none focus:ring-2 focus:ring-tertiary transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-4 py-3 rounded-xl bg-gray-10 text-sm text-primary outline-none focus:ring-2 focus:ring-tertiary transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-primary mb-1">
          Message
        </label>
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Your message..."
          rows={5}
          className="w-full px-4 py-3 rounded-xl bg-gray-10 text-sm text-primary outline-none focus:ring-2 focus:ring-tertiary transition resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-primary text-primaryLight font-medium hover:bg-tertiary transition"
      >
        Send
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}