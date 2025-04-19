import { Router, ActivatedRoute } from "@angular/router";
import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Input, Output, AfterViewInit, Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import Swal from "sweetalert2";
import { FiatService } from "src/shared/services/fiat.service";
import { WalletService } from "src/shared/services/wallet.service";
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';

declare var TradingView: any;
declare var $: any;
declare var Stripe: any;

@Component({
    selector: "app-list",
    templateUrl: "template.html",
    styleUrls: ["style.scss"]
})

export class ListComponent implements OnInit {
    public usaTarjeta:boolean = false;
    public sendPay:number = 1;
    public usaQR:boolean = false;
    public qrGenerated:boolean = false;
    public qrCode:string = null;
    public current_balance:number = 0;
    public cantidadFondeo:number = 0;
    public showCantidad:boolean = false;
    public userName:string = localStorage.getItem("name");
    public loading:boolean = false;
    public card:any = null;
    private stripe: any;
    public cards:any = [];
    public cardSelected:any = null;
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    @ViewChild('digitInputsOne') digitInputsOne!: ElementRef;
    public nombre:string = "";
    public correo:string = "";
    public qrRetiro:any = null;
    public qrRetiroDownload:any = null;
    public moneda:string = "MXN";
    public cryptoAddress:string = null;
    public smallMenu:boolean = false;
    public isFlipped = false;
    public fund = 'mxn';
    public comisionTexto = '3% + $3.00 + IVA';
    // Twin
    public calculoTwin = 20;
    public totalTwin = "1 twin = 1 USD";
    public totalTwincoin = "1 TWC = 1 USD";
    public tipoCambio = '';
    public cantidadFondeoTwin = 0;
    public currentBalanceTwin = 0;
    public bandera = 'https://flagcdn.com/mx.svg';
    public usaTarjetaUSD:boolean = false;
    public webSocketChanel: string = null; 
    public on3dsActive(): Observable<any> {
        return new Observable<any>(observer => {
            console.log(`Escuchando canal específico:`);
            this.Socket.on('3dsComplete', (data: any) => {
                console.log('Evento recibido en Angular:', data);
                observer.next(data);
            });

            this.Socket.on('await3ds', (data: any) => {
                console.log('Evento recibido en Angular:', data);
            });
            return () => {
                this.Socket.off('3dsComplete');
            };
        });
    }    

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,
        private renderer: Renderer2, 
        private FiatService: FiatService,
        @Inject(DOCUMENT) private document: Document,
        private walletService: WalletService,
        private Socket: Socket,
    ){
        this.nombre = localStorage.getItem("name")
        this.correo = localStorage.getItem("mail")
    }

    async ngOnInit(){
        this.loadStripeScript().then(() => {
            // Una vez que el script de Stripe se ha cargado, puedes crear la instancia de Stripe.
            this.stripe = Stripe('pk_test_51OPiAjCbRryrzgLUQ1xs56K4kd3JHpuU0QwwnpJ1M03jM2eUxof7v3fIV6niZnHRT5YTqxCqGGTf3BbThiUtG7VA00jAdvR2IK');
            this.crearTarjeta();
        });
        setTimeout( async() => {
            await this.getWallet();
            this.muestraTarjetas()
        }, 500);
        if(localStorage.getItem("cryptoCurrency")){
            let currency = localStorage.getItem("cryptoCurrency");
            if(currency == "eth" || currency == "btc" || currency == "ltc" || currency == "bnb"){
                this.fund = "mxn";
                this.moneda = "MXN";
            }else{
                this.fund = currency; 
                this.moneda = currency.toUpperCase();
            }
        }
        if(this.fund == "mxn"){
            this.comisionTexto = '3% + $3.00 + IVA';
        }else if(this.fund == "twin"){
            this.comisionTexto = '0%';
        }else if(this.fund == "twincoin"){
            this.comisionTexto = '0%';
        }else{
            this.comisionTexto = '3% + $3.00 + IVA';
        }
        this.ActivatedRoute.queryParams.subscribe(async params => {
            if(params["currency"]){
                if(params["currency"] == "mxn"){
                    this.fund = "mxn";   
                    this.moneda = "MXN";
                    this.comisionTexto = '3% + $3.00 + IVA';
                }else if(params["currency"] == "twin"){
                    this.fund = "twin";
                    this.moneda = "TWIN"
                    this.comisionTexto = '0%';
                }else if(params["currency"] == "twincoin"){
                    this.fund = "twincoin";
                    this.moneda = "TWC"
                    this.comisionTexto = '0%';
                }else{
                    this.fund = "mxn";
                    this.moneda = "MXN"
                    this.comisionTexto = '3% + $3.00 + IVA';
                }
            }
        })
        this.walletService.walletUpdated$.subscribe(() => {
            this.getWallet();
            this.muestraTarjetas();
            this.moneda = localStorage.getItem("currency") ? localStorage.getItem("currency").toUpperCase() : "MXN";
        })
    }
    onDigitInput(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
        if (inputValue.length === 0) {
            const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
            if (index > 0) {
                inputElements[index - 1].focus();
            }
        }
    }
    onDigitInputOne(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
        if (inputValue.length === 0) {
            const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
            if (index > 0) {
                inputElements[index - 1].focus();
            }
        }
    }
    async getWallet(){
        this.loading = true;
        console.log("getWallet");
        let monedaL = localStorage.getItem("currency") == 'mxn' ? 7 : localStorage.getItem("currency") == 'usd' ? 8 : 7;
        this.ServiceUser.getWallet({moneda:monedaL}).subscribe((response: any) => {
            this.loading = false;
            console.log('cartera bro:',response.body);
            if(response.ok){
                let data = response.body.data;
                this.qrCode = data.qr;
                this.current_balance = data.current_balance; 
                this.cryptoAddress = data.uuid;
                this.currentBalanceTwin = response.body.crypto.twin;
                localStorage.setItem("currentBalance", data.current_balance);
                this.bandera = 'https://flagcdn.com/' + data.logo + '.svg';
                this.moneda = data.short_name;
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        },(error)=>{
            console.log(error);
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: error.message ? error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }
    keypressValidaNumero($event){
        if($event.keyCode < 48 || $event.keyCode > 57){
            $event.preventDefault();
        }
        if($event.target.value.length >= 5){
            $event.preventDefault();
        }
        this.cantidadFondeo = $event.target.value;
    }
    changeMXN(){
        this.fund = "mxn";
        this.router.navigate(['/usuario/fund'], { queryParams: { currency: 'mxn' } });
    }
    adquirirTwin(){
        const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
        const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
        values.forEach((value: string) => {
            if(value == ''){
                Swal.fire({
                    title: "Error",
                    text: "Ingresa el código de seguridad de tu cuenta",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return false;
            }
        })
        if(!this.cardSelected){
            Swal.fire({
                title: "Error",
                text: "Selecciona una tarjeta para poder fondear tu cuenta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(this.cantidadFondeoTwin == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder adquirir Twins",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        let code = values.join('');
        let datosFondeo = {
            amount: this.cantidadFondeoTwin,
            cardID: this.cardSelected,
            code: code
        }
        //en 2 decimales
        let cantidadAmostrarFiat = this.calculoTwin.toFixed(2);
        Swal.fire({
            title: "¿Estás seguro?",
            icon: "question",
            text: "¿Estás seguro que deseas adquirir "+this.cantidadFondeoTwin+" Twins por "+cantidadAmostrarFiat+" MXN?",
            showCancelButton: true,
            confirmButtonText: "Adquirir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if(result.isConfirmed){
                this.loading = true;
                this.ServiceUser.mintTwin(datosFondeo).subscribe((response: any) => {
                    console.log('minteoTwin:',response);
                    this.loading = false;
                    if(response.ok){
                        this.cantidadFondeoTwin = 0;
                        $('#fondeaCuentaTwin').val();
                        Swal.fire({
                            title: "Exito",
                            text: 'Tu compra se ha realizado correctamente',
                            icon: "success",
                            confirmButtonText: "Entendido",
                        });
                        Array.from(inputElements).map((input: HTMLInputElement) => input.value = '');
                        $('#fondeaCuentaTwin').val('');
                        this.cardSelected = null;
                        this.totalTwin = "1 twin = 1 USD";
                        this.getWallet();
                    }else{
                        Swal.fire({
                            title: "Error",
                            text: response.body.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                    }
                },(error: any) => {
                    this.loading = false;
                    console.log(error);
                    Swal.fire({
                        title: "Error",
                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                })
            }
        });
    }
    adquirirTwincoin(){
        const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
        const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
        values.forEach((value: string) => {
            if(value == ''){
                Swal.fire({
                    title: "Error",
                    text: "Ingresa el código de seguridad de tu cuenta",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return false;
            }
        })
        if(!this.cardSelected){
            Swal.fire({
                title: "Error",
                text: "Selecciona una tarjeta para poder fondear tu cuenta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        //la cantidad no puede ser menor a 0.00001
        if(this.cantidadFondeoTwin < 0.00001){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder adquirir Twins",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        let code = values.join('');
        let datosFondeo = {
            amount: this.cantidadFondeoTwin,
            cardID: this.cardSelected,
            code: code
        }
        //en 2 decimales
        let cantidadAmostrarFiat = this.calculoTwin.toFixed(2);
        Swal.fire({
            title: "¿Estás seguro?",
            icon: "question",
            text: "¿Estás seguro que deseas adquirir "+this.cantidadFondeoTwin+" Twincoins por "+cantidadAmostrarFiat+" MXN?",
            showCancelButton: true,
            confirmButtonText: "Adquirir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if(result.isConfirmed){
                this.loading = true;
                this.ServiceUser.mintTwincoin(datosFondeo).subscribe((response: any) => {
                    console.log('minteoTwin:',response);
                    this.loading = false;
                    if(response.ok){
                        this.cantidadFondeoTwin = 0;
                        $('#fondeaCuentaTwin').val();
                        Swal.fire({
                            title: "Exito",
                            text: 'Tu compra se ha realizado correctamente',
                            icon: "success",
                            confirmButtonText: "Entendido",
                        });
                        Array.from(inputElements).map((input: HTMLInputElement) => input.value = '');
                        $('#fondeaCuentaTwin').val('');
                        this.cardSelected = null;
                        this.totalTwin = "1 twincoin = 1 USD";
                        this.getWallet();
                    }else{
                        Swal.fire({
                            title: "Error",
                            text: response.body.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                    }
                },(error: any) => {
                    this.loading = false;
                    console.log(error);
                    Swal.fire({
                        title: "Error",
                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                })
            }
        });
    }
    keypressValidaNumeroTwin($event){
        if ($event.type === 'keydown') {
            if ($event.key === 'e' || $event.key === '.' || $event.key === '-' || $event.key === '+') {
                $event.preventDefault();
                return;
            }
        }
        if($event.data != null){
            if($event.keyCode < 48 || $event.keyCode > 57){
                $event.preventDefault();
                return;
            }
            if($event.target.value.length >= 5){
                $event.preventDefault();
                return;
            }
            // Calcular el valor y formatearlo
            let valor = $event.target.value.replace(/[^0-9]/g, '');
            parseInt(valor);
            if (valor.length > 5) {
                valor = valor.slice(0, 5);
            }
            //consulta tipo de cambio
            
            this.ServiceUser.consultarTipoCambio({moneda:'mxn'}).subscribe((response: any) => {
                if(response.body.success == 1){            
                    console.log('tipo de cambio:',response.body.exchange);
                    let tipoCambio = response.body.exchange;
                    $("#tipoCambio").text("1 twin = 1 USD o = "+tipoCambio+" MXN");
                    this.calculoTwin = valor * tipoCambio;
                    this.totalTwin = "";
                    // Formatear el cálculo a formato de moneda
                    const formattedTotal = this.calculoTwin.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
                    // Asignar el valor formateado
                    this.totalTwin = `Total a pagar: ${formattedTotal}`;
                    this.cantidadFondeoTwin = $event.target.value;
                }else{
                    Swal.fire({
                        title: "Error",
                        text: response.body.message,
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                }
            },(error)=>{
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: error.message ? error.message : "Error desconocido, intente más tarde",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            })
        }else{
            this.totalTwin = "1 twin = 1 USD";
            this.cantidadFondeoTwin = 0;
        }
    }
    showCantidadToggle(){
        this.showCantidad = !this.showCantidad;
    }
    loadStripeScript(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
          const script = this.renderer.createElement('script');
          script.src = 'https://js.stripe.com/v3/';
          script.async = true;
          script.defer = true;
    
          script.onload = () => {
            resolve();
          };
    
          script.onerror = (error: Event | string) => {
            reject(error);
          };
    
          this.renderer.appendChild(this.document.body, script);
        });
    }
    crearTarjeta() {
        this.loading = true;
        var elements = this.stripe.elements();
        var style = {
            base: {
                color: '#32325d',
                fontFamily: 'Roboto, "Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a',
            },
        }
        let cardNumber = elements.create('cardNumber', { style: style });
        cardNumber.mount('#cardNumber');
        let expirate = elements.create('cardExpiry', { style: style });
        expirate.mount('#expira');
        let cvc = elements.create('cardCvc', { style: style });
        cvc.mount('#cardCvc');
        this.card = cardNumber;
        this.loading = false;
    }
    addCard(){
        let moneda = localStorage.getItem("currency") ? localStorage.getItem("currency") : 'mxn';
        if(moneda == 'mxn'){
            this.usaTarjeta = true;
            setTimeout(() => {
                this.crearTarjeta()
            }, 1000);
        }else if(moneda == 'usd'){
            this.sendPay = 2;
            this.usaTarjeta = true;
            this.usaQR = true;
            this.usaTarjetaUSD = true;
        }else{
            Swal.fire({
                title: "Error",
                text: "Selecciona una moneda para poder agregar una tarjeta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }
    }
    enviaTarjeta() {
        if (this.stripe && this.card) {
            this.sendPay = 1;
            this.loading = true;
            this.stripe.createToken(this.card).then((result: any) => {
                let token = result.token.id;
                this.ServiceUser.saveCard({cardToken:token}).subscribe((response: any) => {
                    console.log('tarjetas:',response);
                    this.loading = false;
                    if(response.ok){
                        Swal.fire({
                            title: "Exito",
                            text: 'Tu tarjeta se ha agregada correctamente',
                            icon: "success",
                            confirmButtonText: "Entendido",
                        });
                        this.usaTarjeta = false;
                        this.muestraTarjetas();
                        this.card.destroy();
                    }else{
                        Swal.fire({
                            title: "Error",
                            text: response.body.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                    }
                }, (error: any) => {
                    this.loading = false;
                    console.log('tarjetas error:',error);
                    Swal.fire({
                        title: "Error",
                        text: error.message ? error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                })
            }, (error: any) => {
                this.loading = false;
                console.log('error:',error);
            })
        } else {
          console.log("No hay tarjeta o instancia de Stripe");
        }
    }
    formatoFechaCard($event: any) {
        let value = $event.target.value;
        value = value.replace(/[^0-9]/g, '');
    
        if (value.length > 2) {
            value = `${value.substring(0, 2)}/${value.substring(2, 6)}`;
        }
    
        if (value.length > 7) {
            value = value.substring(0, 7);
        }
    
        $event.target.value = value;
    }
    enviaTarjetaUSD() {
        //trae nombreUSD,cardUSD,expiraUSD,cvvUSD valida cada dato y envía para guardar
        let nombre = $('#nombreUSD').val();
        let card = $('#cardUSD').val();
        let expira = $('#expiraUSD').val();
        let cvv = $('#cvvUSD').val();
        if(!nombre || nombre == '' || nombre == null || nombre == undefined || nombre.length < 3){
            Swal.fire({
                title: "Error",
                text: "Ingresa el nombre del titular de la tarjeta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(!card || card == '' || card == null || card == undefined || card.length > 16 || card.length < 14){
            Swal.fire({
                title: "Error",
                text: "Ingresa el número de la tarjeta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(!expira || expira == '' || expira == null || expira == undefined || expira.length < 5){
            Swal.fire({
                title: "Error",
                text: "Ingresa la fecha de expiración de la tarjeta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(!cvv || cvv == '' || cvv == null || cvv == undefined || cvv.length < 3){
            Swal.fire({
                title: "Error",
                text: "Ingresa el código de seguridad de la tarjeta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        let mes = expira.split('/')[0];
        let ano = expira.split('/')[1];
        this.loading = true;
        let data = {
            nombre: nombre,
            card: card,
            mes: mes,
            ano: ano,
            cvv: cvv
        }
        this.ServiceUser.saveCardUSD(data).subscribe((response: any) => {
            console.log('tarjetas:',response);
            this.loading = false;
            if(response.ok){
                Swal.fire({
                    title: "Exito",
                    text: 'Tu tarjeta se ha agregada correctamente',
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.usaTarjetaUSD = false;
                $('#nombreUSD').val('');
                $('#cardUSD').val('');
                $('#expiraUSD').val('');
                $('#cvvUSD').val('');
                this.usaTarjeta = false;
                this.usaTarjetaUSD = false;
                this.usaTarjeta = false;
                this.usaQR = false
                this.muestraTarjetas();
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        }, (error: any) => {
            this.loading = false;
            console.log(error);
            Swal.fire({
                title: "Error",
                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }
    muestraTarjetas(){
        this.sendPay = 2;
        this.loading = true;
        this.ServiceUser.getCards({moneda:localStorage.getItem("currency")}).subscribe((response: any) => {
            console.log(response);
            this.loading = false;
            if(response.ok){
                this.cards = [];
                response.body.data.forEach(element => {
                    if(element.uuid != null){
                        this.cards.push(element)
                    }
                });
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        }, (error: any) => {
            this.loading = false;
            console.log(error);
        })
    }
    selectCardRecharge(uuid:string){
        if(this.fund == 'mxn'){
            if(!this.cantidadFondeo || this.cantidadFondeo == 0){
                Swal.fire({
                    title: "Error",
                    text: "Ingresa una cantidad para poder seleccionar una tarjeta",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return false;
            }
        }else if(this.fund == 'twin'){
            if(!this.cantidadFondeoTwin || this.cantidadFondeoTwin == 0){
                Swal.fire({
                    title: "Error",
                    text: "Ingresa una cantidad para poder seleccionar una tarjeta",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return false;
            }
        }else if(this.fund == 'twincoin'){
            if(!this.cantidadFondeoTwin || this.cantidadFondeoTwin == 0){
                Swal.fire({
                    title: "Error",
                    text: "Ingresa una cantidad para poder seleccionar una tarjeta",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return false;
            }
        }else{
            Swal.fire({
                title: "Error",
                text: "Selecciona una moneda para poder seleccionar una tarjeta",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.cardSelected = uuid;
    }
    deleteCard(uuid:string){
        console.log(uuid);
        Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: "¿Deseas eliminar esta tarjeta, esta acción no se puede revertir?",
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.ServiceUser.deleteCardStripe({cardID:uuid}).subscribe((response: any) => {
                    console.log(response);
                    this.loading = false;
                    if(response.ok){
                        this.muestraTarjetas();
                        Swal.fire({
                            title: "Exito",
                            text: 'Tu tarjeta se ha eliminado correctamente',
                            icon: "success",
                            confirmButtonText: "Entendido",
                        });
                    }else{
                        Swal.fire({
                            title: "Error",
                            text: response.body.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                    }
                }, (error: any) => {
                    this.loading = false;
                    console.log(error);
                    Swal.fire({
                        title: "Error",
                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                })
            }
        })
    }
    fondearCuenta(){
        let cantidadFondeo = Number(this.cantidadFondeo);
        let comisiones = cantidadFondeo * 0.054;

        let montoAcobrar = cantidadFondeo + comisiones;
        

        if (isNaN(montoAcobrar)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al calcular el monto a cobrar.',
            });
            return;
        }
        Swal.fire({
            icon: 'warning',
            title: '¿Estás seguro?',
            text: `¿Deseas fondear ${this.cantidadFondeo + this.moneda}  a tu cuenta, se cobrará un total de ${montoAcobrar.toFixed(2) + this.moneda}, que incluye ${comisiones.toFixed(2) + this.moneda} de comisiones por uso de terminal?`,
            showCancelButton: true,
            confirmButtonText: 'Si, Fondear',
            cancelButtonText: 'No, modificar',
        }).then((result) => {
            if (result.isConfirmed) {
                if(!this.cantidadFondeo || this.cantidadFondeo == 0){
                    Swal.fire({
                        title: "Error",
                        text: "Ingresa una cantidad para poder fondear tu cuenta",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                    return false;
                }
                if(!this.cardSelected){
                    Swal.fire({
                        title: "Error",
                        text: "Selecciona una tarjeta para poder fondear tu cuenta",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                    return false;
                }
                const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
                const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
                values.forEach((value: string) => {
                    if(value == ''){
                        Swal.fire({
                            title: "Error",
                            text: "Ingresa el código de seguridad de tu cuenta",
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                        return false;
                    }
                })
                let code = values.join('');
                let data = {
                    amount: montoAcobrar.toFixed(2),
                    cardID: this.cardSelected,
                    code: code,
                    cantidadOriginal: this.cantidadFondeo,
                    moneda: this.moneda
                }
                this.loading = true;
                this.ServiceUser.fondearCuenta(data).subscribe((response: any) => {
                    console.log('respuesta cobro:', response);
                    this.loading = false;
                    if (response.body.auth) {
                        // Si la tarjeta requiere 3DS
                        let authWindow = window.open(response.body.url, "_blank", "width=500,height=600");
                        this.webSocketChanel = response.body.channel;
                        
                        this.Socket.on('connect', () => {
                            console.log('Conexión WebSocket establecida');
                            this.Socket.emit('await3ds', { channel: this.webSocketChanel });
                        });
                        
                        this.Socket.emit('await3ds', { channel: this.webSocketChanel });
                        this.Socket.on('3dsComplete', (resp) => {
                            //lógica de 3ds completado
                            console.log('Mensaje completado recibido:', resp);
                            if(resp.success){
                                Swal.fire({
                                    title: "Éxito",
                                    text: 'Tu cuenta se ha fondeado correctamente',
                                    icon: "success",
                                    confirmButtonText: "Entendido",
                                });
                                authWindow.close(); 
                                $("#fondeaCuenta").val('');
                                this.cantidadFondeo = 0; 
                                this.cardSelected = null;
                                this.getWallet();
                                inputElements.forEach((input: HTMLInputElement) => {
                                    input.value = '';
                                });
                            }
                        });
                        this.Socket.on('3dsError', (resp) => {
                            //lógica de 3ds error
                            console.log('Mensaje de error recibido:', resp);
                            if(resp.error){
                                Swal.fire({
                                    title: "Error",
                                    text: 'La autenticación 3DS falló',
                                    icon: "error",
                                    confirmButtonText: "Entendido",
                                });
                                authWindow.close();
                            }
                        });
                
                    } else {
                        // Si no hay 3DS
                        if (response.ok) {
                            this.FiatService.notifyUpdateFiat();
                            Swal.fire({
                                title: "Éxito",
                                text: 'Tu cuenta se ha fondeado correctamente',
                                icon: "success",
                                confirmButtonText: "Entendido",
                            });
                        
                        } else {
                            Swal.fire({
                                title: "Error",
                                text: response.body.message,
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        }
                    }
                }, (error: any) => {
                    this.loading = false;
                    console.log(error);
                    Swal.fire({
                        title: "Error",
                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                });                
            }
        })
    }
    keypressValidaNumeroQr($event){
        if($event.keyCode < 48 || $event.keyCode > 57){
            $event.preventDefault();
        }
        if($event.target.value.length >= 5){
            $event.preventDefault();
        }
        if($event.target.value > this.current_balance){
            Swal.fire({
                title: "Error",
                text: "La cantidad no puede ser mayor al saldo actual",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            $event.target.value = "";
            return false;
        }
        if($event.target.value < 1){
            Swal.fire({
                title: "Error",
                text: "La cantidad no puede ser menor a 1",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            $event.target.value = "";
            return false;
        }
        this.cantidadFondeo = $event.target.value;       
    }
    generarQrRetiro(){
        this.loading = true;
        //valida que la cantidad no sea 0 o mayor al saldo actual
        if(!this.cantidadFondeo || this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder generar el código QR",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(this.cantidadFondeo > this.current_balance){
            Swal.fire({
                title: "Error",
                text: "La cantidad no puede ser mayor al saldo actual",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
        const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
        values.forEach((value: string) => {
            if(value == ''){
                Swal.fire({
                    title: "Error",
                    text: "Ingresa el código de seguridad de tu cuenta",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return false;
            }
        })
        let code = values.join('');
        this.ServiceUser.retiroQr({amount:this.cantidadFondeo, code:code}).subscribe((response: any) => {
            console.log(response);
            this.loading = false;
            if(response.ok){
                console.log(response.body);
                this.qrGenerated = true;
                this.qrRetiro = response.body.qr;
                this.qrRetiroDownload = response.body.qrDownload;
                this.getWallet();
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: 'Código QR generado correctamente',
                    confirmButtonText: 'Entendido',
                });
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        }, (error: any) => {
            this.loading = false;
            console.log(error);
            Swal.fire({
                title: "Error",
                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }
    forceDownloadQrS3() {
        this.loading = true;
        this.ServiceUser.downloadImage({ s3: this.qrCode }).subscribe((response: any) => {
                if (response.ok) {
                    // Crear un Blob a partir de la cadena base64
                    const contentType = 'image/png'; // Ajusta según el tipo de imagen que estás descargando
                    const blob = this.base64toBlob(response.body.data, contentType);
    
                    // Crear una URL a partir del Blob
                    const qrAdescargar = window.URL.createObjectURL(blob);
    
                    // Crear el enlace de descarga
                    const link = document.createElement('a');
                    link.href = qrAdescargar;
                    link.download = "qr.png";
                    link.click();
                    this.loading = false;
                } else {
                    this.loading = false;
                    Swal.fire({
                        title: "Error",
                        text: response.body.message,
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                }
            },
            (error: any) => {
                console.log(error);
                this.loading = false;
                Swal.fire({
                    title: "Error",
                    text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        );
    }
    
    // Función para convertir cadena base64 a Blob
    base64toBlob(base64: string, contentType: string): Blob {
        const byteCharacters = atob(base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        return new Blob([byteArray], { type: contentType });
    }
    
    toggleSmallMenu(){
        this.smallMenu = !this.smallMenu;
        console.log(this.smallMenu);
    }       
    shareCode(){
        //copia el codigo this.cryptoAddress a portapapeles
        var aux = document.createElement("input");
        aux.setAttribute("value", this.cryptoAddress);
        document.body.appendChild(aux);
        aux.select();
        document.execCommand("copy");
        document.body.removeChild(aux);
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: 'Código copiado correctamente',
            confirmButtonText: 'Entendido',
        });
    }
    forcePrintQrS3() {
        this.loading = true;
        this.ServiceUser.downloadImage({ s3: this.qrCode }).subscribe(
            (response: any) => {
                this.loading = false;
                if (response.ok) {
                    // Crear un Blob a partir de la cadena base64
                    const contentType = 'image/png'; // Ajusta según el tipo de imagen que estás descargando
                    const blob = this.base64toBlob(response.body.data, contentType);
    
                    // Crear una URL a partir del Blob
                    const qrAdescargar = window.URL.createObjectURL(blob);
    
                    // Crear un objeto Image
                    const img = new Image();
                    img.src = qrAdescargar;
    
                    // Esperar a que la imagen se cargue
                    img.onload = () => {
                        // Abrir la ventana de impresión y agregar la imagen
                        const printWindow = window.open('', '_blank');
                        printWindow.document.write('<html><head><title>Print</title></head><body>');
                        printWindow.document.write('<img src="' + qrAdescargar + '" style="max-width:100%;">');
                        printWindow.document.write('</body></html>');
                        printWindow.document.close();
    
                        // Agregar un evento afterprint para cerrar la ventana después de la impresión
                        printWindow.addEventListener('afterprint', () => {
                            printWindow.close();
                        });
    
                        // Imprimir la ventana después de que la imagen se haya cargado
                        setTimeout(() => {
                            this.loading = false;
                            printWindow.print();
                        }, 100); // Ajusta el tiempo según tus necesidades
                    };
                } else {
                    this.loading = false;
                    Swal.fire({
                        title: "Error",
                        text: response.body.message,
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                }
            },
            (error: any) => {
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        );
    }
    proximamente(){
        Swal.fire({
            title: "Próximamente",
            text: "Esta función estará disponible pronto",
            icon: "info",
            confirmButtonText: "Entendido",
        });
    }
}