import { filter } from "rxjs/operators";
import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";

declare var $: any;

@Component({
    selector: "app-layout",
    templateUrl: "./template.html"
})

export class ComponentLayout implements OnInit {
    constructor( 
    ) {
    }

    ngOnInit() {
    }
}