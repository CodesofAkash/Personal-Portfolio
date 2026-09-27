import type { StructureResolver } from "sanity/structure";

// Fixed-documentId singletons (AK-SAN-036), opened directly rather than
// listed as a collection — there is exactly one of each.
const singleton = (
  S: Parameters<StructureResolver>[0],
  id: string,
  schemaType: string,
  title: string,
) => S.listItem().title(title).id(id).child(S.document().schemaType(schemaType).documentId(id).title(title));

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Pages")
        .id("pages")
        .child(
          S.list()
            .title("Pages")
            .items([
              singleton(S, "homePage", "homePage", "Home page"),
              singleton(S, "aboutPage", "aboutPage", "About page"),
              singleton(S, "projectsPage", "projectsPage", "Projects page"),
              singleton(S, "contactPage", "contactPage", "Contact page"),
              S.documentTypeListItem("legalPage").title("Legal pages"),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem("project").title("Projects"),
      S.documentTypeListItem("experience").title("Experience"),
      S.documentTypeListItem("technology").title("Technologies"),
      S.documentTypeListItem("testimonial").title("Testimonials"),
      S.divider(),
      singleton(S, "settings", "settings", "Site settings"),
    ]);
