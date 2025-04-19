import { Injectable } from '@angular/core';
import { webSocket } from 'rxjs/webSocket';
import { Observable, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BinanceService {
  private btcPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private ethPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private ltcPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private bnbPrice$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private btcMarketData$ = new BehaviorSubject<any>({});
  private ethMarketData$ = new BehaviorSubject<any>({});
  private ltcMarketData$ = new BehaviorSubject<any>({});
  private bnbMarketData$ = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) {
    this.connectWebsocket();
    this.getMarketDataREST();
  }

  connectWebsocket() {
    const socket = webSocket('wss://stream.binance.com:9443/ws/!ticker@arr');

    socket.subscribe((message: any) => {
      message.forEach((data: any) => {
        switch (data.s) {
          case 'BTCUSDT':
            this.btcPrice$.next(parseFloat(data.c));
            break;
          case 'ETHUSDT':
            this.ethPrice$.next(parseFloat(data.c));
            break;
          case 'LTCUSDT':
            this.ltcPrice$.next(parseFloat(data.c));
            break;
          case 'BNBUSDT':
            this.bnbPrice$.next(parseFloat(data.c));
            break;
        }
      });
    });
  }

  getMarketDataREST() {
    // Solicitudes REST para obtener el volumen y cambio en 24h
    this.http.get<any>('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT').subscribe(data => {
      this.btcMarketData$.next({ volume: parseFloat(data.volume), change: parseFloat(data.priceChangePercent) });
    });

    this.http.get<any>('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT').subscribe(data => {
      this.ethMarketData$.next({ volume: parseFloat(data.volume), change: parseFloat(data.priceChangePercent) });
    });

    this.http.get<any>('https://api.binance.com/api/v3/ticker/24hr?symbol=LTCUSDT').subscribe(data => {
      this.ltcMarketData$.next({ volume: parseFloat(data.volume), change: parseFloat(data.priceChangePercent) });
    });

    this.http.get<any>('https://api.binance.com/api/v3/ticker/24hr?symbol=BNBUSDT').subscribe(data => {
      this.bnbMarketData$.next({ volume: parseFloat(data.volume), change: parseFloat(data.priceChangePercent) });
    });
  }

  getBTCPrice(): Observable<number> {
    return this.btcPrice$.asObservable();
  }

  getETHPrice(): Observable<number> {
    return this.ethPrice$.asObservable();
  }

  getLTCPrice(): Observable<number> {
    return this.ltcPrice$.asObservable();
  }

  getBNBPrice(): Observable<number> {
    return this.bnbPrice$.asObservable();
  }

  getBTCMarketData(): Observable<any> {
    return this.btcMarketData$.asObservable();
  }

  getETHMarketData(): Observable<any> {
    return this.ethMarketData$.asObservable();
  }

  getLTCMarketData(): Observable<any> {
    return this.ltcMarketData$.asObservable();
  }

  getBNBMarketData(): Observable<any> {
    return this.bnbMarketData$.asObservable();
  }
}