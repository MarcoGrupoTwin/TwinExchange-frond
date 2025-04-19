import { Router, ActivatedRoute } from "@angular/router";
import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Input, Output, AfterViewInit } from "@angular/core";
import Swal from "sweetalert2";
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import { get } from "http";

declare var $: any;

@Component({
    selector: "app-list",
    templateUrl: "template.html",
    styleUrls: ["style.scss"]
})

export class ListComponent implements OnInit {
    public sendPay:number = 1;
    public loading:boolean = false;
    public changeCodeToggle:boolean = false;
    public codigoVerificacion:string = '';
    public cantidadCobrada:number = 0;
    public rendimientoMensual:number = 0;
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    @ViewChild('digitInputsOne') digitInputsOne!: ElementRef;
    @ViewChild('digitInputsTwo') digitInputsTwo!: ElementRef;
    @ViewChild('digitInputsThree') digitInputsThree!: ElementRef;
    @ViewChild('digitInputsFour') digitInputsFour!: ElementRef;
    @ViewChild('digitInputsFive') digitInputsFive!: ElementRef;
    public moneda:string = "MXN";
    public resultadosUsuarios:Array<any> = [];
    public remesas:Array<any> = [];
    public showCantidad:boolean = false;
    public isCrypto:boolean = false;
    public current_balance:number = 0;
    public tipoCambio:number;
    public cantidadTwins: number;
    public totalMXN: number;
    public user:any = null;
    public monedaSeleccionada:string = "MXN";
    public tipoRemesa:number = 2;
    public remesaSeleccionada:any = null;
    public twinsRecibidos:number = 0;
    public mxnRecibidos:number = 0;
    public monedaCambiar:any = null;

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser
    ){
    }

    async ngOnInit(){
        this.ActivatedRoute.queryParams.subscribe(async params => {
            $("#changeSwapInput").val(null);
            this.cantidadTwins;
            this.totalMXN;
            if(params["currency"]){
                let parametro = params["currency"];
                if(parametro == "mxn"){
                    this.monedaSeleccionada = "MXN";
                    this.getWallet();
                }else if(parametro == "twin"){
                    this.monedaSeleccionada = "TWIN";
                    this.isCrypto = true;
                    this.getWallet();
                }else{
                    this.monedaSeleccionada = "MXN";
                    this.getWallet();
                }
            }
        })
        this.getWallet();
        this.getTipoCambio();
    }
    async changeTab(tab:any){
        this.sendPay = tab;
        if(tab == 2){
            this.getRemesas(2);
        }
    }

    async getRemesas(tipo:any){
        this.loading = true;
        this.tipoRemesa = tipo;
        this.ServiceUser.getRemesas({cobradas:tipo}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                this.remesas = response.body.data;
                console.log('remesas:',this.remesas);
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

    getTipoCambio(){
        this.ServiceUser.consultarTipoCambio({moneda:'mxn'}).subscribe((response: any) => {
            if(response.ok){
                this.tipoCambio = response.body.exchange;
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
    }
    async getWallet(){
        this.loading = true;
        let monedaActual = localStorage.getItem('cryptoCurrency');
        if(monedaActual == 'mxn'){
            this.monedaSeleccionada = "MXN";
        }else if(monedaActual == 'twin'){
            this.isCrypto = true;
            this.monedaSeleccionada = "TWIN";
        }else{
            this.monedaSeleccionada = "MXN";
        }
        console.log(this.monedaSeleccionada);
        this.ServiceUser.getWallet({}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                console.log(response.body);
                if(this.monedaSeleccionada == "MXN"){
                    this.isCrypto = false;
                    this.current_balance = response.body.data.current_balance;
                }else if(this.monedaSeleccionada == "TWIN"){
                    this.isCrypto = true;
                    this.current_balance = response.body.crypto.twin;
                }else{
                    this.isCrypto = false;
                    this.current_balance = response.body.data.current_balance;
                }
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
        if (inputValue.length === 0) {
            const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
            if (index > 0) {
                inputElements[index - 1].focus();
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
    onDigitInputThree(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsThree.nativeElement.querySelectorAll('.firmaInputThree');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
    }
    onDigitInputFour(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsFour.nativeElement.querySelectorAll('.firmaInputFour');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
    }
    onDigitInputFive(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsFive.nativeElement.querySelectorAll('.firmaInputFive');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
    }
    buscaTexto() {
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
    getFirst(text:string){
        return text.charAt(0).toUpperCase() + text.charAt(1).toUpperCase();
    }
    showCantidadToggle(){
        this.showCantidad = !this.showCantidad;
    }

    actualizarMXN() {
        this.totalMXN = parseFloat((this.cantidadTwins * this.tipoCambio).toFixed(2)) || 0;
    }

    actualizarTwins() {
        this.cantidadTwins = parseFloat((this.totalMXN / this.tipoCambio).toFixed(2)) || 0;
    }
    
    selectUser(user:any){
        if(this.totalMXN === 0 || this.totalMXN === null || this.totalMXN === undefined){
            Swal.fire({
                title: "Error",
                text: "Debes ingresar una cantidad a enviar para poder seleccionar el usuario",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
        }
        this.user = user;
        console.log(this.user);
    }
    sendRemesa(){
        if(this.user === null){
            Swal.fire({
                title: "Error",
                text: "Debes seleccionar un usuario para poder enviar la remesa",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
        }
        if(this.totalMXN === 0 || this.totalMXN === null || this.totalMXN === undefined){
            Swal.fire({
                title: "Error",
                text: "Debes ingresar una cantidad a enviar para poder enviar la remesa",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
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
        this.loading = true;
        let cantidadAEnviar = this.monedaSeleccionada == "MXN" ? this.totalMXN : this.cantidadTwins;
        this.ServiceUser.sendRemesa({user_id:this.user.uuid, amount:cantidadAEnviar, moneda_seleccionada: this.monedaSeleccionada, code: code}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                Swal.fire({
                    title: "Éxito",
                    text: "Remesa enviada correctamente",
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.totalMXN = 0;
                this.cantidadTwins = 0;
                this.user = null;
                this.resultadosUsuarios = [];
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        },(error)=>{
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
    
    seleccionaRemesa(remesa:any){
        this.remesaSeleccionada = remesa;
        console.log(this.remesaSeleccionada);
        let monto = this.remesaSeleccionada.enviado;
        let currency = this.remesaSeleccionada.moneda_envia;
        let cambio;
        if(currency == 'MXN'){
            this.mxnRecibidos = monto;
            cambio = (Number(monto) / Number(this.tipoCambio)) 
            this.twinsRecibidos = cambio.toFixed(2);
        }else{
            this.twinsRecibidos = monto;
            cambio = Number(monto) * Number(this.tipoCambio);
            this.mxnRecibidos = cambio.toFixed(2);
        }
    }

    cobrarRemesa(){
        if(this.remesaSeleccionada === null){
            Swal.fire({
                title: "Error",
                text: "Debes seleccionar una remesa para poder cobrarla",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
        }
        if(this.monedaCambiar == null){
            Swal.fire({
                title: "Error",
                text: "Debes seleccionar una moneda para poder cobrar la remesa",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
        }
        this.loading = true;
        this.ServiceUser.getRemesa({remesa:this.remesaSeleccionada.id, moneda:this.monedaCambiar}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                Swal.fire({
                    title: "Éxito",
                    text: "Remesa cobrada correctamente",
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.remesaSeleccionada = null;
                this.mxnRecibidos = 0;
                this.twinsRecibidos = 0;
                this.monedaCambiar = null;
                this.getRemesas(2);
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        },(error)=>{
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
}