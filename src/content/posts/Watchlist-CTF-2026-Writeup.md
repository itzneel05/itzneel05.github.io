---
title: "Watchlist CTF 2026 - Writeup"
published: 2026-09-20
tags: ["ctf", "writeup", "forensics", "osint", "crypto", "dfir", "watchlist"]
description: "A writeup covering the challenges solved during Watchlist CTF 2026, where our team justAdapt placed 51st out of 213 teams."
category: CTF Writeups
---

We recently competed in the **Watchlist CTF** and managed to secure **51st place out of 213 teams** as team justAdapt! I've put together writeups covering the challenges we solved during the event.

The whole CTF was themed around *Westworld* — Aletheia, Decima, Northern Lights, The Machine — and every challenge asked for a flag in the `number{...}` format. It was mostly forensics-heavy, which was very much my kind of CTF. Solves below are ordered by points.

## 1. Reduced Footprint

### Challenge Overview
- **Category:** Lab
- **Points:** 100
- **Target:** SSH into a decommissioned "all quiet" node, find the three things that look legit (one isn't), and extract a hidden key.

### The Approach & Solution
We got SSH credentials to a node that was supposedly cleaned up. The MOTD said *"nothing to see here"* — classic.

- SSH Access: Connected to `node0447` as the investigator user. Home dir had `notes.txt`, which told us to look for three artifacts.
- System Enumeration: Checked `/etc/systemd/system/` for anything that still "wakes on a schedule". Found `sysupdate.service` + `sysupdate.timer` running a script from a **hidden directory** — `/usr/local/lib/.sysupdate/run.sh`. The dot-prefix was mimicking legit system tooling.
- Accidental Evidence: `/home/relay/` had a `cleanup.sh` and a leftover `.bash_history`. The author tried to wipe history with `history -c`, but that only clears memory, not the file already written to disk. The script even had a "TODO finish before handoff" comment.

The flag was a base64 token sitting right in the helper script:

```bash
echo 'bnVtYmVye3RoZV9mb290cHJpbnRfd2FzX25ldmVyX3JlZHVjZWR9' | base64 -d
# number{the_footprint_was_never_reduced}
```

<details><summary>Flag</summary>

`number{the_footprint_was_never_reduced}`

</details>

## 2. Satoshi

### Challenge Overview
- **Category:** Trivia
- **Points:** 100
- **Target:** Solve a riddle pointing at "the day the Machine was tested for the first time, somewhere else another system was being born."

### The Approach & Solution
No files this time, just a riddle. The clue mentioned a "first transmission" on **Jan 3, 2009** that embedded a sentence quoted from a newspaper of that morning about failed institutions needing something different.

That's unmistakably the **Bitcoin genesis block**. Satoshi Nakamoto embedded The Times headline in the coinbase transaction's scriptSig — partly as a timestamp proof, partly as commentary on the 2008 financial crisis.

- Recognized the reference: The Times 03/Jan/2009, the exact embedded sentence.
- Hashed it: Ran the exact string through SHA-256 and took the first 16 hex chars lowercase.

```python
import hashlib
s = "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
print(hashlib.sha256(s.encode()).hexdigest()[:16])  # a6d72baa3db900b0
```

<details><summary>Flag</summary>

`number{a6d72baa3db900b0}`

</details>

## 3. Witness

### Challenge Overview
- **Category:** POI
- **Points:** 250
- **Target:** Fact-check a manager's HR statement against badge logs, email, and a photo "evidence" exhibit.

### The Approach & Solution
A zip with four files: a manager's written statement accusing his employee of stalking, a SQLite badge-access database, the employee's mbox email export, and a JPEG screenshot. The statement gave two exact times to verify: **21:00** (he saw her outside) and **21:15** (she texted him a threat) on 13 March.

- Badge Logs: Filtered `badge_events` for the exact names. Maya badged **out at 18:30** and never came back. Pierce badged into `SL2-MAIN` (a restricted sub-level) at 19:40 and **didn't leave until 21:18** — he was locked in a restricted room the entire window he claims to have been outside watching her.
- Email: Maya's mbox showed a home-network device login at ~20:03 and an **ethics complaint submission at 21:07** — she was home filing a complaint against him, not outside threatening him.
- EXIF: The 'evidence' screenshot was edited in **Adobe Photoshop at 01:22 on March 14** — over four hours after the claimed 21:15 receipt, and Photoshopped rather than a native phone capture. The story fell apart in three layers.

The answer was the case reference in the complaint's `X-Case-Ref` header.

<details><summary>Flag</summary>

`number{AR-ETH-884213}`

</details>

## 4. Signal

### Challenge Overview
- **Category:** Lab (Network / PCAP)
- **Points:** 200
- **Target:** Find a covert C2 channel hidden inside ten hours of ordinary DNS noise.

### The Approach & Solution
A ~16,000 packet capture that was almost entirely DNS — the "noise" the challenge mentioned. The instruction said *READ the pcap*, find what the implant said, what it was told, and "ask the same question it did."

- Anomaly Spotting: Three odd patterns stood out — `*.k.enroll.rl7f3a.net` queries with a hex char + two-digit sequence, underscore-prefixed TXT queries (`_msg`, `_note`, `_root`...), and `sync.relay-7f3a.rl7f3a.net` returning oversized TXT responses.
- Enrollment Channel: Reading the hex chars in sequence order (`a.00`, `7.01`, `f.02`, `3.03`, `c.04`, `1.05`) gave the implant's session ID: **a7f3c1**.
- C2 Sync Script: Five chunked base64 TXT responses reassembled into a tiny Perl script — the implant's sync code. It pointed to `https://l200-c2.xonnie.ai/telemetry/sync` and took the session ID as a `sid` parameter.

"Ask the same question it did" meant just querying the endpoint with the recovered SID:

```bash
curl -s "https://l200-c2.xonnie.ai/telemetry/sync?sid=a7f3c1"
```

The JSON response contained a base64 `auth_token`:

```bash
echo "bnVtYmVye3RoZV9jb25maWdfd2FzX3RoZV9wYXlsb2FkfQ==" | base64 -d
# number{the_config_was_the_payload}
```

<details><summary>Flag</summary>

`number{the_config_was_the_payload}`

</details>

## 5. Checkpoint

### Challenge Overview
- **Category:** Lab (Database / SQLite)
- **Points:** 250
- **Target:** Recover a record purged from a seized node before the SQLite database wrote back.

### The Approach & Solution
We got a tarball with a SQLite database in **WAL (Write-Ahead Logging) mode** — `surveillance.db` plus `-wal` and `-shm` files. An operator had deleted one record right before the node was seized, and the WAL was never checkpointed.

- The trap: Opening the DB in a normal client triggers a checkpoint, which flushes and destroys the recoverable data. The README explicitly warned about this.
- The lead: The `analyst_log` table recorded a purge directive — the target was flagged `RELEVANT` and its alias ended in `0001`. A query on the main table came back empty (the row was gone from there).
- The recovery: In WAL mode, deletes are recorded in the WAL, which still holds the pre-deletion page images until a checkpoint. So I just pulled strings out of the WAL:

```bash
strings surveillance.db-wal | grep "0001"
```

That surfaced the deleted row: alias `PRIMARY`, ssn `000-00-0001`, status `RELEVANT`, and a base64 `intel` field. Decoding it gave the flag.

<details><summary>Flag</summary>

`number{the_log_remembers_what_the_table_forgot}`

</details>

## 6. Trap Street

### Challenge Overview
- **Category:** Forensics (Honeypot / Log Analysis)
- **Points:** 250
- **Target:** Find the one real human visitor in ~70 days of Cowrie SSH honeypot noise and follow the canary file they took.

### The Approach & Solution
Three directories: `logs/` (Cowrie JSON), `downloads/` (SHA-named files), `tty/` (raw session recordings) — plus a `cowrie.json.decoys` manifest listing the automated bot downloads.

- Diff the downloads: Comparing the `downloads/` folder against the decoy manifest left exactly **one** file that wasn't on the decoy list — `c9c34aa1...`. `file` confirmed it was an Excel 2007+ file. Canary found.
- Trace the session: Grepping the logs for the session returned 20 events. A human hit at `3.84.226.129`, logged in with default creds (`root` / `123456`), ran basic recon, `wget`-ed the canary from a Cloudflare Workers URL, ran `history -c`, and closed the session 59 seconds later. Classic cover-up behavior.
- Read the xlsx: Excel files are ZIP archives. Extracting the XML showed two visible roster sections plus rows 30-35 that *looked* empty — but they held URL fragments styled near-invisible (gray 8pt italic and pure white font on white background) and a hidden formula `=A30&A31&A32&A33` stitching them together.
- Follow the callback: The formula built `https://transit.ottrargal.workers.dev/checkin?id=NLA-2026-04`, the canary's beacon URL. Fetching it returned the flag.

<details><summary>Flag</summary>

`number{shaw_followed_the_breadcrumbs}`

</details>

## 7. Tmpfs

### Challenge Overview
- **Category:** Forensics (Memory Analysis)
- **Points:** 300
- **Target:** Recover secrets from a LiME memory dump of an operative who deleted his files before capture.

### The Approach & Solution
A ~2 GB LiME memory dump (with a Volatility symbol file) of an operative named Marcus Reyes. He'd deleted his files, believing "erased on screen" meant gone everywhere. The RAM held everything.

- Dead end: I started with Volatility plugins (`linux.pslist`, `linux.bash`, etc.) and they crawled for minutes on a 2 GB dump. Wrong first move.
- Fast triage: `strings` + `grep` found the `VLT1` magic, a base64 vault blob, and the assembled AES key almost instantly. Lesson: don't overcomplicate the first step.

```bash
strings reyes.lime | grep -B2 -A2 "VLT1"
```

- Split key: The dumped bash history told the whole story. The operative's session (PID 1450) showed him wiping `.vault.enc`, `vault.py`, and `notes.txt` from `/tmp/.cache`. The author's own session (PID 1365) had the full decryption command — the AES-128-CBC key split between an env var (`VAULT_KEY_HEAD`) and a CLI arg (`KEY_TAIL`): `8b3f7e2a1c4d6f9b0e8a7c5d2f1b3e6a`.
- Decrypt: Decoded the base64 blob, stripped the 4-byte `VLT1` header, and decrypted with an all-zero IV:

```bash
tail -c +5 vault.enc > ct.bin
openssl enc -d -aes-128-cbc -K 8b3f7e2a1c4d6f9b0e8a7c5d2f1b3e6a -iv 00000000000000000000000000000000 -in ct.bin -out flag.txt
```

The decrypted JSON held the operative's auth phrase: `volatile_storage_has_a_half_life`.

<details><summary>Flag</summary>

`number{volatile_storage_has_a_half_life}`

</details>

## 8. Mirror Sites

### Challenge Overview
- **Category:** Forensics (Cloud / Incident Response)
- **Points:** 400
- **Target:** Prove that a senior engineer exfiltrated a client dataset across GCP, AWS, and Azure — correlated by a single fingerprint.

### The Approach & Solution
Three log directories (GCP audit + inventory, AWS CloudTrail + S3 access + inventory, Azure activity + storage + blob inventory) and a README warning that "the data carried the same fingerprint into every cloud it touched."

- GCP: `admin_activity` showed adrian.kessler creating a `svc-dataflow-relay` service account at 23:37, its key at 23:43, and `storage.objectViewer` access at 23:46. `data_access` showed BigQuery queries from him using wildly different user-agents (azure-storage-blob, aws-cli, boto3, gsutil...) — the sign of one person hopping environments.
- AWS: CloudTrail only covered pre-incident dates, so the S3 server access logs were the real evidence. Found `ds_0917.bin` — a 29,201-byte object with ETag `c47f74a1d55cf905790b9c97b4640730`, then a 38-byte decoy overwrite. Logs showed PUT, GET, then overwrite from one IP.
- Azure: A deleted blob `backup_final.dat`, same size (29,201), with a `Content-MD5` of `xH90odVc+QV5C5yXtGQHMA==`. Base64-decoding that gave `c47f74a1d55cf905790b9c97b4640730` — **the same hash as the AWS ETag**. Same content fingerprint in both clouds.
- Matching in GCP: Searching the GCP inventory for a 29,201-byte object found `nl_client_roster_2026Q4.xlsx` with the same MD5 and a `CLIENT-CONFIDENTIAL` classification.

Three clouds, one object, one hash. Each cloud's inventory slapped a base64 `mfrag` metadata fragment on it, and together they spelled the flag.

<details><summary>Flag</summary>

`number{the_clouds_do_not_speak_to_each_other_but_we_do}`

</details>

## 9. Mission Creep

### Challenge Overview
- **Category:** Lab (DFIR / Disk Image)
- **Points:** 400
- **Target:** Reconstruct an attacker's full path — entry, persistence, privilege escalation, exfiltration — from a disk image.

### The Approach & Solution
A decommissioned Ubuntu 22.04 disk image (`relay-07.img.xz`) of a box flagged for anomalous outbound traffic.

- Mounting: The image uses LVM, so plain `mount` won't work. `xz -dk` to decompress, then `guestmount -a relay-07.img -i --ro` to mount it read-only (forensically sound) — guestmount handles LVM transparently.
- The false lead: `auth.log` was almost all SSH brute-force traffic — background noise, all failed. Not the entry, just internet radiation. The real entry was in `nginx access.log`: a `POST /upload.php` from `203.0.113.7`, followed by webshell command executions (`sess_4f1c.php?c=...`) that downloaded and ran a dropper.
- Persistence: `/etc/systemd/system/` had `cleanup.service` + `cleanup.timer` running every 15 minutes, executing `/usr/local/sbin/.sysupd` — a script that re-applies the SUID bit to `/usr/bin/pkexec` (PwnKit, CVE-2021-4034) every cycle so the privesc stays warm after patches.
- Exfiltration: `/var/tmp/.x/` held `core.exfil.1551` (a 2.8 MB ELF core dump) and `loot.tgz` (target dossiers staged for exfil, handler "northern lights").
- The flag: the challenge hint said strings on text files wouldn't find it — so I ran `strings` on the **binary**:

```bash
strings core.exfil.1551 | grep -i flag
# relay exfil channel auth = number{a_foothold_is_never_just_a_foothold}
```

<details><summary>Flag</summary>

`number{a_foothold_is_never_just_a_foothold}`

</details>

## 10. Endgame

### Challenge Overview
- **Category:** POI / Cryptographic Forensics
- **Points:** 450
- **Target:** Prove who an anonymous data-export service account really is, decrypt their encrypted plan, and report the crime.

### The Approach & Solution
The finale of the Person-of-Interest series. Artifacts: a badge-access SQLite DB, an audit export log, an AES-GCM encrypted operation note, a personnel PDF, and an evidence cache with a recovered device key.

- The flaw: The building's access-control system signs badge events and export requests with the **same per-device HMAC key** — `HMAC_SHA256(device_key, identifier || timestamp)[:16 hex]`. Find a second where an export and a badge event collide and you can prove one person did both.
- The collision: At `2026-03-13T19:40:33`, the audit log showed `svc_export_04` firing a bulk export with signature `954698a53a1c93f9`. The badge DB showed `Daniel Pierce` (AR-304-77-1592) entering `SL2-MAIN` with token `8bb15baca2401b57`. Both matched the HMAC for the same key. Smoking gun — Pierce is the anonymous exporter.
- The decrypt: Key derivation was `SHA256(Maya's designation || "SL2-MAIN" || SHA256(exhibit_A.jpg))`. Maya's designation came from the personnel PDF; the exhibit hash from `sha256sum`. Decrypting `pierce_plan.enc` with AES-256-GCM (12-byte nonce + ciphertext with GCM tag) revealed Pierce's plan to "silence" Maya Cole at a fake meeting, and his signature `[designation on file: 304771592]`.

<details><summary>Flag</summary>

`number{304771592}`

</details>

---

Honestly this was a really fun CTF and the first time I did proper forensics-heavy challenges — memory analysis, WAL recovery, DNS exfil, disk images, cross-cloud correlation. Big thanks to the rest of justAdapt for grinding through the event with me. Watchlist CTF, definitely coming back for the next one. Happy hacking!