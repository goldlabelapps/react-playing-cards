import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';
import { playFighterZoomSound, playTargetingLockBeep, startCockpitAmbient } from '../Sound';

export function macromediaActionScript({
  target,
  loop = true,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  // Master seamless cycle period in seconds
  const CYCLE_DURATION = 6.0;

  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    repeatDelay: 0, // Zero delay to ensure seamless continuous wraparound
    onComplete,
    onStart: () => {
      startCockpitAmbient();
      playFighterZoomSound(0.4);
    },
    onRepeat: () => {
      playFighterZoomSound(0.4);
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
  const pitchLadder = target.querySelector('[data-part="pitch-ladder"]');
  const bracketLeft = target.querySelector('[data-part="bracket-left"]');
  const bracketRight = target.querySelector('[data-part="bracket-right"]');
  const cornerMarkers = target.querySelector('[data-part="corner-markers"]');
  const crosshairs = target.querySelector('[data-part="crosshairs"]');

  // Dynamic Telemetry Readout DOM Nodes
  const telemetryPitch = target.querySelector('[data-part="telemetry-pitch"]');
  const telemetryAzimuth = target.querySelector('[data-part="telemetry-azimuth"]');
  const telemetryVelocity = target.querySelector('[data-part="telemetry-velocity"]');
  const telemetryHeading = target.querySelector('[data-part="telemetry-heading"]');
  const telemetryRange = target.querySelector('[data-part="telemetry-range"]');
  const telemetryGforce = target.querySelector('[data-part="telemetry-gforce"]');
  const telemetryLock = target.querySelector('[data-part="telemetry-lock"]');

  // 1. Initial State Initialization
  if (reticle) gsap.set(reticle, { scale: 0.5, transformOrigin: '320px 180px', rotation: 0, x: 0, y: 0 });
  if (pitchLadder) gsap.set(pitchLadder, { transformOrigin: '320px 180px', rotation: 0, y: 0 });
  if (hudAura) gsap.set(hudAura, { opacity: 0.8, scale: 1, transformOrigin: '320px 180px' });
  if (ring) gsap.set(ring, { rotation: 0, transformOrigin: '320px 180px', opacity: 0.85 });
  if (innerRing) gsap.set(innerRing, { rotation: 0, transformOrigin: '320px 180px', opacity: 0.7 });
  if (cornerMarkers) gsap.set(cornerMarkers, { opacity: 0.75, scale: 1, transformOrigin: '320px 180px' });
  if (crosshairs) gsap.set(crosshairs, { opacity: 0.75 });
  if (bracketLeft) gsap.set(bracketLeft, { x: 0, opacity: 0.95 });
  if (bracketRight) gsap.set(bracketRight, { x: 0, opacity: 0.95 });

  // 2. MATHEMATICALLY SEAMLESS PARALLAX STAR WRAPAROUND
  // Linear drift across exact integer multiples of 640px ensures continuous flight
  if (starsFar) {
    tl.fromTo(starsFar, { x: 0 }, { x: -640, duration: CYCLE_DURATION, ease: 'none' }, 0);
  }
  if (starsMid) {
    tl.fromTo(starsMid, { x: 0 }, { x: -1280, duration: CYCLE_DURATION, ease: 'none' }, 0);
  }
  if (starsNear) {
    tl.fromTo(starsNear, { x: 0 }, { x: -2560, duration: CYCLE_DURATION, ease: 'none' }, 0);

    // Dynamic stellar velocity stretch during peak acceleration
    tl.to(starsNear, { scaleX: 1.85, duration: 1.6, ease: 'power2.in' }, 1.2)
      .to(starsNear, { scaleX: 1.0, duration: 1.8, ease: 'power2.out' }, 2.8);
  }

  // 3. CONTINUOUS RETICLE ROTATIONS WITH ACCELERATION SURGE
  // Rangefinder ring rotates faster during high-speed engine surge
  if (ring) {
    tl.fromTo(ring, { rotation: 0 }, { rotation: 720, duration: CYCLE_DURATION, ease: 'none' }, 0);
  }
  if (innerRing) {
    tl.fromTo(innerRing, { rotation: 0 }, { rotation: -360, duration: CYCLE_DURATION, ease: 'none' }, 0);
  }

  // 4. SIGNIFICANT PITCH & SPEED FLIGHT MANOEUVRES
  // The fighter banks steeply, climbs +12°, dives -10° to lead the target, and recovers level
  if (reticle) {
    tl.to(
      reticle,
      {
        rotation: 8.5, // Steep bank right into climbing turn
        y: -14,        // Climb pitch inertia
        x: 4,
        duration: 1.6,
        ease: 'sine.inOut',
      },
      0
    )
      .to(
        reticle,
        {
          rotation: -6.5, // Counter-bank dive to intercept target vector
          y: 12,          // Dive pitch inertia
          x: -3,
          duration: 1.8,
          ease: 'sine.inOut',
        },
        1.6
      )
      .to(
        reticle,
        {
          rotation: 3.0,  // Leveling off roll check
          y: -4,
          x: 1,
          duration: 1.4,
          ease: 'sine.inOut',
        },
        3.4
      )
      .to(
        reticle,
        {
          rotation: 0,    // Return to level cruise attitude for seamless loop
          y: 0,
          x: 0,
          duration: 1.2,
          ease: 'sine.out',
        },
        4.8
      );
  }

  // Pitch ladder moves in pitch opposition and rolls with the canopy attitude
  if (pitchLadder) {
    tl.to(
      pitchLadder,
      {
        y: 20,         // Horizon drops as nose pitches up
        rotation: -4,
        duration: 1.6,
        ease: 'sine.inOut',
      },
      0
    )
      .to(
        pitchLadder,
        {
          y: -16,        // Horizon rises as nose pitches down into dive
          rotation: 3,
          duration: 1.8,
          ease: 'sine.inOut',
        },
        1.6
      )
      .to(
        pitchLadder,
        {
          y: 4,
          rotation: -1,
          duration: 1.4,
          ease: 'sine.inOut',
        },
        3.4
      )
      .to(
        pitchLadder,
        {
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: 'sine.out',
        },
        4.8
      );
  }

  // 5. REALISTIC REAL-TIME TELEMETRY METRIC INTERPOLATION
  // Telemetry values dynamically calculate and update text on every animation frame
  const flightMetrics = {
    pitch: 0.0,
    azimuth: 24.0,
    velocity: 1.10,
    thrust: 65,
    heading: 82,
    range: 940,
    gforce: 1.0,
  };

  const updateTelemetry = () => {
    if (telemetryPitch) {
      const pSign = flightMetrics.pitch >= 0 ? '+' : '';
      const pLabel = Math.abs(flightMetrics.pitch) < 2 ? 'LVL' : flightMetrics.pitch > 0 ? 'CLMB' : 'DIVE';
      telemetryPitch.textContent = `PCH ${pSign}${flightMetrics.pitch.toFixed(1)}° // ELEV: ${pLabel}`;
    }

    if (telemetryAzimuth) {
      telemetryAzimuth.textContent = `AZM +${flightMetrics.azimuth.toFixed(1)}° // VEC: R-PAN`;
    }

    if (telemetryVelocity) {
      const bstTag = flightMetrics.thrust >= 90 ? ' [BOOST]' : '';
      telemetryVelocity.textContent = `VEL ${flightMetrics.velocity.toFixed(2)}c // THR ${Math.round(flightMetrics.thrust)}%${bstTag}`;
    }

    if (telemetryHeading) {
      telemetryHeading.textContent = `HDG ${Math.round(flightMetrics.heading).toString().padStart(3, '0')}° // SYS: ONLINE`;
    }

    if (telemetryRange) {
      const inRng = flightMetrics.range < 350 ? ' [LOCK]' : ' TGT DIST';
      telemetryRange.textContent = `RNG ${Math.round(flightMetrics.range).toString().padStart(4, '0')}m //${inRng}`;
    }

    if (telemetryGforce) {
      telemetryGforce.textContent = `ACC +${flightMetrics.gforce.toFixed(1)}G`;
    }
  };

  // Interpolate flight metrics across the 4 flight phases
  // Phase 1: High-G climbing turn (0.0s - 1.6s)
  tl.to(
    flightMetrics,
    {
      pitch: 12.4,
      azimuth: 48.5,
      velocity: 1.95,
      thrust: 95,
      heading: 98,
      range: 680,
      gforce: 2.6,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: updateTelemetry,
    },
    0
  );

  // Phase 2: Peak sublight boost & intercept dive (1.6s - 3.4s)
  tl.to(
    flightMetrics,
    {
      pitch: -9.6,
      azimuth: 76.0,
      velocity: 2.45, // Peak sublight speed
      thrust: 100,
      heading: 114,
      range: 410,
      gforce: 3.4,
      duration: 1.8,
      ease: 'power2.inOut',
      onUpdate: updateTelemetry,
    },
    1.6
  );

  // Phase 3: Deceleration & target acquisition lock (3.4s - 4.8s)
  tl.to(
    flightMetrics,
    {
      pitch: 2.0,
      azimuth: 45.0,
      velocity: 1.45,
      thrust: 75,
      heading: 92,
      range: 240, // Target close in
      gforce: 1.5,
      duration: 1.4,
      ease: 'power1.out',
      onUpdate: updateTelemetry,
    },
    3.4
  );

  // Phase 4: Settle to cruise baseline for seamless loop boundary (4.8s - 6.0s)
  tl.to(
    flightMetrics,
    {
      pitch: 0.0,
      azimuth: 24.0,
      velocity: 1.10,
      thrust: 65,
      heading: 82,
      range: 940,
      gforce: 1.0,
      duration: 1.2,
      ease: 'sine.out',
      onUpdate: updateTelemetry,
    },
    4.8
  );

  // 6. TARGETING COMPUTER HUD LOCK PING & BLINK
  if (bracketLeft && bracketRight) {
    tl.add(() => {
      playTargetingLockBeep(1760);
    }, 3.6);

    tl.to(
      [bracketLeft, bracketRight],
      {
        scale: 0.88,
        duration: 0.1,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
      },
      3.6
    );
  }

  if (telemetryLock) {
    tl.to(
      telemetryLock,
      {
        opacity: 0.2,
        duration: 0.08,
        yoyo: true,
        repeat: 5,
      },
      3.6
    );
  }

  return tl;
}

export default macromediaActionScript;
