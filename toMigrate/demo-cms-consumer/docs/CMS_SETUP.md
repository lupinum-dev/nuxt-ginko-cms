# CMS Setup Guide

This guide explains how to set up collections and content in your Convex CMS to work with the demo app.

## Prerequisites

1. Access to your Convex CMS dashboard
2. A team created (e.g., `demo-team`)
3. An API key with access to all collections

---

## Step 1: Create Collections

Create three collections in the CMS dashboard:

### Collection 1: `authors`

| Field | Type | Localized | Required | Description |
|-------|------|-----------|----------|-------------|
| `slug` | slug | No | Yes | URL-friendly identifier (auto-generated from name) |
| `name` | text | No | Yes | Author's full name |
| `bio` | text | Yes | No | Short biography |
| `avatar` | image | No | No | Profile picture |

### Collection 2: `blogs`

| Field | Type | Localized | Required | Description |
|-------|------|-----------|----------|-------------|
| `slug` | slug | No | Yes | URL-friendly identifier |
| `title` | text | Yes | Yes | Blog post title |
| `excerpt` | text | Yes | No | Short summary (1-2 sentences) |
| `content` | richtext | Yes | Yes | Main content (MDC format) |
| `featuredImage` | image | No | No | Hero image for the post |
| `author` | relation → authors | No | No | Link to author |
| `publishedAt` | datetime | No | No | Publication date |

### Collection 3: `legal`

| Field | Type | Localized | Required | Description |
|-------|------|-----------|----------|-------------|
| `slug` | slug | No | Yes | URL-friendly identifier |
| `title` | text | Yes | Yes | Document title |
| `content` | richtext | Yes | Yes | Legal content (MDC format) |
| `lastUpdated` | date | No | No | Last revision date |

---

## Step 2: Create Authors

Create at least 2 authors for variety:

### Author 1: John Doe

| Field | Value |
|-------|-------|
| slug | `john-doe` |
| name | `John Doe` |
| bio (EN) | `Senior developer and tech writer with 10 years of experience.` |
| bio (DE) | `Senior-Entwickler und Tech-Autor mit 10 Jahren Erfahrung.` |
| avatar | Upload a profile photo |

### Author 2: Jane Smith

| Field | Value |
|-------|-------|
| slug | `jane-smith` |
| name | `Jane Smith` |
| bio (EN) | `Product designer passionate about user experience and accessibility.` |
| bio (DE) | `Produktdesignerin mit Leidenschaft für User Experience und Barrierefreiheit.` |
| avatar | Upload a profile photo |

---

## Step 3: Create Blog Posts

Create at least 3 blog posts:

### Blog Post 1: Getting Started with Nuxt

| Field | Value |
|-------|-------|
| slug | `getting-started-with-nuxt` |
| title (EN) | `Getting Started with Nuxt` |
| title (DE) | `Erste Schritte mit Nuxt` |
| excerpt (EN) | `Learn how to build modern web applications with Nuxt 3.` |
| excerpt (DE) | `Erfahren Sie, wie Sie moderne Webanwendungen mit Nuxt 3 erstellen.` |
| featuredImage | Upload a relevant image |
| author | Select `John Doe` |
| publishedAt | `2025-01-15` |

**Content (EN):**
```markdown
Nuxt is a powerful framework for building Vue.js applications. In this guide, we'll explore the basics.

## Why Nuxt?

Nuxt provides:
- Server-side rendering (SSR)
- Static site generation (SSG)
- File-based routing
- Auto-imports

## Installation

To create a new Nuxt project:

\`\`\`bash
npx nuxi init my-app
cd my-app
pnpm install
pnpm dev
\`\`\`

## Next Steps

Check out the official documentation to learn more about Nuxt's features.
```

**Content (DE):**
```markdown
Nuxt ist ein leistungsstarkes Framework für Vue.js-Anwendungen. In diesem Leitfaden erkunden wir die Grundlagen.

## Warum Nuxt?

Nuxt bietet:
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Dateibasiertes Routing
- Auto-Imports

## Installation

So erstellen Sie ein neues Nuxt-Projekt:

\`\`\`bash
npx nuxi init my-app
cd my-app
pnpm install
pnpm dev
\`\`\`

## Nächste Schritte

Schauen Sie sich die offizielle Dokumentation an, um mehr über die Funktionen von Nuxt zu erfahren.
```

---

### Blog Post 2: Understanding TypeScript

