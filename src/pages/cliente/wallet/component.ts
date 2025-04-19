import { Router, ActivatedRoute } from "@angular/router";
import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Input, Output, AfterViewInit, Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import Swal from "sweetalert2";
import { FiatService } from "src/shared/services/fiat.service";
import { WalletService } from "src/shared/services/wallet.service";

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
    public isCrypto = false;

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,
        private renderer: Renderer2, 
        @Inject(DOCUMENT) private document: Document,
        private FiatService: FiatService,
        private walletService: WalletService,
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
        setTimeout(() => {
            this.getWallet();
        }, 500);
        setTimeout(() => {
            this.ActivatedRoute.queryParams.subscribe(async params => {
                if(params["currency"]){
                    let tipo = 0;
                    this.moneda = params["currency"].toUpperCase();
                    this.isCrypto = true;
                    if(params["currency"] == "btc"){
                        tipo = 1;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            this.loading = false
                            console.log(response);
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                                this.current_balance = response.body.data.current_balance;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletBTC({}).subscribe((response: any) => {
                                    this.loading = false
                                    console.log(response)
                                    if(response.ok && response.body.success == 1){
                                        this.qrCode = response.body.data.qr;
                                        this.cryptoAddress = response.body.data.address;
                                    }else{
                                        Swal.fire({
                                            title: "Error",
                                            text: response.body.message ? response.body.message : "Error desconocido, intente más tarde",
                                            icon: "error",
                                            confirmButtonText: "Entendido",
                                        })
                                    }
                                }, (error: any) => {
                                    console.log()
                                    this.loading = false
                                    Swal.fire({
                                        title: "Error",
                                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                        icon: "error",
                                        confirmButtonText: "Entendido",
                                    });
                                })
                            }
                        }, (error: any) => {
                            this.loading = false
                            Swal.fire({
                                title: "Error",
                                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        })
                    }
                    if(params["currency"] == "eth"){
                        tipo = 2;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            this.loading = false
                            console.log(response);
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                                this.current_balance = response.body.data.current_balance;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletETH({}).subscribe((response: any) => {
                                    this.loading = false
                                    console.log(response)
                                    if(response.ok && response.body.success == 1){
                                        this.qrCode = response.body.data.qr;
                                        this.cryptoAddress = response.body.data.address;
                                    }else{
                                        Swal.fire({
                                            title: "Error",
                                            text: response.body.message ? response.body.message : "Error desconocido, intente más tarde",
                                            icon: "error",
                                            confirmButtonText: "Entendido",
                                        })
                                    }
                                }, (error: any) => {
                                    console.log()
                                    this.loading = false
                                    Swal.fire({
                                        title: "Error",
                                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                        icon: "error",
                                        confirmButtonText: "Entendido",
                                    });
                                })
                            }
                        }, (error: any) => {
                            this.loading = false
                            Swal.fire({
                                title: "Error",
                                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        })
                    }
                    if(params["currency"] == "ltc"){
                        tipo = 3;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            this.loading = false
                            console.log(response);
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                                this.current_balance = response.body.data.current_balance;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletLtc({}).subscribe((response: any) => {
                                    this.loading = false
                                    console.log(response)
                                    if(response.ok && response.body.success == 1){
                                        this.qrCode = response.body.data.qr;
                                        this.cryptoAddress = response.body.data.address;
                                    }else{
                                        Swal.fire({
                                            title: "Error",
                                            text: response.body.message ? response.body.message : "Error desconocido, intente más tarde",
                                            icon: "error",
                                            confirmButtonText: "Entendido",
                                        })
                                    }
                                }, (error: any) => {
                                    console.log()
                                    this.loading = false
                                    Swal.fire({
                                        title: "Error",
                                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                        icon: "error",
                                        confirmButtonText: "Entendido",
                                    });
                                })
                            }
                        }, (error: any) => {
                            this.loading = false
                            Swal.fire({
                                title: "Error",
                                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        })
                    }
                    if(params["currency"] == "bnb"){
                        tipo = 4;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            this.loading = false
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                                this.current_balance = response.body.data.current_balance;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletBnb({}).subscribe((response: any) => {
                                    this.loading = false
                                    if(response.ok && response.body.success == 1){
                                        this.qrCode = response.body.data.qr;
                                        this.cryptoAddress = response.body.data.address;
                                    }else{
                                        Swal.fire({
                                            title: "Error",
                                            text: response.body.message ? response.body.message : "Error desconocido, intente más tarde",
                                            icon: "error",
                                            confirmButtonText: "Entendido",
                                        })
                                    }
                                }, (error: any) => {
                                    this.loading = false
                                    Swal.fire({
                                        title: "Error",
                                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                        icon: "error",
                                        confirmButtonText: "Entendido",
                                    });
                                })
                            }
                        }, (error: any) => {
                            this.loading = false
                            Swal.fire({
                                title: "Error",
                                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        })
                    }
                    if(params["currency"] == "twincoin"){
                        tipo = 5;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            this.loading = false
                            console.log('Solo: ',response);
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                                this.current_balance = response.body.data.current_balance;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletTwinCoin({}).subscribe((response: any) => {
                                    this.loading = false
                                    console.log('respuesta:',response)
                                    if(response.ok && response.body.success == 1){
                                        this.qrCode = response.body.data.qr;
                                        this.cryptoAddress = response.body.data.address;
                                    }else{
                                        Swal.fire({
                                            title: "Error",
                                            text: response.body.message ? response.body.message : "Error desconocido, intente más tarde",
                                            icon: "error",
                                            confirmButtonText: "Entendido",
                                        })
                                    }
                                }, (error: any) => {
                                    console.log('error:',error)
                                    this.loading = false
                                    Swal.fire({
                                        title: "Error",
                                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                        icon: "error",
                                        confirmButtonText: "Entendido",
                                    });
                                })
                            }
                        }, (error: any) => {
                            this.loading = false
                            Swal.fire({
                                title: "Error",
                                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        })
                    }
                    if(params["currency"] == "twin"){
                        //moneda estable
                        tipo = 6;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            console.log('wallet:',response);
                            this.loading = false
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                                this.current_balance = response.body.data.current_balance;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletTwin({}).subscribe((response: any) => {
                                    this.loading = false
                                    if(response.ok && response.body.success == 1){
                                        this.qrCode = response.body.data.qr;
                                        this.cryptoAddress = response.body.data.address;
                                    }else{
                                        Swal.fire({
                                            title: "Error",
                                            text: response.body.message ? response.body.message : "Error desconocido, intente más tarde",
                                            icon: "error",
                                            confirmButtonText: "Entendido",
                                        })
                                    }
                                }, (error: any) => {
                                    console.log('error:',error)
                                    this.loading = false
                                    Swal.fire({
                                        title: "Error",
                                        text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                        icon: "error",
                                        confirmButtonText: "Entendido",
                                    });
                                })
                            }
                        }, (error: any) => {
                            this.loading = false
                            Swal.fire({
                                title: "Error",
                                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                        })
                    }
                    if(params["currency"] == "mxn"){
                        this.isCrypto = false;
                        this.getWallet();
                        this.cryptoAddress = null;
                    }
                }
            })
        }, 1000);
        this.walletService.walletUpdated$.subscribe(() => {
            this.getWallet();
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
        let monedaSeleccionada = localStorage.getItem("cryptoCurrency");
        let monedaFiat = localStorage.getItem("currency") ? localStorage.getItem("currency") : "mxn";
        console.log('moneda seleccionada:',monedaSeleccionada);
        if(monedaSeleccionada == "mxn" || monedaSeleccionada == "usd" || monedaFiat == "mxn" || monedaFiat == "usd"){
            this.isCrypto = false;
            let monedaC = 7;
            this.moneda = monedaFiat.toUpperCase();
            if(monedaFiat == "mxn"){ monedaC = 7; }
            if(monedaFiat == "usd"){ monedaC = 8; }
            this.ServiceUser.getWallet({moneda:monedaC}).subscribe((response: any) => {
                this.loading = false;
                console.log('respuesta de la wallet',response.body);
                if(response.ok){
                    let data = response.body.data;
                    this.qrCode = data.qr;
                    this.current_balance = data.current_balance; 
                    this.cryptoAddress = data.uuid;
                    localStorage.setItem("currentBalance", data.current_balance);
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
        }else{
            this.isCrypto = true;
            let tipo = 0;
            this.moneda = monedaSeleccionada.toUpperCase();
            if(monedaSeleccionada == "btc"){
                tipo = 1;
            }
            if(monedaSeleccionada == "eth"){
                tipo = 2;
            }
            if(monedaSeleccionada == "ltc"){
                tipo = 3;
            }
            if(monedaSeleccionada == "bnb"){
                tipo = 4;
            }
            if(monedaSeleccionada == "twincoin"){
                tipo = 5;
            }
            if(monedaSeleccionada == "twin"){
                tipo = 6;
            }
            this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                this.loading = false;
                console.log('wallet consulta:',response.body);
                if(response.ok){
                    let data = response.body.data;
                    this.qrCode = data.qr;
                    this.current_balance = data.current_balance; 
                    this.cryptoAddress = data.wallet_address;
                    localStorage.setItem("currentBalance", data.current_balance);
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
        this.usaTarjeta = true;
        setTimeout(() => {
            this.crearTarjeta()
        }, 1000);
    }
    enviaTarjeta() {
        if (this.stripe && this.card) {
            this.sendPay = 1;
            this.loading = true;
            this.stripe.createToken(this.card).then((result: any) => {
            let token = result.token.id;
            this.ServiceUser.saveCard({cardToken:token}).subscribe((response: any) => {
                console.log(response);
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
                console.log(error);
                Swal.fire({
                    title: "Error",
                    text: error.message ? error.message : "Error desconocido, intente más tarde",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            })
          }, (error: any) => {
            this.loading = false;
            console.log(error);
          })
        } else {
          console.log("No hay tarjeta o instancia de Stripe");
        }
    }
    muestraTarjetas(){
        this.sendPay = 2;
        this.loading = true;
        this.ServiceUser.getCards({}).subscribe((response: any) => {
            console.log(response);
            this.loading = false;
            if(response.ok){
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
        if(!this.cantidadFondeo || this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder seleccionar una tarjeta",
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
            text: `¿Deseas fondear ${this.cantidadFondeo} MXN a tu cuenta, se cobrará un total de ${montoAcobrar.toFixed(2)} MXN, que incluye ${comisiones.toFixed(2)} MXN de comisiones por uso de terminal?`,
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
                    cantidadOriginal: this.cantidadFondeo
                }
                this.loading = true;
                this.ServiceUser.fondearCuenta(data).subscribe((response: any) => {
                    console.log(response);
                    this.loading = false;
                    if(response.ok){
                        this.FiatService.notifyUpdateFiat();
                        Swal.fire({
                            title: "Exito",
                            text: 'Tu cuenta se ha fondeado correctamente',
                            icon: "success",
                            confirmButtonText: "Entendido",
                        });
                        this.sendPay = 1;
                        this.cantidadFondeo = 0;
                        this.cardSelected = null;
                        this.getWallet();
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
    flipCard() {
        this.isFlipped = !this.isFlipped;
    }     
}