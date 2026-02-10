import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { 
  CardComponent, 
  CardHeaderComponent, 
  CardBodyComponent,
  ColComponent,
  RowComponent,
  ButtonDirective,
  BadgeComponent
} from '@coreui/angular';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface OJTData {
  name: string;
  hours: number;
  color: string;
}

@Component({
  selector: 'app-task3',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    RowComponent,
    ButtonDirective,
    BadgeComponent
  ],
  templateUrl: './task3.component.html',
  styleUrls: ['./task3.component.scss']
})
export class Task3Component implements OnInit {
  @ViewChild('horizontalBarCanvas') horizontalBarCanvas!: ElementRef<HTMLCanvasElement>;

  // OJT Data from Google Sheets
  ojtData: OJTData[] = [
    { name: 'Karl', hours: 76, color: '#5856d6' },
    { name: 'Kenji', hours: 62, color: '#9333ea' },
    { name: 'Lester', hours: 54, color: '#39f' },
    { name: 'Emmelie', hours: 42, color: '#f9b115' },
    { name: 'Christian', hours: 42, color: '#e55353' },
    { name: 'Kent', hours: 36, color: '#2eb85c' }
  ];

  totalHours: number = 0;

  private horizontalChart?: Chart;

  ngOnInit(): void {
    this.totalHours = this.ojtData.reduce((sum, item) => sum + item.hours, 0);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createHorizontalBarChart();
    }, 100);
  }

  private createHorizontalBarChart(): void {
    const ctx = this.horizontalBarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const names = this.ojtData.map(item => item.name);
    const hours = this.ojtData.map(item => item.hours);
    const colors = this.ojtData.map(item => item.color);

    this.horizontalChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Hours Completed',
          data: hours,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 0,
          borderRadius: 4,
          barThickness: 40
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Task #3: OJT Hours - Horizontal Bar Chart (Full Page)',
            font: {
              size: 18,
              weight: 'bold'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            callbacks: {
              label: (context) => {
                const value = context.parsed.x ?? 0;
                const percentage = ((value / this.totalHours) * 100).toFixed(1);
                return `${value} hours (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            max: 80,
            ticks: {
              stepSize: 10,
              font: {
                size: 12
              }
            },
            title: {
              display: true,
              text: 'Total Hours Completed',
              font: {
                size: 14,
                weight: 'bold'
              }
            },
            grid: {
              display: true,
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y: {
            ticks: {
              font: {
                size: 13,
                weight: 600
              }
            },
            grid: {
              display: false
            }
          }
        },
        animation: {
          duration: 1500,
          easing: 'easeOutQuart'
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.horizontalChart) this.horizontalChart.destroy();
  }
}