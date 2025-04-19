import { Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { Service as ServicioUsuarios } from "src/pages/cliente/module/service";
import Swal from "sweetalert2";
import { WalletService } from "src/shared/services/wallet.service";

declare var $: any;

@Component({
    templateUrl: "template.html",
    selector: "twin-bank-component",
    styleUrls: ["style.scss"]
})

export class ComponentTwinBank implements OnInit, OnChanges {
    @Input() show: boolean = false;  // Recibe la señal de si debe estar visible
    @Output() close: EventEmitter<void> = new EventEmitter();  // Emite un evento para cerrar

    public america:any;
    public asia:any;
    public europa:any;
    public africa:any;
    public oceania:any;
    public moneda:any;

    constructor(
        public ServicioUsuarios: ServicioUsuarios,
        private el: ElementRef,
        private walletService: WalletService,
    ) {}

    async ngOnInit() {
    }
    
    // Detecta cambios en los inputs
    ngOnChanges(changes: SimpleChanges) {
        if (changes['show'] && changes['show'].currentValue === true) {
            // Si show cambia a true, abre el modal
            this.moneda = localStorage.getItem("currency") ? localStorage.getItem("currency").toUpperCase() : "MXN";
            this.abrirModal();
        } else if (changes['show'] && changes['show'].currentValue === false) {
            // Si show cambia a false, cierra el modal
            
            this.cerrarModal();
        }
    }

    abrirModal() {
        // Abre el modal usando jQuery
        this.ServicioUsuarios.getTwinBank({}).subscribe((res: any) => {
            console.log('twinbank',res);
            if(res.body.success == 1){
                let ame = JSON.parse(res.body.data[0].coins);
                this.america = ame.filter((x:any) => x.name == 'Peso Méxicano' || x.name == 'Dolar Estadounidense');
                //this.africa = JSON.parse(res.body.data[0].coins);
                //toma solo el usd y el mxn
                // this.asia = JSON.parse(res.body.data[2].coins);
                // this.europa = JSON.parse(res.body.data[3].coins);
                // this.oceania = JSON.parse(res.body.data[4].coins);
                $(this.el.nativeElement).find("#exampleModal").modal("show");
            }else{
                Swal.fire({
                    title: "Error",
                    text: res.body.message,
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        }, (err) => {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al obtener la información",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        })
    }

    cerrarModal() {
        this.america = [];
        $(this.el.nativeElement).find("#exampleModal").modal("hide");
        this.close.emit();
    }

    buscarPais(paisBuscado: string) {
        let pais = paisBuscado.toLowerCase();
        console.log(pais);
        let elementos = document.getElementsByClassName("banderaCambioPais");

        for (let i = 0; i < elementos.length; i++) {
            // Obtiene el nombre del país y la moneda
            let nombrePais = elementos[i].querySelector(".nombrepais")?.textContent.toLowerCase() || "";
            let moneda = elementos[i].querySelector(".moneda")?.textContent.toLowerCase() || "";

            // Verifica si el texto ingresado coincide con el nombre del país o la moneda
            if (nombrePais.indexOf(pais) > -1 || moneda.indexOf(pais) > -1) {
                elementos[i].setAttribute("style", "display: block;");
            } else {
                elementos[i].setAttribute("style", "display: none;");
            }
        }
    }
    seleccionarMoneda(moneda: any) {
        let money = moneda.short_name.toLowerCase();
        localStorage.setItem("currency", money);
        this.walletService.notifyUpdateWallet();
        this.cerrarModal();
    }
}