import { Component, OnInit, Renderer2 } from "@angular/core";
import { Router, ActivatedRoute, RouterModule } from "@angular/router";

declare var $: any;
@Component({
    selector:"app-view",
    templateUrl:"template.html",
    styleUrls: ['./style.scss'],
})

export class IndexComponent implements OnInit {

    constructor(
        private router: Router,
        private ActivatedRoute: ActivatedRoute,
    ){

    }

    ngOnInit(){
        
    }

}