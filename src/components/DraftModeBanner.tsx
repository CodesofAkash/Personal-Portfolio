// A visible, obvious one-click exit while the draft-mode cookie is set
// (AK-CMS-034) — otherwise the only way out is knowing the disable route by
// heart, and the cookie silently keeps ordinary visits in draft mode long
// after the editor moved on.
export default function DraftModeBanner() {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-white"
      style={{ background: "#7c3aed", boxShadow: "0 8px 24px rgba(124,58,237,0.4)" }}
    >
      Draft mode is on
      <a href="/api/draft-mode/disable" className="underline underline-offset-2 hover:no-underline">
        Exit
      </a>
    </div>
  );
}
