import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import {Service as ServiceCliente} from "src/pages/user/module/service"; 
import Swal from "sweetalert2";
import { LanguageSelectorService } from "src/shared/services/translate";
import { WalletService } from "src/shared/services/wallet.service";
import { FiatService } from "src/shared/services/fiat.service";
import { Socket } from 'ngx-socket-io';
import { Observable, Subscription } from 'rxjs';

declare var $: any;

@Component({
    templateUrl: "template.html",
    selector: "component-sidebar-inside",
    styleUrls: ["style.scss"]
})

export class ComponentSidebar {
    public activeMenu = "trading";
    public loading:boolean = false;
    public showTwinBank:boolean = false;
    public user:any = { 
        name: "",
        email: ""
    }
    public consultaEstado:boolean = false;
    public current_balanceMXN:any = 0;
    public current_balanceBTC:any = '0.00000000';
    public current_balanceETH:any = '0.00000000';
    public current_balanceBNB:any = '0.00000000';
    public current_balanceLTC:any = '0.00000000';
    public twincoinBalance:any = '0.00000000';
    public nombre_recortato:string = "";
    public twinBalance:any = '0.00000000'
    public monedaActiva:string = "mxn";
    public btcSelected:boolean = false;
    public currencies:any;
    public onNewMessage(): Observable<any> {
        return new Observable<any>(observer => {
            this.Socket.on('notififaciones', (data) => {
                console.log('Message: ', data);
            })
        });
    }
    public isMobile:boolean = false;
    public token = localStorage.getItem("token") ? localStorage.getItem("token") : null;
    public estaAfuera:boolean = false;
    //select profile 
    public optionSelected = "";
    public countries = [];
    public professions = [];
    public userData = {
        nombre: "",
        apellidos: "",
        genero: "",
        oficio: 1,
        fecha_nacimiento: "",
        lada: 1,
        telefono: "",
        correo: "",
        qr: "assets/images/borroso.png"
    }
    //Peso Méxicano
    public monedaNumero = 7;
    public currencySeleccionada = "mxn";
    public bandera = 'https://flagcdn.com/mx.svg';

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        public ServiceUser: ServiceUser,
        public languageSelectorService: LanguageSelectorService,
        public walletService: WalletService,
        public fiatService: FiatService,
        public Socket:Socket,
        public ServiceCliente: ServiceCliente
    ) { 
        this.consultaEstado = localStorage.getItem("currentBalance") ? true : false;
    }

    async ngOnInit() {
        this.monedaActiva = localStorage.getItem("cryptoCurrency") ? localStorage.getItem("cryptoCurrency") : "mxn";
        let moneda = localStorage.getItem("currency") ? localStorage.getItem("currency") : "mxn";
        if(moneda == 'mxn'){
            this.bandera = 'https://flagcdn.com/mx.svg';
            this.monedaNumero = 7;
            this.currencySeleccionada = "mxn";
        }else if(moneda == 'usd'){
            this.monedaNumero = 8;
            this.bandera = 'https://flagcdn.com/us.svg';
            this.currencySeleccionada = "usd";
        }else{
            this.monedaNumero = 7;
            this.bandera = 'https://flagcdn.com/mx.svg';
            this.currencySeleccionada = "mxn";
        }
        if(!localStorage.getItem("cryptoCurrency")){
            localStorage.setItem("cryptoCurrency", "btc");
        }
        const storedLanguage = this.languageSelectorService.getSelectedLanguage();
        this.languageSelectorService.changeLanguage(storedLanguage);
        this.ActivatedRoute.queryParams.subscribe(async params => {
            if(params["currency"] && params["currency"] == "btc"){
                this.btcSelected = true;
            }else{
                this.btcSelected = false;
            }
        })
        let url = this.router.url
        this.activeMenu = url.split("/")[2]
        this.user.name = localStorage.getItem("name")
        this.user.email = localStorage.getItem("mail")
        //toma this.user.name y toma la primera letra de cada palabra y la convierte en mayuscula y la concatena
        this.nombre_recortato = this.user.name.split(" ").map((item) => item.charAt(0).toUpperCase()).join("");
        
        this.getWallet()
        this.fiatService.FiatUpdated$.subscribe(() => {
            setTimeout(() => {
                if(!this.estaAfuera){
                    this.consultaEstado = false;
                    this.getWallet()
                }
            },1000);
        })
        this.joinRoom();
        if(this.token){
            setInterval(() => {
                if(!this.estaAfuera){
                    this.consultaEstado = false;
                    this.getWallet();
                }
            }, 10000);
        }
        this.isMobileFunction();
        this.getCurrency()
        this.walletService.walletUpdated$.subscribe(() => {
            let moneda = localStorage.getItem("currency");
            this.currencySeleccionada = moneda;
            if(moneda == 'mxn'){
                this.bandera = 'https://flagcdn.com/mx.svg';
                this.monedaNumero = 7;
            }else if(moneda == 'usd'){
                this.monedaNumero = 8;
                this.bandera = 'https://flagcdn.com/us.svg';
            }
            this.getWallet();
        })
    }  

    getCurrency(){
        this.ServiceUser.getCurrencies({}).subscribe((response: any) => {
            if(response.ok && response.body.success == 1){
                //solo usa las monedas que short_name coincida con mxn y usd
                console.log('currencies', response.body.data);
                this.currencies = response.body.data.filter((item) => item.id == 7 || item.id == 8);
            }else{
                console.log('error al consultar las monedas', response);
            }
        },(error:any)=>{
            console.log('error al consultar las monedas', error);
        })
    }

    ngOnDestroy(){
        //deten el intervalo
        this.estaAfuera = true;
    }

    joinRoom(){
        let id = localStorage.getItem("user");
        this.Socket.emit('notificaciones', id);
    }
    cambiarIdioma(idioma: string) {
        this.languageSelectorService.changeLanguage(idioma);
    }
    getWallet(){
        if(!this.consultaEstado){
            this.ServiceUser.getWallet({moneda:this.monedaNumero}).subscribe((response: any) => {
                if(response.ok){
                    let data = response.body.data;
                    this.current_balanceMXN = data.current_balance ? data.current_balance : 0.00;
                    this.current_balanceBTC = response.body.crypto.btc ? response.body.crypto.btc : '0.00000000';
                    this.twincoinBalance = response.body.crypto.twincoin ? response.body.crypto.twincoin : '0.00000000';
                    this.twinBalance = response.body.crypto.twin ? response.body.crypto.twin : '0.00000000';
                    this.current_balanceETH = response.body.crypto.eth ? response.body.crypto.eth : '0.00000000';
                    this.current_balanceBNB = response.body.crypto.bnb ? response.body.crypto.bnb : '0.00000000';
                    this.current_balanceLTC = response.body.crypto.ltc ? response.body.crypto.ltc : '0.00000000';
                    localStorage.setItem("currentBalance", this.current_balanceMXN);
                }else{
                    Swal.fire({
                        title: "Error GW-01",
                        text: response.body.message,
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                }
            },(error:any)=>{
                console.log('error al consultar la wallet', error);
                this.loading = false;
            })
        }else{
            this.current_balanceMXN = localStorage.getItem("currentBalance");
        }
    }

    changeAccount(tipo){
        let cuenta = ""
        if(tipo == 'business'){
            cuenta = "empresarial"
        }else if(tipo == 'guest'){
            cuenta = "invitado"
        }else{
            cuenta = "personal"
        }
        Swal.fire({
            title: "Atención",
            text: "¿Desea cambiar a su cuenta "+cuenta+"?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                Swal.fire({
                    title: "Ooops!",
                    text: "Tenemos problemas para cambiar su cuenta, por favor intente más tarde",
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        })
    }
    goMenu(menu:string){
        if(menu == 'trading'){
            this.router.navigate(["usuario/trading"]);
        }else if(menu == 'fund'){
            this.router.navigate(["usuario/fund"]);
        }else if(menu == 'wallet'){
            this.router.navigate(["usuario/wallet"]);
        }else if(menu == 'lightning'){
            this.router.navigate(["usuario/lightning"]);
        }else if(menu == 'send'){
            this.router.navigate(["usuario/send"]);
        }else if(menu == 'redeem'){
            this.router.navigate(["usuario/redeem"]);
        }else if(menu == 'movements'){
            this.router.navigate(["usuario/movements"]);
        }else if(menu == 'code'){
            this.router.navigate(["usuario/code"]);
        }else if(menu == 'charge'){
            this.router.navigate(["usuario/charge"]);
        }else if(menu == 'payment'){
            this.router.navigate(["usuario/payment"]);
        }else if(menu == 'saving'){
            this.router.navigate(["usuario/saving"]);
        }else if(menu == 'remittance'){
            this.router.navigate(["usuario/remittance"]);
        }else if(menu == 'loan'){
            this.router.navigate(["usuario/loan"]);
        }else{
            this.router.navigate(["usuario/trading"]);
        }
        this.activeMenu = menu;
    }
    changeCryptoCurrency(currency:string){
        localStorage.setItem("cryptoCurrency", currency);
        let url = this.router.url
        let urlSplit = url.split("?")
        let urlParams = ""
        if(urlSplit.length > 1){
            urlParams = urlSplit[1]
        }
        this.monedaActiva = currency;
        this.router.navigate([urlSplit[0]], { queryParams: { currency: currency }, queryParamsHandling: 'merge', });
        if(currency != "mxn"){
            this.walletService.notifyUpdateWallet();
        }
    }

    isMobileFunction(){
        if(window.innerWidth < 768){
            this.isMobile = true;
        }else{
            this.isMobile = false;
        }
    }

    openModalProfile(){
        this.loading = true;
        this.ServiceUser.getprofileEdit({}).subscribe(async (response: any) => {
            if(response.ok){
                let data = response.body.data;
                //limpiamos "1996-11-18T06:00:00.000Z" a yyyy-mm-dd
                let fecha = new Date(data.birthdate);
                let dia = fecha.getDate();
                let mes = fecha.getMonth()+1;
                let anio = fecha.getFullYear();
                let fecha_nacimiento = anio+"-"+(mes < 10 ? "0"+mes : mes)+"-"+(dia < 10 ? "0"+dia : dia);
                data.birthdate = fecha_nacimiento;
                this.userData = {
                    nombre: data.name,
                    apellidos: data.last_name,
                    genero: data.gender,
                    oficio: data.profession,
                    fecha_nacimiento: data.birthdate,
                    lada: data.phone_code,
                    telefono: data.phone,
                    correo: data.email,
                    qr: data.qr
                }
                await this.getCountries();
                await this.getProfessions();
                this.loading = false;
                $("#profileModal").modal("show");
            }else{
                this.loading = false;
                Swal.fire({
                    title: "Error GP-01",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            }
        },(error:any)=>{
            this.loading = false;
            Swal.fire({
                title: "Error GP-02",
                text: error.message ? error.message : "Error desconocido, intente más tarde",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        })
    }
    editFirma(){
        $("#profileModal").modal("hide");
        this.router.navigate(["usuario/code"]);
    }
    changePassword(){
        //open swal with actual password, new password and confirm password
        $("#profileModal").modal("hide");
        Swal.fire({
            title: "Cambiar contraseña",
            html: `
                <div class="form-group">
                    <label for="actualPassword">Contraseña actual</label>
                    <input type="password" class="form-control" id="actualPassword" placeholder="Contraseña actual">
                </div>
                <div class="form-group mt-3">
                    <label for="newPassword">Nueva contraseña</label>
                    <input type="password" class="form-control" id="newPassword" placeholder="Nueva contraseña">
                </div>
                <div class="form-group mt-3">
                    <label for="newPasswordRepeat">Repetir Nueva contraseña</label>
                    <input type="password" class="form-control" id="newPasswordRepeat" placeholder="Repetir la nueva contraseña">
                </div>
                <div id="error-message" style="color:red; margin-top:10px; display:none;">
                    Las contraseñas no coinciden
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: "Cambiar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                let actualPassword = $("#actualPassword").val();
                let newPassword = $("#newPassword").val();
                let newPasswordRepeat = $("#newPasswordRepeat").val();
                
                // Verificamos si las contraseñas coinciden
                if (newPassword !== newPasswordRepeat) {
                    // Mostramos el mensaje de error sin cerrar el modal
                    $("#error-message").show();
                    return false; // Evitamos que Swal se cierre
                } else {
                    // Si todo está bien, ocultamos el mensaje de error
                    $("#error-message").hide();
                    // Retornamos los valores para que Swal los capture
                    return { actualPassword: actualPassword, newPassword: newPassword };
                }
            }
        }).then((result) => {
            if (result.value) {
                this.loading = true;
                this.ServiceUser.changePasswordFromProfile({pass: result.value.actualPassword, newpass: result.value.newPassword}).subscribe((response: any) => {
                    console.log('response pass', response);
                    if(response.ok){
                        this.loading = false;
                        if(response.body.success == 1){
                            Swal.fire({
                                title: "Contraseña cambiada",
                                text: response.body.message,
                                icon: "success",
                                confirmButtonText: "Entendido",
                            });
                        }else{
                            Swal.fire({
                                title: "Error CP-01",
                                text: response.body.message,
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                            $("#profileModal").modal("show");
                        }
                    }else{
                        this.loading = false;
                        Swal.fire({
                            title: "Error CP-01",
                            text: response.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                        $("#profileModal").modal("show");
                    }
                },(error:any)=>{
                    console.log('error al cambiar la contraseña', error);
                    this.loading = false;
                    Swal.fire({
                        title: "Error CP-02",
                        text: error.message ? error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                    $("#profileModal").modal("show");
                })
            }else{
                $("#profileModal").modal("show");
            }
        })
        
    }
    selectOption(option: string){
        if(this.optionSelected == option){
            this.optionSelected = "";
        }else{
            this.optionSelected = option;
        }
    }
    async getCountries(){
        this.loading = true;
        this.ServiceCliente.getCountries({}).subscribe((response) => {
            this.loading = false;
            if(response.ok){
                this.countries = response.body.data;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error) => {
            this.loading = false;
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
                confirmButtonText: 'Entendido'
            })
        })
    }
    async getProfessions(){
        this.loading = true;
        this.ServiceCliente.getProfessions({}).subscribe((response) => {
            this.loading = false;
            if(response.ok){
                this.professions = response.body.data;
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error) => {
            this.loading = false;
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
                confirmButtonText: 'Entendido'
            })
        })
    }
    guardarCambios(){
        $("#profileModal").modal("hide");
        Swal.fire({
            title: "Atención",
            text: "¿Desea guardar los cambios?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No",
        }).then((result) => {
            if (result.value) {
                this.loading = true;
                let data = {
                    name: this.userData.nombre,
                    last_name: this.userData.apellidos,
                    gender: this.userData.genero,
                    profession: this.userData.oficio,
                    birthdate: this.userData.fecha_nacimiento,
                    phone_code: this.userData.lada,
                    phone: this.userData.telefono,
                    email: this.userData.correo
                }
                this.ServiceUser.updateProfile(data).subscribe((response: any) => {
                    console.log('response update profile', response);
                    if(response.ok){
                        this.loading = false;
                        if(response.body.success == 1){
                            Swal.fire({
                                title: "Cambios guardados",
                                text: response.body.message,
                                icon: "success",
                                confirmButtonText: "Entendido",
                            });
                        }else{
                            Swal.fire({
                                title: "Error GP-01",
                                text: response.body.message,
                                icon: "error",
                                confirmButtonText: "Entendido",
                                timer: 2000
                            });
                            $("#profileModal").modal("show");
                        }
                    }else{
                        this.loading = false;
                        Swal.fire({
                            title: "Error GP-01",
                            text: response.body.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                            timer: 2000
                        });
                        $("#profileModal").modal("show");
                    }
                },(error:any)=>{
                    console.log('error al guardar los cambios 2', error);
                    this.loading = false;
                    Swal.fire({
                        title: "Error GP-02",
                        text: error.message ? error.message : "Error desconocido, intente más tarde",
                        icon: "error",
                        confirmButtonText: "Entendido",
                        timer: 2000
                    });
                    $("#profileModal").modal("show");
                })
            }else{
                $("#profileModal").modal("show");
            }
        });
    }
    TwinBank(){
        console.log('showTwinBank', this.showTwinBank);
        this.showTwinBank = !this.showTwinBank;
    }
}