import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DailyTimeRecordService, DtrRecord } from '../DailyTimeRecord/DailyTimeRecord.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userRole: string = 'HR';
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

  constructor(private dtrService: DailyTimeRecordService) {}

  ngOnInit(): void {
    this.personnelList = this.dtrService.getPersonnelList();

    if (this.userRole === 'HR') {
      this.selectedPersonnel = this.personnelList[0] || '';
      this.displayPersonnel = this.selectedPersonnel;
    } else {
      this.displayPersonnel = this.currentUser;
    }

    this.loadDtrData();
  }

  onPersonnelChange(): void {
    this.displayPersonnel = this.selectedPersonnel;
    this.loadDtrData();
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