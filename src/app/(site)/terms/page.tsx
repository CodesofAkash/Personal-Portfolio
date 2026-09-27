import type { Metadata } from "next";
import TermsView from "./TermsView";
import { getLegalPage, getSettings } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getLegalPage("terms"), getSettings()]);
  return buildMetadata(page?.seo, settings?.seo, "/terms");
}

export default async function Page() {
  const content = await getLegalPage("terms");
  return <TermsView content={content} />;
}
