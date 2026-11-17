---
title: "Maltego community OSINT CTF - Qualifier B - 2026"
published: 2026-11-17
tags: ["ctf", "osint", "maltego", "writeup"]
description: "A writeup covering some of the OSINT challenges solved during Maltego OSINT CTF 2026 Qualifier B, where our team justAdapt placed 12th out of 217 teams with 11,740 points."
category: CTF Writeups
---

The B round finally happened in November 2026, and this time our team **justAdapt** finished **12th out of 217 teams with 11,740 points**. The squad was justChill (me), rexus, and Apexdator, representing Gujarat University - DBFS, India.

We solved 41 challenges across geolocation, maritime, brand protection, fraud, due diligence, threat intelligence, social media, and more — with a couple of hints along the way (-40 pts). Below are writeups for a selection of the interesting ones.

## 1. Vessel Identification

### Challenge Overview
- **Category:** Maritime OSINT
- **Points:** 100
- **Target:** Identify the vessel in a short video clip and extract its Maritime Mobile Service Identity (MMSI) number.

### The Approach & Solution
This one gave us a short video clip of a large cruise ship docked at night near a city skyline, and we had to pull its MMSI number out of thin air. Here's how it went:

- Visual ID: The ship had the illuminated blue Crown & Anchor logo, the glass AquaDome at the bow, and a very distinct superstructure. That combo pointed straight to Royal Caribbean's **Icon of the Seas**, docked at PortMiami.
- AIS Lookup: With the ship identified, I pulled its AIS details — **IMO 9829930**, call sign **C6FU5** — which gave me the MMSI.

### Flag
`Flag: flag{311001178}`

## 2. The Brewery Trail - 1

### Challenge Overview
- **Category:** Geolocation
- **Points:** 100
- **Target:** Analyze a video recorded near a conference center and identify the full name of the venue. The only clue is a conversation mentioning the smell of a nearby brewery.

### The Approach & Solution
With just a video clip and a passing mention of a brewery smell, I didn't overthink it:

- Reverse Image Search: I pulled one promising frame out of the video and threw it into reverse image search. That gave me the general location right away — **Mechelen, Belgium**.
- Narrowing it down: From there I matched the street scene in the footage to the area and spotted a familiar corner storefront, which pinned down the exact spot.
- Following the brewery clue: Following that lead landed us on the nearby conference venue — the **Lamot Congress and Heritage Centre**.
- Formatting: The flag wanted the full name in lowercase with underscores, and the "center" spelling ended up being the one that worked.

### Flag
`Flag: flag{lamot_congress_and_heritage_center}`

## 3. The Hotel Observer

### Challenge Overview
- **Category:** Geolocation
- **Points:** 100
- **Target:** Identify the hotel from which a photograph was captured, using landmarks and environmental features in the image.

<img src="/assets/images/posts/Maltego-CTF-Qualifier-B/The_Hotel_Observer.jpeg" width="300" />

### The Approach & Solution
This one played out almost exactly like the previous geolocation challenge:

- Reverse Image Search: I ran the image through reverse image search first, same as always.
- The giveaway: There was a banner in the frame that literally read **"PAVILION SQUARE"**. That basically handed us the area.
- Street View: I jumped over to that spot on Street View and matched the three-way road junction from the image to the layout on the ground.
- Hotel found: Once the road lined up, it was clear the photo had been taken from the **Pavilion Hotel**.

### Flag
`Flag: flag{Pavilion_Hotel}`

## 4. Hidden Stay: The Vagator Mystery - 1

### Challenge Overview
- **Category:** Geolocation
- **Points:** 200
- **Target:** Identify the complete name of the Airbnb resort shown in a nighttime photo of a pool and apartment building. The only hint is that the property is somewhere near Vagator Beach.

<img src="/assets/images/posts/Maltego-CTF-Qualifier-B/Hidden_Stay_The_Vagator_Mystery_-_1.jpg" width="300" />

### The Approach & Solution
- Reverse Image Search: I ran the photo through a visual search and got a match for **Lillywoods Highland Beach Resort** in Candolim, Goa. The architecture and pool layout looked close, but the location didn't fit the prompt.
- Applying the constraint: The challenge specifically said Vagator Beach, so I discarded the Candolim result and searched again within that area.
- Property identified: That led to **Urja Resort Casablanca** — a Casablanca Complex property on Vagator Beach Road in Vagator/Chapora, North Goa. The four-story cream building with red-trimmed ledges, external AC units, and the curved pebble-bordered pool with a circular kids' pool all matched.
- Formatting: lowercase, underscores instead of spaces.

