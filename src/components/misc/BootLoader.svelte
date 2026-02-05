<script lang="ts">
import { onMount } from "svelte";
import { fade } from "svelte/transition";

let visible = false;
let logs: string[] = [];
let logContainer: HTMLElement;

const bootMessages = [
	"[  OK  ] Started Early Binary Load.",
	"[  OK  ] Reached target File System Check on /dev/disk/by-uuid/NEEL-2026.",
	"[  OK  ] Mounted /home/itzneel/workspace.",
	"[  OK  ] Started Network Name Resolution.",
	"[  OK  ] Established Secure Tunnel via OpenSSH.",
	"[  OK  ] Found device /dev/input/creative-module.",
	"[  OK  ] Started Astro Content Layer Service.",
	"[  OK  ] Initializing Tailwind CSS Engine...",
	"[  OK  ] Loaded 1024MB of Research & Projects.",
	"[  OK  ] Syncing with GitHub Repositories.",
	"[  OK  ] Reached target System Initialization.",
	"[  OK  ] Started Daily Cleanup of Temporary Directories.",
	"[  OK  ] Reached target Graphical Interface.",
	"[  OK  ] Established Session: user@itzneel-space.",
	"Welcome to ItzNeel's Space v1.0.0!",
];

onMount(() => {
	const hasVisited = sessionStorage.getItem("neel-boot-sequence");
	if (!hasVisited) {
		visible = true;
		// Remove the global loading class once the component is mounted and visible
		// This prevents a flash of content while transferring control from CSS to Svelte
		requestAnimationFrame(() => {
			document.documentElement.classList.remove("boot-loading");
		});
		runBootSequence();
	}
});

async function runBootSequence() {
	for (const msg of bootMessages) {
		await new Promise((r) => setTimeout(r, Math.random() * 100 + 50));
		logs = [...logs, msg];
		if (logContainer) {
			logContainer.scrollTop = logContainer.scrollHeight;
		}
	}

	await new Promise((r) => setTimeout(r, 800));
	visible = false;
	sessionStorage.setItem("neel-boot-sequence", "true");
}
</script>

{#if visible}
    <div class="boot-loader" out:fade={{ duration: 500 }}>
        <div class="log-container" bind:this={logContainer}>
            {#each logs as log}
                <div class="log-line">
                    {#if log.startsWith('[  OK  ]')}
                        <span class="text-green-500 font-bold">[  OK  ]</span> {log.substring(9)}
                    {:else}
                        {log}
                    {/if}
                </div>
            {/each}
            <div class="cursor-blink">_</div>
        </div>
    </div>
{/if}

<style>
    .boot-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #000;
        z-index: 9999;
        padding: 2rem;
        font-family: 'JetBrains Mono', 'Fira Code', monospace;
        color: #fff;
        overflow: hidden;
        pointer-events: none; /* Allow clicks to pass through if it gets stuck */
    }

    .log-container {
        height: 100%;
        overflow-y: auto;
        scrollbar-width: none; /* Firefox */
    }
    
    .log-container::-webkit-scrollbar {
        display: none; /* Chrome/Safari */
    }

    .log-line {
        margin-bottom: 0.25rem;
        white-space: pre-wrap;
        font-size: 14px;
        line-height: 1.5;
    }

    .cursor-blink {
        display: inline-block;
        animation: blink 1s step-end infinite;
        color: #fff;
    }

    @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
    }
    
    /* Mobile optimization */
    @media (max-width: 768px) {
        .boot-loader {
            padding: 1rem;
        }
        .log-line {
            font-size: 12px;
        }
    }
</style>
