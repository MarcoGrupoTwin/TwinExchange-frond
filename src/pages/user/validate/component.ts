import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";
import {Service as ServiceUser} from "src/pages/user/module/service";
import Swal from "sweetalert2";

declare var $: any;

@Component({
    selector:"app-view",
    templateUrl:"template.html",
    styleUrls: ['./style.scss'],
})

export class IndexComponent implements OnInit {
    public disabledButton: boolean = true;
    public name: string = "";
    public email: string = "";
    public token: string = "";
    constructor(
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private ServiceUser: ServiceUser,
    ){

    }

    ngOnInit(){
        this.ActivatedRoute.queryParams.subscribe((params) => {
            if(params["a"] && params["t"]){
                let data = {
                    a: params["a"],
                    t: params["t"],
                }
                if(data.a == "rp"){
                    this.ServiceUser.changePassword(data).subscribe((response:any)=>{
                        if(response.body.success == 1){
                            this.disabledButton = false;
                            this.name = response.body.name;
                            this.email = response.body.email;
                            this.token = params["t"];
                        }else{
                            Swal.fire({
                                title: "Error",
                                text: response.body.message,
                                icon: "error",
                                confirmButtonText: "Entendido",
                            });
                            this.router.navigate(["usuario/index"]);
                        }
                    },(error)=>{
                        Swal.fire({
                            title: "Error",
                            text: error.error.message,
                            icon: "error",
                            confirmButtonText: "Entendido",
                        });
                        this.router.navigate(["usuario/index"]);
                    })
                }else{
                    this.router.navigate(["usuario/index"]);
                }
            }else{
                this.router.navigate(["usuario/index"]);
            }
        })
    }
    changePass(){
        if(!this.disabledButton){
            this.disabledButton = true;
            let password = $("#firstPass").val();
            let repeatPassword = $("#secondPass").val();
            if(password == "" || repeatPassword == ""){
                Swal.fire({
                    title: "Error",
                    text: "Todos los campos son obligatorios",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return;
            }
            if(password != repeatPassword){
                Swal.fire({
                    title: "Error",
                    text: "Las contraseñas no coinciden",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                return;
            }
            let data = {
                password: password,
                repeatPassword: repeatPassword,
                name: this.name,
                email: this.email,
                t: this.token,
            }
            this.ServiceUser.changePass(data).subscribe((response:any)=>{
                if(response.body.success == 1){
                    Swal.fire({
                        title: "Exito",
                        text: response.body.message,
                        icon: "success",
                        confirmButtonText: "Entendido",
                    });
                    this.router.navigate(["usuario/index"]);
                }else{
                    Swal.fire({
                        title: "Error",
                        text: response.body.message,
                        icon: "error",
                        confirmButtonText: "Entendido",
                    });
                    this.disabledButton = false;
                }
            },(error)=>{
                Swal.fire({
                    title: "Error",
                    text: error.error.message,
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
                this.disabledButton = false;
            })
            
        }else{
            Swal.fire({
                title: "Error",
                text: "No se puede cambiar la contraseña",
                icon: "error",
                confirmButtonText: "Entendido",
            });
        }
    }
}