import { getImage } from "astro:assets";
import { getCollection } from "astro:content";
import type { APIContext, ImageMetadata } from "astro";
import MarkdownIt from "markdown-it";
import { parse as htmlParser } from "node-html-parser";
import sanitizeHtml from "sanitize-html";
import { siteConfig } from "@/config";
import { getSortedPosts } from "@/utils/content-utils";

const markdownParser = new MarkdownIt();

// get dynamic import of images as a map collection
const imagesGlob = import.meta.glob<{ default: ImageMetadata }>(
	"/src/content/**/*.{jpeg,jpg,png,gif,webp}", // include posts and assets
);

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error("site not set");
	}

	// Use the same ordering as site listing (pinned first, then by published desc)
	const posts = (await getSortedPosts()).filter((post) => !post.data.encrypted);

	let rssFeed = `<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${context.site.href}</link>
    <description>${escapeXml(siteConfig.subtitle || "No description")}</description>
    <language>${siteConfig.lang}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${new URL("rss.xml", context.site).href}" rel="self" type="application/rss+xml"/>`;

	for (const post of posts) {
		// convert markdown to html string
		const body = markdownParser.render(post.body ?? "");
		// convert html string to DOM-like structure
		const html = htmlParser.parse(body);
		// hold all img tags in variable images
		const images = html.querySelectorAll("img");

		for (const img of images) {
			const src = img.getAttribute("src");
			if (!src) continue;

			// Handle content-relative images and convert them to built _astro paths
			if (
				src.startsWith("./") ||
				src.startsWith("../") ||
				(!src.startsWith("http") && !src.startsWith("/"))
			) {
				let importPath: string | null = null;

				if (src.startsWith("./")) {
					// Path relative to the post file directory
					const prefixRemoved = src.slice(2);
					// Check if this post is in a subdirectory (like bestimageapi/index.md)
					const postPath = post.id; // This gives us the full path like "bestimageapi/index.md"
					const postDir = postPath.includes("/") ? postPath.split("/")[0] : "";

					if (postDir) {
						// For posts in subdirectories
						importPath = `/src/content/posts/${postDir}/${prefixRemoved}`;
					} else {
						// For posts directly in posts directory
						importPath = `/src/content/posts/${prefixRemoved}`;
					}
				} else if (src.startsWith("../")) {
					// Path like ../assets/images/xxx -> relative to /src/content/
					const cleaned = src.replace(/^\.\.\//, "");
					importPath = `/src/content/${cleaned}`;
				} else {
					// Handle direct filename (no ./ prefix) - assume it's in the same directory as the post
					const postPath = post.id; // This gives us the full path like "bestimageapi/index.md"
					const postDir = postPath.includes("/") ? postPath.split("/")[0] : "";

					if (postDir) {
						// For posts in subdirectories
						importPath = `/src/content/posts/${postDir}/${src}`;
					} else {
						// For posts directly in posts directory
						importPath = `/src/content/posts/${src}`;
					}
				}

				const imageMod = await imagesGlob[importPath]?.()?.then(
					(res) => res.default,
				);
				if (imageMod) {
					const optimizedImg = await getImage({ src: imageMod });
					img.setAttribute("src", new URL(optimizedImg.src, context.site).href);
				} else {
					// Debug: log the failed import path
					console.log(
						`Failed to load image: ${importPath} for post: ${post.id}`,
					);
				}
			} else if (src.startsWith("/")) {
				// images starting with `/` are in public dir
				img.setAttribute("src", new URL(src, context.site).href);
			}
		}

		const postUrl = new URL(`posts/${post.id}/`, context.site).href;
		const content = sanitizeHtml(html.toString(), {
			allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
		});

		rssFeed += `
    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${post.data.published.toUTCString()}</pubDate>
      <description>${escapeXml(post.data.description || "")}</description>
      <content:encoded><![CDATA[${content}]]></content:encoded>`;

		// 添加分类标签
		if (post.data.category) {
			rssFeed += `
      <category>${escapeXml(post.data.category)}</category>`;
		}

		rssFeed += `
    </item>`;
	}

	rssFeed += `
  </channel>
</rss>`;

	return new Response(rssFeed, {
		headers: {
			"Content-Type": "application/rss+xml; charset=utf-8",
		},
	});
}