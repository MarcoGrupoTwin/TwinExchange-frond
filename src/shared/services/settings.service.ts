import { Injectable } from "@angular/core";
import { Service as ServiceAPI } from "./api.service";

@Injectable({ providedIn: "root" })
export class Service {

	constructor(
			public ServiceAPI: ServiceAPI,
	) { }

	getListLanguage(data){ 
		(!data.recursive)? data.recursive = true : false;
		data.url = "catalog_language/application/get_list.php";
		return this.ServiceAPI.get(data);
	}

	getListFormatDate(data){ 
		(!data.recursive)? data.recursive = true : false;
		data.url = "catalog_format_date/application/get_list.php";
		return this.ServiceAPI.get(data);
	}
	
	getListFormatNumber(data){ 
		(!data.recursive)? data.recursive = true : false;
		data.url = "catalog_format_number/application/get_list.php";
		return this.ServiceAPI.get(data);
	}
}