// A single, small component rather than a typed-per-schema builder —
// this project only ever renders one JSON-LD block (Person, in the root
// layout), so a whole builder system would be abstraction nobody needs
// yet. What does matter regardless of how many schema types exist:
// JSON.stringify() does not escape `<`, and this data includes editor-
// controlled Sanity fields (settings.name, social links) — without
// escaping, a `</script>` inside one of those values would close this
// tag early and let anything after it execute as real markup on every
// page. < is the standard mitigation (valid inside a JSON string,
// invalid as a literal "<" for an HTML parser to act on).
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
