import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from "@angular/core";
import { Router } from "@angular/router";
import { error } from "console";
import {Service as ServiceUser} from "src/pages/user/module/service"; 
import Swal from "sweetalert2";
import { LanguageSelectorService } from "src/shared/services/translate";
import {URL_API} from "src/app/variables";
declare var $:any;

@Component({
    templateUrl: "template.html",
    selector: "component-navbar-inside-front",
    styleUrls: ["./style.scss"]
})

export class ComponentNavbar implements OnInit {
    public loading:boolean = false;
    public countries:any = [];
    public professions:any = [];
    public telefono:any = "";
    public lada:any = "";
    public ladaCode:any = "";
    public isLogin:boolean = false;
    @ViewChild('digitInputsThree') digitInputsThree!: ElementRef;

    constructor(
        public ServiceUser: ServiceUser,
        public renderer: Renderer2,
        public router: Router,
        public languageSelectorService: LanguageSelectorService
    ) {

    }

    ngOnInit(){
        if(this.router.url.includes("token")){
            let token = this.router.url.split("token=")[1];
            token = token.split("#")[0];
            this.isLogin = true;
            this.ServiceUser.loginSocials({token: token}).subscribe((response) => {
                if(response.ok){
                    localStorage.setItem("token", response.body.token);
                    localStorage.setItem("mail", response.body.email);
                    localStorage.setItem("name", response.body.name);
                    localStorage.setItem("user",response.body.uuid);
                    localStorage.setItem("kyc",response.body.kyc);
                    this.router.navigate(["usuario/trading"]);
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.body.message,
                        confirmButtonText: 'Entendido'
                    })
                }
            }, (error) => {
                console.log(error)
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: error.error.message,
                    confirmButtonText: 'Entendido'
                })
            })
        }
        if(this.router.url.includes("error")){
            if(this.router.url.includes("auth_failed")){
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'No se ha podido iniciar sesión, por favor intente de nuevo',
                    confirmButtonText: 'Entendido'
                })
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Ha ocurrido un error inesperado, contacte a soporte',
                    confirmButtonText: 'Entendido'
                })
            }
        }
        this.revisaToken();
        this.getCountries();
        this.getProfessions();
    }
    cambiarIdioma(idioma: string) {
        this.languageSelectorService.changeLanguage(idioma);
    }
    crearCuenta(){
        $("#crearCuenta").attr("disabled", "disabled");
        let countrie = $("#countrie").val()
        let nombre = $("#nombre").val()
        let apellido = $("#apellido").val()
        let celular = $("#celular").val()
        let password = $("#password").val()
        let repearpass = $("#repearpass").val()
        let fechaNac = $("#fechaNac").val()
        let genero = $("#genero").val()
        let email = $("#mail").val()
        let profesion = $("#profesion").val()
        if(nombre == "" || apellido == "" || celular == "" || password == "" || repearpass == "" || fechaNac == "" || genero == "" || profesion == "" || email == "" || countrie == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios!',
            })
            $("#crearCuenta").removeAttr("disabled");
            return false;
        }
        if(password != repearpass){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Las contraseñas no coinciden!',
            })
            $("#crearCuenta").removeAttr("disabled");
            return false;
        }
        if(isNaN(celular) || celular.length > 10 || celular.length < 7){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El celular debe ser numerico y tener 10 digitos maximo y 7 minimo!',
            })
            $("#crearCuenta").removeAttr("disabled");
            return false;
        }

        let data = {
            email: email,
            name: nombre,
            last_name: apellido,
            phone: celular,
            password: password,
            confirm_password: repearpass,
            birthdate: fechaNac,
            profession: profesion,
            countrieCode: this.ladaCode,
        }
        console.log('datos a procesar:',data)
        this.telefono = celular;

        this.loading = true;
        this.ServiceUser.signUp(data).subscribe((response) => {
            this.loading = false;
            if(response.ok){
                $("#staticBackdrop").modal("show");
            }else{
                $("#crearCuenta").removeAttr("disabled");
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error) => {
            $("#crearCuenta").removeAttr("disabled");
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
    showPassToggle(){
        let input = $("#password");
        let input2 = $("#repearpass");
        if(input.attr("type") == "password"){
            input.attr("type", "text");
        }else{
            input.attr("type", "password");
        }
        if(input2.attr("type") == "password"){
            input2.attr("type", "text");
        }else{
            input2.attr("type", "password");
        }
    }
    showPassToggleS(){
        let input = $("#passwordLogin");
        if(input.attr("type") == "password"){
            input.attr("type", "text");
        }else{
            input.attr("type", "password");
        }
    }
    iniciarSesion(){
        let mailLogin = $("#mailLogin").val()
        let passwordLogin = $("#passwordLogin").val()
        if(mailLogin == "" || passwordLogin == ""){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Todos los campos son obligatorios!',
            })
        }
        let data = {
            email: mailLogin,
            password: passwordLogin,
        }
        this.loading = true;
        this.ServiceUser.login(data).subscribe((response) => {
            this.loading = false;
            console.log('respuesta del login:',response)
            if(response.ok){
                if(response.body.code == 22){
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: '¡Por favor confirma tu teléfono con el código que te enviamos!',
                        confirmButtonText: 'Entendido'
                    })
                    this.telefono = response.body.phone;
                    this.lada = response.body.phonecode;
                    this.sendNewCode();
                    $("#staticBackdrop").modal("show");
                }else{
                    // localStorage.clear();
                    localStorage.setItem("token", response.body.token);
                    localStorage.setItem("mail", response.body.email);
                    localStorage.setItem("name", response.body.name);
                    localStorage.setItem("user",response.body.uuid);
                    localStorage.setItem("kyc",response.body.kyc);
                    this.router.navigate(["usuario/trading"]);
                }
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
    revisaToken(){
        let token = localStorage.getItem("token");
        if(token != null){
            this.loading = true;
            this.ServiceUser.checkToken({}).subscribe((response) => {
                this.loading = false;
                if(response.ok){
                    localStorage.setItem("token", response.token);
                    this.router.navigate(["usuario/trading"], { queryParams: { kyc: 1 }, queryParamsHandling: 'merge', });
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: response.body.message,
                        confirmButtonText: 'Entendido'
                    })
                    //localStorage.removeItem("token");
                }
            })
        }
    }
    forgotPassword(){
        Swal.fire({
            title: 'Ingrese su correo',
            input: 'email',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            showLoaderOnConfirm: true,
            preConfirm: (login) => {
                let data = {
                    email: login,
                }
                this.loading = true;
                this.ServiceUser.forgotPassword(data).subscribe((response) => {
                    this.loading = false;
                    if(response.ok){
                        Swal.fire({
                            icon: 'success',
                            title: 'Correo enviado con exito!',
                            text: 'Revise su correo para recuperar su contraseña',
                            confirmButtonText: 'Entendido'
                        })
                    }else{
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: response.body.message,
                            confirmButtonText: 'Entendido'
                        })
                    }
                }, (error) => {
                    console.log(error)
                    this.loading = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.error.message,
                        confirmButtonText: 'Entendido'
                    })
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
          })
    }
    getCountries(){
        this.loading = true;
        this.ServiceUser.getCountries({}).subscribe((response) => {
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
    getProfessions(){
        this.loading = true;
        this.ServiceUser.getProfessions({}).subscribe((response) => {
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
    validarTelefono(){
        const Actual = this.digitInputsThree.nativeElement.querySelectorAll('.firmaInputThree');
        const ActualArray = Array.from(Actual).map((input: HTMLInputElement) => input.value);
        //valida que sea un código de 6 dígitos
        let telefono = ActualArray.join("");
        if(telefono.length != 6){
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El código debe ser de 6 dígitos!',
            })
            return false;
        }
        let data = {
            phone: this.telefono,
            code: telefono,
        }

        this.ServiceUser.validaCodigoTelefono(data).subscribe((response:any) => {
            if(response.ok){
                Swal.fire({
                    icon: 'success',
                    title: '¡Cuenta creada con éxito!',
                    text: response.body.message,
                    confirmButtonText: 'Entendido',
                    timer: 2000
                })
                $("#staticBackdrop").modal("hide");
                $("#crearCuenta").removeAttr("disabled");
                localStorage.setItem("token", response.body.token);
                localStorage.setItem("mail", response.body.email);
                localStorage.setItem("name", response.body.name);
                localStorage.setItem("kyc",response.body.kyc);
                this.router.navigate(["usuario/trading"], { queryParams: { firma: 1 }, queryParamsHandling: 'merge', });
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error) => {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
                confirmButtonText: 'Entendido'
            })
        })
    }
    getPhoneCode(event:Event){
        //obten el data-code del select
        const selectElement = event.target as HTMLSelectElement;
        const selectedOption = selectElement.options[selectElement.selectedIndex];
        this.lada = selectedOption.getAttribute('data-code');
        console.log('el elegindo bro:',this.lada)
        //Selecciona el valor del select
        this.ladaCode = selectElement.value;
        console.log('el elegindo bro:',this.ladaCode)
    }
    sendNewCode(){
        console.log('enviando nuevo codigo')
        let data = {
            phone: this.telefono,
            code: this.lada,
        }
        this.ServiceUser.sendNewPhoneCode(data).subscribe((response) => {
            console.log('respuesta al enviar el código:',response)
            if(response.ok){
                // Swal.fire({
                //     icon: 'success',
                //     title: 'Código enviado con exito!',
                //     text: response.body.message,
                //     confirmButtonText: 'Entendido'
                // })
            }else{
                this.isLogin = true;
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: response.body.message,
                    confirmButtonText: 'Entendido'
                })
            }
        }, (error) => {
            this.isLogin = true;
            console.log('al enviar el código:',error)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: error.error.message,
                confirmButtonText: 'Entendido'
            })
        })
    }
    crearCuentaSocial(red:string){
        if(red == "facebook"){
            window.location.href = URL_API + "auth/facebook";
        }else if(red == "google"){
            window.location.href = URL_API + "auth/google";
        }else{
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se ha podido iniciar sesión',
                confirmButtonText: 'Entendido'
            })
        }
    }
}