import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { 
  CardComponent, 
  CardHeaderComponent, 
  CardBodyComponent,
  ColComponent,
  RowComponent,
  TableDirective,
  BadgeComponent,
  ButtonDirective
} from '@coreui/angular';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface OJTData {
  name: string;
  hours: number;
  color: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    ColComponent,
    RowComponent,
    TableDirective,
    BadgeComponent,
    ButtonDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('verticalBarCanvas') verticalBarCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieChartCanvas') pieChartCanvas!: ElementRef<HTMLCanvasElement>;

  // OJT Data from Google Sheets
  ojtData: OJTData[] = [
    { name: 'Karl', hours: 76, color: '#5856d6', status: 'Excellent' },
    { name: 'Kenji', hours: 62, color: '#9333ea', status: 'Good' },
    { name: 'Lester', hours: 54, color: '#39f', status: 'Good' },
    { name: 'Emmelie', hours: 42, color: '#f9b115', status: 'Fair' },
    { name: 'Christian', hours: 42, color: '#e55353', status: 'Fair' },
    { name: 'Kent', hours: 36, color: '#2eb85c', status: 'Fair' }
  ];

  totalHours: number = 0;
  averageHours: number = 0;

  private verticalChart?: Chart;
  private pieChart?: Chart;

  ngOnInit(): void {
    this.totalHours = this.ojtData.reduce((sum, item) => sum + item.hours, 0);
    this.averageHours = Math.round(this.totalHours / this.ojtData.length);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.createVerticalBarChart();
      this.createPieChart();
    }, 100);
  }

  private createVerticalBarChart(): void {
    const ctx = this.verticalBarCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const names = this.ojtData.map(item => item.name);
    const hours = this.ojtData.map(item => item.hours);
    const colors = this.ojtData.map(item => item.color);

    this.verticalChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: names,
        datasets: [{
          label: 'Hours Completed',
          data: hours,
          backgroundColor: colors,
          borderColor: colors,
          borderWidth: 0,
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          title: {
            display: true,
            text: 'Task #4: Vertical Bar Chart',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 20
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            callbacks: {
              label: (context) => {
                const value = context.parsed.y;
                if (value === null || value === undefined) return '';
                const percentage = ((value / this.totalHours) * 100).toFixed(1);
                return `${value} hours (${percentage}%)`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 80,
            ticks: {
              stepSize: 10,
              font: {
                size: 11
              }
            },
            title: {
              display: true,
              text: 'Total Hours',
              font: {
                size: 12,
                weight: 'bold'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            ticks: {
              font: {
                size: 12,
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

  private createPieChart(): void {
    const ctx = this.pieChartCanvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const names = this.ojtData.map(item => item.name);
    const hours = this.ojtData.map(item => item.hours);
    const colors = this.ojtData.map(item => item.color);

    this.pieChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: names,
        datasets: [{
          data: hours,
          backgroundColor: colors,
          borderColor: '#fff',
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              font: {
                size: 11
              },
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i] as number;
                    const percentage = ((value / this.totalHours) * 100).toFixed(1);
                    return {
                      text: `${label}: ${value}h (${percentage}%)`,
                      fillStyle: colors[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          title: {
            display: true,
            text: 'Task #5: Hours Distribution - Pie Chart',
            font: {
              size: 16,
              weight: 'bold'
            },
            padding: {
              bottom: 15
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12,
            callbacks: {
              label: (context) => {
                const value = context.parsed as number;
                const percentage = ((value / this.totalHours) * 100).toFixed(1);
                return `${context.label}: ${value} hours (${percentage}%)`;
              }
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

  getPercentage(hours: number): string {
    return ((hours / this.totalHours) * 100).toFixed(1) + '%';
  }

  ngOnDestroy(): void {
    if (this.verticalChart) this.verticalChart.destroy();
    if (this.pieChart) this.pieChart.destroy();
  }
}