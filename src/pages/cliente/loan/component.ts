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
    public loanSelected:any = {"id": null,"amount": 0,};


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
        this.ServiceUser.getCongifLoans({}).subscribe((res:any)=>{
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
        this.rendimientoMensual = monto * (this.configuracionAhorros.apertura/100);
        this.impuestosPorRendimiento = (monto * this.configuracionAhorros.monthly_interest) / 100;
        this.rendimientoTotalMensual = Number(this.montoAhorro) + Number(this.rendimientoMensual) + Number(this.impuestosPorRendimiento);
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
                text: "El monto mínimo de préstamo es de $1,000.00",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        //el monto maximo de ahorro es de 5000
        if(this.montoAhorro > 5000){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "El monto máximo de préstamo para tu cuenta es de $5,000.00",
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
        }
        
        this.ServiceUser.createLoan(data).subscribe((res:any)=>{
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
                    text: "Tu préstamo se ha realizado correctamente",
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
        this.ServiceUser.getLoans({}).subscribe((res:any)=>{
            this.loading = false;
            if(res.ok){
                this.listAhorros = res.body.loans;
                this.historial = res.body.loans;
                if(this.historial.length > 0){
                    this.totalAhorros = 0;
                    this.listAhorros.forEach((element:any) => {
                        element.contract = this.sanitizer.bypassSecurityTrustResourceUrl(element.contract);
                        this.totalAhorros += element.amount;
                    })
                }
                console.log('historial',this.listAhorros);
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
    calcularRetiro($evento:any){
        let monto = $evento.target.value;
        
        if(!this.loanSelected){
            Swal.fire({
                title: "Error",
                text: "Selecciona un préstamo para poder realizar el calculo del abono",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            $evento.target.value = null;
            return false;
        }
        this.cantidadRetiro = monto;
        this.retiroRendimiento = this.loanSelected.amount - monto;
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
        if(this.cantidadRetiro > this.loanSelected.amount){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "No puedes abonar más de lo que debes",
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
            id: this.loanSelected.id,
            code: code,
            pago: this.cantidadRetiro
        }
        this.ServiceUser.realizarPagoLoan(data).subscribe((res:any)=>{
            this.loading = false;
            if(res.ok){
                this.sendPay = 2;
                this.retiroRendimiento = 0;
                this.cantidadRetiro = 0;
                this.verAhorros();
                $("#totalRetiro").val(null);
                Swal.fire({
                    title: "Éxito",
                    text: "Tu abono se ha realizado correctamente",
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
    seleccionaPrestamo(loan:any){
        this.loanSelected = loan;
        console.log('loanSelected',this.loanSelected);
    }
}