### Flag
`Flag: flag{urja_resort_casablanca}`

## 5. The Corporate Hardware

### Challenge Overview
- **Category:** Physical Security
- **Points:** 100
- **Target:** Identify the primary laptop brand used by ING-DiBa employees in Frankfurt, Germany.

### The Approach & Solution
A nice simple one, with a small detour:

- First guess: I went with **Lenovo**, purely on the assumption that every big bank runs on ThinkPads. That was wrong.
- Employee reviews: I switched over to kununu and went through ING Deutschland reviews from the Frankfurt office. One intern review listed "moderne personal Hardware (HP Notebook & neues Iphone)" as a plus point.
- Answer: That was enough to confirm **HP** as the primary brand.

### Flag
`Flag: flag{HP}`

## 6. Tracing a Dead Domain - 1

### Challenge Overview
- **Category:** Due Diligence
- **Points:** 100
- **Target:** Identify the CMS that was previously used to build the now-parked domain chubert.fr.

### The Approach & Solution
- Initial searches on the domain turned up nothing useful.
- A screenshot of the site's footer, with its "CHUBERT Formation @ 2018" copyright and RSS icon, pointed towards WordPress.
- I confirmed it by pulling an archived copy of the site from the Wayback Machine — the page source had the usual WordPress fingerprints.

### Flag
`Flag: flag{WordPress}`

## 7. Eyes From Orbit

### Challenge Overview
- **Category:** Chronolocation
- **Points:** 100
- **Target:** Analyze satellite imagery of an October incident and identify the company or facility that was targeted.

<img src="/assets/images/posts/Maltego-CTF-Qualifier-B/Eyes_From_Orbit.png" width="300" />

### The Approach & Solution
- Reverse Image Search: I just ran the satellite image through reverse image search and got it almost immediately.
- The huge smoke plume over the industrial complex matched coverage of the attack on **Saudi Aramco**'s facilities.

### Flag
`Flag: flag{Saudi_Aramco}`

## 8. Behind the Ransom Note - 1

### Challenge Overview
- **Category:** Dark Web
- **Points:** 100
- **Target:** Analyze a ransom note from a suspected ransomware incident and identify the threat group responsible.

<img src="/assets/images/posts/Maltego-CTF-Qualifier-B/Behind_the_Ransom_Note.png" width="300" />

### The Approach & Solution
- I compared the note's structure and wording against known ransomware templates — the three headings, the opening lines, the "we are not politically motivated" guarantee, and the Tor contact flow all matched.
- Threat intel profiles confirmed the group as **BlackMatter**. The missing "1TB downloaded" line is just a per-victim insertion, and Shanova copies the same wording rather than originating it.

### Flag
`Flag: flag{BlackMatter}`

## 9. Tracing Vessel Identity Across Flag Changes - 1

### Challenge Overview
- **Category:** Maritime
- **Points:** 100
- **Target:** From a vessel photograph, find its current MMSI and the two flag states it operated under while named "Range \*\*\*\*".

<img src="/assets/images/posts/Maltego-CTF-Qualifier-B/Tracing_Vessel_Identity_Across_Flag_Changes_-_1.jpg" width="300" />

### The Approach & Solution
- Vessel ID: The ship in the photo was the crude oil tanker **Pelagos One** (IMO 9299898, built 2005).
- Current identity: Cross-referencing maritime databases showed it now sails as **Palara**, with MMSI **667002277**.
- Name history: Its past names included **Range Vale** (September 2025 to March 2026), which matched the "Range \*\*\*\*" hint.
- Flag states: Looking at the registrations during that period gave **Comoros** and **Zimbabwe**. The prompt said to ignore any annotations attached to a flag, so the note attached to the Zimbabwe record didn't disqualify it.
- Formatting: MMSI followed by the two flag nations in alphabetical order.

### Flag
`Flag: flag{667002277_Comoros_Zimbabwe}`

Honestly, a lot of these came down to reverse image search and a bit of AI-assisted digging, and it worked out — 12th out of 217 teams with 11,740 points, up from 15th in Qualifier A. We were closer to the top 10 than I'd like to admit, just 600 points away, but no finals this time. Maybe next time. These are just a handful of the 41 challenges we solved; I'll leave the rest for another day. Happy hacking!

