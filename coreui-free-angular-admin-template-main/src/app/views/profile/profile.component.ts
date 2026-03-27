import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DailyTimeRecordService, DtrRecord } from '../DailyTimeRecord/DailyTimeRecord.service';
import { KpiInspectionService, SemesterKey } from '../kpi-inspection/kpi-inspection.service';
import { AuthService } from '../../services/auth.service';

interface IndividualKpiData {
  avgCommitment: string;
  avgAccomplishment: string;
  finalRating: string;
  totalTarget: number;
  totalAccomplishment: number | null;
  overallProgress: number;
  categories: Array<{
    label: string;
    target: number;
    accomplishment: number | null;
    progress: number;
  }>;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  private authService = inject(AuthService);

  userRole: string = '';
  currentUser: string = 'Andrei F. Imperial';

  filteredRecords: DtrRecord[] = [];
  personnelList: string[] = [];
  yearList: number[] = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  monthList = [
    { value: 1,  label: 'January'   }, { value: 2,  label: 'February'  },
    { value: 3,  label: 'March'     }, { value: 4,  label: 'April'     },
    { value: 5,  label: 'May'       }, { value: 6,  label: 'June'      },
    { value: 7,  label: 'July'      }, { value: 8,  label: 'August'    },
    { value: 9,  label: 'September' }, { value: 10, label: 'October'   },
    { value: 11, label: 'November'  }, { value: 12, label: 'December'  }
  ];

  selectedPersonnel: string = '';
  selectedYear: number = 2026;
  selectedMonth: number = 1;
  displayPersonnel: string = '';

  editingDay: number | null = null;
  editingRemark: string = '';

  activeTab: string = 'dtr';
  selectedSemester: SemesterKey = 'S1';
  selectedYearKpi: number = 2026;
  availableYears: number[] = [2024, 2025, 2026, 2027, 2028, 2029, 2030];
  individualKpiData: IndividualKpiData | null = null;

  constructor(
    private dtrService: DailyTimeRecordService,
    private kpiService: KpiInspectionService
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.personnelList = this.dtrService.getPersonnelList();

    if (this.userRole === 'HR') {
      this.selectedPersonnel = this.personnelList[0] || '';
      this.displayPersonnel = this.selectedPersonnel;
    } else {
      this.displayPersonnel = this.currentUser;
    }

    this.loadDtrData();
    this.loadIndividualKpi();
  }

  onPersonnelChange(): void {
    this.displayPersonnel = this.selectedPersonnel;
    this.loadDtrData();
    this.loadIndividualKpi();
  }

  onDtrFilterChange(): void {
    this.loadDtrData();
  }

  loadDtrData(): void {
    const personnel = this.userRole === 'HR' ? this.selectedPersonnel : this.currentUser;
    if (!personnel) return;
    this.filteredRecords = this.dtrService.getMonthlyRecords(
      personnel, this.selectedYear, this.selectedMonth
    );
  }

  loadIndividualKpi(): void {
    const personnel = this.userRole === 'HR' ? this.selectedPersonnel : this.currentUser;
    if (!personnel) return;

    this.kpiService.getCategoryData(this.selectedYearKpi, this.selectedSemester).subscribe(categories => {
      const categoryProgress = categories.map(cat => {
        const progress = cat.totalAccomplishment !== null && cat.totalTarget > 0
          ? Math.min(100, Math.round((cat.totalAccomplishment / cat.totalTarget) * 100))
          : 0;
        return {
          label: cat.label,
          target: cat.totalTarget,
          accomplishment: cat.totalAccomplishment,
          progress
        };
      });

      const totalTarget = categoryProgress.reduce((s, c) => s + c.target, 0);
      const totalAccomplishment = categoryProgress.every(c => c.accomplishment === null)
        ? null
        : categoryProgress.reduce((s, c) => s + (c.accomplishment || 0), 0);
      const overallProgress = totalAccomplishment !== null && totalTarget > 0
        ? Math.min(100, Math.round((totalAccomplishment / totalTarget) * 100))
        : 0;

      this.kpiService.getKpiData().subscribe(kpiData => {
        const personData = kpiData.find(k => k.inspector === personnel);

        if (personData) {
          this.individualKpiData = {
            avgCommitment: this.kpiService.computeAvg([
              personData.commitment.quality,
              personData.commitment.efficiency,
              personData.commitment.timeliness
            ]),
            avgAccomplishment: this.kpiService.computeAvg([
              personData.actual.quality,
              personData.actual.efficiency,
              personData.actual.timeliness
            ]),
            finalRating: this.kpiService.getRatingLabel(
              personData.rating.quality,
              personData.rating.efficiency,
              personData.rating.timeliness
            ),
            totalTarget,
            totalAccomplishment,
            overallProgress,
            categories: categoryProgress
          };
        } else {
          this.individualKpiData = {
            avgCommitment: '0.00',
            avgAccomplishment: '0.00',
            finalRating: 'No Data',
            totalTarget,
            totalAccomplishment,
            overallProgress,
            categories: categoryProgress
          };
        }
      });
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  startEdit(rec: DtrRecord): void {
    this.editingDay = rec.DTRDAY;
    this.editingRemark = rec.Remark || '';
  }

  saveRemark(rec: DtrRecord): void {
    const personnel = this.userRole === 'HR' ? this.selectedPersonnel : this.currentUser;
    this.dtrService.updateRemark(
      rec.ID, rec.DTRYEAR, rec.DTRMONTH, rec.DTRDAY, personnel, this.editingRemark
    );
    rec.Remark = this.editingRemark;
    this.editingDay = null;
  }

  cancelEdit(): void {
    this.editingDay = null;
  }

  isWeekend(rec: DtrRecord): boolean {
    if (rec.Remark === 'Saturday' || rec.Remark === 'Sunday') return true;
    const dow = new Date(rec.DTRYEAR, rec.DTRMONTH - 1, rec.DTRDAY).getDay();
    return dow === 0 || dow === 6;
  }

  hasValue(val: string): boolean {
    return !!val && val !== 'NULL' && val !== '';
  }

  getMonthName(month: number): string {
    return this.monthList.find(m => m.value === month)?.label || '';
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name.split(' ')
      .filter(n => n.length > 0)
      .slice(0, 2)
      .map(n => n[0].toUpperCase())
      .join('');
  }
}