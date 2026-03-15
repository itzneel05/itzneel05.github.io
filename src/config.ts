import type {
	AnnouncementConfig,
	CommentConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	FullscreenWallpaperConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SidebarLayoutConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// Removed i18n import to avoid circular dependency

// Define site language
const SITE_LANG = "en"; // Language code, e.g.: 'en', 'zh_CN', 'ja', etc.

export const siteConfig: SiteConfig = {
	title: "ItzNeel's Space",
	subtitle: "",

	lang: SITE_LANG,

	themeColor: {
		hue: 210, // Default theme color hue, range 0-360. e.g.: red: 0, cyan: 200, teal: 250, pink: 345
		fixed: true, // Hide theme color picker from visitors
	},

	bangumi: {
		userId: "your-bangumi-id", // Set your Bangumi user ID here
	},

	anime: {
		mode: "local", // Anime page mode: "bangumi" uses Bangumi API, "local" uses local config
	},

	banner: {
		enable: true, // Enable banner wallpaper mode

		// Supports single image or image array; auto-enables carousel when array length > 1
		src: {
			desktop: ["/assets/images/hoho.jpg"], // Desktop banner images
			mobile: ["/assets/images/hoho.jpg"], // Mobile banner images
		}, // Use local banner images

		position: "center", // Equivalent to object-position, supports 'top', 'center', 'bottom'. Default: 'center'

		carousel: {
			enable: true, // true: enable carousel for multiple images. false: randomly show one image from array

			interval: 1.5, // Carousel interval (seconds)
		},

		// PicFlow API support (smart image API)
		imageApi: {
			enable: false, // Enable image API
			url: "http://domain.com/api_v2.php?format=text&count=4", // API address, returns text with one image link per line
		},
		// Use PicFlow API's Text return type, so format=text parameter is needed
		// Project: https://github.com/matsuzaka-yuki/PicFlow-API
		// Self-host the API

		homeText: {
			enable: true, // Display custom text on homepage
			title: "ItzNeel.log", // Homepage banner main title

			subtitle: ["Attempting the impossible"],
			typewriter: {
				enable: true, // Enable subtitle typewriter effect

				speed: 100, // Typing speed (ms)
				deleteSpeed: 50, // Delete speed (ms)
				pauseTime: 2000, // Pause time after fully displayed (ms)
			},
		},

		credit: {
			enable: false, // Show banner image credit text

			text: "Describe", // Credit text to display
			url: "", // (Optional) URL link to original artwork or artist page
		},

		navbar: {
			transparentMode: "semifull", // Navbar transparency mode: "semi" semi-transparent + rounded, "full" fully transparent, "semifull" dynamic
		},
	},
	toc: {
		enable: true, // Enable table of contents
		depth: 3, // TOC depth, 1-6. 1 = only h1, 2 = h1 and h2, etc.
	},
	generateOgImages: true, // Enable OpenGraph image generation. Note: takes a long time to render, not recommended during local dev
	favicon: [
		// Leave empty to use default favicon
		// {
		//   src: '/favicon/icon.png',    // Icon file path
		//   theme: 'light',              // Optional, specify theme 'light' | 'dark'
		//   sizes: '32x32',              // Optional, icon size
		// }
	],

	// Font configuration
	font: {
		zenMaruGothic: {
			enable: true, // Enable global rounded font, good for Japanese and English
		},
		hanalei: {
			enable: false, // Enable Hanalei font as global font
		},
	},
	showLastModified: true, // Toggle for "last edited" card display
};
export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	enable: false, // Enable fullscreen wallpaper (only works when banner is disabled)
	src: {
		desktop: [], // Desktop wallpaper images
		mobile: [], // Mobile wallpaper images
	}, // Use local wallpaper images
	position: "center", // Wallpaper position, equivalent to object-position
	carousel: {
		enable: true, // Enable carousel
		interval: 1, // Carousel interval (seconds)
	},
	zIndex: -1, // Z-index layer, keeps wallpaper in background
	opacity: 0.8, // Wallpaper opacity
	blur: 1, // Background blur amount
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		// Custom navbar links with multi-level menu support
		{
			name: "Links",
			url: "/links/",
			icon: "material-symbols:link",
			children: [
				{
					name: "GitHub",
					url: "https://github.com/itzneel05",
					external: true,
					icon: "fa6-brands:github",
				},
				{
					name: "Linkedin",
					url: "https://www.linkedin.com/in/neel-ijner/",
					external: true,
					icon: "fa6-brands:linkedin",
				},
			],
		},
		LinkPreset.About,
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/duck.gif", // Relative to /src directory. If starts with '/', relative to /public directory
	name: "Neel Ijner",
	bio: "CS Student - Bug Finder",
	links: [
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/itzneel05",
		},
		{
			name: "Linkedin",
			icon: "fa6-brands:linkedin",
			url: "https://www.linkedin.com/in/neel-ijner/",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: false,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (e.g. background color) are overridden. See astro.config.mjs.
	// Choose a dark theme, as this blog currently only supports dark backgrounds.
	theme: "github-dark",
};

export const commentConfig: CommentConfig = {
	enable: false, // Enable comments. When false, comment component won't show in post area.
	twikoo: {
		envId: "",
		lang: "en", // Set Twikoo comment system language
	},
};

export const announcementConfig: AnnouncementConfig = {
	title: "Announcement", // Announcement title
	content: "Nothing Much, hehe", // Announcement content
	closable: false, // Allow user to close announcement
	link: {
		enable: true, // Enable link
		text: "Learn More", // Link text
		url: "/about/", // Link URL
		external: false, // Internal link
	},
};

export const footerConfig: FooterConfig = {
	enable: true, // Enable footer HTML injection
};

// Edit FooterConfig.html to add custom footer content

/**
 * Sidebar layout configuration
 * Controls sidebar component display, ordering, animation, and responsive behavior
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// Enable sidebar
	enable: true,

	// Sidebar position: left or right
	position: "left",

	// Sidebar component configuration list
	components: [
		{
			// Component type: user profile
			type: "profile",
			// Enable this component
			enable: true,
			// Display order (lower number = higher priority)
			order: 1,
			// Component position: "top" = fixed at top
			position: "top",
			// CSS class for styling and animation
			class: "onload-animation",
			// Animation delay (ms), for staggered animation
			animationDelay: 0,
		},
		{
			// Component type: announcement
			type: "announcement",
			// Enable this component (controlled via unified config)
			enable: true,
			// Display order
			order: 2,
			// Component position: "top" = fixed at top
			position: "top",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 50,
		},
		{
			// Component type: categories
			type: "categories",
			// Enable this component
			enable: true,
			// Display order
			order: 3,
			// Component position: "sticky" = sticky positioning, scrollable
			position: "sticky",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 150,
			// Responsive config
			responsive: {
				// Collapse threshold: auto-collapse when category count exceeds 5
				collapseThreshold: 5,
			},
		},
		{
			// Component type: tags
			type: "tags",
			// Enable this component
			enable: true,
			// Display order
			order: 5,
			// Component position: "sticky"
			position: "sticky",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 250,
			// Responsive config
			responsive: {
				// Collapse threshold: auto-collapse when tag count exceeds 20
				collapseThreshold: 20,
			},
		},
	],

	// Default animation config
	defaultAnimation: {
		// Enable default animation
		enable: true,
		// Base delay (ms)
		baseDelay: 0,
		// Increment delay (ms), added to each successive component
		increment: 50,
	},

	// Responsive layout config
	responsive: {
		// Breakpoint config (pixels)
		breakpoints: {
			// Mobile breakpoint: screen width < 768px
			mobile: 768,
			// Tablet breakpoint: screen width < 1024px
			tablet: 1024,
			// Desktop breakpoint: screen width < 1280px
			desktop: 1280,
		},
		// Layout modes for different devices
		// hidden: hide sidebar (desktop)  drawer: drawer mode (hidden on mobile)  sidebar: show sidebar
		layout: {
			// Mobile: sidebar mode
			mobile: "sidebar",
			// Tablet: sidebar mode
			tablet: "sidebar",
			// Desktop: sidebar mode
			desktop: "sidebar",
		},
	},
};

// Unified export interface for all configs
export const widgetConfigs = {
	profile: profileConfig,
	announcement: announcementConfig,
	layout: sidebarLayoutConfig,
	fullscreenWallpaper: fullscreenWallpaperConfig,
} as const;

export const umamiConfig = {
	enabled: false, // Show Umami analytics
	apiKey: "", // Your API key
	baseUrl: "https://api.umami.is", // Umami Cloud API address
	scripts: `
<script defer src="https://cloud.umami.is/script.js" data-website-id=""></script>
  `.trim(), // Script to inject (no need to add in Layout separately)
} as const;
