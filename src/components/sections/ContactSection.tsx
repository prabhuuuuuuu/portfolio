"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, stagger, viewportOnce } from "@/lib/motion";
import { socials } from "@/lib/portfolio-data";
import { Magnetic } from "@/components/motion/Magnetic";

export function ContactSection() {
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactMessage, setContactMessage] = useState("");

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    setContactStatus("sending");
    setContactMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          message: formData.get("message"),
          company: formData.get("company"),
        }),
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error ?? "Message could not be sent.");
      }

      form.reset();
      setContactStatus("success");
      setContactMessage("Message sent. I will reply soon.");
    } catch (error) {
      setContactStatus("error");
      setContactMessage(error instanceof Error ? error.message : "Message could not be sent.");
    }
  };

  return (
    <section id="contact">
      <motion.div
        className="section-head"
        initial="hidden"
        animate="show"
        variants={stagger(0.08, 0.2)}
      >
        <motion.p variants={fadeUp} className="label">
          04. spec // reach out
        </motion.p>
        <motion.h2 variants={fadeUp} className="display">
          Let&apos;s Connect
        </motion.h2>
      </motion.div>

      <div className="contact-grid">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.08)}
        >
          <motion.p variants={fadeUp} className="label" style={{ marginBottom: 32 }}>
            form.contact
          </motion.p>

          <form onSubmit={handleContactSubmit} style={{ display: "grid", gap: 28 }}>
            <motion.div variants={fadeUp} className="field">
              <label htmlFor="contact-name">Name</label>
              <input id="contact-name" name="name" type="text" placeholder="Name" required />
            </motion.div>
            <motion.div variants={fadeUp} className="field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" name="email" type="email" placeholder="Email" required />
            </motion.div>
            <input aria-hidden="true" tabIndex={-1} name="company" type="text" autoComplete="off" className="hidden" />
            <motion.div variants={fadeUp} className="field">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="Message..." rows={4} required />
            </motion.div>

            <motion.div
              variants={fadeUp}
              style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20, marginTop: 8 }}
            >
              <Magnetic>
                <button
                  type="submit"
                  disabled={contactStatus === "sending"}
                  className="btn btn--accent"
                  style={{ opacity: contactStatus === "sending" ? 0.6 : 1 }}
                >
                  <span className="btn__tick" />
                  <span>{contactStatus === "sending" ? "Sending..." : "Submit"}</span>
                </button>
              </Magnetic>
              {contactMessage ? (
                <p
                  role="status"
                  className="telemetry"
                  style={{ color: contactStatus === "error" ? "#ff5d5d" : "var(--accent)", margin: 0 }}
                >
                  {contactMessage}
                </p>
              ) : null}
            </motion.div>
          </form>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
          variants={stagger(0.08, 0.1)}
        >
          <motion.p variants={fadeUp} className="label" style={{ marginBottom: 24 }}>
            socials.json :
          </motion.p>
          <motion.ul variants={stagger(0.08)} className="socials">
            {socials.map((s) => (
              <motion.li key={s.id} variants={fadeUp}>
                <a
                  href={s.href}
                  target={s.external ? "_blank" : undefined}
                  rel={s.external ? "noreferrer" : undefined}
                >
                  <em>{s.glyph}</em>
                  <span style={{ overflowWrap: "anywhere" }}>{s.label}</span>
                  <span aria-hidden>{s.external ? "↗" : "→"}</span>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
