import { UnitSystem } from '../types';

export function formatDistance(km: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    const miles = km * 0.621371;
    return `${miles.toFixed(2)} mi`;
  }
  return `${km.toFixed(2)} km`;
}

export function formatWeight(kg: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    const lbs = kg * 2.20462;
    return `${Math.round(lbs)} lbs`;
  }
  return `${Math.round(kg)} kg`;
}

export function formatHeight(cm: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    const totalInches = cm / 2.54;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

export function formatPace(durationSeconds: number, distanceKm: number, unitSystem: UnitSystem): string {
  if (distanceKm <= 0 || durationSeconds <= 0) return "--:--";
  const dist = unitSystem === 'imperial' ? distanceKm * 0.621371 : distanceKm;
  const secPerUnit = durationSeconds / dist;
  const mins = Math.floor(secPerUnit / 60);
  const secs = Math.floor(secPerUnit % 60);
  const unitLabel = unitSystem === 'imperial' ? '/mi' : '/km';
  return `${mins}:${secs < 10 ? '0' : ''}${secs} ${unitLabel}`;
}

export function formatWater(ml: number, unitSystem: UnitSystem): string {
  if (unitSystem === 'imperial') {
    const oz = ml * 0.033814;
    return `${oz.toFixed(1)} fl oz`;
  }
  const liters = ml / 1000;
  return `${liters.toFixed(1)} L`;
}
