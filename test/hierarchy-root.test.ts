import { describe, expect, it } from "vitest";
import {
  buildGinkoHierarchyState,
  canonicalizeGinkoHierarchyPath,
  getGinkoHierarchyEntryPath,
  resolveGinkoHierarchyPath,
} from "../src/hierarchy";

describe("hierarchy root documents", () => {
  const state = buildGinkoHierarchyState(
    [
      {
        id: "quick-start",
        slug: "quick-start",
        content: { title: "Quick Start", slug: "quick-start" },
      },
      {
        id: "guides",
        isFolder: true,
        slug: "guides",
        content: { title: "Guides", slug: "guides" },
        children: [
          {
            id: "authentication",
            slug: "authentication",
            content: { title: "Authentication", slug: "authentication" },
          },
        ],
      },
    ],
    {
      locale: "en",
      defaultLocale: "en",
      baseSegment: "docs",
      includeFolders: true,
      rootSlug: "quick-start",
    },
  );

  it("aliases the configured root slug to the collection base path", () => {
    expect(state.root).toEqual({
      slug: "quick-start",
      sourcePath: "/docs/quick-start",
      path: "/docs",
      itemId: "quick-start",
      contentId: undefined,
    });
    expect(canonicalizeGinkoHierarchyPath(state, "/docs/quick-start")).toBe("/docs");
    expect(canonicalizeGinkoHierarchyPath(state, "/docs")).toBe("/docs");
  });

  it("resolves the base path back to the configured root entry", () => {
    const rootEntry = resolveGinkoHierarchyPath(state, "/docs");
    expect(rootEntry?.slug).toBe("quick-start");
    expect(getGinkoHierarchyEntryPath(state, rootEntry!)).toBe("/docs");
  });

  it("leaves non-root hierarchy pages unchanged", () => {
    const authEntry = resolveGinkoHierarchyPath(state, "/docs/guides/authentication");
    expect(authEntry?.slug).toBe("authentication");
    expect(getGinkoHierarchyEntryPath(state, authEntry!)).toBe("/docs/guides/authentication");
  });
});
