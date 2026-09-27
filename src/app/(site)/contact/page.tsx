import type { Metadata } from "next";
import ContactView from "./ContactView";
import { getContactPage, getSettings } from "@/sanity/lib/queries";
import { buildMetadata } from "@/sanity/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [contactPage, settings] = await Promise.all([getContactPage(), getSettings()]);
  return buildMetadata(contactPage?.seo, settings?.seo, "/contact");
}

export default async function Page() {
  const [content, settings] = await Promise.all([getContactPage(), getSettings()]);
  return <ContactView content={content} settings={settings} />;
}
