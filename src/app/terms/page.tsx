import type { Metadata } from "next";
import TermsView from "./TermsView";

export const metadata: Metadata = {
  title: "Terms of Service | Akash Sharma",
  description: "Terms of service for akashsharma.dev",
  alternates: {
    canonical: "https://akashsharma.dev/terms",
  },
  openGraph: {
    title: "Terms of Service | Akash Sharma",
    description: "Terms of service for akashsharma.dev",
    url: "https://akashsharma.dev/terms",
  },
  twitter: {
    title: "Terms of Service | Akash Sharma",
    description: "Terms of service for akashsharma.dev",
  },
};

export default function Page() {
  return <TermsView />;
}
