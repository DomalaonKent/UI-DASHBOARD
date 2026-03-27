import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface KPIEntry {
  inspector: string;
  period: string;
  photo?: string;
  commitment:  { quality: number; efficiency: number; timeliness: number };
  actual:      { quality: number; efficiency: number; timeliness: number };
  rating:      { quality: number; efficiency: number; timeliness: number };
}

export interface KpiCategoryRow {
  name: string;
  weight: number;
  weightPct: number;
  target: number;
  accomplishment: number | null;
}

export interface KpiCategoryData {
  label: string;
  totalTarget: number;
  totalAccomplishment: number | null;
  rows: KpiCategoryRow[];
}

export type SemesterKey = 'S1' | 'S2';

@Injectable({ providedIn: 'root' })
export class KpiInspectionService {

  private mockData: KPIEntry[] = [
    {
      inspector: 'Andrei F. Imperial', period: 'January 2026',
      photo: 'assets/images/profile/prof1.jpg',
      commitment:  { quality: 4, efficiency: 4, timeliness: 4 },
      actual:      { quality: 5, efficiency: 4, timeliness: 5 },
      rating:      { quality: 5, efficiency: 4, timeliness: 5 },
    },
    {
      inspector: 'Jessica Arao', period: 'January 2026',
      photo: 'assets/images/profile/prof.jpg',
      commitment:  { quality: 4, efficiency: 4, timeliness: 4 },
      actual:      { quality: 4, efficiency: 5, timeliness: 4 },
      rating:      { quality: 4, efficiency: 5, timeliness: 4 },
    },
    {
      inspector: 'Ronald J Jebulan Jr.', period: 'January 2026',
      photo: 'assets/images/profile/prof2.jpg',
      commitment:  { quality: 3, efficiency: 4, timeliness: 3 },
      actual:      { quality: 4, efficiency: 4, timeliness: 4 },
      rating:      { quality: 4, efficiency: 4, timeliness: 4 },
    },
    {
      inspector: 'Susan D. Torre', period: 'January 2026',
      photo: 'assets/images/profile/prof5.jpg',
      commitment:  { quality: 4, efficiency: 3, timeliness: 4 },
      actual:      { quality: 5, efficiency: 4, timeliness: 5 },
      rating:      { quality: 5, efficiency: 4, timeliness: 5 },
    },
    {
      inspector: 'Judith P. Alaurin', period: 'January 2026',
      photo: 'assets/images/profile/prof7.jpg',
      commitment:  { quality: 4, efficiency: 4, timeliness: 4 },
      actual:      { quality: 3, efficiency: 4, timeliness: 3 },
      rating:      { quality: 3, efficiency: 4, timeliness: 3 },
    },
    {
      inspector: 'Judy Ann N. Bilangel', period: 'January 2026',
      photo: 'assets/images/profile/prof8.jpg',
      commitment:  { quality: 5, efficiency: 5, timeliness: 5 },
      actual:      { quality: 5, efficiency: 5, timeliness: 5 },
      rating:      { quality: 5, efficiency: 5, timeliness: 5 },
    },
    {
      inspector: 'Joseph N. Bartolome', period: 'January 2026',
      photo: 'assets/images/profile/prof4.jpg',
      commitment:  { quality: 4, efficiency: 4, timeliness: 3 },
      actual:      { quality: 4, efficiency: 4, timeliness: 4 },
      rating:      { quality: 4, efficiency: 4, timeliness: 4 },
    },
    {
      inspector: 'John Russel A. Marasigan', period: 'January 2026',
      photo: 'assets/images/profile/prof3.jpg',
      commitment:  { quality: 3, efficiency: 3, timeliness: 4 },
      actual:      { quality: 4, efficiency: 3, timeliness: 4 },
      rating:      { quality: 4, efficiency: 3, timeliness: 4 },
    },
  ];

