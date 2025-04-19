import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit,ViewChild,ElementRef } from "@angular/core";
import Swal from "sweetalert2";
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import { float } from "@zxing/library/esm/customTypings";
import { FiatService } from "src/shared/services/fiat.service";
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';

declare var $: any;

@Component({
    selector: "app-list",
    templateUrl: "template.html",
    styleUrls: ["style.scss"]
})

export class ListComponent implements OnInit {
    public sendPay:number = 1;
    public loading:boolean = false;
    public current_balance:number = 0;
    public showCantidad:boolean = false;
    public cantidadFondeo:float = 0;
    public resultadosUsuarios:Array<any> = [];
    public userSelected:string = "";
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    public muestra:number = 1;
    currentDevice: MediaDeviceInfo = null;
    public droppedFiles: File[] = [];
    @ViewChild('fileInput') fileInput!: ElementRef;
    public mxnBalance:number = 0;
    public crypto:boolean = false;
    public btcBalance:number = 0.00000000;
    public twincoinBalance:number = 0.00000000;
    public twinbalance:number = 0.00000000;
    public moneda:string = "MXN";

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,
        private FiatService: FiatService,
        private Socket:Socket,
        public fiatService: FiatService,
    ){
    }

    async ngOnInit(){
        await this.getWallet();
        await this.getContacts();
        this.ActivatedRoute.queryParams.subscribe(async params => {
            if(params["currency"]){
                this.crypto = true;
                if(params["currency"] == "btc"){
                    this.current_balance = this.btcBalance;
                    this.crypto = true;
                    this.moneda = "BTC";
                }else if(params["currency"] == "mxn"){
                    this.crypto = false;
                    this.getWallet();
                    this.crypto = false;
                    this.moneda = "MXN";
                }else if(params["currency"] == "twincoin"){
                    this.current_balance = this.twincoinBalance;
                    this.crypto = true;
                    this.moneda = "Twincoin";
                }else if(params["currency"] == "twin"){
                    this.current_balance = this.twinbalance;
                    this.crypto = true;
                    this.moneda = "Twin";
                }
                
            }
        })
        this.fiatService.FiatUpdated$.subscribe(() => {
            setTimeout(() => {
                this.getWallet()
            },1000);
        })
    }
    async getContacts(){
        this.loading = true;
        this.ServiceUser.getContacts({}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                let data = response.body.data;
                this.resultadosUsuarios = data;
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
    async getWallet(){
        this.loading = true;
        this.crypto = false;
        let monedaSeleccionada = localStorage.getItem("cryptoCurrency");
        console.log('moneda seleccionada:',monedaSeleccionada);
        if(monedaSeleccionada == "mxn"){
            this.ServiceUser.getWallet({}).subscribe((response: any) => {
                this.loading = false;
                if(response.ok){
                    let data = response.body.data;
                    this.current_balance = data.current_balance;
                    this.btcBalance = response.body.crypto.btc;
                    this.twincoinBalance = response.body.crypto.twincoin;
                    this.twinbalance = response.body.crypto.twin;
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
            this.crypto = true;
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
                    this.current_balance = data.current_balance; 
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
    showCantidadToggle(){
        this.showCantidad = !this.showCantidad;
    }
    keypressValidaNumero($event){
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
        if($event.target.value < 1 && !this.crypto){
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
    keypressValidaNumeroCrypto($event){
        // Valida números y punto
        if ($event.keyCode < 48 || $event.keyCode > 57) {
            $event.preventDefault();
        }
        if ($event.target.value.length >= 10) {
            $event.preventDefault();
        }
    
        let monto = parseFloat($event.target.value).toFixed(8); // Redondea a 8 decimales
        console.log(monto);
        let monedaCrypto;
        if (this.moneda == "btc") {
            monedaCrypto = this.btcBalance;
        } else if (this.moneda == "twincoin") {
            monedaCrypto = this.twincoinBalance;
        }
        if (Number(monto) > monedaCrypto) {
            Swal.fire({
                title: "Error",
                text: "La cantidad no puede ser mayor al saldo actual de " + this.moneda,
                icon: "error",
                confirmButtonText: "Entendido",
            });
            $event.target.value = "";
            return false;
        }
    
        if (Number(monto) < 0.00000001) {
            Swal.fire({
                title: "Error",
                text: "La cantidad no puede ser menor a 0.00000001",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            $event.target.value = "";
            return false;
        }
        
        this.cantidadFondeo = Number(monto);
    }
    
    buscaTexto() {
        this.changeMuestra(1)
        let texto = $("#busquedaText").val();
    
        if (texto.trim() === '') {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debe ingresar un texto para buscar',
                confirmButtonText: "Entendido",
            });
            return false;
        }
    
        // Expresiones regulares para validar correo electrónico y número de teléfono
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const cryptoWalletRegex = /^(0x[a-fA-F0-9]{40}|[13][a-km-zA-HJ-NP-Z1-9]{25,34})$/;
    
        let tipo = '';
    
        if (emailRegex.test(texto)) {
            tipo = 'mail';
        } else if (phoneRegex.test(texto)) {
            tipo = 'phone';
        } else if(cryptoWalletRegex.test(texto)){
            tipo = 'crypto';
        }else {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El texto ingresado no es un correo electrónico ni un número de teléfono válido o una dirección de criptomoneda',
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.ServiceUser.searchUser({search: texto, type: tipo, moneda:this.moneda}).subscribe((response: any) => {
            console.log(response);
            if(response.ok){
                this.resultadosUsuarios = []
                this.resultadosUsuarios.push(response.body.data);
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
                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }
    selectUser(uuid){
        this.userSelected = uuid;
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
    sendMoney(){
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
        if(this.userSelected == ""){
            Swal.fire({
                title: "Error",
                text: "Selecciona un usuario",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(this.cantidadFondeo == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa una cantidad",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.loading = true;
        this.ServiceUser.sendMoney({code: code, amount: this.cantidadFondeo, uuid: this.userSelected, moneda:this.moneda}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                Swal.fire({
                    title: "Éxito",
                    text: 'Se ha enviado el dinero correctamente',
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                $('#fondeaCuenta').val('')
                this.userSelected = '';
                this.getWallet();
                //notificar en websocket a la otra persona
                this.Socket.emit('notificaciones', this.userSelected);
                this.FiatService.notifyUpdateFiat();
                Array.from(inputElements).map((input: HTMLInputElement) => input.value = '');
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
                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }
    changeMuestra(muestra:number){
        this.muestra = muestra;
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
        this.loading = true;
        this.changeMuestra(1)
        let monedero =  $event;
        this.ServiceUser.getUserFromQr({code: monedero}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                this.resultadosUsuarios = []
                this.resultadosUsuarios.push(response.body.data);
                this.userSelected = response.body.data.uuid;
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
                text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }

    onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
      }
    
      onDragLeave(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
      }
    
      onDrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
    
        const files = event.dataTransfer?.files;
        this.processFiles(files);
      }
    
      onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        this.processFiles(files);
      }
    
      processFiles(files: FileList | null | undefined) {
        if (files) {
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (this.isImage(file)) {
              this.droppedFiles.push(file);
              this.readFileAsBase64(file);
            }
          }
        }
      }
    
      isImage(file: File): boolean {
        return file.type.startsWith('image/');
      }
    
      readFileAsBase64(file: File) {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            this.loading = true;
            this.muestra = 1;
            this.ServiceUser.getUserFromQrImage({image: base64String}).subscribe((response: any) => {
                this.loading = false;
                if(response.ok){
                    this.resultadosUsuarios = []
                    this.resultadosUsuarios.push(response.body.data);
                    this.userSelected = response.body.data.uuid;
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
                    text: error.error.message ? error.error.message : "Error desconocido, intente más tarde",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            })
        };
        reader.readAsDataURL(file);
    }
    buscarUsuario(nombre: string) {
        // Convertir el nombre a minúsculas
        const nombreLowerCase = nombre.toLowerCase();
      
        // Oculta todos los elementos <li>
        $(".listadoContactosItem").hide();
      
        // Filtra y muestra solo los elementos <li> cuyo nombre coincide (insensible a mayúsculas y minúsculas)
        $(".listadoContactosItem").filter(function() {
          return $(this).text().toLowerCase().includes(nombreLowerCase);
        }).show();
    }
       
    proximamente(){
        Swal.fire({
            title: "Próximamente",
            text: "Esta función estará disponible pronto",
            icon: "info",
            confirmButtonText: "Entendido",
        });
    }
    // Envio a wallet fuera de la plataforma
    sendTwin(){
        this.ServiceUser.sendTwincoin({address:'0x9BC82437AB699eB8D24811bB46cE7a7796D90Df7',amount:1}).subscribe((response: any) => {
            console.log(response);
        },(error)=>{
            console.log(error);
        })
    }
    getFirst(text:string){
        return text.charAt(0) + text.charAt(1);
    }
}