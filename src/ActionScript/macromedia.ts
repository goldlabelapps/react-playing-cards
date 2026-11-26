import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';
import { playFighterZoomSound, playTargetingLockBeep } from '../Sound';

export function macromediaActionScript({
  target,
  loop = false,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: loop ? 0.6 : 0,
    onComplete,
    onStart: () => {
      // Trigger fighter cockpit sound on initial launch
      playTargetingLockBeep(1100);
    },
    onRepeat: () => {
      // Re-trigger sound on timeline loop
      playTargetingLockBeep(1100);
    },
  });

  tl.timeScale(speed);

  // Parallax Starfield Groups
  const starsFar = target.querySelector('[data-part="stars-far"]');
  const starsMid = target.querySelector('[data-part="stars-mid"]');
  const starsNear = target.querySelector('[data-part="stars-near"]');

  // Reticle & HUD Elements
  const reticle = target.querySelector('[data-part="reticle"]');
  const hudAura = target.querySelector('[data-part="hud-aura"]');
  const ring = target.querySelector('[data-part="ring"]');
  const innerRing = target.querySelector('[data-part="inner-ring"]');
  const bracketLeft = target.querySelector('[data-part="bracket-left"]');
  const bracketRight = target.querySelector('[data-part="bracket-right"]');
  const cornerMarkers = target.querySelector('[data-part="corner-markers"]');
  const crosshairs = target.querySelector('[data-part="crosshairs"]');
  const pitchLadder = target.querySelector('[data-part="pitch-ladder"]');
  const telemetry = target.querySelector('[data-part="telemetry"]');
  const telemetryLock = target.querySelector('[data-part="telemetry-lock"]');

  // 1. Initial State Initialization
  if (starsFar) gsap.set(starsFar, { x: 0 });
  if (starsMid) gsap.set(starsMid, { x: 0 });
  if (starsNear) gsap.set(starsNear, { x: 0, scaleX: 1, transformOrigin: 'left center' });

  // Center of reticle HUD is (320px, 180px)
  if (reticle) gsap.set(reticle, { transformOrigin: '320px 180px' });
  if (hudAura) gsap.set(hudAura, { opacity: 0, scale: 0.5, transformOrigin: '320px 180px' });
  if (ring) gsap.set(ring, { rotation: 0, transformOrigin: '320px 180px', opacity: 0 });
  if (innerRing) gsap.set(innerRing, { rotation: 0, transformOrigin: '320px 180px', opacity: 0 });
  if (cornerMarkers) gsap.set(cornerMarkers, { opacity: 0, scale: 1.15, transformOrigin: '320px 180px' });
  if (crosshairs) gsap.set(crosshairs, { opacity: 0 });
  if (pitchLadder) gsap.set(pitchLadder, { opacity: 0, y: -10 });
  if (telemetry) gsap.set(telemetry, { opacity: 0 });

  if (bracketLeft) gsap.set(bracketLeft, { x: -35, opacity: 0 });
  if (bracketRight) gsap.set(bracketRight, { x: 35, opacity: 0 });

  // 2. PHASE 1: RETICLE BOOT-UP & TARGETING CALIBRATION (0.0s - 0.7s)
  if (cornerMarkers) {
    tl.to(cornerMarkers, {
      opacity: 0.75,
      scale: 1,
      duration: 0.5,
      ease: 'power2.out',
    }, 0);
  }

  if (crosshairs) {
    tl.to(crosshairs, {
      opacity: 0.8,
      duration: 0.4,
      ease: 'power1.out',
    }, 0.1);
  }

  if (hudAura) {
    tl.to(hudAura, {
      opacity: 0.85,
      scale: 1,
      duration: 0.6,
      ease: 'power2.out',
    }, 0.15);
  }

  if (ring) {
    tl.to(ring, {
      opacity: 0.85,
      rotation: 180,
      duration: 1.2,
      ease: 'power1.out',
    }, 0.15);
  }

  if (innerRing) {
    tl.to(innerRing, {
      opacity: 0.7,
      rotation: -120,
      duration: 1.2,
      ease: 'power1.out',
    }, 0.15);
  }

  if (pitchLadder) {
    tl.to(pitchLadder, {
      opacity: 0.6,
      y: 0,
      duration: 0.5,
      ease: 'power2.out',
    }, 0.25);
  }

  if (telemetry) {
    tl.to(telemetry, {
      opacity: 0.85,
      duration: 0.4,
      ease: 'power1.out',
    }, 0.3);
  }

  // Targeting acquisition brackets snap in and acquire target lock
  if (bracketLeft && bracketRight) {
    tl.to([bracketLeft, bracketRight], {
      opacity: 1,
      x: 0,
      duration: 0.45,
      ease: 'back.out(2)',
    }, 0.35);

    // Lock acquired chirp and bracket lock pulse
    tl.add(() => {
      playTargetingLockBeep(1760);
    }, 0.6);

    tl.to([bracketLeft, bracketRight], {
      scale: 0.9,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      ease: 'power2.inOut',
    }, 0.6);
  }

  if (telemetryLock) {
    tl.to(telemetryLock, {
      opacity: 0.2,
      duration: 0.08,
      yoyo: true,
      repeat: 3,
    }, 0.6);
  }

  // 3. PHASE 2: STARFIGHTER PAN TO THE RIGHT // PARALLAX STARFIELD SHIFT (0.7s - 3.2s)
  // When flying in a cockpit panning right, distant world shifts left with parallax depth
  const panDuration = 2.5;
  const panStart = 0.7;

  // Trigger Star Wars zoom / flyby whoosh audio
  tl.add(() => {
    playFighterZoomSound(0.45);
  }, panStart);

  // Distant stars: slow shift left
  if (starsFar) {
    tl.to(starsFar, {
      x: -90,
      duration: panDuration,
      ease: 'power2.inOut',
    }, panStart);
  }

  // Mid stars: moderate shift left
  if (starsMid) {
    tl.to(starsMid, {
      x: -210,
      duration: panDuration,
      ease: 'power2.inOut',
    }, panStart);
  }

  // Near stars: fast high-speed shift left with velocity streak
  if (starsNear) {
    tl.to(starsNear, {
      x: -420,
      duration: panDuration,
      ease: 'power2.inOut',
    }, panStart);

    // Stellar speed stretch during peak acceleration
    tl.to(starsNear, {
      scaleX: 1.45,
      duration: panDuration * 0.4,
      ease: 'power2.in',
    }, panStart).to(starsNear, {
      scaleX: 1,
      duration: panDuration * 0.6,
      ease: 'power2.out',
    }, panStart + panDuration * 0.4);
  }

  // The reticle remains centered at (320, 180), with subtle cockpit gimbal inertia
  if (reticle) {
    tl.to(reticle, {
      rotation: 1.4,
      x: 3,
      y: -1,
      duration: 0.9,
      ease: 'sine.inOut',
    }, panStart)
      .to(reticle, {
        rotation: -1.2,
        x: -2,
        y: 1,
        duration: 1.0,
        ease: 'sine.inOut',
      }, panStart + 0.9)
      .to(reticle, {
        rotation: 0,
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'sine.out',
      }, panStart + 1.9);
  }

  // Continuous rotational tracking of the outer reticle ring throughout the pan
  if (ring) {
    tl.to(ring, {
      rotation: '+=240',
      duration: panDuration,
      ease: 'none',
    }, panStart);
  }

  // Counter-rotation of the inner precision ring
  if (innerRing) {
    tl.to(innerRing, {
      rotation: '-=160',
      duration: panDuration,
      ease: 'none',
    }, panStart);
  }

  // 4. PHASE 3: STABILIZATION & RESET
  if (cornerMarkers) {
    tl.to(cornerMarkers, {
      opacity: 0.85,
      duration: 0.4,
    }, panStart + panDuration);
  }

  return tl;
}

export default macromediaActionScript;