  private buildCategories(): KpiCategoryData[] {
    return [
      {
        label: 'Processing w/o Encoding and Printing',
        totalTarget: 11046,
        totalAccomplishment: null,
        rows: [
          { name: 'Mon',     weight: 30, weightPct: 22.00, target: 2430, accomplishment: null },
          { name: 'Ryan',    weight: 25, weightPct: 19.00, target: 2099, accomplishment: null },
          { name: 'Bart',    weight: 30, weightPct: 22.00, target: 2430, accomplishment: null },
          { name: 'Dan',     weight: 30, weightPct: 22.00, target: 2430, accomplishment: null },
          { name: 'Francis', weight: 20, weightPct: 15.00, target: 1657, accomplishment: null },
        ],
      },
      {
        label: 'Encoding and Printing',
        totalTarget: 11046,
        totalAccomplishment: null,
        rows: [
          { name: 'Ryan',    weight: 10, weightPct: 6.0,  target: 663,  accomplishment: null },
          { name: 'Bart',    weight: 5,  weightPct: 3.0,  target: 331,  accomplishment: null },
          { name: 'Dan',     weight: 5,  weightPct: 3.0,  target: 331,  accomplishment: null },
          { name: 'Francis', weight: 10, weightPct: 6.0,  target: 663,  accomplishment: null },
          { name: 'Ed',      weight: 75, weightPct: 42.0, target: 4639, accomplishment: null },
          { name: 'Luis',    weight: 70, weightPct: 40.0, target: 4419, accomplishment: null },
        ],
      },
      {
        label: 'Inspection',
        totalTarget: 3890,
        totalAccomplishment: null,
        rows: [
          { name: 'Gie',     weight: 30, weightPct: 17.000, target: 661, accomplishment: null },
          { name: 'Mon',     weight: 20, weightPct: 12.000, target: 467, accomplishment: null },
          { name: 'Francis', weight: 20, weightPct: 12.000, target: 467, accomplishment: null },
          { name: 'Ryan',    weight: 30, weightPct: 17.000, target: 661, accomplishment: null },
          { name: 'Bart',    weight: 25, weightPct: 15.000, target: 584, accomplishment: null },
          { name: 'Dan',     weight: 25, weightPct: 15.000, target: 584, accomplishment: null },
          { name: 'Ed',      weight: 10, weightPct: 6.000,  target: 233, accomplishment: null },
          { name: 'Luis',    weight: 10, weightPct: 6.000,  target: 233, accomplishment: null },
        ],
      },
      {
        label: 'Frequency Assignment',
        totalTarget: 1006,
        totalAccomplishment: null,
        rows: [
          { name: 'Mon',     weight: 20, weightPct: 67, target: 674, accomplishment: null },
          { name: 'Francis', weight: 10, weightPct: 33, target: 332, accomplishment: null },
        ],
      },
      {
        label: 'Validation of Broadband Speed',
        totalTarget: 180,
        totalAccomplishment: null,
        rows: [
          { name: 'Mon',     weight: 10, weightPct: 23,  target: 41, accomplishment: null },
          { name: 'Francis', weight: 5,  weightPct: 11,  target: 21, accomplishment: null },
          { name: 'Ryan',    weight: 5,  weightPct: 11,  target: 21, accomplishment: null },
          { name: 'Bart',    weight: 10, weightPct: 23,  target: 41, accomplishment: null },
          { name: 'Dan',     weight: 10, weightPct: 23,  target: 41, accomplishment: null },
          { name: 'Ed',      weight: 2,  weightPct: 4.5, target: 8,  accomplishment: null },
          { name: 'Luis',    weight: 2,  weightPct: 4.5, target: 8,  accomplishment: null },
        ],
      },
    ];
  }

  private makeCategories(): Record<SemesterKey, KpiCategoryData[]> {
    return { S1: this.buildCategories(), S2: this.buildCategories() };
  }

  private categoryData: Record<number, Record<SemesterKey, KpiCategoryData[]>> = {
    2024: this.makeCategories(),
    2025: this.makeCategories(),
    2026: this.makeCategories(),
    2027: this.makeCategories(),
  };

  getKpiData(): Observable<KPIEntry[]> {
    return of(this.mockData);
  }

  getCategoryData(year: number, semester: SemesterKey): Observable<KpiCategoryData[]> {
    const data = this.categoryData[year]?.[semester] ?? [];
    return of(data);
  }

  getAvailableYears(): number[] {
    return Object.keys(this.categoryData).map(Number).sort((a, b) => b - a);
  }

  getAvatarColors(): string[] {
    return [
      'linear-gradient(135deg,#5856d6,#4745b3)',
      'linear-gradient(135deg,#2eb85c,#1e7e34)',
      'linear-gradient(135deg,#39f,#007bdf)',
      'linear-gradient(135deg,#f9b115,#c87f0a)',
      'linear-gradient(135deg,#e55353,#b21f1f)',
      'linear-gradient(135deg,#9333ea,#7928b5)',
      'linear-gradient(135deg,#20c997,#0d6e4f)',
      'linear-gradient(135deg,#fd7e14,#c05c00)',
    ];
  }

  getRatingLabel(q: number, e: number, t: number): string {
    const avg = (q + e + t) / 3;
    if (avg >= 4.5) return 'Outstanding';
    if (avg >= 3.5) return 'Very Satisfactory';
    if (avg >= 2.5) return 'Satisfactory';
    if (avg >= 1.5) return 'Unsatisfactory';
    return 'Poor';
  }

  getRatingBadgeClass(q: number, e: number, t: number): string {
    const avg = (q + e + t) / 3;
    if (avg >= 4.5) return 'badge-outstanding';
    if (avg >= 3.5) return 'badge-very-satisfactory';
    if (avg >= 2.5) return 'badge-satisfactory';
    return 'badge-poor';
  }

  computeAvg(values: number[]): string {
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  }
}