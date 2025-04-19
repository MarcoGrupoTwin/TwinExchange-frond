import { Component, OnInit, ViewChild, EventEmitter, Input, Output, ElementRef, AfterViewInit } from "@angular/core";
import { Service as ServicioUsuarios } from "src/pages/cliente/module/service";
import Swal from "sweetalert2";

declare var $: any;

@Component({
    templateUrl: "template.html",
    selector: "kyc-component",
    styleUrls: ["style.scss"]
})

export class ComponentKYC implements OnInit {
    @Input() parametro: any;
    @Output() kycCompletado: EventEmitter<any> = new EventEmitter();

    //camara
    isOpen = false;
    @ViewChild('videoElement') videoElement: ElementRef<HTMLVideoElement>;
    @ViewChild('canvas') canvasElement: ElementRef<HTMLCanvasElement>;
    WIDTH = 320;
    HEIGHT = 240;
    isCaptured = false;
    stream: MediaStream | undefined;


    public step:number = 1;
    public identificacion:number = 1;
    public textBack:string = "En otro momento";
    public textNext:string = "Siguiente";
    public showBack:boolean = true;
    public mostrarVideo:boolean = true;
    public showNext:boolean = false;
    public showBackFlow:boolean = false;
    public showFinal:boolean = false;
    public hasToken:boolean = false;
    public stepsCompleted:number = 1;
    public isLoading:boolean = false;
    public kycData:any = {
        identificacion: { 
            tipo: 1,
            frontal: "",
            trasera: ""
        },
        selfie: "",
        comprobante: ""
    }

    constructor(
        public ServicioUsuarios: ServicioUsuarios
    ) {
    }
    async ngOnInit(){
        //launch modal #exampleModalCenter
        console.log('parametro',this.parametro)
        localStorage.getItem("token") ? this.hasToken = true : this.hasToken = false;
        console.log('hasToken',this.hasToken)
        if(this.hasToken){
            $('#exampleModalCenter').modal('show')
        }
    }
    
    async nextStep(number:number){
        if(number == 1){
            this.textBack = "En otro momento";
            this.textNext = "Siguiente";
            this.showBack = true;
            this.showNext = true;
            this.showBackFlow = false;
            this.step = number;
        }else if(number == 2){
            //si el usuario ya subió una identificación, no se le permite regresar
            if(this.kycData.identificacion.frontal == ""){
                this.textBack = "Regresar";
                this.textNext = "Continuar";
                this.showBack = false;
                this.showBackFlow = true;
                this.showNext = true;
                this.step = number;
            }
        }else if(number == 3){
            //avanza si por lo menos se ha completado el frontal de la identificación
            if(this.kycData.identificacion.frontal != ""){
                this.textBack = "Continuar";
                this.textNext = "Validar datos";
                this.showBack = false;
                this.showBackFlow = true;
                this.showNext = false;
                this.step = number;
            }else{
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, sube una identificación para poder continuar',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }else if(number == 4){
            setTimeout(() => this.initializeCamera(), 0);
            this.textBack = "Regresar";
            this.textNext = "Continuar";
            this.showBack = false;
            this.showBackFlow = true;
            this.showNext = true;
            this.step = number;
        }else if(number == 5){
            //si no se ha tomado la selfie, no se permite avanzar
            if(this.kycData.selfie == ""){
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, toma una selfie para poder continuar',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            this.textBack = "Continuar";
            this.textNext = "Validar datos";
            this.showBack = false;
            this.showBackFlow = true;
            this.showNext = false;
            this.step = number;
        }else if(number == 6){
            this.textBack = "Regresar";
            this.textNext = "Continuar";
            this.showBack = false;
            this.showBackFlow = true;
            this.showNext = true;
            this.step = number;
        }else if(number == 7){
            //si no se ha subido el comprobante de domicilio, no se permite avanzar
            if(this.kycData.comprobante == ""){
                Swal.fire({
                    title: 'Error',
                    text: 'Por favor, sube un comprobante de domicilio para poder continuar',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            this.textBack = "Regresar";
            this.textNext = "Continuar";
            this.showBack = false;
            this.showBackFlow = false;
            this.showNext = true;
            this.step = number;
        }else if(number == 8){
            this.showFinal = true;
            this.showBack = false;
            this.showBackFlow = false;
            this.showNext = false;
            this.step = 1;
        }
    }
    changeIdentificacion(number:number){
        this.kycData.identificacion.frontal = "";
        this.kycData.identificacion.trasera = "";
        this.identificacion = number;
    }   
    completaKYC(){
        this.isLoading = true;
        this.ServicioUsuarios.validaKYC({kyc: this.kycData}).subscribe((response) => {
            this.isLoading = false;
            if(response.ok && response.body.success == '1'){
                Swal.fire({
                    title: 'KYC completado',
                    text: 'Tu KYC ha sido completado exitosamente, ahora puedes gozar de todos los beneficios de TwinExchange',
                    icon: 'success',
                    confirmButtonText: 'Aceptar'
                });
                $("#exampleModalCenter").modal('hide');
                localStorage.setItem("kyc", "completed");
                this.kycCompletado.emit(true);
            }else{
                Swal.fire({
                    title: 'Error',
                    text: 'No se pudo completar el KYC, por favor intenta más tarde',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
            }
        }, (error) => {
            this.isLoading = false;
            Swal.fire({
                title: 'Error',
                text: 'No se pudo completar el KYC, por favor intenta más tarde.',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        })
    }
    loadPicture(numero:number){
        //create input file, trigger click and get file, transform to base64 and save in kycData.identificacion.frontal
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
        input.onchange = (e:any) => {
            //el archivo seleccionado no puede ser mayor a 2MB
            if(e.target.files[0].size > 2097152){
                Swal.fire({
                    title: 'Error',
                    text: 'El archivo seleccionado no puede ser mayor a 2MB',
                    icon: 'error',
                    confirmButtonText: 'Aceptar'
                });
                return;
            }
            let file = e.target.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                if(numero == 1){
                    this.kycData.identificacion.frontal = reader.result;
                }else if(numero == 2){
                    this.kycData.identificacion.trasera = reader.result;
                }else if(numero == 3){
                    this.kycData.comprobante = reader.result;
                }
            }
        }
        console.log('así va',this.kycData)
    }
    initializeCamera() {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            this.stream = stream;
            this.videoElement.nativeElement.srcObject = stream;
            this.videoElement.nativeElement.play();
        })
        .catch(error => {
            console.error('Error al acceder a la cámara: ', error);
        });
    }
    capture() {
        const video = this.videoElement.nativeElement;
        const canvas = this.canvasElement.nativeElement;
        const context = canvas.getContext('2d');

        if (context) {
            context.drawImage(video, 0, 0, this.WIDTH, this.HEIGHT);
            this.isCaptured = true;
            this.kycData.selfie = canvas.toDataURL('image/png');
            this.mostrarVideo = false;
            console.log('así va',this.kycData)
        }
        this.stopCamera();
    }
    stopCamera() {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
}
