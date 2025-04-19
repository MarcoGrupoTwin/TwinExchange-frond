import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import Swal from "sweetalert2";
import { query } from "@angular/fire/firestore";
import { WalletService } from "src/shared/services/wallet.service";
import { Service } from "../module/service";
import {BinanceService} from "src/shared/services/binance.service";
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';
import { AreaSeries, BarSeries, createChart, CandlestickSeries,  } from 'lightweight-charts';

declare var TradingView: any;
declare var $: any;

@Component({
    selector: "app-list",
    templateUrl: "template.html",
    styleUrls: ["style.scss"]
})

export class ListComponent implements OnInit, OnDestroy, AfterViewInit {
    public ejecutarKYC: boolean = true;
    public ejecutarFirma: boolean = false;
    public loading: boolean = false;
    public cryptoCurrency: string = "btc";
    public imagenCrypto: string = "assets/images/cripto/iconBTC.png";
    public userData:Array<any> = [{
        nombre: "Juan",
        apellido: "Perez",
        email: "correo@juan.com"
    }];
    public markets = {
        BTC: {price: 0, volume: 0, change: 0},
        ETH: {price: 0, volume: 0, change: 0},
        LTC: {price: 0, volume: 0, change: 0},
        BNB: {price: 0, volume: 0, change: 0},
        TWIN: {price: 0, volume: 0, change: 0},
        TWINCOIN: {price: 0, volume: 0, change: 0}
    }
    public priceCoin = 0;

    //1 btc, 2 eth, 3 ltc, 4 bnb, 5 twincoin, 6 twin
    public crypto = 1; 
    public marketPrice = 0.00;  // Precio actual del mercado
    public balanceCrypto = 0.0;
    public balanceFiat = 0.00;
    public moneda = 'USD';
    
    // Datos de compra
    public buyAmount = 0;
    public buyTotal = 0;
    public buyPercentage = 0;

    // Datos de venta
    public sellAmount = 0;
    public sellTotal = 0;
    public sellPercentage = 0;

    //ordenes del usuario
    public ordersOpen:Array<any> = [];
    public ordersHistory:Array<any> = [];
    public seeOrderType = 1;
    public orders:Array<any> = [];
    public ordenes:Array<any> = [];
    public ordenesCompradas:Array<any> = [];
    public ordenesVendidas:Array<any> = [];
    public ordenesTradinwView:Array<any> = [];

    //trading view
    public intervalo: string = '1d';
    public buyPrice = 0.00;
    public sellPrice = 0.00;
    public FullLoading: boolean = false;
    private chart: any;
    private candlestickSeries: any;  


