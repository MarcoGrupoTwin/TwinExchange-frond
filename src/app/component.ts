import { Component } from '@angular/core';
import { TranslateService } from "@ngx-translate/core";
import { NavigationEnd, Router } from '@angular/router';
import { filter } from "rxjs/operators";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
	public nav_end_events:any = "";
	// public gtag:any = "";

  	constructor(
		private TranslateService: TranslateService,
		public Router:Router
	) { }
}
