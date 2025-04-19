import { Router, ActivatedRoute } from "@angular/router";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from "sweetalert2";
import {Service as ServiceUser} from "src/pages/cliente/module/service";

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
    public showRetiro:boolean = false;
    public showCantidad:boolean = false;
    public codigoVerificacion:string = '';
    public cantidadCobrada:number = 0;
    public rendimientoMensual:number = 0;
    public retiroRendimiento:number = 0;
    public impuestosPorRendimiento:number = 0;
    public cantidadRetiro:number = 0;
    public montoAhorro:number = 0;
    public rendimientoTotalMensual:number = 0;
    public current_balance:number = 0;
    public totalAhorros:number = 0;
    public listAhorros:any = [];
    public historial:any = [];
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    @ViewChild('digitInputsOne') digitInputsOne!: ElementRef;
    @ViewChild('digitInputsTwo') digitInputsTwo!: ElementRef;
    @ViewChild('digitInputsThree') digitInputsThree!: ElementRef;
    @ViewChild('digitInputsFour') digitInputsFour!: ElementRef;
    @ViewChild('digitInputsFive') digitInputsFive!: ElementRef;
    public configuracionAhorros:any = {}


    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,
        private sanitizer: DomSanitizer
    ){
    }

    async ngOnInit(){
        this.getConfigAhorros();
        this.getWallet();
    }

    async getWallet(){
        this.loading = true;
        console.log("getWallet");
        this.ServiceUser.getWallet({}).subscribe((response: any) => {
            this.loading = false;
            console.log(response.body);
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

    getConfigAhorros(){
        this.loading = true;
        this.ServiceUser.getCongifSavings({}).subscribe((res:any)=>{
            this.loading = false;
            if(res.ok){
                this.configuracionAhorros = res.body.config[0];
                this.configuracionAhorros.contract = this.sanitizer.bypassSecurityTrustResourceUrl(this.configuracionAhorros.contract);
                console.log('configuración',this.configuracionAhorros);
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                })
            }
        },(error:any)=>{
            this.loading = false;
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
            })
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
        if(inputValue.length === 0){
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
        if(inputValue.length === 0){
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
        if(inputValue.length === 0){
            const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
            if (index > 0) {
                inputElements[index - 1].focus();
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
        if(inputValue.length === 0){
            const inputElements = this.digitInputsThree.nativeElement.querySelectorAll('.firmaInputThree');
            if (index > 0) {
                inputElements[index - 1].focus();
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
        if(inputValue.length === 0){
            const inputElements = this.digitInputsFour.nativeElement.querySelectorAll('.firmaInputFour');
            if (index > 0) {
                inputElements[index - 1].focus();
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
        if(inputValue.length === 0){
            const inputElements = this.digitInputsFive.nativeElement.querySelectorAll('.firmaInputFive');
            if (index > 0) {
                inputElements[index - 1].focus();
            }
        }
    }

    calcularRendimiento($event){
        let monto = $event.target.value;
        this.montoAhorro = monto;
        console.log('monto',monto);
        this.rendimientoMensual = monto * (this.configuracionAhorros.rendimiento/100);
        console.log('rendimiento',this.rendimientoMensual);
        this.impuestosPorRendimiento = this.rendimientoMensual * (this.configuracionAhorros.impuesto/100);
        console.log('impuestos',this.impuestosPorRendimiento);
        this.rendimientoTotalMensual = Number(this.montoAhorro) + Number(this.rendimientoMensual) - Number(this.impuestosPorRendimiento);
    }
    
    insertSavings(){
        this.loading = true;
        //this.montoAhorro tiene que ser mayor a 0 y menor a this.current_balance
        if(this.montoAhorro <= 0){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "Ingresa un monto mayor a 0",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        //el monto tiene que ser mayor a 1000
        if(this.montoAhorro < 1000){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "El monto mínimo de ahorro es de $1,000.00",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        //this.montoAhorro no puede ser mayor a this.current_balance solo puede ser igual o menor
        if(this.montoAhorro > this.current_balance){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "No tienes suficiente saldo para realizar este ahorro",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
        const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
        values.forEach((value: string) => {
            if(value == ''){
                this.loading = false;
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
            code: code,
            amount: this.montoAhorro,
            config_id: this.configuracionAhorros.id
        }
        this.ServiceUser.createSaving(data).subscribe((res:any)=>{
            this.loading = false;
            if(res.ok){
                this.sendPay = 2;
                this.montoAhorro = 0;
                this.rendimientoMensual = 0;
                this.impuestosPorRendimiento = 0;
                this.rendimientoTotalMensual = 0;
                this.verAhorros();
                Swal.fire({
                    title: "Éxito",
                    text: "Tu ahorro se ha registrado correctamente",
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
            }else{
                Swal.fire({
                    title: "Error",
                    text: res.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        },(error:any)=>{
            this.loading = false;
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
            })
        })
    }
    changeSee(){
        this.showCantidad = !this.showCantidad;
    }
    verAhorros(){
        this.loading = true;
        this.sendPay = 2;
        this.ServiceUser.getSavings({}).subscribe((res:any)=>{
            this.loading = false;
            if(res.ok){
                this.listAhorros = res.body.savings;
                this.historial = res.body.history;
                if(this.historial.length > 0){
                    this.listAhorros.forEach((element:any) => {
                        element.contract = this.sanitizer.bypassSecurityTrustResourceUrl(element.contract);
                        this.totalAhorros = element.total;
                    })
                }
                console.log('ahorros',this.listAhorros);    
                console.log('historial',this.historial);
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: res.message,
                })
            }
        },(error:any)=>{
            this.loading = false;
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
            })
        })
    }
    realizarRetiro(){
        this.sendPay = 2;
        this.showRetiro = true;
        this.verAhorros();
    }
    calcularRetiro($evento){
        let monto = $evento.target.value;
        let comision = (this.configuracionAhorros.rendimiento/100) + 1;
        this.cantidadRetiro = monto;
        this.retiroRendimiento = monto * comision;
    }
    retirarAhorro(){
        this.loading = true;
        if(this.cantidadRetiro <= 0){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "Ingresa un monto mayor a 0",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        if(this.cantidadRetiro > this.totalAhorros){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "No puedes retirar más de lo que tienes en tus ahorros",
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
            code: code,
            amount: this.cantidadRetiro
        }
        this.ServiceUser.realizarRetiroSaving(data).subscribe((res:any)=>{
            this.loading = false;
            if(res.ok){
                this.sendPay = 2;
                this.retiroRendimiento = 0;
                this.cantidadRetiro = 0;
                this.verAhorros();
                $("#totalRetiro").val(null);
                Swal.fire({
                    title: "Éxito",
                    text: "Tu retiro se ha realizado correctamente",
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                //limpiar todos los .firmainput
                const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
                Array.from(inputElements).forEach((input: HTMLInputElement) => input.value = '');
            }else{
                Swal.fire({
                    title: "Error",
                    text: res.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        },(error:any)=>{
            this.loading = false;
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
            })
        })
    }
}