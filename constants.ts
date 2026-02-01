import { MaterialData } from './types';

// Approximate embodied carbon factors (kgCO2e/m3) and costs ($/m3)
export const INITIAL_MATERIALS: MaterialData[] = [
  { name: 'Concrete (C30/37)', volume: 500, factor: 2400 * 0.15, costPerUnit: 150 }, // ~360 kgCO2e/m3
  { name: 'Steel (Rebar)', volume: 50, factor: 7850 * 1.5, costPerUnit: 8000 }, // ~11775 kgCO2e/m3 (High density)
  { name: 'Timber (Engineered)', volume: 200, factor: 500 * 0.4, costPerUnit: 900 }, // ~200 kgCO2e/m3
  { name: 'Glass (Double Glazed)', volume: 30, factor: 2500 * 1.1, costPerUnit: 3000 },
  { name: 'Brick', volume: 150, factor: 1800 * 0.25, costPerUnit: 400 },
];

export const RIBA_2030_TARGET = 625; // kgCO2e/m2 for Office/Residential average
export const RIBA_CURRENT_AVG = 1200;

export const LONDON_CARBON_TAX_TRENDS = "UK ETS traded carbon values are projected to rise significantly by 2030.";