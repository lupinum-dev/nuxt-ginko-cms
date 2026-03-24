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
        kind: "folder",
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

  it("keeps group nodes in navigation while excluding them from route segments", () => {
    const groupedState = buildGinkoHierarchyState(
      [
        {
          id: "group-intro",
          kind: "group",
          content: { title: "Introduction" },
          children: [
            {
              id: "quick-start",
              slug: "quick-start",
              content: { title: "Quick Start", slug: "quick-start" },
            },
          ],
        },
      ],
      {
        locale: "en",
        defaultLocale: "en",
        baseSegment: "docs",
        includeFolders: true,
      },
    );

    const [group] = groupedState.tree;
    const [page] = group?.children ?? [];

    expect(group?.nodeKind).toBe("group");
    expect(group?.path).toBeUndefined();
    expect(page?.path).toBe("/docs/quick-start");
    expect(resolveGinkoHierarchyPath(groupedState, "/docs/quick-start")?.title).toBe("Quick Start");
  });

  it("does not infer folders from the legacy isFolder flag anymore", () => {
    const legacyState = buildGinkoHierarchyState(
      [
        {
          id: "legacy-folder",
          isFolder: true,
          slug: "legacy-folder",
          content: { title: "Legacy Folder", slug: "legacy-folder" },
        },
      ],
      {
        locale: "en",
        defaultLocale: "en",
        baseSegment: "docs",
        includeFolders: true,
      },
    );

    expect(legacyState.tree[0]?.nodeKind).toBe("page");
    expect(legacyState.folders).toHaveLength(0);
    expect(legacyState.pages).toHaveLength(1);
  });
});