    //escuchar cambios en WS 
    public socketSubscription: Subscription;
    public onNewMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.Socket.on('orders', (data:any) => {
                console.log("Nueva orden",data);
                this.seeOrderType = 1;
                this.getOrdersByUser();
                observer.next(data);
            });
            this.Socket.on('new_price', async (data:any) => {
                if(data.success == 1){
                    this.marketPrice = data.price;
                    this.buyPrice = data.price;
                    this.sellPrice = data.price;
                    this.priceCoin = data.price;

                    if (this.candlestickSeries) {
                        const newCandle = {
                            time: await this.getHoraUsuarioToSeconds(),
                            open: data.open,
                            high: data.high,
                            low: data.low,
                            close: data.close
                        };
                        this.getAllOrders();
                        this.getOpenMarkets();
                        this.candlestickSeries.update(newCandle);
                    }
                }
                observer.next(data);
            })
        });
    }

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private walletService: WalletService,
        private service: Service,
        private binanceService: BinanceService,
        private Socket: Socket
    ){
    }

    async ngOnInit(){
        await this.ActivatedRoute.queryParams.subscribe(async params => {
            if(params["firma"] && params["firma"] == 1){
                this.ejecutarFirma = true
            }
        })
        this.ConnectUser();
        this.getWallet()
        this.getOpenMarkets();
        if(localStorage.getItem("cryptoCurrency")){
            this.cryptoCurrency = localStorage.getItem("cryptoCurrency")
            let currency = localStorage.getItem("cryptoCurrency")
            this.getIcons(currency)
        }

        this.walletService.walletUpdated$.subscribe(() => {
            if(localStorage.getItem("cryptoCurrency") != 'twin'){
                this.marketPriceReal()
                this.changeCryptoCurrency()
                this.getWallet()
                this.getIcons(localStorage.getItem("cryptoCurrency"))
            }else{
                console.log("No hará nada por que es twin")
            }
        })
    }

    ngOnDestroy(){
        this.Socket.disconnect()
    }

    ngAfterViewInit(): void {

    }

    ConnectUser(){
        let usuario = localStorage.getItem("user");
        this.Socket.connect();
        this.Socket.on('connect_error', (err) => {
            console.log('Error connecting to server', err);
        });
        this.socketSubscription = this.onNewMessage().subscribe((data) => {});
        this.Socket.emit('trading',{channel:usuario});
    }

    getOrdersByUser(){
        this.service.getOrdersByUser({crypto:this.crypto}).subscribe((resp:any) => {
            this.ordersOpen = resp.body.data.filter((order:any) => order.state == 'OPEN');
            this.ordersHistory = resp.body.data.filter((order:any) => order.state == 'CLOSED');
            this.orders = this.ordersOpen;
        },(error:any) => {
            console.log("Error al obtener las ordenes del usuario",error)
        })
    }

    async getAllOrders() {
        this.service.gerOrders({crypto:this.crypto,interval:this.intervalo}).subscribe((resp: any) => {
            this.ordenes = resp.body.data;
            let tradingview = resp.body.tradingview;
            console.log("Órdenes", tradingview);
    
            // Agrupar las órdenes por tipo
            this.ordenesCompradas = this.ordenes.filter((order: any) => order.type === 'buy');
            this.ordenesVendidas = this.ordenes.filter((order: any) => order.type === 'sell');
    
            // Formatear para TradingView
            this.ordenesTradinwView = tradingview.map((order: any) => ({
                time: order.time,
                open: order.open,
                high: order.high,
                low: order.low,
                close: order.close
            }));

            if(!this.FullLoading){
                this.initTradingView();
                this.FullLoading = true;
            }else{
                this.candlestickSeries.setData(this.ordenesTradinwView);
                this.chart.timeScale().fitContent();
            }
        }, (error: any) => {
            console.log("Error al obtener las órdenes", error);
        });
    }

    getLastPrice(crypto:number){
        this.service.getPriceCoin({crypto:crypto}).subscribe((data:any) => {
            this.priceCoin = data.body.price
            this.marketPrice = data.body.price
            this.buyPrice = data.body.price
            this.sellPrice = data.body.price
        },(error) => {
            console.log('Error al obtener el precio',error);
        })
    }

    changeTypeOrdes(type:string){
        if(type == 'open'){
            this.seeOrderType = 1;
            this.orders = this.ordersOpen;
        }else{
            this.seeOrderType = 2;
            this.orders = this.ordersHistory;
        }
    }

    getOpenMarkets(){
        this.openTwincoin()
        this.openBitcoin()
        this.openEthereum()
        this.openLitecoin()
        this.openBinance()
    }
    
    openTwincoin(){
        this.service.getOpenMarkets({crypto:5}).subscribe((data:any) => {
            if(data.body.success == 1){
                let markets = data.body.data;
                this.markets.TWINCOIN.price = markets.current_close;
                this.markets.TWINCOIN.volume = markets.current_volume;
                this.markets.TWINCOIN.change = markets.percent_change_24h;
            }
        })
    }

    openBitcoin(){
        this.service.getOpenMarkets({crypto:1}).subscribe((data:any) => {
            if(data.body.success == 1){
                let markets = data.body.data;
                this.markets.BTC.price = markets.current_close;
                this.markets.BTC.volume = markets.current_volume;
                this.markets.BTC.change = markets.percent_change_24h;
            }
        })
    }

    openEthereum(){
        this.service.getOpenMarkets({crypto:2}).subscribe((data:any) => {
            console.log('ETH:',data.body);
            if(data.body.success == 1){
                let markets = data.body.data;
                if(markets){
                    this.markets.ETH.price = markets.current_close;
                    this.markets.ETH.volume = markets.current_volume;
                    this.markets.ETH.change = markets.percent_change_24h;
                }
            }
        })
    }

    openLitecoin(){
        this.service.getOpenMarkets({crypto:3}).subscribe((data:any) => {
            if(data.body.success == 1){
                let markets = data.body.data;
                if(markets){
                    this.markets.LTC.price = markets.current_close;
                    this.markets.LTC.volume = markets.current_volume;
                    this.markets.LTC.change = markets.percent_change_24h;
                }
            }
        })
    }

    openBinance(){
        this.service.getOpenMarkets({crypto:4}).subscribe((data:any) => {
            if(data.body.success == 1){
                let markets = data.body.data;
                if(markets){
                    this.markets.BNB.price = markets.current_close;
                    this.markets.BNB.volume = markets.current_volume;
                    this.markets.BNB.change = markets.percent_change_24h;
                }
            }
        })
    }

    getIcons(currency:any){
        if(currency == "btc"){
            this.imagenCrypto = "assets/images/cripto/iconBTC.png"
        }else if(currency == "eth"){
            this.imagenCrypto = "assets/images/cripto/iconETH.png"
        }else if(currency == "ltc"){
            this.imagenCrypto = "assets/images/cripto/iconLTC.png"
        }else if(currency == "bnb"){
            this.imagenCrypto = "assets/images/cripto/iconBNB.png"
        }else if(currency == "twincoin"){
            this.imagenCrypto = "assets/images/cripto/icoTWC.png"
        }else{
            this.imagenCrypto = "assets/images/cripto/iconBTC.png"
        }
    }

    getWallet(){
        this.service.getWallet({moneda:8}).subscribe((data) => {
            if(localStorage.getItem("cryptoCurrency") == 'twincoin'){
                this.crypto = 5;
                this.balanceCrypto = data.body.crypto.twincoin;
            }else if(localStorage.getItem("cryptoCurrency") == 'btc'){
                this.crypto = 1;
                this.balanceCrypto = data.body.crypto.btc;
            }else if(localStorage.getItem("cryptoCurrency") == 'eth'){
                this.crypto = 2;
                this.balanceCrypto = data.body.crypto.eth;
            }else if(localStorage.getItem("cryptoCurrency") == 'ltc'){
                this.crypto = 3;
                this.balanceCrypto = data.body.crypto.ltc;
            }else if(localStorage.getItem("cryptoCurrency") == 'bnb'){
                this.crypto = 4;
                this.balanceCrypto = data.body.crypto.bnb;
            }else{
                this.crypto = 1;
                this.balanceCrypto = data.body.crypto.btc;
            }
            this.balanceFiat = data.body.data.current_balance;
            this.getLastPrice(this.crypto);
            this.getAllOrders();
            this.getOrdersByUser();
        })
    }

    marketPriceReal(){
        this.cleaninput();
        let nombre = "bitcoin";
        let currency  = localStorage.getItem("cryptoCurrency")
        if(currency == "btc"){
            nombre = "bitcoin"
        }else if(currency == "eth"){
            nombre = "ethereum"
        }else if(currency == "ltc"){
            nombre = "litecoin"
        }else if(currency == "bnb"){
            nombre = "binancecoin"
        }else{
            nombre = "bitcoin"
        }
        this.service.getMarketPrice({crypto:nombre}).subscribe((data) => {
            console.log('marketprice:',data.body);
            this.marketPrice = data.body.price
        })
    }

    cleaninput(){
        $('#sellCrypto').val('')
        $('#butCrypto').val('')
        this.buyAmount = 0;
        this.buyTotal = 0;
        this.buyPercentage = 0;
        this.sellAmount = 0;
        this.sellTotal = 0;
        this.sellPercentage = 0;
    }

    checkKYC(){
        setTimeout(() => {
            if(localStorage.getItem("kyc") == 'incomplete'){
                this.ejecutarKYC = true
                console.log("KYC Incompleto")
            }
         },500);
    }

    initTradingView() {
        this.chart = createChart(document.getElementById('tradingview_f7512'), { width: 800, height: 500});
        this.candlestickSeries = this.chart.addSeries(CandlestickSeries, { upColor: '#4CAF50', borderUpColor: '#4CAF50', wickUpColor: '#4CAF50', downColor: '#F44336', borderDownColor: '#F44336', wickDownColor: '#F44336', borderVisible: false });
        this.candlestickSeries.setData(this.ordenesTradinwView);
        this.chart.timeScale().fitContent();
    }

    manejarKYCCompletado(evento){
        console.log('Se completo el KYC:',evento)
    }
    manejarFirmaCompletada(evento){
        console.log('Se completo la firma:',evento)
        if(evento){
            this.ejecutarFirma = false;
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo completar la firma!',
            })
        }
    }

    changeCryptoCurrency(){
        this.cryptoCurrency = localStorage.getItem("cryptoCurrency")
    }

    private formatToCryptoDecimals(value: number): number {
        return parseFloat(value.toFixed(8));
    }

    calculateTotal(type: 'buy' | 'sell') {
        if (type === 'buy') {
            this.buyTotal = this.buyAmount * this.buyPrice;
        } else {
            this.sellTotal = this.sellAmount * this.sellPrice;
        }
    }

    updateFromPercentage(type: 'buy' | 'sell') {
        if (type === 'buy') {
            const amount = (this.balanceFiat * this.buyPercentage) / 100 / this.buyPrice;
            this.buyAmount = this.formatToCryptoDecimals(amount);
            this.calculateTotal('buy');
        } else {
            const amount = (this.balanceCrypto * this.sellPercentage) / 100;
            this.sellAmount = this.formatToCryptoDecimals(amount);
            this.calculateTotal('sell');
        }
    }

    async getHoraUsuario(){
        const formatter = new Intl.DateTimeFormat('es-MX', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        
        const parts = formatter.formatToParts(new Date());
        const year = parts.find(p => p.type === 'year').value;
        const month = parts.find(p => p.type === 'month').value;
        const day = parts.find(p => p.type === 'day').value;
        const hour = parts.find(p => p.type === 'hour').value;
        const minute = parts.find(p => p.type === 'minute').value;
        const second = parts.find(p => p.type === 'second').value;

        const isoDate = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
        
        return isoDate;
    }

    async getHoraUsuarioToSeconds(){
        let hora = await this.getHoraUsuario();
        let fecha = new Date(hora);
        let segundos = fecha.getTime() / 1000;
        return segundos;
    }

    async submitOrder(type: 'buy' | 'sell') {
        this.loading = true;
    
        const price = type === 'buy' ? this.buyPrice : this.sellPrice;
        const amount = type === 'buy' ? this.buyAmount : this.sellAmount;
        const total = amount * price;

        const order = {
            crypto: this.crypto,
            type,
            amount,
            total,
            price,
            timestamp: await this.getHoraUsuario(),
            currency: 8
        };
    
        console.log('Orden lista para enviar:', order);
    
        this.service.postOrder(order).subscribe(
            (response: any) => {
                this.loading = false;
                console.log('Orden enviada:', response);
                Swal.fire({
                    icon: 'success',
                    title: 'Orden enviada',
                    text: 'Tu orden ha sido enviada con éxito!',
                });
            },
            (error: any) => {
                this.loading = false;
                console.error('Error al enviar orden:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se pudo enviar la orden!',
                });
            }
        );
    }
}