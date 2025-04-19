import { Injectable } from "@angular/core";
import { Row } from "src/shared/classes/row.class";
import { Filters } from "src/shared/classes/table.class";
import { Service as ServiceAPI } from "src/shared/services/api.service";

@Injectable()
export class Service {
	public token:any;
	public authenticated:any = false;
	public path_user:string = "user/";
	public path_catalogs:string = "catalogs/";
    public path_authentication:string = "auth/";

	constructor(
		public ServiceAPI: ServiceAPI
	) {	}

	signUp(data) { data.url = this.path_authentication + "sign-up"; return this.ServiceAPI.post(data); }
	login(data) { data.url = this.path_authentication + "login"; return this.ServiceAPI.post(data); }
    loginSocials(data) { data.url = this.path_authentication + "login/social"; return this.ServiceAPI.get(data); }
	checkToken(data) { data.url = this.path_authentication + "checkToken"; return this.ServiceAPI.post(data); }
    checkFirma(data) { data.url = this.path_authentication + "check-firma"; return this.ServiceAPI.get(data); }
	forgotPassword(data) { data.url = this.path_authentication + "forgot-password"; return this.ServiceAPI.post(data); }
    changePassword(data) { data.url = this.path_authentication + "change-password"; return this.ServiceAPI.get(data); }
    changePass(data) { data.url = this.path_authentication + "change-password"; return this.ServiceAPI.post(data); }
    setCode(data) { data.url = this.path_authentication + "code"; return this.ServiceAPI.put(data); }
    validaCodigoTelefono(data) { data.url = this.path_authentication + "valida/codigo/telefono"; return this.ServiceAPI.post(data); }
    sendNewPhoneCode(data) { data.url = this.path_authentication + "envia/codigo/telefono"; return this.ServiceAPI.post(data); }
    getCountries(data) { data.url = this.path_catalogs + "countries"; return this.ServiceAPI.get(data); }
    getProfessions(data) { data.url = this.path_catalogs + "professions"; return this.ServiceAPI.get(data); }

	logout(data){
        data.url = this.path_authentication + "logout";
        return this.ServiceAPI.post(data);
	}

	setToken(token: string): void {
		this.token = token;
		localStorage.setItem("token", token);
	}
 
    getToken() {
		this.token = localStorage.getItem("token");
		return this.token;
	}

    signIn(data: any) {
		this.authenticated = true;
		localStorage.setItem("login_status", "true");

		for(var index in data){
			// console.log(index + ": " + data[index]);
			localStorage.setItem(index, data[index]);
		} 
	}
}

export interface FiltersUser extends Filters {
    support_user_id?: number;
	user_id?: any;
}

export class User extends Row {
    constructor(){
        super();
    }

    public override init(){
        super.init();
        this.data = {
			user: {},
			pages: {},
			answer_supplier: {},
			form: {},
			product_variation_list: {},
			product_data: {},
			product_variant_dataa: {
				summary: {},
				list: [],
			},
			product: {
				product_variation_list_edit: [],
				product_variation:[],
				product_variation_list:[],
				product_variation_list_preview:[],
				table_list:[],
				images: [],

			},
			image: {},
            pager: {
                next: 0,
                previous:0
            }
        };
    }
}


export interface FiltersSupportUser extends Filters {
    support_user_id?: number;
}

export class SupportUser extends Row {  
    constructor(){
        super();
    }

    public override init(){
        super.init();
        this.data = {
			support_user: {},
            support_user_data: {},
            support_user_settings: {},
            pager: {
                next: 0,
                previous:0
            }
        };
    }
}


export class Product extends Row {  
    constructor(){
        super();
    }

    public override init(){
        super.init();
        this.data = {
            product:{},
            pager:{
                next:0,
                previous:0
            }
        };
    }
}


export interface FiltersProduct extends Filters {
    partner_id?:number;
    store_id?:number;
    product_id?:number;
    product_category_id?:number;
    product_subcategory_id?:number;
    min_price?:string;
    max_price?:string;
}