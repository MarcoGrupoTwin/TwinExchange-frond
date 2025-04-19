import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { URL_WS } from "src/app/variables";

import { ComponentNavbar } from "./component";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { Service as ServiceProduct } from "src/pages/user/module/service";
import { Service as ServiceSupportUser } from "src/pages/user/module/service";

import { Utils } from "src/shared/classes/utils.class";

const config: SocketIoConfig = { url: URL_WS, options: {} };

@NgModule({
    imports: [ 
        RouterModule, 
        CommonModule,
        TranslateModule,
        SocketIoModule.forRoot(config),
    ],
    declarations: [ 
        ComponentNavbar 
    ],
    exports: [ 
        ComponentNavbar 
    ],
    providers: [
        ServiceSupportUser,
        ServiceProduct,
        Utils,
    ]
})

export class ModuleNavbar {}
