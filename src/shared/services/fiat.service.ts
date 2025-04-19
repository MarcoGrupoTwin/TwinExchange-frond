import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FiatService {
  private FiatUpdatedSource = new Subject<void>();
  FiatUpdated$ = this.FiatUpdatedSource.asObservable();
  constructor() { }

  notifyUpdateFiat() {
    this.FiatUpdatedSource.next();
  }
 
}