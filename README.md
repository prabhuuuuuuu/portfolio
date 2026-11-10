# Pranav Shewale — Portfolio

Personal portfolio and lab notebook for Pranav Prashant Shewale. Built with
Next.js 16 (App Router), React 19, Tailwind CSS v4, Framer Motion, and React
Three Fiber.

The site includes a GitHub-backed Markdown blog with a private admin console at
`/admin`. Posts, images, and edits are committed to this repository through the
GitHub Contents API, so the deployed admin works without a database.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The blog lives at `/blog`
and the admin console at `/admin`.

Copy `.env.example` to `.env.local` and fill in the values you need. Never
commit `.env.local`.

## Scripts

```bash
npm run dev    # development server
npm run lint   # eslint
npm run build  # production build
npm start      # serve the production build
```

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `CONTACT_EMAIL_USER` | Contact form | Gmail address used by SMTP |
| `CONTACT_EMAIL_PASS` | Contact form | Gmail app password |
| `ADMIN_USERNAME` | Admin | Admin sign-in username |
| `ADMIN_PASSWORD` | Admin | Admin sign-in password |
| `ADMIN_SESSION_SECRET` | Admin | Random string (16+ chars) used to sign session cookies |
| `GITHUB_TOKEN` | Deployed admin | Fine-grained GitHub token with `Contents: Read and write` |
| `GITHUB_OWNER` | Optional | Repository owner, defaults to `prabhuuuuuuu` |
| `GITHUB_REPO` | Optional | Repository name, defaults to `portfolio` |
| `GITHUB_BRANCH` | Optional | Branch to commit to, defaults to `main` |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public origin used for canonical URLs, sitemap, robots, and RSS |
| `BLOG_STORAGE` | Optional | Force `github` or `local` storage in any environment |

Generate a session secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Blog storage

Storage is selected automatically:

- **Local development** (`VERCEL` unset) writes posts to `content/blog/*.md` and
  images to `public/blog/<slug>/` on your machine.
- **Vercel** uses the GitHub Contents API. The deployed filesystem is read-only,
  so writes must happen through a commit.

You can override the mode with `BLOG_STORAGE=github` or `BLOG_STORAGE=local`.
Local writes are deliberately disabled on Vercel.

### Creating a GitHub token

1. Open [Fine-grained personal access tokens](https://github.com/settings/personal-access-tokens/new).
2. Select **Only select repositories** and choose this portfolio repository.
3. Under **Repository permissions**, set **Contents** to **Read and write**.
4. Generate the token and add it to Vercel as `GITHUB_TOKEN`.

The token is only read on the server. It is never sent to the browser, and it
must not be committed to the repository.

### Deploying the admin to Vercel

1. Add `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET`,
   `GITHUB_TOKEN`, and `NEXT_PUBLIC_SITE_URL` in **Project → Settings →
   Environment Variables**.
2. Add `GITHUB_OWNER`, `GITHUB_REPO`, and `GITHUB_BRANCH` only if they differ
   from the defaults.
3. Redeploy the project.

Saving a post commits the markdown and images to GitHub. Vercel then rebuilds
the site automatically, usually within one to two minutes.

## Writing a post

1. Sign in at `/admin`.
2. Choose **New entry**.
3. Add a title, date, category, optional tags/excerpt/cover, and write the body
   in Markdown with the live preview beside it.
4. **Save draft** keeps it out of the public site. **Publish** commits it and
   triggers a rebuild.

Images can be uploaded as a cover, through the toolbar, by drag-and-drop, or by
pasting them directly into the editor. Images are resized and compressed in the
browser before upload to stay within request size limits.

Markdown supports GFM (tables, task lists, footnotes), fenced code with syntax
highlighting, KaTeX math (`$inline$` and `$$display$$`), heading anchors, safe
external links, and figure captions:

```markdown
![Alt text](/blog/post-slug/image.webp "Caption shown under the image")
```

An image alone on its line becomes a `<figure>` and the Markdown title becomes
the caption.

## Project structure

```text
content/blog/              Markdown posts (frontmatter + body)
public/blog/<slug>/        Images uploaded for each post
src/app/blog/              Public blog index and post pages
src/app/admin/             Admin console (dynamic, noindex)
src/app/api/admin/         Login, logout, post CRUD, upload, preview
src/components/admin/      Dashboard, editor, login UI
src/components/blog/       Blog index, markdown renderer, share links
src/lib/admin/             Session auth, rate limiting, API guards
src/lib/blog/              Content parsing, validation, markdown pipeline, storage
```
