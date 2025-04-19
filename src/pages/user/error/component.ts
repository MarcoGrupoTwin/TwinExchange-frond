import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LanguageSelectorService } from "src/shared/services/translate";

declare var $:any;
declare var swal:any;

@Component({
    selector:"app-view",
    templateUrl:"template.html"
})

export class ViewComponent implements OnInit {
    constructor(
        private router: Router,
        public languageSelectorService: LanguageSelectorService
    ){
    }

    ngOnInit(){
        const storedLanguage = this.languageSelectorService.getSelectedLanguage();
        this.languageSelectorService.changeLanguage(storedLanguage);
    }
    goto(){
        this.router.navigate(["usuario/index"])
    }

}