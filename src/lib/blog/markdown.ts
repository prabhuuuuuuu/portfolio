import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import { visit } from "unist-util-visit";
import type { Element, Parent, Root } from "hast";

/**
 * A markdown image that sits alone in a paragraph becomes a figure. The
 * markdown title (`![alt](src "caption")`) is used as the visible caption.
 */
function rehypeFigures() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent: Parent | undefined) => {
      if (node.tagName !== "img" || index === undefined || !parent) return;

      const title = typeof node.properties?.title === "string" ? node.properties.title : "";
      delete node.properties?.title;

      node.properties = {
        ...node.properties,
        loading: "lazy",
        decoding: "async",
      };

      const isOnlyChild =
        parent.type === "element" &&
        (parent as Element).tagName === "p" &&
        parent.children.length === 1;

      if (!isOnlyChild) {
        if (title) node.properties.title = title;
        return;
      }

      const paragraph = parent as Element;
      paragraph.tagName = "figure";
      paragraph.properties = {
        ...paragraph.properties,
        className: ["md-figure"],
      };

      if (title) {
        paragraph.children.push({
          type: "element",
          tagName: "figcaption",
          properties: {},
          children: [{ type: "text", value: title }],
        });
      }
    });
  };
}

/** Strip unsafe URLs and make external links open in a new tab. */
function rehypeLinkSafety() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "a") {
        const href = typeof node.properties?.href === "string" ? node.properties.href : "";
        if (/^\s*(javascript|vbscript):/i.test(href)) {
          delete node.properties?.href;
          return;
        }
        if (/^https?:\/\//i.test(href)) {
          node.properties = {
            ...node.properties,
            target: "_blank",
            rel: ["noopener", "noreferrer"],
          };
        }
      }

      if (node.tagName === "img") {
        const src = typeof node.properties?.src === "string" ? node.properties.src : "";
        if (/^\s*(javascript|vbscript):/i.test(src)) {
          delete node.properties?.src;
        }
      }
    });
  };
}

export async function compileMarkdown(markdown: string) {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: "append",
      properties: {
        className: ["md-heading-link"],
        ariaLabel: "Link to this section",
      },
      content: {
        type: "element",
        tagName: "span",
        properties: { className: ["md-heading-link__mark"] },
        children: [{ type: "text", value: "#" }],
      },
    })
    .use(rehypeFigures)
    .use(rehypeLinkSafety)
    .use(rehypeKatex, { throwOnError: false, strict: false })
    .use(rehypeHighlight, { detect: false, ignoreMissing: true })
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}

/** Point images at raw GitHub while a freshly uploaded post awaits deployment. */
export function rewriteMarkdownImageUrls(html: string, baseUrl: string) {
  if (!baseUrl) return html;
  return html.replaceAll('src="/blog/', `src="${baseUrl}/blog/`);
}
