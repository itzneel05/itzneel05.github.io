import type { DARK_MODE, LIGHT_MODE } from "../constants/constants";

export type SiteConfig = {
	title: string;
	subtitle: string;
	keywords?: string[]; // Site keywords, used to generate <meta name="keywords">

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};

	// Add font configuration
	font: {
		zenMaruGothic: {
			enable: boolean; // Whether to use ZenMaruGothic-Black as global font
		};
		hanalei: {
			enable: boolean; // Whether to use Hanalei as global font
		};
	};

	// 添加bangumi配置
	bangumi?: {
		userId?: string; // Bangumi user ID
	};

	// 添加番剧页面配置
	anime?: {
		mode?: "bangumi" | "local"; // Anime page mode
	};

	banner: {
		enable: boolean;
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  }; // Supports single image, image array, or separate desktop and mobile images
		position?: "top" | "center" | "bottom";
		carousel?: {
			enable: boolean; // Whether to enable carousel
			interval: number; // Carousel interval (seconds)
		};
		imageApi?: {
			enable: boolean; // Whether to enable image API
			url: string; // API address, returns text with one image link per line
		};
		homeText?: {
			enable: boolean; // Whether to display custom text on homepage
			title?: string; // Main title
			subtitle?: string | string[]; // Subtitle, supports single string or string array
			typewriter?: {
				enable: boolean; // Whether to enable typewriter effect
				speed: number; // Typing speed (ms)
				deleteSpeed: number; // Delete speed (ms)
				pauseTime: number; // Pause time after full display (ms)
			};
		};
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // Navbar transparent mode
		};
	};
	toc: {
		enable: boolean;
		depth: 1 | 2 | 3;
	};
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // Control whether to show "last edited" card
};

export type Favicon = {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
};

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Anime = 4,
	Diary = 5,
	Gallery = 6,

	Projects = 7,
	Skills = 8,
	Timeline = 9,
}

export type NavBarLink = {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // Menu item icon
	children?: (NavBarLink | LinkPreset)[]; // Supports submenus, can be NavBarLink or LinkPreset
};

export type NavBarConfig = {
	links: (NavBarLink | LinkPreset)[];
};

export type ProfileConfig = {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
};

export type LicenseConfig = {
	enable: boolean;
	name: string;
	url: string;
};
// Comment configuration

export type CommentConfig = {
	enable: boolean; // Whether to enable comments
	twikoo?: TwikooConfig;
};

type TwikooConfig = {
	envId: string;
	region?: string;
	lang?: string;
};

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type BlogPostData = {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
};

export type ExpressiveCodeConfig = {
	theme: string;
};

export type AnnouncementConfig = {
	// The enable property has been removed, now controlled uniformly by sidebarLayoutConfig
	title?: string; // Announcement title
	content: string; // Announcement content
	icon?: string; // Announcement icon
	type?: "info" | "warning" | "success" | "error"; // Announcement type
	closable?: boolean; // Whether it can be closed
	link?: {
		enable: boolean; // Whether to enable link
		text: string; // Link text
		url: string; // Link URL
		external?: boolean; // Whether it's an external link
	};
};

export type FooterConfig = {
	enable: boolean; // Whether to enable Footer HTML injection
};

// Component configuration type definition
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "custom";

export type WidgetComponentConfig = {
	type: WidgetComponentType; // Component type
	enable: boolean; // Whether to enable this component
	order: number; // Display order, smaller number means higher priority
	position: "top" | "sticky"; // Component position: top fixed area or sticky area
	class?: string; // Custom CSS class name
	style?: string; // Custom inline style
	animationDelay?: number; // Animation delay (ms)
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // Hidden on specified devices
		collapseThreshold?: number; // Collapse threshold
	};
	customProps?: Record<string, any>; // Custom properties for extending component functionality
};

export type SidebarLayoutConfig = {
	enable: boolean; // Whether to enable sidebar
	position: "left" | "right"; // Sidebar position: left or right
	components: WidgetComponentConfig[]; // Component configuration list
	defaultAnimation: {
		enable: boolean; // Whether to enable default animation
		baseDelay: number; // Base delay (ms)
		increment: number; // Increment delay for each component (ms)
	};
	responsive: {
		breakpoints: {
			mobile: number; // Mobile breakpoint (px)
			tablet: number; // Tablet breakpoint (px)
			desktop: number; // Desktop breakpoint (px)
		};
		layout: {
			mobile: "hidden" | "bottom" | "drawer" | "sidebar"; // Mobile layout mode
			tablet: "sidebar" | "bottom" | "drawer"; // Tablet layout mode
			desktop: "sidebar"; // Desktop layout mode
		};
	};
};

export type FullscreenWallpaperConfig = {
	enable: boolean; // Whether to enable fullscreen wallpaper
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // Supports single image, image array, or separate desktop and mobile images
	position?: "top" | "center" | "bottom"; // Wallpaper position, equivalent to object-position
	carousel?: {
		enable: boolean; // Whether to enable carousel
		interval: number; // Carousel interval (seconds)
	};
	zIndex?: number; // Z-index, ensure wallpaper is displayed at the correct layer
	opacity?: number; // Wallpaper opacity, between 0-1
	blur?: number; // Background blur amount, in px
};
