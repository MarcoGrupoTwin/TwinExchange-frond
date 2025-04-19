import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';

import { ComponentSidebar } from "./component";

import { Service as ServiceSupportUser } from "src/pages/user/module/service";
import { Service as ServiceProduct } from "src/pages/cliente/module/service";
import{ ComponentKYC } from "src/shared/components/kyc/component";

import { ComponentTwinBank } from "src/shared/components/twin-bank/component";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    imports: [ 
        RouterModule, 
        CommonModule, 
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        })
    ],
    declarations: [ 
        ComponentSidebar,
        ComponentTwinBank,
    ],
    exports: [ 
        ComponentSidebar,
    ],
    providers: [
        ServiceProduct,
        ServiceSupportUser
    ]
})

export class ModuleSidebar {}
