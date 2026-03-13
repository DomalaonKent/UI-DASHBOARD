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

  getKpiData(): Observable<KPIEntry[]> {
    return of(this.mockData);
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