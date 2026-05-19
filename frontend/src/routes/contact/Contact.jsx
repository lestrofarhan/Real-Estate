import "./contact.scss";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

export default function Contact() {
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.target);
    const payload = Object.fromEntries(form.entries());
    try {
      await apiRequest.post("/contact", payload);
      setStatus({ ok: true, msg: "Message sent — we'll get back to you soon." });
      e.target.reset();
    } catch (err) {
      console.error(err);
      setStatus({ ok: false, msg: err?.response?.data?.message || "Send failed" });
    }
  };

  return (
    <div className="contactPage">
      <div className="wrapper">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit} className="contactForm">
          <input name="name" placeholder="Your name" required />
          <input name="email" type="email" placeholder="Your email" required />
          <input name="subject" placeholder="Subject" />
          <textarea name="message" placeholder="Your message" required />
          <button type="submit">Send Message</button>
        </form>
        {status && (
          <div className={status.ok ? "success" : "error"}>{status.msg}</div>
        )}
      </div>
    </div>
  );
}
