"use client";

import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

import { SectionWrapper } from "@/hoc";
import { slideIn } from "@/utils/motion";
import type { ContactFormSection, FormField, Settings } from "@/sanity/lib/types";

const EarthCanvas = dynamic(() => import("@/components/canvas/Earth"), { ssr: false });

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

const DEFAULT_FIELDS: FormField[] = [
  { name: "name", label: "Your Name", placeholder: "What's your name?", type: "text" },
  { name: "email", label: "Your Email", placeholder: "What's your email?", type: "email" },
  { name: "message", label: "Your Message", placeholder: "What do you want to say?", type: "textarea" },
];

interface ContactProps {
  settings: Settings | null;
  formSection?: ContactFormSection;
  modelUrl?: string;
}

const Contact = ({ settings, formSection, modelUrl }: ContactProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const fields = formSection?.fields && formSection.fields.length > 0 ? formSection.fields : DEFAULT_FIELDS;
  const submitText = formSection?.submitButtonText || "Send";

  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);

    emailjs
      .send(
        "service_s3inyje",
        "template_neayvk7",
        {
          from_name: form.name,
          to_name: settings?.name ?? "",
          from_email: form.email,
          to_email: settings?.email ?? "",
          subject: `Portfolio Contact: ${form.name}`,
          message: `From: ${form.name} (${form.email})\n\nMessage:\n${form.message}\n\n---\nSent via portfolio contact form.`,
        },
        "3-eFGhotqAWABe54T",
      )
      .then(
        () => {
          setLoading(false);
          toast.success(
            "Thank you. I will get back to you as soon as possible.",
          );
          setForm({
            name: "",
            email: "",
            message: "",
          });
        },
        (error) => {
          setLoading(false);
          console.log(error);
          toast.error("Something went wrong. Please try again.");
        },
      );
  };

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-8"
        >
          {fields.map((field) => (
            <label key={field.name} className="flex flex-col">
              <span className="text-white font-medium mb-4">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  rows={7}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none"
                  required
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none"
                  required
                />
              )}
            </label>
          ))}
          <button
            type="submit"
            className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl"
            disabled={loading}
          >
            {loading ? "Sending..." : submitText}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas modelUrl={modelUrl} />
      </motion.div>
    </div>
  );
};

const ContactSection = SectionWrapper(Contact, "contact");
export default ContactSection;
