import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WalletService {
  private walletUpdatedSource = new Subject<void>();
  walletUpdated$ = this.walletUpdatedSource.asObservable();
  constructor() { }

  notifyUpdateWallet() {
    this.walletUpdatedSource.next();
  }
 
}