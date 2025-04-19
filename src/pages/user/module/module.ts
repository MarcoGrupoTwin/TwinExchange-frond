import { CUSTOM_ELEMENTS_SCHEMA,NgModule,OnDestroy} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { Utils } from "src/shared/classes/utils.class";
import { Service as ServiceSupportUser } from "./service";
import { Service as ServiceProduct } from "src/pages/cliente/module/service";
import { Service as ServiceSettings } from "src/shared/services/settings.service";

import { RoutingOutside, RoutingOutsideFront } from "./routing";
import { ViewComponent as LoginSupportUser } from "../login/component";
import { ViewComponent as Error } from "../error/component";
import { IndexComponent as ViewIndex } from "../index/component";
import { LanguageSelectorService } from "src/shared/services/translate";

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    imports: [
       
    ],
    declarations: [

    ],
    providers: [

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class Module {} //no se usa

@NgModule({
    imports: [
        
    ],
    declarations: [

    ],
    providers: [

    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ModuleOutside {} //no se usa

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule.forChild({ // Usa "forChild" ya que ya se usa "forRoot" en AppModule
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        }),
        RouterModule.forChild(RoutingOutsideFront),
    ],
    declarations: [
        ViewIndex,
        Error,
    ],
    providers: [
        Utils,
        ServiceSettings,
        ServiceSupportUser,
        ServiceProduct
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ModuleOutsideSide implements OnDestroy{
    private languageSubscription: Subscription;

    constructor(private languageService: LanguageSelectorService) {
        // Suscribirse al evento de cambio de idioma
        this.languageSubscription = this.languageService.languageChanged.subscribe(() => {
            
        });
    }
    
    ngOnDestroy() {
        // Desuscribirse al destruir el módulo
        this.languageSubscription.unsubscribe();
    }
}
