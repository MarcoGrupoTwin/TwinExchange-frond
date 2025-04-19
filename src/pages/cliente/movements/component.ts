import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import {Service as ServiceUser} from "src/pages/cliente/module/service";
import Swal from "sweetalert2";;

@Component({
    selector: "app-list",
    templateUrl: "template.html",
    styleUrls: ["style.scss"]
})

export class ListComponent implements OnInit {
    public sendPay:number = 1;
    public movements:any = [];
    public loading:boolean = false;
    public categoria:any = 'fondeos';
    public moneda:any = 'MXN';

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
        private service: ServiceUser
    ){
    }

    async ngOnInit(){
        this.ActivatedRoute.queryParams.subscribe(async params => {
            if(params["currency"]){
                if(params["currency"] == "mxn"){
                    this.moneda = "MXN";   
                }else if(params["currency"] == "twin"){
                    this.moneda = "TWIN";
                }else if(params["currency"] == "btc"){
                    this.moneda = "BTC";
                }else if(params["currency"] == "eth"){
                    this.moneda = "ETH";
                }else if(params["currency"] == "ltc"){
                    this.moneda = "LTC";
                }else if(params["currency"] == "twincoin"){
                    this.moneda = "TWINCOIN";
                }else if(params["currency"] == "bnb"){
                    this.moneda = "BNB";
                }else{
                    this.moneda = "MXN"
                }
            }
        })
        this.getMovements();
    }

    getMovements(){
        this.loading = true;
        let data = {
            categoria: this.categoria,
            moneda: this.moneda
        }
        this.service.getMovements(data).subscribe((response: any) => {
            this.loading = false;
            if(response.ok){
                console.log('movimientos:',response.body.data);
                this.movements = response.body.data;
            }else{
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al obtener los movimientos",
                    icon: "error",
                    confirmButtonText: "Aceptar"
                });
            }
        }, (error) => {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al obtener los movimientos",
                icon: "error",
                confirmButtonText: "Aceptar"
            });
        })
    }
    onchangeButton(adonde:any){
        this.categoria = adonde;
        this.movements = [];
        this.getMovements();
    }
    getStripeIdSuffix(stripeId:any){
        if (!stripeId) return '';
        const parts = stripeId.split('_');
        return parts.length > 1 ? parts[1] : stripeId;
    }
}