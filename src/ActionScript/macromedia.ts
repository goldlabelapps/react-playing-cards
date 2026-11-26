import { gsap } from 'gsap';
import type { ActionScriptOptions } from '../types';

export function macromediaActionScript({
  target,
  loop = true,
  onComplete,
  speed = 1,
}: ActionScriptOptions) {
  const tl = gsap.timeline({
    repeat: loop ? -1 : 0,
    onComplete,
  });

  tl.timeScale(speed);

  // Reticle & Cockpit Frame Elements
  const reticle = target.querySelector('[data-part="reticle"]');
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
  const telemetryStatus = target.querySelector('[data-part="telemetry-status"]');
  const telemetrySensor = target.querySelector('[data-part="telemetry-sensor"]');

  // Starfield Assembly (Stopped / Rest State)
  const starfieldStatic = target.querySelector('[data-part="starfield-static"]');
  const starfieldForward = target.querySelector('[data-part="starfield-forward"]');

  // 1. Center Reticle & Lock All Flight Dynamics at Rest
  if (reticle) {
    gsap.set(reticle, {
      scale: 0.5,
      transformOrigin: '320px 180px',
      rotation: 0,
      x: 0,
      y: 0,
    });
  }
  if (pitchLadder) {
    gsap.set(pitchLadder, {
      transformOrigin: '320px 180px',
      rotation: 0,
      y: 0,
    });
  }
  if (cornerMarkers) {
    gsap.set(cornerMarkers, {
      opacity: 0.75,
      scale: 1,
      transformOrigin: '320px 180px',
    });
  }
  if (crosshairs) {
    gsap.set(crosshairs, { opacity: 0.75 });
  }
  if (bracketLeft) {
    gsap.set(bracketLeft, { x: 0, opacity: 0.95, scale: 1 });
  }
  if (bracketRight) {
    gsap.set(bracketRight, { x: 0, opacity: 0.95, scale: 1 });
  }
  if (starfieldStatic) {
    gsap.set(starfieldStatic, {
      transformOrigin: '320px 180px',
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
    });
  }
  if (starfieldForward) {
    gsap.set(starfieldForward, {
      transformOrigin: '320px 180px',
      scale: 1,
      rotation: 0,
      x: 0,
      y: 0,
    });
  }

  // 2. Set Dynamic Telemetry to Steady At-Rest State
  if (telemetryPitch) telemetryPitch.textContent = 'PCH +00.0° // ELEV: LVL';
  if (telemetryAzimuth) telemetryAzimuth.textContent = 'AZM +000.0° // VEC: HOLD';
  if (telemetryVelocity) telemetryVelocity.textContent = 'VEL 0.00c // THR 0%';
  if (telemetryHeading) telemetryHeading.textContent = 'HDG 082° // SYS: READY';
  if (telemetryRange) telemetryRange.textContent = 'RNG HOLD // STATIONARY';
  if (telemetryGforce) telemetryGforce.textContent = 'ACC +0.0G';
  if (telemetryLock) telemetryLock.textContent = 'TGT LOCK: STANDBY';
  if (telemetryStatus) telemetryStatus.textContent = 'AUTO-TRIM: REST';
  if (telemetrySensor) telemetrySensor.textContent = 'RADAR: ACQUIRED // 4-B';

  // 3. Reticle and starfield are locked dead-center and motionless at rest (Zero animation)
  return tl;
}

export default macromediaActionScript;
