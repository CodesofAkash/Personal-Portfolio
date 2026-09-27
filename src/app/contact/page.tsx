import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact Akash Sharma | Get in Touch",
  description:
    "Interested in collaborating? Get in touch with me via email or social media. Available for freelance work and full-time opportunities.",
  alternates: {
    canonical: "https://akashsharma.dev/contact",
  },
  openGraph: {
    title: "Contact Akash Sharma | Get in Touch",
    description:
      "Interested in collaborating? Get in touch with me via email or social media. Available for freelance work and full-time opportunities.",
    url: "https://akashsharma.dev/contact",
  },
  twitter: {
    title: "Contact Akash Sharma | Get in Touch",
    description:
      "Interested in collaborating? Get in touch with me via email or social media. Available for freelance work and full-time opportunities.",
  },
};

export default function Page() {
  return <ContactView />;
}
