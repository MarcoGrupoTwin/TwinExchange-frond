import { Router, ActivatedRoute } from "@angular/router";
import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Input, Output, AfterViewInit, Renderer2, Inject } from "@angular/core";
import { DOCUMENT } from '@angular/common';
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import Swal from "sweetalert2";
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';
import { computeStyles } from "@popperjs/core";
import { FiatService } from "src/shared/services/fiat.service";

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
    @ViewChild('digitInputsTwo') digitInputsTwo!: ElementRef;
    public nombre:string = "";
    public correo:string = "";
    public qrRetiro:any = null;
    public qrRetiroDownload:any = null;
    public moneda:string = "MXN";
    public cryptoAddress:string = null;
    public smallMenu:boolean = false;
    public escannerActivo:boolean = false;
    public isFlipped = false;
    currentDevice: MediaDeviceInfo = null;
    public montoRetiro:number = 0;
    public UsuarioFirma:string = null;
    public operacion:string = null;
    public isMobile:boolean = false;
    
    //cobro por usuarios
    public numeroUsuarios:number = 2;
    public montoDivididoUsuarios:number = 0;
    public pasosDivision:number = 1;
    public cantidadPagada:number = 0;
    public usuarios:any = [];
    public usuarioPagando:any = null;
    public method:number = 1;

    //cobro por monto
    public cobrarMonto:number = 0;
    public cantidadCobrada:number = 0;
    public cantidadRestante:number = 0;
    public participantes:any = [];
    public cobromonto:boolean = false;
    // socket connection
    private socketSubscription: Subscription;
    public webSocketChanel:string = null;
    public onNewMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.Socket.on('paymentComplete', (data: any) => {
                if(data == this.operacion && this.pasosDivision == 1){
                    $('#montoArecibir').val('');
                    this.loading = false;
                    this.montoRetiro = 0;
                    this.UsuarioFirma = null;
                    this.webSocketChanel = null;
                    this.operacion = null;
                    Swal.fire({
                        title: "Exito",
                        text: "El usuario ha realizado el pago correctamente",
                        icon: "success",
                        confirmButtonText: "Entendido",
                    });
                    this.getWallet();
                }
                if(data == this.operacion && this.pasosDivision == 2){
                    this.pasosDivision = 2;
                    this.loading = false;
                    this.montoRetiro = 0;
                    this.webSocketChanel = null;
                    this.operacion = null;
                    this.sendPay = 5;
                    this.usuarios[this.usuarioPagando].uuuid = this.UsuarioFirma;
                    this.usuarios[this.usuarioPagando].paymentSuccess = true;
                    this.usaQR = false;
                    this.UsuarioFirma = null;
                    this.cantidadPagada = this.cantidadPagada + this.montoDivididoUsuarios;
                    Swal.fire({
                        title: "Exito",
                        text: "El usuario ha realizado el pago correctamente",
                        icon: "success",
                        confirmButtonText: "Entendido",
                    });
                }
                if(this.cobromonto){
                    this.agregaValor(this.UsuarioFirma,this.cobrarMonto);
                    this.method = 2;
                    this.montoRetiro = 0;
                    this.operacion = null;
                    this.UsuarioFirma = null;
                    this.cobrarMonto = 0;
                    $("#montoCobro").attr("disabled",false);
                    $("#montoCobro").val("");
                    $("#vbjdfhb").attr("disabled",false);   
                    this.sendPay = 4;
                    this.usaQR = false;
                }
            })
            this.Socket.on('cancelPayment', (data: any) => {
                if(data == this.operacion){
                    $('#montoArecibir').val('');
                    this.loading = false;
                    this.montoRetiro = 0;
                    this.UsuarioFirma = null;
                    this.webSocketChanel = null;
                    this.operacion = null;
                    Swal.fire({
                        title: "Error",
                        text: "El usuario ha cancelado la operación.",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                    if(this.cobromonto){
                        this.sendPay = 4;
                        this.usaQR = false;
                    }
                }
            })
        });
        
    }

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,
        private renderer: Renderer2, 
        private Socket: Socket,
        private FiatService: FiatService,
        @Inject(DOCUMENT) private document: Document
    ){
        this.nombre = localStorage.getItem("name")
        this.correo = localStorage.getItem("mail")
    }

    async ngOnInit(){
        setTimeout(() => {
            this.getWallet();
        }, 500);
        this.isMobileFunction();
        setTimeout(() => {
            this.ActivatedRoute.queryParams.subscribe(async params => {
                if(params["currency"]){
                    let tipo = 0;
                    this.moneda = params["currency"].toUpperCase();
                    if(params["currency"] == "btc"){
                        tipo = 1;
                        this.loading = true;
                        this.ServiceUser.getCryptoWallet({crypto_id:tipo}).subscribe((response: any) => {
                            this.loading = false
                            console.log(response);
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
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
                            console.log(response);
                            if(response.ok && response.body.success == 1){
                                this.cryptoAddress = response.body.data.wallet_address;
                                this.qrCode = response.body.data.qr;
                            }else{
                                this.loading = true
                                this.ServiceUser.crearWalletBnb({}).subscribe((response: any) => {
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
                    if(params["currency"] == "mxn"){
                        this.getWallet();
                        this.cryptoAddress = null;
                    }
                }
            })
        }, 1000);
    }

    conexionSocket(uuid:string,data:any){
        this.Socket.connect();
        this.startConnection();
        this.socketSubscription = this.onNewMessage().subscribe((data) => {
           console.log('se sucribe a algo:',data);
        });
        this.Socket.emit('joinPayment', uuid);
        this.Socket.emit('requirePayment', data);
    }
    ngOnDestroy(){
        this.Socket.disconnect();
        if(this.socketSubscription){
            this.socketSubscription.unsubscribe();
        }
    }

    startConnection(){
        this.Socket.on('connect_error', (err) => {
            console.log('Error connecting to server', err);
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
    }
    onDigitInputOne(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
    }
    onDigitInputTwo(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
    }
    async getWallet(){
        this.loading = true;
        console.log("getWallet");
        this.ServiceUser.getWallet({}).subscribe((response: any) => {
            this.loading = false;
            console.log(response.body);
            if(response.ok){
                let data = response.body.data;
                this.qrCode = data.qr;
                this.current_balance = data.current_balance; 
                this.cryptoAddress = data.uuid;
                localStorage.setItem("currentBalance", data.current_balance);
                this.FiatService.notifyUpdateFiat();
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
    keypressNumeroUsuarios($event){
        if($event.keyCode < 48 || $event.keyCode > 57){
            $event.preventDefault();
        }
        if($event.target.value.length >= 5){
            $event.preventDefault();
        }
        this.numeroUsuarios = $event.target.value;
    } 
    keypressNumeroCobrar($event){
        if($event.keyCode < 48 || $event.keyCode > 57){
            $event.preventDefault();
        }
        if($event.target.value.length >= 5){
            $event.preventDefault();
        }
        this.cobrarMonto = $event.target.value;
    } 
    showCantidadToggle(){
        this.showCantidad = !this.showCantidad;
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
    proximamente(){
        Swal.fire({
            title: "Próximamente",
            text: "Esta función estará disponible pronto",
            icon: "info",
            confirmButtonText: "Entendido",
        });
    }
    camerasFoundHandler($event): void {
        console.log('camerasFoundHandler');
        if ($event.length === 0) {
            console.error('No se encontraron cámaras disponibles');
        } else {
            console.log('Cámaras encontradas:', $event);
        }
    }
    scanSuccessHandler($event): void {
        let qr =  $event;//recibe lo que se escaneo
        this.escannerActivo = false;
        this.loading = true;
        this.ServiceUser.consultaSaldoCobroRetiroQr({qr:qr}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok && response.body.success == 1){
                let monto = response.body.data.monto;
                let nombre = response.body.data.nombre;
                Swal.fire({
                    title: "Entrega efectivo",
                    text: "Por favor confirma cuando entregues $" + monto + " mxn a " + nombre,
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonText: "Entregar",
                    cancelButtonText: "Cancelar entrega",
                }).then((result) => {
                    if (result.isConfirmed) {
                        this.loading = true;
                        this.ServiceUser.cobroRetiroQr({qr:qr}).subscribe((response: any) => {
                            this.loading = false;
                            if(response.ok && response.body.success == 1){
                                Swal.fire({ 
                                    title: "Exito",
                                    text: 'El saldo se ha añadido a tu cuenta correctamente',
                                    icon: "success",
                                    confirmButtonText: "Entendido",
                                });
                                this.getWallet();
                                this.FiatService.notifyUpdateFiat();
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
            }else{
                this.loading = false;
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
    scannQr(){
        console.log("scannQr");
        this.escannerActivo = true;
    }
    
    cobrarQrUnUsuario(){
        if(!this.cantidadFondeo || this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder generar un cobro.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }else{
            this.sendPay = 3;
            this.escannerActivo = true;
        }
    }
    cancelaOperacion(){
        this.sendPay = 1;
        this.escannerActivo = false;
        this.montoRetiro = 0;
        this.UsuarioFirma = null;
        this.webSocketChanel = null;
        $('#montoArecibir').val('');
    }
    cobrarQrUnUsuarioQR($event){
        let qr = $event;//recibe lo que se escaneo
        this.loading = true;
        this.ServiceUser.getQrCharge({token:qr,monto:this.cantidadFondeo,number_users:1}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok && response.body.success == 1){
                this.sendPay = 1;
                this.usaQR = true;
                let data = response.body;
                this.escannerActivo = false;
                this.montoRetiro = data.monto;
                this.UsuarioFirma = data.usuarios.id;
                this.webSocketChanel = data.webSocket;
                this.operacion = data.operacion;
                let datos = {
                    datos:'vendedor',
                    uuid:this.UsuarioFirma,
                    movimiento:this.webSocketChanel
                } 
                this.conexionSocket(this.UsuarioFirma,datos);
                this.FiatService.notifyUpdateFiat();
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
    cancelarPago(){
        if(this.UsuarioFirma || this.montoRetiro > 0){
            Swal.fire({
                icon: 'warning',
                title: '¿Estás seguro?',
                text: "El cobro completo será cancelado y los saldos de los usuarios no se verán afectados.",
                showCancelButton: true,
                confirmButtonText: 'Cancelar',
                cancelButtonText: 'No, continuar',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.Socket.emit('leavePayment', this.UsuarioFirma)
                    this.Socket.emit('cancelPayment', {sala:this.UsuarioFirma,uuid:this.operacion});
                    this.loading = true;
                    this.ServiceUser.cancelQrCharge({chanel:this.webSocketChanel}).subscribe((response: any) => {
                        this.loading = false;
                        if(response.ok && response.body.success == 1){
                            $("#montoArecibir").val("");
                            this.sendPay = 1;
                            this.escannerActivo = false;
                            this.montoRetiro = 0;
                            this.UsuarioFirma = null;
                            this.webSocketChanel = null;
                            this.FiatService.notifyUpdateFiat();
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
        }else{
            Swal.fire({
                title: "Error",
                text: "No se ha generado un cobro",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }
    }
    generarPago(){
        if(!this.montoRetiro || this.montoRetiro == 0 || this.UsuarioFirma == null){
            Swal.fire({
                title: "Error",
                text: "No tienes una operación de cobro en proceso",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
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
        this.loading = true;
        this.ServiceUser.pagarQrCharge({uuid:this.operacion,code:code,usuarioPaga:this.UsuarioFirma}).subscribe((response: any) => {
            console.log(response);
            this.loading = false;
            if(response.ok && response.body.success == 1){
                this.Socket.emit('paymentComplete', {sala:this.UsuarioFirma,uuid:this.operacion});
                this.Socket.emit('leavePayment', this.UsuarioFirma);
                Swal.fire({
                    title: "Exito",
                    text: 'Tu pago se ha realizado correctamente',
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.getWallet();
                this.montoRetiro = 0;
                this.operacion = null;
                this.UsuarioFirma = null;
                const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
                inputElements.forEach((input: HTMLInputElement) => {
                    input.value = "";
                })
                this.FiatService.notifyUpdateFiat();
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
    dividirPartesIguales(){
        if(!this.cantidadFondeo || this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder generar un cobro.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.sendPay = 5;
    }
    continuarDivisionUsuarios(){
        if(!this.numeroUsuarios || this.numeroUsuarios  < 2 || this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa un número de usuarios igual o mayor a 2.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        //no puede ser mayor a 6
        if(this.numeroUsuarios > 6){
            Swal.fire({
                title: "Error",
                text: "Ingresa un número de usuarios menor a 6.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.pasosDivision = 2;  
        this.montoDivididoUsuarios = this.cantidadFondeo / this.numeroUsuarios;
        //inserta los usuarios en el arreglo
        for (let index = 0; index < this.numeroUsuarios; index++) {
            this.usuarios.push({id:index,uuuid:null,paymentSuccess:null,monto:this.montoDivididoUsuarios});
        }
    }
    selectUserForpay(IdArray:any){
        if(this.usuarios[IdArray].uuuid != null){
            Swal.fire({
                title: "Error",
                text: "Este usuario ya ha sido seleccionado",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.usuarioPagando = IdArray;
        this.escannerActivo = true;
    }
    escanearUnUsuario($event:any){
        let qr = $event;//recibe lo que se escaneo
        this.loading = true;
        this.ServiceUser.getQrCharge({token:qr,monto:this.montoDivididoUsuarios,number_users:this.usuarios.length}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok && response.body.success == 1){
                let data = response.body;
                this.escannerActivo = false;
                this.montoRetiro = data.monto;
                this.UsuarioFirma = data.usuarios.id;
                this.webSocketChanel = data.webSocket;
                this.operacion = data.operacion;
                let datos = {
                    datos:'vendedor',
                    uuid:this.UsuarioFirma,
                    movimiento:this.webSocketChanel
                } 
                this.conexionSocket(this.UsuarioFirma,datos);
                this.sendPay = 1
                this.usaQR = true
                this.method = 2;
                this.FiatService.notifyUpdateFiat();
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
    generarPagoUsuarios(){
        if(!this.montoRetiro || this.montoRetiro == 0 || this.UsuarioFirma == null){
            Swal.fire({
                title: "Error",
                text: "No tienes una operación de cobro en proceso",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
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
        this.loading = true;
        this.ServiceUser.pagarQrCharge({uuid:this.operacion,code:code,usuarioPaga:this.UsuarioFirma}).subscribe((response: any) => {
            console.log(response);
            this.loading = false;
            if(response.ok && response.body.success == 1){
                this.Socket.emit('paymentComplete', {sala:this.UsuarioFirma,uuid:this.operacion});
                this.Socket.emit('leavePayment', this.UsuarioFirma);
                this.sendPay = 5;
                this.usuarios[this.usuarioPagando].uuuid = this.UsuarioFirma;
                this.usuarios[this.usuarioPagando].paymentSuccess = true;
                this.montoRetiro = 0;
                this.operacion = null;
                this.UsuarioFirma = null;
                this.usaQR = false;
                this.pasosDivision = 2
                const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
                inputElements.forEach((input: HTMLInputElement) => {
                    input.value = "";
                })
                this.cantidadPagada = this.cantidadPagada + this.montoDivididoUsuarios;
                Swal.fire({
                    title: "Exito",
                    text: 'Tu pago se ha realizado correctamente, da click en continuar para pagar al siguiente usuario',
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.FiatService.notifyUpdateFiat();
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
    cancelarPagoUsuarios(){
        if(this.UsuarioFirma || this.montoRetiro > 0){
            Swal.fire({
                icon: 'warning',
                title: '¿Estás seguro?',
                text: "El cobro completo será cancelado y los saldos de los usuarios no se verán afectados.",
                showCancelButton: true,
                confirmButtonText: 'Cancelar',
                cancelButtonText: 'No, continuar',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.Socket.emit('leavePayment', this.UsuarioFirma)
                    this.Socket.emit('cancelPayment', {sala:this.UsuarioFirma,uuid:this.operacion});
                    this.loading = true;
                    this.ServiceUser.cancelQrCharge({chanel:this.webSocketChanel}).subscribe((response: any) => {
                        this.loading = false;
                        if(response.ok && response.body.success == 1){
                            $("#montoArecibir").val("");
                            this.escannerActivo = false;
                            this.montoRetiro = 0;
                            this.UsuarioFirma = null;
                            this.webSocketChanel = null;
                            this.FiatService.notifyUpdateFiat();
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
        }else{
            Swal.fire({
                title: "Error",
                text: "No se ha generado un cobro",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }
    }
    cancelaOperacionUsuario(){
        this.usuarioPagando = null;
        this.escannerActivo = false;
    }
    completarPagosDivididos(){
       //valida que todos los usuarios hayan pagado
        let usuariosPagados = 0;
        this.usuarios.forEach(element => {
            if(element.paymentSuccess == true){
                usuariosPagados = usuariosPagados + 1;
            }
        }); 
        if(usuariosPagados != this.usuarios.length){
            Swal.fire({
                title: "Error",
                text: "Por favor completa los pagos de todos los usuarios",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        Swal.fire({
            icon:'success',
            title: 'Éxito',
            text: 'Todos los pagos se han realizado correctamente por un total de $' + this.cantidadFondeo + ' mxn',
            confirmButtonText: 'Entendido',
        });
        this.sendPay = 1
        this.method = 1
        $("montoArecibir").val("");
    }
    //dividir por monto
    dividePagoMonto(){
        if(!this.cantidadFondeo || this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder generar un cobro.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.sendPay = 4;
        this.cobromonto = true;
        this.participantes.push({id:0,uuid:null,monto:0});
        this.cantidadRestante = this.cantidadFondeo;
    }
    cobrarMontoFunction() {
        // convierte this.cobrarMonto a numero
        const monto: number = parseFloat(this.cobrarMonto.toString());
        const cantidad: number = parseFloat(this.cantidadFondeo.toString());
    
        console.log("cobrarMontoFunction:", monto + ' ' + cantidad);
    
        if (!monto || monto === 0) {
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad para poder generar un cobro.",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if (monto > cantidad) {
            Swal.fire({
                title: "Error",
                text: "El monto a abonar no puede ser mayor a la cantidad a fondear",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if (monto < 1) {
            Swal.fire({
                title: "Error",
                text: "El monto a cobrar no puede ser menor a 1",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        $("#montoCobro").val("");
        $("#montoCobro").attr("disabled", true);
        $("#vbjdfhb").attr("disabled", true);
        this.escannerActivo = true;
    }    
    lecturaMontoParticular($event:any){
        let qr = $event;//recibe lo que se escaneo
        this.loading = true;
        this.ServiceUser.getQrCharge({token:qr,monto:this.cobrarMonto,number_users:1}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok && response.body.success == 1){
                let data = response.body;
                this.escannerActivo = false;
                this.montoRetiro = data.monto;
                this.UsuarioFirma = data.usuarios.id;
                this.webSocketChanel = data.webSocket;
                this.operacion = data.operacion;
                let datos = {
                    datos:'vendedor',
                    uuid:this.UsuarioFirma,
                    movimiento:this.webSocketChanel
                } 
                this.conexionSocket(this.UsuarioFirma,datos);
                this.sendPay = 1
                this.usaQR = true
                this.method = 3
                this.FiatService.notifyUpdateFiat();
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
    cancelaOperacionMonto(){
        this.sendPay = 4;
        this.escannerActivo = false;
        this.cobrarMonto = 0;
        this.montoRetiro = 0;
        this.UsuarioFirma = null;
        this.webSocketChanel = null;
        $('#montoCobro').val('');
        $('#montoCobro').attr('disabled',false);
        $("#vbjdfhb").attr("disabled",false);
    }
    confirmarPagoMonto(){
        if(!this.montoRetiro || this.montoRetiro == 0 || this.UsuarioFirma == null){
            Swal.fire({
                title: "Error",
                text: "No tienes una operación de cobro en proceso",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
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
        this.loading = true;
        this.ServiceUser.pagarQrCharge({uuid:this.operacion,code:code,usuarioPaga:this.UsuarioFirma}).subscribe((response: any) => {
            console.log(response);
            this.loading = false;
            if(response.ok && response.body.success == 1){
                this.Socket.emit('paymentComplete', {sala:this.UsuarioFirma,uuid:this.operacion});
                this.Socket.emit('leavePayment', this.UsuarioFirma);
                this.sendPay = 4;
                this.usaQR = false;
                this.method = 1;
                this.agregaValor(this.UsuarioFirma,this.cobrarMonto);
                this.montoRetiro = 0;
                this.operacion = null;
                this.UsuarioFirma = null;
                const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
                inputElements.forEach((input: HTMLInputElement) => {
                    input.value = "";
                })
                this.cobrarMonto = 0;
                $("#montoCobro").attr("disabled",false);
                $("#montoCobro").val("");
                $("#vbjdfhb").attr("disabled",false);
                Swal.fire({
                    title: "Exito",
                    text: 'Tu pago se ha realizado correctamente',
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.FiatService.notifyUpdateFiat();
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
    cancelarPagoMonto(){
        if(this.UsuarioFirma || this.montoRetiro > 0){
            Swal.fire({
                icon: 'warning',
                title: '¿Estás seguro?',
                text: "El cobro completo será cancelado y los saldos de los usuarios no se verán afectados.",
                showCancelButton: true,
                confirmButtonText: 'Cancelar',
                cancelButtonText: 'No, continuar',
            }).then((result) => {
                if (result.isConfirmed) {
                    this.Socket.emit('leavePayment', this.UsuarioFirma)
                    this.Socket.emit('cancelPayment', {sala:this.UsuarioFirma,uuid:this.operacion});
                    this.loading = true;
                    this.ServiceUser.cancelQrCharge({chanel:this.webSocketChanel}).subscribe((response: any) => {
                        this.loading = false;
                        if(response.ok && response.body.success == 1){
                            $("#montoArecibir").val("");
                            this.escannerActivo = false;
                            this.montoRetiro = 0;
                            this.UsuarioFirma = null;
                            this.webSocketChanel = null;
                            this.sendPay = 4;
                            this.usaQR = false;
                            this.FiatService.notifyUpdateFiat();
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
        }else{
            Swal.fire({
                title: "Error",
                text: "No se ha generado un cobro",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }       
    }
    agregaValor(uuid: string, monto: number) {
        monto = parseFloat(monto.toString());
        console.log("agregaValor:", this.cantidadCobrada + ' ' + monto);
        this.cantidadCobrada = this.cantidadCobrada + monto;
        // Buscar el primer elemento con uuid null
        const primerElementoSinUUID = this.participantes.find(participante => participante.uuid === null);
    
        if (primerElementoSinUUID) {
            // Si se encuentra un elemento sin UUID, calcular el monto real
            const montoReal = Math.min(monto, this.cantidadRestante);
            primerElementoSinUUID.uuid = uuid;
            primerElementoSinUUID.monto = montoReal;
    
            // Actualizar la cantidad restante
            this.cantidadRestante -= montoReal;
        } else {
            // Si no hay un elemento sin UUID, agregar uno nuevo si hay suficiente cantidad restante
            if (monto <= this.cantidadRestante) {
                const id = this.participantes.length;
                this.participantes.push({ id, uuid, monto });
    
                // Actualizar la cantidad restante
                this.cantidadRestante -= monto;
            } else {
                // Manejar el caso donde el monto excede la cantidad restante
                console.error("El monto excede la cantidad restante.");
                return true; // Puedes cambiar esto según tus necesidades
            }
        }
        return false;
    }
    
    
    
    cerrarCuentaMontos(){
        Swal.fire({
            icon:'success',
            title: 'Éxito',
            text: 'Todos los pagos se han realizado correctamente por un total de $' + this.cantidadFondeo + ' mxn',
            confirmButtonText: 'Entendido',
        });
        this.sendPay = 1
        this.method = 1
        this.cobromonto = false;
        this.participantes = [];
        this.cantidadRestante = 0;
        this.cantidadCobrada = 0;
        this.cobrarMonto = 0;
        this.escannerActivo = false;
        this.montoRetiro = 0;
        this.UsuarioFirma = null;
        this.webSocketChanel = null;
        this.usaQR = false;
        this.operacion = null;
        this.UsuarioFirma = null;
        $("#montoArecibir").val("");
    }

    isMobileFunction(){
        if(window.innerWidth < 768){
            this.isMobile = true;
        }else{
            this.isMobile = false;
        }
    }
}