| Field | Value |
|-------|-------|
| slug | `understanding-typescript` |
| title (EN) | `Understanding TypeScript` |
| title (DE) | `TypeScript verstehen` |
| excerpt (EN) | `A beginner's guide to TypeScript and type safety.` |
| excerpt (DE) | `Ein Einsteigerleitfaden für TypeScript und Typsicherheit.` |
| featuredImage | Upload a relevant image |
| author | Select `Jane Smith` |
| publishedAt | `2025-01-20` |

**Content (EN):**
```markdown
TypeScript adds static typing to JavaScript, helping catch errors before runtime.

## Benefits of TypeScript

1. **Type Safety** - Catch errors at compile time
2. **Better IDE Support** - Autocomplete and refactoring
3. **Self-Documenting** - Types serve as documentation

## Basic Example

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
}

function greetUser(user: User): string {
  return \`Hello, \${user.name}!\`
}
\`\`\`

## Getting Started

Add TypeScript to your project with:

\`\`\`bash
pnpm add -D typescript
\`\`\`
```

**Content (DE):**
```markdown
TypeScript fügt JavaScript statische Typisierung hinzu und hilft, Fehler vor der Laufzeit zu erkennen.

## Vorteile von TypeScript

1. **Typsicherheit** - Fehler zur Kompilierzeit erkennen
2. **Bessere IDE-Unterstützung** - Autovervollständigung und Refactoring
3. **Selbstdokumentierend** - Typen dienen als Dokumentation

## Einfaches Beispiel

\`\`\`typescript
interface User {
  id: number
  name: string
  email: string
}

function greetUser(user: User): string {
  return \`Hallo, \${user.name}!\`
}
\`\`\`

## Erste Schritte

Fügen Sie TypeScript zu Ihrem Projekt hinzu mit:

\`\`\`bash
pnpm add -D typescript
\`\`\`
```

---

### Blog Post 3: Building with Convex

| Field | Value |
|-------|-------|
| slug | `building-with-convex` |
| title (EN) | `Building with Convex` |
| title (DE) | `Entwickeln mit Convex` |
| excerpt (EN) | `How to build real-time applications with Convex backend.` |
| excerpt (DE) | `Wie man Echtzeit-Anwendungen mit Convex-Backend erstellt.` |
| featuredImage | Upload a relevant image |
| author | Select `John Doe` |
| publishedAt | `2025-01-25` |

**Content (EN):**
```markdown
Convex is a backend platform that makes building real-time apps simple.

## Key Features

- **Real-time Sync** - Data updates automatically
- **Type-Safe** - End-to-end TypeScript support
- **Serverless** - No infrastructure to manage

## Define a Schema

\`\`\`typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    completed: v.boolean(),
  }),
})
\`\`\`

## Create a Query

\`\`\`typescript
// convex/tasks.ts
import { query } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect()
  },
})
\`\`\`

Try Convex for your next project!
```

**Content (DE):**
```markdown
Convex ist eine Backend-Plattform, die das Erstellen von Echtzeit-Apps vereinfacht.

## Hauptfunktionen

- **Echtzeit-Sync** - Daten werden automatisch aktualisiert
- **Typsicher** - End-to-End TypeScript-Unterstützung
- **Serverless** - Keine Infrastruktur zu verwalten

## Schema definieren

\`\`\`typescript
// convex/schema.ts
import { defineSchema, defineTable } from 'convex/server'
import { v } from 'convex/values'

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    completed: v.boolean(),
  }),
})
\`\`\`

## Query erstellen

\`\`\`typescript
// convex/tasks.ts
import { query } from './_generated/server'

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('tasks').collect()
  },
})
\`\`\`

Probieren Sie Convex für Ihr nächstes Projekt aus!
```

---

## Step 4: Create Legal Documents

Create at least 2 legal pages:

### Legal Document 1: Privacy Policy

| Field | Value |
|-------|-------|
| slug | `privacy-policy` |
| title (EN) | `Privacy Policy` |
| title (DE) | `Datenschutzerklärung` |
| lastUpdated | `2025-01-01` |

**Content (EN):**
```markdown
## Introduction

This Privacy Policy explains how we collect, use, and protect your personal information.

## Information We Collect

We may collect the following types of information:

- **Personal Information**: Name, email address
- **Usage Data**: Pages visited, time spent on site
- **Cookies**: See our Cookie Policy for details

## How We Use Your Information

We use your information to:

1. Provide and improve our services
2. Send you updates and newsletters
3. Respond to your inquiries

## Your Rights

You have the right to:

- Access your personal data
- Request deletion of your data
- Opt-out of marketing communications

## Contact Us

If you have questions about this policy, please contact us at privacy@example.com.
```

