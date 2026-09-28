import { defineArrayMember, defineType } from "sanity";

// Never a fixed primaryCta/secondaryCta pair — array order is render order.
export const ctaBtns = defineType({
  name: "ctaBtns",
  title: "Buttons",
  type: "array",
  of: [defineArrayMember({ type: "ctaBtn" })],
  description: "Add as many buttons as this layout needs.",
});
