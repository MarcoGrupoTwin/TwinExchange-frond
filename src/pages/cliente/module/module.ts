import { CUSTOM_ELEMENTS_SCHEMA,NgModule,OnDestroy} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CommonModule, CurrencyPipe } from "@angular/common";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

import { Utils } from "src/shared/classes/utils.class";
import { Service as ServiceSupportUser } from "src/pages/user/module/service";
import { Service as ServiceSettings } from "src/shared/services/settings.service";
import { Service as ServiceProduct } from "src/pages/cliente/module/service";
import { LanguageSelectorService } from "src/shared/services/translate";

import { Routing, RoutingSales } from "./routing";
import { ListComponent as IndexCliente } from "../index/component";
import { ListComponent as Lightning } from "../lightning/component";
import { ListComponent as Send } from "../send/component";
import { ListComponent as Wallet } from "../wallet/component";
import { ListComponent as Payment } from "../payment/component";
import { ListComponent as Charge } from "../charge/component";
import { ListComponent as Movements } from "../movements/component";
import { ListComponent as Support } from "../support/component";
import { ListComponent as Code } from "../code/component";
import { ListComponent as Saving } from "../saving/component";
import { ListComponent as Loans } from "../loan/component";
import { ListComponent as Remittance } from "../remittance/component";
import { ListComponent as Redeem } from "../redeem/component";
import { ListComponent as Fund } from "../fund/component";
import { URL_WS, COINBASE_WS } from "src/app/variables";

import { NgxDropzoneModule } from 'ngx-dropzone';
import { ColorPickerModule } from 'ngx-color-picker';

const config: SocketIoConfig = { url: URL_WS, options: {} };
const configGecko: SocketIoConfig = { url: COINBASE_WS, options: {} };

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
//componente
import{ ComponentCriptoList } from "src/shared/components/criptos-list/component";
import{ firmaDigital } from "src/shared/components/firma-digital/component";

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgxDropzoneModule,
        TranslateModule.forChild({ // Usa "forChild" ya que ya se usa "forRoot" en AppModule
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        }),
        InfiniteScrollModule,
        ColorPickerModule,
        RouterModule.forChild(Routing),
        SocketIoModule.forRoot(config),
        ZXingScannerModule
    ],
    declarations: [
        IndexCliente,
        ComponentCriptoList,
        firmaDigital,
        Lightning,
        Send,
        Wallet,
        Movements,
        Support,
        Code,
        Redeem,
        Fund,
        Charge,
        Payment,
        Saving,
        Loans,
        Remittance
    ],
    providers: [
        CurrencyPipe,
        Utils,
        ServiceProduct,
        ServiceSettings,
        ServiceSupportUser
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Module implements OnDestroy{
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

@NgModule({
    imports: [
        FormsModule,
        CommonModule,
        NgxDropzoneModule,
        TranslateModule,
        InfiniteScrollModule,
        ColorPickerModule,
        RouterModule.forChild(Routing),
    ],
    declarations: [
        
    ],
    providers: [
        CurrencyPipe,
        Utils,
        ServiceProduct,
        ServiceSettings,
        ServiceSupportUser
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ModuleSales{}