import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { BrowserModule } from '@angular/platform-browser';
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClientModule, HttpClient } from "@angular/common/http";

import { ModuleNavbar as NavbarInside} from "src/layout/navbar-inside/module";
import { ModuleNavbar as NavbarOutFront} from "src/layout/navbar-outside-front/module"; //header principal
import { ModuleFooter as FooterInside } from "src/layout/footer-inside/module";
import { ModuleFooter as FooterOutside } from "src/layout/footer-outside/module";
import { ModuleFooter as FooterOutsideFront } from "src/layout/footer-outside-front/module";
import { ModuleNavbar as NavbarOutside } from "src/layout/navbar-outside/module";
import { ModuleSidebar as SidebarInside } from "src/layout/sidebar-inside/module";
import { environment } from '../environments/environment.prod';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

import { ComponentLayout as LayoutInside} from "../layout/layout-inside/component";
import { ComponentLayout as LayoutOutside } from "../layout/layout-outside/component";
import { ComponentLayout as LayoutInsideSales } from "../layout/layout-inside-sales/component";
import { ComponentLayout as LayoutOutSideFront } from "../layout/layout-outside-front/component";

import { AppComponent } from './component';
import { Routing } from "./routing";


@NgModule({
	declarations: [
		AppComponent,
		LayoutInside,
        LayoutOutside,
		LayoutInsideSales,
		LayoutOutSideFront,
	],
	imports: [
		provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
		FooterInside,
		FooterOutsideFront,
        NavbarInside,
		NavbarOutFront,
        NavbarOutside,
        FooterOutside,
        SidebarInside,

		FormsModule,
		BrowserModule,
		HttpClientModule,
        RouterModule.forRoot(Routing,{ useHash: false }),
		TranslateModule.forRoot({
            loader: {
                deps: [ HttpClient ],
                provide: TranslateLoader,
                useFactory: (FactoryTranslateLoader),
            }
		}),
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }

export function FactoryTranslateLoader(http: HttpClient) {
	return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
