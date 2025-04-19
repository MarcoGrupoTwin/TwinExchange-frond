import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { FooterComponent } from "./component";

@NgModule({
    imports: [ 
        RouterModule, 
        CommonModule,
        TranslateModule
    ],
    declarations: [ 
        FooterComponent 
    ],
    exports: [ 
        FooterComponent 
    ]
})

export class ModuleFooter {}
