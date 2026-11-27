#!/usr/bin/env python3
"""
Modern Flash SFX Curation & Audio Asset Pipeline
Extracts, converts, and categorises retro sound effects from source directories
into a unified, lightweight, single-format (.m4a / AAC) library with comprehensive
JSON metadata and TypeScript declarations.
"""

import os
import sys
import json
import subprocess
import re
from pathlib import Path

SFX_SOURCE_DIR = Path("/Users/milky/My Drive/GitHub/sfx")
REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "public" / "sfx"
CATALOG_TS_PATH = REPO_ROOT / "src" / "Sound" / "soundCatalog.ts"

# Selected curated sound list mapping:
# (source_pack, source_subpath, dest_category, sound_id, human_name, tags)
CURATED_SOUNDS = [
    # --- UI (BlipBoom) ---
    ("blip", "ui/ui_click_01.wav", "ui", "ui/click-01", "Click 01", ["ui", "click", "button", "tap"]),
    ("blip", "ui/ui_click_02.wav", "ui", "ui/click-02", "Click 02", ["ui", "click", "button", "soft"]),
    ("blip", "ui/ui_click_03.wav", "ui", "ui/click-03", "Click 03", ["ui", "click", "button", "tick"]),
    ("blip", "ui/ui_hover_01.wav", "ui", "ui/hover-01", "Hover 01", ["ui", "hover", "focus"]),
    ("blip", "ui/ui_hover_02.wav", "ui", "ui/hover-02", "Hover 02", ["ui", "hover", "focus", "subtle"]),
    ("blip", "ui/ui_confirm_01.wav", "ui", "ui/confirm-01", "Confirm 01", ["ui", "confirm", "accept", "success"]),
    ("blip", "ui/ui_confirm_02.wav", "ui", "ui/confirm-02", "Confirm 02", ["ui", "confirm", "accept", "bell"]),
    ("blip", "ui/ui_confirm_03.wav", "ui", "ui/confirm-03", "Confirm 03", ["ui", "confirm", "accept", "chime"]),
    ("blip", "ui/ui_cancel_01.wav", "ui", "ui/cancel-01", "Cancel 01", ["ui", "cancel", "back", "dismiss"]),
    ("blip", "ui/ui_cancel_02.wav", "ui", "ui/cancel-02", "Cancel 02", ["ui", "cancel", "back", "drop"]),
    ("blip", "ui/ui_cancel_03.wav", "ui", "ui/cancel-03", "Cancel 03", ["ui", "cancel", "back"]),
    ("blip", "ui/ui_toggle_on_01.wav", "ui", "ui/toggle-on", "Toggle On", ["ui", "toggle", "switch", "on"]),
    ("blip", "ui/ui_toggle_off_01.wav", "ui", "ui/toggle-off", "Toggle Off", ["ui", "toggle", "switch", "off"]),
    ("blip", "ui/ui_open_01.wav", "ui", "ui/open-01", "Menu Open 01", ["ui", "open", "modal", "dialog"]),
    ("blip", "ui/ui_open_02.wav", "ui", "ui/open-02", "Menu Open 02", ["ui", "open", "drawer", "pop"]),
    ("blip", "ui/ui_close_01.wav", "ui", "ui/close-01", "Menu Close 01", ["ui", "close", "modal", "dismiss"]),
    ("blip", "ui/ui_close_02.wav", "ui", "ui/close-02", "Menu Close 02", ["ui", "close", "drawer"]),
    ("blip", "ui/ui_error_01.wav", "ui", "ui/error-01", "Error 01", ["ui", "error", "alert", "deny"]),
    ("blip", "ui/ui_error_02.wav", "ui", "ui/error-02", "Error 02", ["ui", "error", "warning", "buzz"]),

    # --- PICKUPS & REWARDS (BlipBoom) ---
    ("blip", "pickup/pickup_coin_01.wav", "pickups", "pickups/coin-01", "Coin Pickup 01", ["pickup", "coin", "gold", "reward"]),
    ("blip", "pickup/pickup_coin_02.wav", "pickups", "pickups/coin-02", "Coin Pickup 02", ["pickup", "coin", "gold", "reward"]),
    ("blip", "pickup/pickup_coin_03.wav", "pickups", "pickups/coin-03", "Coin Pickup 03", ["pickup", "coin", "gold", "reward"]),
    ("blip", "pickup/pickup_coin_04.wav", "pickups", "pickups/coin-04", "Coin Pickup 04", ["pickup", "coin", "gold", "reward"]),
    ("blip", "pickup/pickup_gem_01.wav", "pickups", "pickups/gem-01", "Gem Pickup 01", ["pickup", "gem", "crystal", "sparkle"]),
    ("blip", "pickup/pickup_gem_02.wav", "pickups", "pickups/gem-02", "Gem Pickup 02", ["pickup", "gem", "crystal"]),
    ("blip", "pickup/pickup_gem_03.wav", "pickups", "pickups/gem-03", "Gem Pickup 03", ["pickup", "gem", "crystal", "rare"]),
    ("blip", "pickup/pickup_powerup_01.wav", "pickups", "pickups/powerup-01", "Powerup 01", ["pickup", "powerup", "boost"]),
    ("blip", "pickup/pickup_powerup_02.wav", "pickups", "pickups/powerup-02", "Powerup 02", ["pickup", "powerup", "upgrade"]),
    ("blip", "pickup/pickup_health_01.wav", "pickups", "pickups/health-01", "Health Pickup 01", ["pickup", "health", "heal", "heart"]),
    ("blip", "pickup/pickup_health_02.wav", "pickups", "pickups/health-02", "Health Pickup 02", ["pickup", "health", "heal"]),
    ("blip", "pickup/pickup_key_01.wav", "pickups", "pickups/key-01", "Key Pickup 01", ["pickup", "key", "unlock"]),
    ("blip", "pickup/pickup_key_02.wav", "pickups", "pickups/key-02", "Key Pickup 02", ["pickup", "key", "secret"]),
    ("blip", "pickup/pickup_key_03.wav", "pickups", "pickups/key-03", "Key Pickup 03", ["pickup", "key", "dungeon"]),

    # --- JINGLES & GAMEPLAY STATES (BlipBoom) ---
    ("blip", "jingle/jingle_start_01.wav", "jingles", "jingles/start", "Game Start Fanfare", ["jingle", "start", "begin", "fanfare"]),
    ("blip", "jingle/jingle_levelup_01.wav", "jingles", "jingles/levelup", "Level Up Chime", ["jingle", "levelup", "upgrade", "success"]),
    ("blip", "jingle/jingle_win_01.wav", "jingles", "jingles/win", "Victory Jingle", ["jingle", "win", "victory", "triumph"]),
    ("blip", "jingle/jingle_gameover_01.wav", "jingles", "jingles/gameover", "Game Over Lament", ["jingle", "gameover", "loss", "defeat"]),

    # --- MOVEMENT & WHOOSHES (BlipBoom + MM) ---
    ("blip", "jump/jump_basic_01.wav", "movement", "movement/jump-01", "Jump 01", ["movement", "jump", "hop"]),
    ("blip", "jump/jump_basic_02.wav", "movement", "movement/jump-02", "Jump 02", ["movement", "jump", "leap"]),
    ("blip", "jump/jump_basic_03.wav", "movement", "movement/jump-03", "Jump 03", ["movement", "jump", "air"]),
    ("blip", "jump/jump_double_01.wav", "movement", "movement/double-jump-01", "Double Jump 01", ["movement", "jump", "double"]),
    ("blip", "jump/jump_spring_01.wav", "movement", "movement/spring-01", "Spring Bounce 01", ["movement", "spring", "bounce", "boing"]),
    ("blip", "jump/jump_spring_02.wav", "movement", "movement/spring-02", "Spring Bounce 02", ["movement", "spring", "bounce"]),
    ("blip", "jump/jump_land_01.wav", "movement", "movement/land-01", "Feet Landing 01", ["movement", "land", "feet", "ground"]),
    ("mm", "Misc/m4a/Swipe1.m4a", "movement", "movement/swipe-01", "Swipe Whoosh 01", ["movement", "swipe", "whoosh", "transition"]),
    ("mm", "Misc/m4a/Swipe2.m4a", "movement", "movement/swipe-02", "Swipe Whoosh 02", ["movement", "swipe", "whoosh", "fast"]),
    ("mm", "Misc/m4a/Swipe3.m4a", "movement", "movement/swipe-03", "Swipe Whoosh 03", ["movement", "swipe", "whoosh", "deep"]),
    ("mm", "Misc/m4a/Slide1.m4a", "movement", "movement/slide-01", "Slide 01", ["movement", "slide", "glide"]),
    ("mm", "Vehicles/m4a/Skid1.m4a", "movement", "movement/skid-01", "Tire Skid 01", ["movement", "skid", "screech", "friction"]),
    ("mm", "Vehicles/m4a/Rev1.m4a", "movement", "movement/rev-01", "Engine Rev 01", ["movement", "engine", "rev", "motor"]),

    # --- COMBAT & WEAPONS (BlipBoom + MM) ---
    ("blip", "shoot/shoot_laser_01.wav", "combat", "combat/laser-01", "Laser Blast 01", ["combat", "laser", "shoot", "scifi"]),
    ("blip", "shoot/shoot_laser_02.wav", "combat", "combat/laser-02", "Laser Blast 02", ["combat", "laser", "shoot", "retro"]),
    ("blip", "shoot/shoot_laser_03.wav", "combat", "combat/laser-03", "Laser Blast 03", ["combat", "laser", "beam"]),
    ("blip", "shoot/shoot_laser_04.wav", "combat", "combat/laser-04", "Laser Blast 04", ["combat", "laser", "heavy"]),
    ("blip", "shoot/shoot_blaster_01.wav", "combat", "combat/blaster-01", "Blaster Shot 01", ["combat", "blaster", "plasma"]),
    ("blip", "shoot/shoot_blaster_02.wav", "combat", "combat/blaster-02", "Blaster Shot 02", ["combat", "blaster", "rapid"]),
    ("mm", "Guns/m4a/SciFiGun1.m4a", "combat", "combat/scifi-gun-01", "Sci-Fi Gun 01", ["combat", "scifi", "gun", "plasma"]),
    ("mm", "Guns/m4a/SciFiGun2.m4a", "combat", "combat/scifi-gun-02", "Sci-Fi Gun 02", ["combat", "scifi", "gun", "pulse"]),
    ("mm", "Guns/m4a/SciFiGun3.m4a", "combat", "combat/scifi-gun-03", "Sci-Fi Gun 03", ["combat", "scifi", "gun"]),
    ("mm", "Guns/m4a/SciFiGun4.m4a", "combat", "combat/scifi-gun-04", "Sci-Fi Gun 04", ["combat", "scifi", "gun", "zap"]),
    ("mm", "Guns/m4a/Gun1.m4a", "combat", "combat/gun-01", "Arcade Gun 01", ["combat", "gun", "arcade", "shot"]),
    ("mm", "Guns/m4a/Gun2.m4a", "combat", "combat/gun-02", "Arcade Gun 02", ["combat", "gun", "fire"]),
    ("mm", "Guns/m4a/Reload1.m4a", "combat", "combat/reload-01", "Weapon Reload", ["combat", "reload", "ammo", "mechanical"]),

    # --- EXPLOSIONS & BURSTS (BlipBoom + MM) ---
    ("blip", "explosion/explosion_small_01.wav", "explosions", "explosions/small-01", "Small Explosion 01", ["explosion", "small", "pop", "blast"]),
    ("blip", "explosion/explosion_small_02.wav", "explosions", "explosions/small-02", "Small Explosion 02", ["explosion", "small", "burst"]),
    ("blip", "explosion/explosion_large_01.wav", "explosions", "explosions/large-01", "Large Explosion 01", ["explosion", "large", "boom", "detonation"]),
    ("blip", "explosion/explosion_large_02.wav", "explosions", "explosions/large-02", "Large Explosion 02", ["explosion", "large", "heavy"]),
    ("mm", "Explosions/m4a/Explosion1.m4a", "explosions", "explosions/arcade-01", "Arcade Explosion 01", ["explosion", "arcade", "retro", "boom"]),
    ("mm", "Explosions/m4a/Explosion2.m4a", "explosions", "explosions/arcade-02", "Arcade Explosion 02", ["explosion", "arcade", "blast"]),
    ("mm", "Explosions/m4a/Explosion3.m4a", "explosions", "explosions/arcade-03", "Arcade Explosion 03", ["explosion", "arcade", "rumble"]),
    ("mm", "Explosions/m4a/Explosion4.m4a", "explosions", "explosions/arcade-04", "Arcade Explosion 04", ["explosion", "arcade", "shatter"]),
    ("mm", "Guns/m4a/Bomb1.m4a", "explosions", "explosions/bomb-01", "Bomb Detonation 01", ["explosion", "bomb", "shockwave"]),

    # --- IMPACT & HITS (BlipBoom + MM) ---
    ("blip", "hit/hit_punch_01.wav", "impact", "impact/punch-01", "Punch Hit 01", ["impact", "punch", "strike", "hit"]),
    ("blip", "hit/hit_punch_02.wav", "impact", "impact/punch-02", "Punch Hit 02", ["impact", "punch", "thud"]),
    ("blip", "hit/hit_hurt_01.wav", "impact", "impact/hurt-01", "Hurt Damage 01", ["impact", "hurt", "damage"]),
    ("blip", "hit/hit_hurt_02.wav", "impact", "impact/hurt-02", "Hurt Damage 02", ["impact", "hurt", "groan"]),
    ("blip", "hit/hit_block_01.wav", "impact", "impact/block-01", "Shield Block 01", ["impact", "block", "shield", "parry"]),
    ("blip", "hit/hit_enemy_01.wav", "impact", "impact/enemy-01", "Enemy Hit 01", ["impact", "enemy", "strike"]),
    ("blip", "hit/hit_swing_01.wav", "impact", "impact/swing-01", "Melee Swing 01", ["impact", "swing", "whoosh", "melee"]),
    ("mm", "Impact/m4a/Impact1.m4a", "impact", "impact/impact-01", "Arcade Impact 01", ["impact", "crash", "collision"]),
    ("mm", "Impact/m4a/Impact2.m4a", "impact", "impact/impact-02", "Arcade Impact 02", ["impact", "heavy", "slam"]),
    ("mm", "Impact/m4a/Impact3.m4a", "impact", "impact/impact-03", "Arcade Impact 03", ["impact", "smack"]),
    ("mm", "Impact/m4a/Impact1.m4a", "impact", "impact/impact-01", "Arcade Impact 01", ["impact", "crash", "collision"]),
    ("mm", "Impact/m4a/Impact2.m4a", "impact", "impact/impact-02", "Arcade Impact 02", ["impact", "heavy", "slam"]),
    ("mm", "Impact/m4a/Impact3.m4a", "impact", "impact/impact-03", "Arcade Impact 03", ["impact", "smack"]),

    # --- ARCADE CHIPTUNE & RETRO (MM) ---
    ("mm", "Misc/m4a/KerChing1.m4a", "arcade", "arcade/kerching-01", "Cash Register 01", ["arcade", "cash", "money", "kerching", "bell"]),
    ("mm", "Misc/m4a/KerChing2.m4a", "arcade", "arcade/kerching-02", "Cash Register 02", ["arcade", "cash", "coins"]),
    ("mm", "Misc/m4a/Kerching3.m4a", "arcade", "arcade/kerching-03", "Cash Register 03", ["arcade", "cash", "chime"]),
    ("mm", "Misc/m4a/Bell1.m4a", "arcade", "arcade/bell-01", "Service Bell 01", ["arcade", "bell", "ring", "ding"]),
    ("mm", "Misc/m4a/Bell2.m4a", "arcade", "arcade/bell-02", "Service Bell 02", ["arcade", "bell", "ding"]),
    ("mm", "Misc/m4a/Beep1.m4a", "arcade", "arcade/beep-01", "8-Bit Beep 01", ["arcade", "beep", "8bit", "retro"]),
    ("mm", "Misc/m4a/Beep2.m4a", "arcade", "arcade/beep-02", "8-Bit Beep 02", ["arcade", "beep", "tone"]),
    ("mm", "Misc/m4a/Beep5.m4a", "arcade", "arcade/beep-05", "8-Bit High Beep", ["arcade", "beep", "high"]),
    ("mm", "Misc/m4a/Beep6.m4a", "arcade", "arcade/beep-06", "8-Bit Dual Beep", ["arcade", "beep", "chirp"]),
    ("mm", "Misc/m4a/OldSchool1.m4a", "arcade", "arcade/oldschool-01", "Oldschool Chiptune 01", ["arcade", "oldschool", "chiptune", "synth"]),
    ("mm", "Misc/m4a/OldSchool5.m4a", "arcade", "arcade/oldschool-05", "Oldschool Chiptune 05", ["arcade", "oldschool", "arpeggio"]),
    ("mm", "Misc/m4a/OldSchool20.m4a", "arcade", "arcade/oldschool-20", "Oldschool Chiptune 20", ["arcade", "oldschool", "computer"]),
    ("mm", "Misc/m4a/OldSchool30.m4a", "arcade", "arcade/oldschool-30", "Oldschool Chiptune 30", ["arcade", "oldschool", "trill"]),
    ("mm", "Misc/m4a/Siren1Loop.m4a", "arcade", "arcade/siren-loop", "Red Alert Siren", ["arcade", "siren", "alarm", "loop"]),

    # --- RETRO VOICE & SPEECH SYNTHESIS (MM) ---
    ("mm", "Speech/m4a/GetReady1.m4a", "speech", "speech/get-ready-01", 'Voice: "Get Ready 01"', ["speech", "voice", "ready", "start"]),
    ("mm", "Speech/m4a/GetReady2.m4a", "speech", "speech/get-ready-02", 'Voice: "Get Ready 02"', ["speech", "voice", "ready"]),
    ("mm", "Speech/m4a/Ready1.m4a", "speech", "speech/ready-01", 'Voice: "Ready 01"', ["speech", "voice", "ready"]),
    ("mm", "Speech/m4a/GameOver1.m4a", "speech", "speech/game-over-01", 'Voice: "Game Over 01"', ["speech", "voice", "gameover", "end"]),
    ("mm", "Speech/m4a/GameOver2.m4a", "speech", "speech/game-over-02", 'Voice: "Game Over 02"', ["speech", "voice", "gameover"]),
    ("mm", "Speech/m4a/Bonus1.m4a", "speech", "speech/bonus-01", 'Voice: "Bonus 01"', ["speech", "voice", "bonus", "reward"]),
    ("mm", "Speech/m4a/Bonus2.m4a", "speech", "speech/bonus-02", 'Voice: "Bonus 02"', ["speech", "voice", "bonus"]),
    ("mm", "Speech/m4a/PowerUp1.m4a", "speech", "speech/powerup-01", 'Voice: "Power Up 01"', ["speech", "voice", "powerup"]),
    ("mm", "Speech/m4a/PowerUp2.m4a", "speech", "speech/powerup-02", 'Voice: "Power Up 02"', ["speech", "voice", "powerup"]),
]


