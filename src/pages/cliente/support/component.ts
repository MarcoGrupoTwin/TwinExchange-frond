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
    
    public faqs:any = [];
    public filteredFaqs:any = [];

    constructor( 
        private ActivatedRoute: ActivatedRoute,
        private service: ServiceUser
    ){
    }

    async ngOnInit(){
        this.service.getFaqs({}).subscribe((res:any) => {
            console.log(res);
            if(res.body.success == 1 && res.ok){
                this.faqs = res.body.data;
                this.filteredFaqs = [...this.faqs];
            }else{
                Swal.fire("Error", "Ocurrió un error al cargar las preguntas frecuentes", "error");
            }
        }, (error) => {
            Swal.fire("Error", "Ocurrió un error al cargar las preguntas frecuentes", "error");
        })
    }

    buscarPregunta(event:any){
        const query = event.target.value.toLowerCase().trim();
        if (query) {
        this.filteredFaqs = this.faqs.filter(faq => 
            faq.title.toLowerCase().includes(query) || 
            faq.content.toLowerCase().includes(query)
        );
        } else {
        this.filteredFaqs = [...this.faqs];  // Si está vacío, muestra todas
        }
    }
}