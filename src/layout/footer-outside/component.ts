import { Component } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Component({
    templateUrl: "template.html",
    selector: "component-footer-outside",
})

export class FooterComponent{
    public date : Date = new Date();

    constructor( 
        private TranslateService: TranslateService 
    ) {

    }
}