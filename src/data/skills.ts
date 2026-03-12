// Skill data configuration file
// Used to manage data for the skill display page

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "security" | "tools" | "other" | "programming";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // Related project IDs
	certifications?: string[];
	color?: string; // Skill card theme color
}

export const skillsData: Skill[] = [
	{
		id: "penetration-testing",
		name: "Penetration Testing",
		description:
			"Identifying vulnerabilities and weaknesses in systems and applications.",
		icon: "simple-icons:hackthebox",
		category: "security",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		projects: [],
		color: "#FF3333",
	},
	{
		id: "vulnerability-assessment",
		name: "Vulnerability Assessment",
		description:
			"Systematic review of security weaknesses in an information system.",
		icon: "simple-icons:qualys",
		category: "security",
		level: "intermediate",
		experience: { years: 0, months: 6 },
		projects: [],
		color: "#FF9900",
	},
	{
		id: "bug-bounty",
		name: "Bug Bounty",
		description:
			"Participating in bug bounty programs to discover and report security vulnerabilities.",
		icon: "simple-icons:bugcrowd",
		category: "security",
		level: "beginner",
		experience: { years: 0, months: 4 },
		projects: [],
		color: "#66CC66",
	},
	{
		id: "network-security",
		name: "Network Security",
		description:
			"Securing computer networks from intruders, attacks, and unauthorized access.",
		icon: "simple-icons:cloudflare",
		category: "security",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: [],
		color: "#3366FF",
	},
	{
		id: "web-application-security",
		name: "Web Application Security",
		description:
			"Protecting web applications from various attacks like XSS, SQLi, CSRF.",
		icon: "simple-icons:owasp",
		category: "security",
		level: "intermediate",
		experience: { years: 0, months: 10 },
		projects: [],
		color: "#FF6666",
	},
	{
		id: "linux",
		name: "Linux",
		description:
			"Proficiency in Linux operating systems for security tasks and system administration.",
		icon: "logos:linux-tux",
		category: "tools",
		level: "advanced",
		experience: { years: 2, months: 0 },
		projects: [],
		color: "#FCC624",
	},
	{
		id: "nmap",
		name: "Nmap",
		description: "Network discovery and security auditing with Nmap.",
		icon: "simple-icons:nmap",
		category: "tools",
		level: "intermediate",
		experience: { years: 0, months: 8 },
		projects: [],
		color: "#72D672",
	},
	{
		id: "burp-suite",
		name: "Burp Suite",
		description: "Web vulnerability scanner and proxy tool.",
		icon: "simple-icons:burpsuite",
		category: "tools",
		level: "intermediate",
		experience: { years: 0, months: 10 },
		projects: [],
		color: "#FF7F50",
	},
	{
		id: "metasploit",
		name: "Metasploit",
		description:
			"Penetration testing framework for developing and executing exploit code.",
		icon: "simple-icons:metasploit",
		category: "tools",
		level: "beginner",
		experience: { years: 0, months: 6 },
		projects: [],
		color: "#0066FF",
	},
	{
		id: "python-scripting",
		name: "Python Scripting",
		description: "Writing Python scripts for automation and security tasks.",
		icon: "logos:python",
		category: "programming",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: [],
		color: "#3776AB",
	},
	{
		id: "javascript",
		name: "JavaScript",
		description:
			"Understanding JavaScript for web application analysis and exploitation.",
		icon: "logos:javascript",
		category: "programming",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: [],
		color: "#F7DF1E",
	},
	{
		id: "html-css",
		name: "HTML/CSS",
		description:
			"Proficiency in front-end web technologies for web security assessments.",
		icon: "logos:html-5",
		category: "programming",
		level: "intermediate",
		experience: { years: 1, months: 0 },
		projects: [],
		color: "#E34C26",
	},
	{
		id: "os-exploitation",
		name: "OS Exploitation",
		description:
			"Understanding and exploiting vulnerabilities in operating systems.",
		icon: "simple-icons:kalilinux",
		category: "security",
		level: "beginner",
		experience: { years: 0, months: 6 },
		projects: [],
		color: "#5C2B7D",
	},
	{
		id: "ctf",
		name: "CTF",
		description:
			"Participating in Capture The Flag competitions to hone cybersecurity skills.",
		icon: "mdi:flag",
		category: "security",
		level: "intermediate",
		experience: { years: 0, months: 10 },
		projects: [],
		color: "#FFD700",
	},
];

// Get skill statistics
export const getSkillStats = () => {
	const total = skillsData.length;
	const byLevel = {
		beginner: skillsData.filter((s) => s.level === "beginner").length,
		intermediate: skillsData.filter((s) => s.level === "intermediate").length,
		advanced: skillsData.filter((s) => s.level === "advanced").length,
		expert: skillsData.filter((s) => s.level === "expert").length,
	};
	const byCategory = {
		security: skillsData.filter((s) => s.category === "security").length,
		tools: skillsData.filter((s) => s.category === "tools").length,
		programming: skillsData.filter((s) => s.category === "programming").length,
		other: skillsData.filter((s) => s.category === "other").length,
	};

	return { total, byLevel, byCategory };
};

// Get skills by category
export const getSkillsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return skillsData;
	}
	return skillsData.filter((s) => s.category === category);
};

// Get advanced skills
export const getAdvancedSkills = () => {
	return skillsData.filter(
		(s) => s.level === "advanced" || s.level === "expert",
	);
};

// Calculate total years of experience
export const getTotalExperience = () => {
	const totalMonths = skillsData.reduce((total, skill) => {
		return total + skill.experience.years * 12 + skill.experience.months;
	}, 0);
	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
