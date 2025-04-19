import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import {Service as ServiceUser} from "src/pages/user/module/service"; 
import Swal from "sweetalert2";

declare var $: any;
@Component({
    templateUrl: "template.html",
    selector: "component-navbar-inside",
    styleUrls: ["style.scss"]
})

export class ComponentNavbar implements OnInit {
    public loading:boolean = false;

    constructor(
        private router: Router,
        private ServiceUser: ServiceUser,
    ) {
    }
    async ngOnInit(){
    }
    openSidebar() {
        $("#sidebar").animate({ left: "0" }, 200); // 500 es la duración en milisegundos
    }
      
    closeSidebar() {
        $("#sidebar").animate({ left: "-250px" }, 200);
    }
    signOut(){
        this.loading = true;
        this.ServiceUser.logout({}).subscribe((response:any)=>{
            this.loading = false;
            if(response.ok){
                //elimina todos los elementos de localstorage
                localStorage.clear();
                this.router.navigate(["usuario/index"]);
            }else{
                Swal.fire({
                    title: "Error",
                    text: response.body.message,
                    icon: "error",
                    confirmButtonText: "Ok",
                });
            }
        },(error:any)=>{
            this.loading = false;
            Swal.fire({
                title: "Error",
                text: "Error de conexión",
                icon: "error",
                confirmButtonText: "Ok",
            });
        })
    }
    backAnyPage(){
        window.history.back();
    }
}