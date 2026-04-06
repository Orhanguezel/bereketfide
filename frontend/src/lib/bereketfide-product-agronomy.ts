import type { SpecItem } from '@/components/projects/ProjectSpecs';

function strArr(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === 'string' && x.trim().length > 0).map((s) => s.trim());
}

function numStr(v: unknown): string | null {
  if (v == null || v === '') return null;
  if (typeof v === 'number' && Number.isFinite(v)) return String(v);
  if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
}

/** `GET /products/by-slug` + `normalizeProduct` yanıtından tarımsal alanlar → spec satırları (yalnız dolu olanlar). */
export function bereketfideAgronomySpecItems(
  project: Record<string, unknown>,
  label: (key: string) => string,
): SpecItem[] {
  const out: SpecItem[] = [];

  const botanical = project.botanical_name;
  if (typeof botanical === 'string' && botanical.trim()) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.botanicalName')}:`,
      value: botanical.trim(),
    });
  }

  const seasons = strArr(project.planting_seasons);
  if (seasons.length > 0) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.plantingSeasons')}:`,
      value: seasons.join(', '),
    });
  }

  const harvest = numStr(project.harvest_days);
  if (harvest) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.harvestDays')}:`,
      value: harvest,
    });
  }

  const zones = strArr(project.climate_zones);
  if (zones.length > 0) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.climateZones')}:`,
      value: zones.join(', '),
    });
  }

  const soils = strArr(project.soil_types);
  if (soils.length > 0) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.soilTypes')}:`,
      value: soils.join(', '),
    });
  }

  const water = project.water_need;
  if (typeof water === 'string' && water.trim()) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.waterNeed')}:`,
      value: water.trim(),
    });
  }

  const sun = project.sun_exposure;
  if (typeof sun === 'string' && sun.trim()) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.sunExposure')}:`,
      value: sun.trim(),
    });
  }

  const minT = numStr(project.min_temp);
  const maxT = numStr(project.max_temp);
  if (minT && maxT) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.tempRange')}:`,
      value: `${minT} – ${maxT} °C`,
    });
  } else if (minT) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.minTemp')}:`,
      value: `${minT} °C`,
    });
  } else if (maxT) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.maxTemp')}:`,
      value: `${maxT} °C`,
    });
  }

  const germ = numStr(project.germination_days);
  if (germ) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.germinationDays')}:`,
      value: germ,
    });
  }

  const depth = numStr(project.seed_depth_cm);
  if (depth) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.seedDepthCm')}:`,
      value: depth,
    });
  }

  const row = numStr(project.row_spacing_cm);
  if (row) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.rowSpacingCm')}:`,
      value: row,
    });
  }

  const plant = numStr(project.plant_spacing_cm);
  if (plant) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.plantSpacingCm')}:`,
      value: plant,
    });
  }

  const yieldV = project.yield_per_sqm;
  if (typeof yieldV === 'string' && yieldV.trim()) {
    out.push({
      icon: 'default',
      label: `${label('projects.agronomy.yieldPerSqm')}:`,
      value: yieldV.trim(),
    });
  }

  return out;
}
