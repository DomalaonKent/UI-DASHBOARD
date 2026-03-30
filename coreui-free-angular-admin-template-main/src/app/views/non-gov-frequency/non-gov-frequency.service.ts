import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface FrequencyData {
  id: number;
  callSign: string;
  licensee: string;
  txFreq: string | null;
  rxFreq: string | null;
  location: string;
  serviceArea: string;
  equipment: string | null;
  serialNumber: string | null;
  source: string;
  issued: string | null;
}

@Injectable({ providedIn: 'root' })
export class NonGovFrequencyService {

  private readonly NON_GOV_JSON_PATHS: Record<string, string> = {
    portable: 'assets/data/freq-non-gov-portable.json',
    fb:       'assets/data/freq-non-gov-fb.json',
    mobile:   'assets/data/freq-non-gov-mobile.json',
    fx:       'assets/data/freq-non-gov-fx.json',
    repeater: 'assets/data/freq-non-gov-repeater.json',
  };

  constructor(private http: HttpClient) {}

  getNonGovDataByType(type: string): Observable<FrequencyData[]> {
    const url = this.NON_GOV_JSON_PATHS[type];
    if (!url) {
      console.warn(`[NonGovFrequencyService] Unknown tab type: "${type}"`);
      return of([]);
    }
    return this.http.get<any[]>(url).pipe(
      map(data => this.mapData(data)),
      catchError(err => {
        console.error(`[NonGovFrequencyService] Could not load "${url}". Status: ${err.status}.`);
        return of([]);
      })
    );
  }

  private mapData(data: any[]): FrequencyData[] {
    return data.map((item, i) => ({
      id:           i + 1,
      callSign:     item.callSign     ?? '',
      licensee:     item.licensee     ?? '',
      txFreq:       item.txFreq       ?? null,
      rxFreq:       item.rxFreq       ?? null,
      location:     item.location     ?? '',
      serviceArea:  item.serviceArea  ?? '',
      equipment:    item.equipment    ?? null,
      serialNumber: item.serialNumber ?? null,
      source:       item.source       ?? '',
      issued:       item.issued       ?? null,
    }));
  }
}