import type { Metadata } from "next";
import PrivacyView from "./PrivacyView";
import { getLegalPage, getSettings } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getLegalPage("privacy"), getSettings()]);
  return buildMetadata(page?.seo, settings?.seo, "/privacy");
}

export default async function Page() {
  const content = await getLegalPage("privacy");
  return <PrivacyView content={content} />;
}