def format_bytes(num_bytes: int) -> str:
    if num_bytes < 1024:
        return f"{num_bytes} B"
    elif num_bytes < 1024 * 1024:
        return f"{num_bytes / 1024:.1f} KB"
    else:
        return f"{num_bytes / (1024 * 1024):.2f} MB"


def probe_audio_meta(filepath: Path) -> dict:
    """Extract audio duration, channels, sample rate via afinfo."""
    duration = 0.0
    sample_rate = 44100
    channels = 1
    try:
        res = subprocess.run(["afinfo", str(filepath)], capture_output=True, text=True, check=True)
        dur_match = re.search(r"estimated duration:\s+([0-9.]+)\s+sec", res.stdout)
        if dur_match:
            duration = round(float(dur_match.group(1)), 3)
        rate_match = re.search(r"([0-9]+)\s+Hz", res.stdout)
        if rate_match:
            sample_rate = int(rate_match.group(1))
        ch_match = re.search(r"([0-9]+)\s+ch", res.stdout)
        if ch_match:
            channels = int(ch_match.group(1))
    except Exception:
        pass
    return {"durationSeconds": duration, "sampleRate": sample_rate, "channels": channels}


def main():
    print("=" * 64)
    print("  MODERN FLASH // SFX CURATION & CONVERSION PIPELINE")
    print("=" * 64)

    if not SFX_SOURCE_DIR.exists():
        print(f"Error: SFX source directory '{SFX_SOURCE_DIR}' does not exist.")
        sys.exit(1)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    manifest_entries = []
    category_stats = {}
    total_bytes = 0

    blip_base = SFX_SOURCE_DIR / "BlipBoom_RetroSFX" / "WAV"
    mm_base = SFX_SOURCE_DIR / "MMRetroArcadeSoundsPack1_0_5"

    for pack, rel_path, category, sound_id, human_name, tags in CURATED_SOUNDS:
        cat_dir = OUTPUT_DIR / category
        cat_dir.mkdir(parents=True, exist_ok=True)

        dest_filename = f"{sound_id.replace('/', '_')}.m4a"
        dest_path = cat_dir / dest_filename
        web_path = f"/sfx/{category}/{dest_filename}"

        if pack == "blip":
            src_path = blip_base / rel_path
            if not src_path.exists():
                print(f"  [MISSING] Source file not found: {src_path}")
                continue
            # Convert WAV -> M4A (AAC) via afconvert
            cmd = [
                "/usr/bin/afconvert",
                "-f", "m4af",
                "-d", "aac",
                "-b", "128000",
                str(src_path),
                str(dest_path),
            ]
            subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        elif pack == "mm":
            src_path = mm_base / rel_path
            if not src_path.exists():
                print(f"  [MISSING] Source file not found: {src_path}")
                continue
            # Copy M4A directly
            with open(src_path, "rb") as sf, open(dest_path, "wb") as df:
                df.write(sf.read())
        else:
            continue

        file_size = dest_path.stat().st_size
        total_bytes += file_size
        meta = probe_audio_meta(dest_path)

        entry = {
            "id": sound_id,
            "name": human_name,
            "category": category,
            "filename": dest_filename,
            "path": web_path,
            "format": "m4a",
            "codec": "AAC",
            "mimeType": "audio/mp4",
            "sizeBytes": file_size,
            "sizeFormatted": format_bytes(file_size),
            "durationSeconds": meta["durationSeconds"],
            "sampleRate": meta["sampleRate"],
            "channels": meta["channels"],
            "tags": tags,
        }
        manifest_entries.append(entry)

        cat_stat = category_stats.setdefault(category, {"count": 0, "sizeBytes": 0})
        cat_stat["count"] += 1
        cat_stat["sizeBytes"] += file_size

    # Sort manifest entries by category, then name
    manifest_entries.sort(key=lambda x: (x["category"], x["name"]))

    # Prepare final JSON manifest
    manifest = {
        "version": "1.0.0",
        "description": "Modern Flash Curated Sound Effects Manifest",
        "format": "m4a",
        "codec": "AAC",
        "totalSounds": len(manifest_entries),
        "totalSizeBytes": total_bytes,
        "totalSizeFormatted": format_bytes(total_bytes),
        "categories": [
            {
                "id": cat,
                "name": cat.capitalize(),
                "count": stats["count"],
                "sizeBytes": stats["sizeBytes"],
                "sizeFormatted": format_bytes(stats["sizeBytes"]),
            }
            for cat, stats in sorted(category_stats.items())
        ],
        "sounds": manifest_entries,
    }

    manifest_json_path = OUTPUT_DIR / "sounds.json"
    with open(manifest_json_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    # Also write a copy to public/sfx/soundManifest.json for compatibility
    with open(OUTPUT_DIR / "soundManifest.json", "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"[*] Processed {len(manifest_entries)} sounds across {len(category_stats)} categories.")
    print(f"[*] Total disk footprint: {format_bytes(total_bytes)} ({total_bytes} bytes).")
    print(f"[+] Written manifest to {manifest_json_path.relative_to(REPO_ROOT)}")

    # Generate TypeScript types & static catalog in src/Sound/soundCatalog.ts
    generate_ts_catalog(manifest, CATALOG_TS_PATH)


def generate_ts_catalog(manifest: dict, target_path: Path):
    target_path.parent.mkdir(parents=True, exist_ok=True)
    sound_ids = [s["id"] for s in manifest["sounds"]]
    categories = [c["id"] for c in manifest["categories"]]

    ts_content = f"""/**
 * Modern Flash Sound Catalog
 * Autogenerated by scripts/curate-sound-library.py
 * Contains strongly typed Sound IDs, categories, and manifest metadata.
 */

export type SoundCategory = { ' | '.join(repr(c) for c in categories) };

export type SoundId =
{chr(10).join(f'  | {repr(sid)}' for sid in sound_ids)};

export interface SoundItem {{
  id: SoundId;
  name: string;
  category: SoundCategory;
  filename: string;
  path: string;
  format: 'm4a';
  codec: 'AAC';
  mimeType: 'audio/mp4';
  sizeBytes: number;
  sizeFormatted: string;
  durationSeconds: number;
  sampleRate: number;
  channels: number;
  tags: string[];
}}

export interface SoundManifest {{
  version: string;
  description: string;
  format: string;
  codec: string;
  totalSounds: number;
  totalSizeBytes: number;
  totalSizeFormatted: string;
  categories: {{
    id: SoundCategory;
    name: string;
    count: number;
    sizeBytes: number;
    sizeFormatted: string;
  }}[];
  sounds: SoundItem[];
}}

export const SOUND_MANIFEST: SoundManifest = {json.dumps(manifest, indent=2)};

export const SOUND_CATALOG: Record<SoundId, SoundItem> = Object.fromEntries(
  SOUND_MANIFEST.sounds.map((sound) => [sound.id, sound])
) as Record<SoundId, SoundItem>;
"""
    with open(target_path, "w", encoding="utf-8") as f:
        f.write(ts_content)

    print(f"[+] Written TypeScript catalog to {target_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
