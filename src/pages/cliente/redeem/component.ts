import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit,ViewChild, ElementRef} from "@angular/core";
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
    public saldo_moneda_seleccionada:string = '0.00000000';
    public loading:boolean = false;
    public cantidadCambiar:number = 0;
    public cantidadEnviar:number = 0;
    public tipoCambio:number = 0;
    public saldoTwin:any = 0;
    public monto:any = 0;
    public listadoMonedas:any = [
        {id:1,moneda:"Peso Méxicano",simbolo:"MXN",tipo:1,icon:"assets/images/cripto/iconMXN.png"},
        {id:2,moneda:"Bitcoin",simbolo:"BTC",tipo:2,icon:"assets/images/cripto/iconBTC.png"},
        {id:3,moneda:"TWINCOIN",simbolo:"TWC",tipo:2,icon:"assets/images/cripto/icoTWC.png"},
        {id:4,moneda:"TWIN",simbolo:"TWIN",tipo:2,icon:"assets/images/cripto/twin24.svg"},
        {id:5,moneda:"Etherium",simbolo:"ETH",tipo:2,icon:"assets/images/cripto/iconETH.png"},
        {id:6,moneda:"Binance",simbolo:"BNB",tipo:2,icon:"assets/images/cripto/iconBNB.png"},
        {id:7,moneda:"Lite coin",simbolo:"LTC",tipo:2,icon:"assets/images/cripto/iconLTC.png"},
    ]
    //mostrar monedas menos la seleccionada
    //monea a cambiar
    public monedasShow:any = this.listadoMonedas.filter((item:any) => item.tipo == 2);
    public monedaSeleccionada:any = []
    //moneda a recibir
    public monedaRecibir:any = [];
    @ViewChild('digitInputs') digitInputs!: ElementRef;
    @ViewChild('digitInputsOne') digitInputsOne!: ElementRef;

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,

    ){
    }

    async ngOnInit(){
        // setTimeout(() => {
        //     this.getWallet();
        // }, 500);
        this.monedaRecibir = [];
        let monedaTipo = 2;
        let moneda = localStorage.getItem('cryptoCurrency').toUpperCase();

        if(moneda == "BNB" || moneda == "ETH" || moneda == "BTC" || moneda == "LTC" || moneda == "TWC" || moneda == "TWIN"){
            monedaTipo = 1;
        }
        this.changeListOptions(monedaTipo, moneda);

        this.ActivatedRoute.queryParams.subscribe(async params => {
            $("#changeSwapInput").val(null);
            this.cantidadCambiar = 0;
            if(params["currency"]){
                let parametro = params["currency"];
                if(params["currency"] == "btc"){
                    //BTC
                    this.monedaRecibir = []
                    this.changeListOptions(1,parametro)
                }else if(params["currency"] == "mxn"){
                    //MXN
                    this.monedaRecibir = []
                    this.changeListOptions(2,parametro)
                }else if(params["currency"] == "twincoin"){
                    //TWINCOIN
                    this.monedaRecibir = []
                    this.changeListOptions(1,parametro)
                }else if(params["currency"] == "twin"){
                    //TWIN
                    this.monedaRecibir = []
                    this.changeListOptions(1,parametro)
                }else if(params["currency"] == "eth"){
                    //ETH
                    this.monedaRecibir = []
                    this.changeListOptions(1,parametro)
                }else if(params["currency"] == "bnb"){
                    //BNB
                    this.monedaRecibir = []
                    this.changeListOptions(1,parametro)
                }else if(params["currency"] == "ltc"){
                    //LTC
                    this.monedaRecibir = []
                    this.changeListOptions(1,parametro)
                }else{
                    //MXN
                    this.monedaRecibir = this.listadoMonedas[0]
                    this.changeListOptions(2,'MXN')
                }
            }
        })
    }
    monedaSelected(arregloMonedas:any){
        this.monedaRecibir = arregloMonedas;
    }

    changeListOptions(tipo:any,moneda:any){
        console.log('tipo:',tipo,  'moneda:',moneda);
        moneda = moneda.toUpperCase();
        if(moneda == 'TWINCOIN'){
            moneda = 'TWC';
        }
        this.monedaSeleccionada = this.listadoMonedas.find((item:any) => item.simbolo == moneda);

        if(tipo == 1){
            this.monedasShow = this.listadoMonedas.filter((item:any) => item.tipo == 1);
        }else{
            this.monedasShow = this.listadoMonedas.filter((item:any) => item.tipo == 2);
        }
        this.getWallet();
    }

    async getWallet(){
        this.loading = true;
        this.ServiceUser.getWallet({}).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                console.log('esta en un bucle');
                let data = response.body.data;
                let cryptos = response.body.crypto;
                if(this.monedaSeleccionada.simbolo == "MXN"){
                    this.saldo_moneda_seleccionada = data.current_balance;
                }else if(this.monedaSeleccionada.simbolo == "BTC"){
                    this.saldo_moneda_seleccionada = cryptos.btc;
                }else if(this.monedaSeleccionada.simbolo == "TWC"){
                    this.saldo_moneda_seleccionada = cryptos.twincoin;
                }else if(this.monedaSeleccionada.simbolo == "TWIN"){
                    this.saldo_moneda_seleccionada = cryptos.twin;
                }else if(this.monedaSeleccionada.simbolo == "ETH"){
                    this.saldo_moneda_seleccionada = cryptos.eth;
                }else if(this.monedaSeleccionada.simbolo == "BNB"){
                    this.saldo_moneda_seleccionada = cryptos.bnb;
                }else if(this.monedaSeleccionada.simbolo == "LTC"){
                    this.saldo_moneda_seleccionada = cryptos.ltc;
                }else{
                    this.saldo_moneda_seleccionada = data.current_balance;
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
    keypressValidaNumeroTwin($event){
        //si
        if ($event.type === 'keydown') {
            if ($event.key === 'e' || $event.key === '-' || $event.key === '+') {
                $event.preventDefault();
                return;
            }
        }

        if($event.data != null){
            if($event.keyCode < 48 || $event.keyCode > 57){
                $event.preventDefault();
                return;
            }
            // if($event.target.value.length >= 8){
            //     $event.preventDefault();
            //     return;
            // }
            // Calcular el valor y formatearlo
            let valor = $event.target.value.replace(/[^0-9.]/g, '');
            parseInt(valor);
            // if (valor.length > 8) {
            //     valor = valor.slice(0, 8);
            // }
            //valor no puede ser mayor al saldo de this.saldoTwin
            if(parseInt(valor) > Number(this.saldo_moneda_seleccionada)){
                Swal.fire({
                    title: "Error",
                    text: "No puedes cambiar más " + this.monedaSeleccionada.moneda + " de los que tienes en tu cartera",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                //eliminar valor
                $event.target.value = '';
                return;
            }
            console.log('valor:',valor);
            this.cantidadEnviar = valor;
        }else{
            this.cantidadCambiar = 0;
        }
    }
    calcularCanjeo(){
        this.loading = true;
        //valida que this.monedaSeleccionada sea diferente de this.monedaRecibir
        if(this.monedaSeleccionada.simbolo == this.monedaRecibir.simbolo){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "Por favor selecciona una moneda para continuar",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
        }
        //si this.monedaRecibir no tiene valor no se puede continuar
        if(this.monedaRecibir.length == 0){
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "Por favor selecciona una moneda para continuar",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return;
        }
        let data = {
            monedaSeleccionada:this.monedaSeleccionada,
            monedaRecibir:this.monedaRecibir,
            cantidad:this.cantidadEnviar
        }
        console.log('data:',data);
        this.ServiceUser.consultarSwap(data).subscribe((response: any) => {
            this.loading = false;
            console.log('response tipo cambio:' ,response);
            if(response.body.success == 1){
                this.cantidadCambiar = response.body.price;
                this.monto = response.body.price;
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
    cambiarMoneda(){
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
        if(this.monto == 0){
            Swal.fire({
                title: "Error",
                text: "Ingresa la cantidad de twins a cambiar",
                icon: "error",
                confirmButtonText: "Entendido",
            });
            return false;
        }
        this.loading = true;
        let data = {
            monto: this.cantidadEnviar,
            monedaSeleccionada: this.monedaSeleccionada,
            monedaRecibir: this.monedaRecibir,
            codigo: values.join('')
        }
        console.log('Data para cambiar :',data);
        // Swal.fire({
        //     title: "Error",
        //     text: "Nodos no sincronizados, por favor intente más tarde",
        //     icon: "error",
        //     confirmButtonText: "Entendido",
        // });
        // this.loading = false;
        
        this.ServiceUser.swapCoins(data).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                Swal.fire({
                    title: "Éxito",
                    text: response.body.message,
                    icon: "success",
                    confirmButtonText: "Entendido",
                });
                this.getWallet();
                this.monto = 0;
                this.cantidadCambiar = 0;
                inputElements.forEach((input: HTMLInputElement) => input.value = '');
                $("#changeSwapInput").val('');
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
}