**Content (DE):**
```markdown
## Einleitung

Diese Datenschutzerklärung erklärt, wie wir Ihre persönlichen Daten erfassen, verwenden und schützen.

## Welche Daten wir erfassen

Wir erfassen möglicherweise folgende Arten von Informationen:

- **Persönliche Daten**: Name, E-Mail-Adresse
- **Nutzungsdaten**: Besuchte Seiten, Verweildauer auf der Website
- **Cookies**: Siehe unsere Cookie-Richtlinie für Details

## Wie wir Ihre Daten verwenden

Wir verwenden Ihre Daten, um:

1. Unsere Dienste bereitzustellen und zu verbessern
2. Ihnen Updates und Newsletter zu senden
3. Auf Ihre Anfragen zu antworten

## Ihre Rechte

Sie haben das Recht auf:

- Zugang zu Ihren persönlichen Daten
- Löschung Ihrer Daten
- Abmeldung von Marketing-Kommunikation

## Kontakt

Bei Fragen zu dieser Richtlinie kontaktieren Sie uns bitte unter datenschutz@example.com.
```

---

### Legal Document 2: Terms of Service

| Field | Value |
|-------|-------|
| slug | `terms-of-service` |
| title (EN) | `Terms of Service` |
| title (DE) | `Nutzungsbedingungen` |
| lastUpdated | `2025-01-01` |

**Content (EN):**
```markdown
## Agreement to Terms

By accessing our website, you agree to these Terms of Service.

## Use License

Permission is granted to temporarily view the materials on our website for personal, non-commercial use only.

## Disclaimer

The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.

## Limitations

In no event shall we be liable for any damages arising out of the use or inability to use our materials.

## Governing Law

These terms shall be governed by the laws of your jurisdiction.

## Changes to Terms

We reserve the right to modify these terms at any time. Please review periodically.
```

**Content (DE):**
```markdown
## Zustimmung zu den Bedingungen

Durch den Zugriff auf unsere Website stimmen Sie diesen Nutzungsbedingungen zu.

## Nutzungslizenz

Es wird die Erlaubnis erteilt, die Materialien auf unserer Website vorübergehend nur für den persönlichen, nicht-kommerziellen Gebrauch anzusehen.

## Haftungsausschluss

Die Materialien auf unserer Website werden ohne Mängelgewähr bereitgestellt. Wir geben keine ausdrücklichen oder stillschweigenden Garantien.

## Beschränkungen

In keinem Fall haften wir für Schäden, die aus der Nutzung oder der Unmöglichkeit der Nutzung unserer Materialien entstehen.

## Anwendbares Recht

Diese Bedingungen unterliegen den Gesetzen Ihrer Gerichtsbarkeit.

## Änderungen der Bedingungen

Wir behalten uns das Recht vor, diese Bedingungen jederzeit zu ändern. Bitte überprüfen Sie sie regelmäßig.
```

---

## Step 5: Publish All Content

1. Go to each item in the CMS
2. Change status from `draft` to `published`
3. Save the changes

---

## Step 6: Create API Key

1. Go to **Settings** → **API Keys** in your CMS dashboard
2. Create a new API key with:
   - Name: `Demo App`
   - Permissions: `*` (all collections) or `blogs, authors, legal`
3. Copy the API key

---

## Step 7: Configure the Demo App

Create `.env.local` in `packages/demo-cms-consumer/`:

```env
NUXT_CMS_API_URL=https://your-deployment.convex.site
NUXT_CMS_API_KEY=your-api-key-here
NUXT_CMS_TEAM_SLUG=demo-team
```

---

## Step 8: Run the Demo

```bash
cd packages/demo-cms-consumer

# Development (preview mode - real-time API)
pnpm dev

# Production build (static mode - downloads assets)
pnpm generate
pnpm preview
```

---

## Verification Checklist

- [ ] Authors appear with avatars on blog posts
- [ ] Blog listing shows all 3 posts with images
- [ ] Blog detail pages load with full content
- [ ] Locale switcher changes content language
- [ ] Privacy Policy page loads at `/legal/privacy-policy`
- [ ] Terms of Service page loads at `/legal/terms-of-service`
- [ ] Fallback indicator shows when German content is missing
- [ ] Production build downloads all assets to `public/cms-assets/`
