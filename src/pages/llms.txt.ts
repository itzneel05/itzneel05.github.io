import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { getSortedPosts } from "@/utils/content-utils";
import { profileConfig, siteConfig } from "@/config";

function escapeMarkdown(value: string): string {
	return value.replace(/[\[\]()]/g, "");
}

export async function GET(context: APIContext) {
	if (!context.site) {
		throw Error("site not set");
	}

	const site = context.site.href.replace(/\/$/, "");
	const posts = await getSortedPosts();
	const publishedPosts = posts.filter((post) => !post.data.draft);

	let content = `# ${siteConfig.title}

> ${siteConfig.subtitle || "Personal cybersecurity blog by " + profileConfig.name + ": CTF writeups, TryHackMe learning-path posts, and hands-on security notes."}

## About

- [About ${profileConfig.name}](${site}/about/)
- [GitHub](${profileConfig.links[0]?.url})
- [LinkedIn](${profileConfig.links[1]?.url})

## Posts

`;

	for (const post of publishedPosts) {
		const title = escapeMarkdown(post.data.title);
		const url = `${site}/posts/${post.id}/`;
		const date = post.data.published.toISOString().slice(0, 10);
		const description = post.data.description
			? ` - ${post.data.description}`
			: "";
		content += `- [${date} | ${title}](${url})${description}\n`;
	}

	content += `
## Feeds

- [RSS](${site}/rss.xml)
- [Atom](${site}/atom.xml)
- [Sitemap](${site}/sitemap.xml)
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain; charset=utf-8",
		},
	});
}