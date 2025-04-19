import { Router, ActivatedRoute } from "@angular/router";
import { Component, ViewChild, ElementRef, EventEmitter, OnInit, Input, Output, AfterViewInit } from "@angular/core";
import Swal from "sweetalert2";
import {Service as ServiceUser} from "src/pages/cliente/module/service";

declare var TradingView: any;

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
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    @ViewChild('digitInputsOne') digitInputsOne!: ElementRef;
    @ViewChild('digitInputsTwo') digitInputsTwo!: ElementRef;
    @ViewChild('digitInputsThree') digitInputsThree!: ElementRef;
    @ViewChild('digitInputsFour') digitInputsFour!: ElementRef;
    @ViewChild('digitInputsFive') digitInputsFive!: ElementRef;


    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser
    ){
    }

    async ngOnInit(){
    }
    solicitarViaCorreo(){
        Swal.fire({
            icon:'warning',
            title: 'Solictúd vía correo',
            text: 'Enviaremos un correo a tu cuenta de correo electrónico para que puedas realizar el proceso de recuperación de contraseña',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.ServiceUser.obtenCodigoFirma({tipo:'mail'}).subscribe((response: any) => {
                    console.log(response);
                    this.loading = false;
                    if(response.ok && response.body.success == '1'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Correo enviado',
                            text: 'Se ha enviado un correo a tu cuenta de correo electrónico para que puedas realizar el proceso de recuperación de contraseña',
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.body.message,
                        })
                    }
                }, (error) => {
                    this.loading = false;
                    console.log('firma correo:',error)
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.error.message ? error.error.message : 'Ocurrio un error al enviar el correo',
                    })
                })
            }
        })
    }
    solicitarViaTelefono(){
        Swal.fire({
            icon:'warning',
            title: 'Solictúd vía teléfono',
            text: 'Enviaremos un mensaje de texto a tu número de teléfono para que puedas realizar el proceso de recuperación de tu firma.',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                this.loading = true;
                this.ServiceUser.obtenCodigoFirma({tipo:'phone'}).subscribe((response: any) => {
                    console.log(response);
                    this.loading = false;
                    if(response.ok && response.body.success == '1'){
                        Swal.fire({
                            icon: 'success',
                            title: 'Mensaje enviado',
                            text: 'Se ha enviado a tu teléfono un códgio para que puedas realizar el proceso de recuperación de tu firma.',
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.body.message,
                        })
                    }
                }, (error) => {
                    console.log('firma telefono:',error)
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.error.message ? error.error.message : 'Ocurrio un error al enviar el mensaje',
                    })
                })
            }
        })
    }
    validaCodigo(){
        // Obtener elementos de la firma y de la firma válida
        const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
        const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
        
        values.forEach((value, index) => {
            if (!value) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ingresa el código de firma!',
                    confirmButtonText: 'Entendido'
                })
                return;
            }
            if(value == ''){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ingresa el código de firma!',
                    confirmButtonText: 'Entendido'
                })
                return;
            }
        })
        if(values.length < 6){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ingresa el código de firma!',
                confirmButtonText: 'Entendido'
            })
            return;
        }
        this.loading = true;
        this.ServiceUser.validaCodigoFirma({code:values}).subscribe((response: any) => {
            console.log(response);
            if(response.ok && response.body.success == '1'){
                this.loading = false;
                this.changeCodeToggle = true;
                this.codigoVerificacion = values.join('');
            }else{
                this.loading = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                })
            }
        }, (error) => {
            console.log(error)
            this.loading = false;
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Ocurrio un error al validar el código de firma',
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
    onDigitInputTwo(event: any, index: number) {
        const inputValue = event.target.value;
        if (inputValue.length === 1) {
            const inputElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            }
        }
        if (inputValue.length === 0) {
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
        if (inputValue.length === 0) {
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
        if (inputValue.length === 0) {
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
        if (inputValue.length === 0) {
            const inputElements = this.digitInputsFive.nativeElement.querySelectorAll('.firmaInputFive');
            if (index > 0) {
                inputElements[index - 1].focus();
            }
        }
    }
    cambiarFirma(){
        Swal.fire({
            icon:'warning',
            title: 'Cambiar firma',
            text: '¿Estás seguro de cambiar tu firma?',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const inputElements = this.digitInputsOne.nativeElement.querySelectorAll('.firmaInputOne');
                const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
                
                const inputValidaElements = this.digitInputsTwo.nativeElement.querySelectorAll('.firmaInputTwo');
                const valuesValida = Array.from(inputValidaElements).map((input: HTMLInputElement) => input.value);

                values.forEach((value, index) => {
                    if (value != valuesValida[index]) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'La firma no coincide!',
                            confirmButtonText: 'Entendido'
                        })
                        return;
                    }
                })
                this.loading = true;
                this.ServiceUser.cambiaCodigoFirma({
                    code:this.codigoVerificacion,
                    newCode:values,
                    validaCode:valuesValida
                }).subscribe((response: any) => {
                    console.log(response.body);
                    if(response.ok && response.body.success == '1'){
                        this.loading = false;
                        this.changeCodeToggle = true;
                        this.codigoVerificacion = values.join('');
                        Swal.fire({
                            icon: 'success',
                            title: 'Código de firma cambiado',
                            text: '!Se ha cambiado el código de firma con éxito!',
                        })
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000);
                    }else{
                        this.loading = false;
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.body.message,
                        })
                    }
                }, (error) => {
                    console.log(error)
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.error.message ? error.error.message : 'Ocurrio un error al cambiar el código de firma',
                    })
                })
            }
        })
    }
    cambiarFirmaNew(){
        Swal.fire({
            icon:'warning',
            title: 'Cambiar firma',
            text: '¿Estás seguro de cambiar tu firma?',
            showCancelButton: true,
            confirmButtonText: 'Continuar',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                const inputElements = this.digitInputsFour.nativeElement.querySelectorAll('.firmaInputFour');
                const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
                
                const inputValidaElements = this.digitInputsFive.nativeElement.querySelectorAll('.firmaInputFive');
                const valuesValida = Array.from(inputValidaElements).map((input: HTMLInputElement) => input.value);
                
                const Actual = this.digitInputsThree.nativeElement.querySelectorAll('.firmaInputThree');
                const ActualArray = Array.from(Actual).map((input: HTMLInputElement) => input.value);

                values.forEach((value, index) => {
                    if(!value){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ingresa el código de firma!',
                            confirmButtonText: 'Entendido'
                        })
                        return;
                    }
                    if(value == ''){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ingresa el código de firma!',
                            confirmButtonText: 'Entendido'
                        })
                        return;
                    }
                    if (value != valuesValida[index]) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'La firma no coincide!',
                            confirmButtonText: 'Entendido'
                        })
                        return;
                    }
                })
                valuesValida.forEach((value, index) => {
                    if(!value){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ingresa el código de firma!',
                            confirmButtonText: 'Entendido'
                        })
                        return;
                    }
                    if(value == ''){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ingresa el código de firma!',
                            confirmButtonText: 'Entendido'
                        })
                        return;
                    }
                })
                this.loading = true;
                let lastCode = ActualArray.join('');
                this.ServiceUser.setNewCode({
                    lastCode: lastCode,
                    newCode: values,
                    validaCode: valuesValida
                }).subscribe((response: any) => {
                    if(response.ok && response.body.success == '1'){
                        this.loading = false;
                        Swal.fire({
                            icon: 'success',
                            title: 'Código se firma cambiado',
                            text: '!Se ha cambiado el código de firma con éxito!',
                        })
                        setTimeout(() => {
                            window.location.reload();
                        }, 2500);
                    }else{
                        this.loading = false;
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.body.message,
                        })
                    }
                }, (error) => {
                    console.log(error)
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.error.message ? error.error.message : 'Ocurrio un error al cambiar el código de firma',
                    })
                })
            }
        })
    }
}