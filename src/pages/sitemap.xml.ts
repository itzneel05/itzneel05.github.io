import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { getSortedPosts } from "@/utils/content-utils";

function escapeXml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&apos;");
}

function toISO(date: Date): string {
	const iso = date.toISOString();
	return iso.slice(0, 10);
}

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error("site not set");
	}

	const posts = (await getSortedPosts()).filter((post) => !post.data.draft);

	const staticPages = ["", "about/", "archive/", "rss/", "atom/"];
	let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

	for (const page of staticPages) {
		sitemap += `  <url>
    <loc>${escapeXml(new URL(page, context.site).href)}</loc>
    <changefreq>weekly</changefreq>
  </url>
`;
	}

	const sortedPosts = [...posts].sort(
		(a, b) =>
			(b.data.updated || b.data.published).getTime() -
			(a.data.updated || a.data.published).getTime(),
	);

	for (const post of sortedPosts) {
		const postUrl = new URL(`posts/${post.id}/`, context.site).href;
		const lastModified = post.data.updated || post.data.published;
		sitemap += `  <url>
    <loc>${escapeXml(postUrl)}</loc>
    <lastmod>${toISO(lastModified)}</lastmod>
    <changefreq>monthly</changefreq>
  </url>
`;
	}

	sitemap += `</urlset>`;

	return new Response(sitemap, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
}