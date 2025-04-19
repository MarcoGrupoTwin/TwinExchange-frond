import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";

import { ComponentNavbar } from "./component";

@NgModule({
	imports: [
		RouterModule,
		CommonModule,
		TranslateModule,
	],
	declarations: [
		ComponentNavbar
	],
	exports: [ 
		ComponentNavbar 
	]
})

export class ModuleNavbar { }
