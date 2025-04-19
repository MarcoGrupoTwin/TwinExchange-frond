import { Router, ActivatedRoute } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";

declare var TradingView: any;

@Component({
    selector: "app-list",
    templateUrl: "template.html",
    styleUrls: ["style.scss"]
})

export class ListComponent implements OnInit {
    public ejecutarKYC: boolean = false;
    public ejecutarFirma: boolean = false;
    public userData:Array<any> = [{
        nombre: "Juan",
        apellido: "Perez",
        email: "correo@juan.com"
    }];

    constructor( 
        private router: Router,
        private ActivatedRoute: ActivatedRoute
    ){
    }

    async ngOnInit(){
        //ve si está declarado kyc en la url como parametro con router
        await this.ActivatedRoute.params.subscribe(async params => {
            if(params["kyc"] && params["kyc"] == 1){
                this.ejecutarKYC = true
            }
            if(params["firma"] && params["firma"] == 1){
                this.ejecutarFirma = true
            }
        })
        
        new TradingView.widget({
            "autosize": true,
            "symbol": "BITSTAMP:BTCUSD",
            "interval": "1",
            "timezone": "exchange",
            "theme": "light",
            "style": "1",
            "locale": "es",
            "enable_publishing": false,
            "backgroundColor": "rgba(255, 255, 255, 1)",
            "allow_symbol_change": true,
            "container_id": "tradingview_f7511"
          });
    }
    manejarKYCCompletado(evento){
        console.log('Se completo el KYC:',evento)
    }
    manejarFirmaCompletada(evento){
        console.log('Se completo la firma:',evento)
    }
}