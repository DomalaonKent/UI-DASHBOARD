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
import { IconDirective } from '@coreui/icons-angular';
import { KpiInspectionService, KPIEntry } from './kpi-inspection.service';

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
    IconDirective,
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

  private sub?: Subscription;

  constructor(private kpiService: KpiInspectionService) {}

  ngOnInit(): void {
    this.avatarColors = this.kpiService.getAvatarColors();
    this.sub = this.kpiService.getKpiData().subscribe(data => {
      this.kpiData = data;
      this.computeSummary();
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private computeSummary(): void {
    if (!this.kpiData.length) return;
    const n = this.kpiData.length;

    this.avgCommitment     = this.kpiService.computeAvg(
      this.kpiData.flatMap(k => [k.commitment.quality, k.commitment.efficiency, k.commitment.timeliness])
    );
    this.avgAccomplishment = this.kpiService.computeAvg(
      this.kpiData.flatMap(k => [k.actual.quality, k.actual.efficiency, k.actual.timeliness])
    );
    this.avgFinalRating    = this.kpiService.computeAvg(
      this.kpiData.flatMap(k => [k.rating.quality, k.rating.efficiency, k.rating.timeliness])
    );

    const s = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
    this.avgQ = (s(this.kpiData.map(k => k.rating.quality))    / n).toFixed(1);
    this.avgE = (s(this.kpiData.map(k => k.rating.efficiency)) / n).toFixed(1);
    this.avgT = (s(this.kpiData.map(k => k.rating.timeliness)) / n).toFixed(1);
  }

  getAvatarColor(i: number): string {
    return this.avatarColors[i % this.avatarColors.length];
  }

  getRatingLabel(q: number, e: number, t: number): string {
    return this.kpiService.getRatingLabel(q, e, t);
  }

  getRatingBadgeClass(q: number, e: number, t: number): string {
    return this.kpiService.getRatingBadgeClass(q, e, t);
  }
}