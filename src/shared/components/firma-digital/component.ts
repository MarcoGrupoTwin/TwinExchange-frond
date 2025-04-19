import { Component, ViewChild, ElementRef, EventEmitter, Input, Output, AfterViewInit } from "@angular/core";
import Swal from "sweetalert2";

import {Service as ServiceUser} from "src/pages/user/module/service";

declare var $: any;

@Component({
    templateUrl: "template.html",
    selector: "firma-component",
    styleUrls: ["style.scss"]
})

export class firmaDigital implements AfterViewInit {
    @Input() parametro: any;
    @Output() FirmaCompletado: EventEmitter<any> = new EventEmitter();

    public step: number = 1;
    public textBack: string = "En otro momento";
    public textNext: string = "Confirmar firma";
    public showBack: boolean = true;
    public showNext: boolean = true;
    public showBackFlow: boolean = false;
    public showFinal: boolean = false;
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    @ViewChild('validationInputs') validationInputs!: ElementRef;

    constructor(
        public ServiceUser: ServiceUser,
    ) {}

    ngAfterViewInit() {
        this.ServiceUser.checkFirma({}).subscribe((response: any) => {
            if(response.ok){
                if(response.body.success != 1){
                    $('#exampleModalCenter').modal({
                        backdrop: 'static',
                        keyboard: false,
                        show: true
                    });

                    if (this.digitInputs) {
                        setTimeout(() => {
                            const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
                            if (inputElements.length > 0) {
                                inputElements[0].focus();
                            }
                        }, 100);
                    }
                    $('#exampleModalCenter').modal('show')
                }
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error: any) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
                confirmButtonText: 'Entendido'
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
    onDigitInputValidation(event: any, index: number) {
        const inputValue = event.target.value;

        if (inputValue.length === 1) {
            const inputElements = this.validationInputs.nativeElement.querySelectorAll('.firmaInputValida');
            if (index < inputElements.length - 1) {
                inputElements[index + 1].focus();
            } 
        }

        if (inputValue.length === 0) {
            const inputElements = this.validationInputs.nativeElement.querySelectorAll('.firmaInputValida');
            if (index > 0) {
                inputElements[index - 1].focus();
            }
        }
    }

    nextStep(number: number) {
        this.step = number;
        if (number == 1) {
            this.textBack = "En otro momento";
            this.textNext = "Confirmar firma";
            this.showBack = true;
            this.showNext = true;
            this.showBackFlow = false;
        } else if (number == 2) {
            this.showFinal = true;
            this.showBack = false;
            this.showBackFlow = false;
            this.showNext = false;
        }
    }

    completaFirma() {
        // Obtener elementos de la firma y de la firma válida
        const inputElements = this.digitInputs.nativeElement.querySelectorAll('.firmaInput');
        const values = Array.from(inputElements).map((input: HTMLInputElement) => input.value);
        
        const inputValidaElements = this.validationInputs.nativeElement.querySelectorAll('.firmaInputValida');
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
        this.ServiceUser.setCode({code: values,validaCode:valuesValida}).subscribe((response: any) => {
            if(response.ok){
                this.FirmaCompletado.emit(true);
                $('#exampleModalCenter').modal('hide');
                Swal.fire({
                    icon: 'success',
                    title: 'Exito',
                    text: 'Tu firma ha sido registrada correctamente, con esta firma podrás realizar transacciones en la plataforma',
                    confirmButtonText: 'Entendido',
                    timer: 5000
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...o',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error: any) => {
            if(error.error.success == 10){
                $('#exampleModalCenter').modal('hide');
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...l',
                    text: error.error.message,
                    confirmButtonText: 'Entendido'
                })
                $('#exampleModalCenter').modal('hide');
                return;
            }
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
                confirmButtonText: 'Entendido'
            })
        })
    }    
      
}
