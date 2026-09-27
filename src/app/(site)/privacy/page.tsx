import type { Metadata } from "next";
import PrivacyView from "./PrivacyView";

export const metadata: Metadata = {
  title: "Privacy Policy | Akash Sharma",
  description: "Privacy policy for akashsharma.dev",
  alternates: {
    canonical: "https://akashsharma.dev/privacy",
  },
  openGraph: {
    title: "Privacy Policy | Akash Sharma",
    description: "Privacy policy for akashsharma.dev",
    url: "https://akashsharma.dev/privacy",
  },
  twitter: {
    title: "Privacy Policy | Akash Sharma",
    description: "Privacy policy for akashsharma.dev",
  },
};

export default function Page() {
  return <PrivacyView />;
}
