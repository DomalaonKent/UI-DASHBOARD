import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  CardComponent,
  CardHeaderComponent,
  CardBodyComponent,
  ColComponent,
  RowComponent,
  BadgeComponent,
} from '@coreui/angular';
import { KpiInspectionService, KPIEntry, KpiCategoryData, SemesterKey } from './kpi-inspection.service';

@Component({
  selector: 'app-kpi-inspection',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    RowComponent,
    BadgeComponent,
  ],
  templateUrl: './kpi-inspection.component.html',
  styleUrls: ['./kpi-inspection.component.scss'],
})
export class KpiInspectionComponent implements OnInit, OnDestroy {

  kpiData: KPIEntry[]    = [];
  avatarColors: string[] = [];

  avgCommitment      = '0.00';
  avgAccomplishment  = '0.00';
  avgFinalRating     = '0.00';
  avgQ = '0.0';
  avgE = '0.0';
  avgT = '0.0';

  availableYears: number[]      = [];
  selectedYear: number          = 2026; 
  selectedSemester: SemesterKey = 'S1';
  yearDropdownOpen              = false;

  readonly semesterLabel: Record<SemesterKey, string> = {
    S1: 'January – June',
    S2: 'July – December',
  };

  readonly categoryTabKeys = [
    'processing',
    'encoding',
    'inspection',
    'frequency',
    'broadband',
  ] as const;

  readonly categoryTabLabels: Record<string, string> = {
    processing: 'Processing',
    encoding:   'Encoding & Printing',
    inspection: 'Inspection',
    frequency:  'Freq. Assignment',
    broadband:  'Broadband Speed',
  };

  activeTab      = 'kpi';
  categoryData: KpiCategoryData[] = [];

  private readonly tabIndexMap: Record<string, number> = {
    processing: 0,
    encoding:   1,
    inspection: 2,
    frequency:  3,
    broadband:  4,
  };

  private sub?:    Subscription;
  private catSub?: Subscription;

  constructor(private kpiService: KpiInspectionService) {}

  ngOnInit(): void {
    this.avatarColors   = this.kpiService.getAvatarColors();
    this.availableYears = [2026, 2027, 2028, 2029, 2030];
    this.selectedYear = 2026; 
    
    this.sub = this.kpiService.getKpiData().subscribe(data => {
      this.kpiData = data;
      this.computeSummary();
    });
    this.loadCategoryData();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.catSub?.unsubscribe();
  }

  toggleYearDropdown(): void {
    this.yearDropdownOpen = !this.yearDropdownOpen;
  }

  selectYear(year: number): void {
    this.selectedYear     = year;
    this.yearDropdownOpen = false;
    this.loadCategoryData();
  }

  selectSemester(sem: SemesterKey): void {
    this.selectedSemester = sem;
    this.loadCategoryData();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  private loadCategoryData(): void {
    this.catSub?.unsubscribe();
    this.catSub = this.kpiService
      .getCategoryData(this.selectedYear, this.selectedSemester)
      .subscribe({
        next: (data) => { 
          this.categoryData = data; 
        },
        error: (err) => {
          console.error('Error loading category data:', err);
          this.categoryData = [];
        }
      });
  }

  getCategoryForTab(tabKey: string): KpiCategoryData | null {
    const index = this.tabIndexMap[tabKey];
    return index !== undefined ? (this.categoryData[index] ?? null) : null;
  }

  getTotalWeight(tabKey: string): number {
    const cat = this.getCategoryForTab(tabKey);
    return cat?.rows.reduce((a, r) => a + (r.weight || 0), 0) ?? 0;
  }

  getTotalWeightPct(tabKey: string): number {
    const cat = this.getCategoryForTab(tabKey);
    return cat?.rows.reduce((a, r) => a + (r.weightPct || 0), 0) ?? 0;
  }

  rowProgress(row: { target: number; accomplishment: number | null }): number {
    if (!row.accomplishment || !row.target || row.target === 0) return 0;
    return Math.min(100, Math.round((row.accomplishment / row.target) * 100));
  }

  private computeSummary(): void {
    if (!this.kpiData.length) return;
    const n = this.kpiData.length;

    this.avgCommitment = this.kpiService.computeAvg(
      this.kpiData.flatMap(k => [k.commitment.quality, k.commitment.efficiency, k.commitment.timeliness])
    );
    this.avgAccomplishment = this.kpiService.computeAvg(
      this.kpiData.flatMap(k => [k.actual.quality, k.actual.efficiency, k.actual.timeliness])
    );
    this.avgFinalRating = this.kpiService.computeAvg(
      this.kpiData.flatMap(k => [k.rating.quality, k.rating.efficiency, k.rating.timeliness])
    );

    const s = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    this.avgQ = (s(this.kpiData.map(k => k.rating.quality))    / n).toFixed(1);
    this.avgE = (s(this.kpiData.map(k => k.rating.efficiency)) / n).toFixed(1);
    this.avgT = (s(this.kpiData.map(k => k.rating.timeliness)) / n).toFixed(1);
  }

  getAvatarColor(i: number): string {
    const colors = [
      '#5856d6', '#34d399', '#f59e0b', '#ef4444', 
      '#8b5cf6', '#ec489a', '#14b8a6', '#f97316'
    ];
    return colors[i % colors.length];
  }

  getRatingLabel(q: number, e: number, t: number): string {
    const avg = (q + e + t) / 3;
    if (avg >= 4.5) return 'Outstanding';
    if (avg >= 3.5) return 'Very Satisfactory';
    if (avg >= 2.5) return 'Satisfactory';
    return 'Poor';
  }

  getRatingBadgeClass(q: number, e: number, t: number): string {
    const avg = (q + e + t) / 3;
    if (avg >= 4.5) return 'badge-outstanding';
    if (avg >= 3.5) return 'badge-very-satisfactory';
    if (avg >= 2.5) return 'badge-satisfactory';
    return 'badge-poor';
  }
}