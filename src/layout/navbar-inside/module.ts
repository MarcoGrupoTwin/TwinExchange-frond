// module-navbar.module.ts
import { NgModule, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { URL_WS } from "src/app/variables";

import { ComponentNavbar } from "./component";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { LanguageSelectorService } from "src/shared/services/translate";

const config: SocketIoConfig = { url: URL_WS, options: {} };

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}

@NgModule({
    imports: [ 
        RouterModule, 
        CommonModule,
        TranslateModule.forChild({ // Usa "forChild" ya que ya se usa "forRoot" en AppModule
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        }),
        SocketIoModule.forRoot(config),
    ],
    declarations: [ 
        ComponentNavbar 
    ],
    exports: [ 
        ComponentNavbar 
    ],
    providers: [
    ]
})

export class ModuleNavbar implements OnDestroy {
    private languageSubscription: Subscription;

    constructor(private languageService: LanguageSelectorService) {
        // Suscribirse al evento de cambio de idioma
        this.languageSubscription = this.languageService.languageChanged.subscribe(() => {
            this.languageService.changeLanguage(this.languageService.getSelectedLanguage());
        });
    }
    ngOnDestroy() {
        // Desuscribirse al destruir el módulo
        this.languageSubscription.unsubscribe();
    }
}