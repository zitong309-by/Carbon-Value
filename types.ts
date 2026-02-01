export enum Persona {
  INVESTMENT_MANAGER = 'Investment Manager',
  REAL_ESTATE_DEVELOPER = 'Real Estate Developer',
  COMPLIANCE_OFFICER = 'Compliance Officer'
}

export interface MaterialData {
  name: string;
  volume: number; // m3
  factor: number; // kgCO2e/m3
  costPerUnit: number; // $/m3
}

export interface AnalysisResult {
  totalCarbon: number;
  carbonPerSqm: number;
  ribaComparison: 'low' | 'medium' | 'high';
  breakdown: { name: string; value: number }[];
}

export interface FinancialReport {
  riskRating: 'Low' | 'Medium' | 'High' | 'Critical';
  npvData: { year: number; value: number }[]; // Net Present Value over time
  strandedYear: number | null;
  sensitivityData: { carbonPriceIncrease: string; valuationDrop: number }[];
  liquidityBoost?: number;
  interestSaved?: number;
  advice: string[];
  reportType: 'ROI' | 'Breakeven' | 'Compliance';
}

export interface WhatIfResponse {
  materials: MaterialData[];
  explanation: string;
  carbonReductionPercent: number;
  costDeltaPercent: number;
}