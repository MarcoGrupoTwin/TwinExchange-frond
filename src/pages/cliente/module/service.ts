import { Injectable } from "@angular/core";
import { Row } from "src/shared/classes/row.class";
import { Filters } from "src/shared/classes/table.class";
import { Service as ServiceAPI } from "src/shared/services/api.service";

@Injectable()
export class Service {
	public token:any;
	public authenticated:any = false;
	public path_user:string = "user/";
	public path_wallet:string = "wallet/";
	public path_auth:string = "auth/";
	public path_crypto:string = "crypto/";
	public path_fiat:string = "fiat/";
	public path_savings:string = "savings/";
	public path_loans:string = "loans/";
	public path_catalogs:string = "catalogs/";
	public path_remesas:string = "remesas/";
	public path_trading:string = "trading/";

	constructor(
		public ServiceAPI: ServiceAPI
	) {	}

	getWallet(data){ data.url = this.path_wallet; return this.ServiceAPI.get(data); }
	getMovements(data){ data.url = this.path_wallet+"movements/"; return this.ServiceAPI.get(data); }
	saveCard(data){ data.url = this.path_wallet+'card/'; return this.ServiceAPI.post(data); }
	saveCardUSD(data){ data.url = this.path_wallet+'card/usd/'; return this.ServiceAPI.post(data); }
	getCards(data){ data.url = this.path_wallet+'card/'; return this.ServiceAPI.get(data); }
	deleteCardStripe(data){ data.url = this.path_wallet+'card'; return this.ServiceAPI.delete(data); }
	obtenCodigoFirma(data){ data.url = this.path_auth+'change-code'; return this.ServiceAPI.get(data); }
	validaCodigoFirma(data){ data.url = this.path_auth+'change-code'; return this.ServiceAPI.post(data); }
	cambiaCodigoFirma(data){ data.url = this.path_auth+'change-code'; return this.ServiceAPI.put(data); }
	setNewCode(data) { data.url = this.path_auth + "code"; return this.ServiceAPI.post(data); }
	fondearCuenta(data) { data.url = this.path_wallet + "fund"; return this.ServiceAPI.post(data); }
	searchUser(data) { data.url = this.path_user + "search-user"; return this.ServiceAPI.post(data); }
	getProfile(data){ data.url = this.path_user; return this.ServiceAPI.get(data); }
	getContacts(data){ data.url = this.path_user+'contacts'; return this.ServiceAPI.get(data); }
	getUserFromQr(data){ data.url = this.path_user+'user-from-qr'; return this.ServiceAPI.post(data); }
	getUserFromQrImage(data){ data.url = this.path_user+'user-from-qr-image'; return this.ServiceAPI.post(data); }
	sendMoney(data) { data.url = this.path_wallet + "send-money/"; return this.ServiceAPI.post(data); }
	retiroQr(data) { data.url = this.path_wallet + "retiro-qr/"; return this.ServiceAPI.post(data); }
	cobroRetiroQr(data) { data.url = this.path_wallet + "cobro-retiro-qr/"; return this.ServiceAPI.post(data); }
	consultaSaldoCobroRetiroQr(data) { data.url = this.path_wallet + "cobro-retiro-qr/"; return this.ServiceAPI.get(data); }
	getCryptoWallet(data){ data.url = this.path_crypto; return this.ServiceAPI.get(data); }
	crearWalletBTC(data){ data.url = this.path_crypto+'btc'; return this.ServiceAPI.post(data); }
	crearWalletETH(data){ data.url = this.path_crypto+'eth'; return this.ServiceAPI.post(data); }
	crearWalletTwinCoin(data){ data.url = this.path_crypto+'twincoin'; return this.ServiceAPI.post(data); }
	crearWalletTwin(data){ data.url = this.path_crypto+'twin'; return this.ServiceAPI.post(data); }
	crearWalletLtc(data){ data.url = this.path_crypto+'ltc'; return this.ServiceAPI.post(data); }
	crearWalletBnb(data){ data.url = this.path_crypto+'bnb'; return this.ServiceAPI.post(data); }
	downloadImage(data){ data.url = this.path_user+'download-image'; return this.ServiceAPI.post(data); }
	getQrCharge(data){ data.url = this.path_wallet+'qr-charge'; return this.ServiceAPI.post(data); }
	cancelQrCharge(data){ data.url = this.path_wallet+'qr-charge'; return this.ServiceAPI.delete(data); }
	pagarQrCharge(data){ data.url = this.path_wallet+'qr-charge'; return this.ServiceAPI.put(data); }
	
	//Twin
	mintTwin(data){ data.url = this.path_crypto + "mint/twin"; return this.ServiceAPI.post(data); }
	mintTwincoin(data){ data.url = this.path_crypto + "mint/twincoin"; return this.ServiceAPI.post(data); }
	consultarTipoCambio(data){ data.url = this.path_fiat + "tipo-cambio"; return this.ServiceAPI.get(data); }

	//twincoin
	sendTwincoin(data) { data.url = this.path_crypto + "twincoin/send/"; return this.ServiceAPI.put(data); }

	//swap
	swapCoins(data) { data.url = this.path_crypto + "swap"; return this.ServiceAPI.post(data); }
	consultarSwap(data) { data.url = this.path_crypto + "swap/price"; return this.ServiceAPI.post(data); }

	//savings
	getSavings(data) { data.url = this.path_savings; return this.ServiceAPI.get(data); }
	createSaving(data) { data.url = this.path_savings; return this.ServiceAPI.post(data); }
	getCongifSavings(data) { data.url = this.path_savings + "config"; return this.ServiceAPI.get(data); }
	realizarRetiroSaving(data) { data.url = this.path_savings + "retiro"; return this.ServiceAPI.post(data); }

	//loans
	getLoans(data) { data.url = this.path_loans; return this.ServiceAPI.get(data); }
	createLoan(data) { data.url = this.path_loans; return this.ServiceAPI.post(data); }
	getCongifLoans(data) { data.url = this.path_loans + "config"; return this.ServiceAPI.get(data); }
	realizarPagoLoan(data) { data.url = this.path_loans + "pago"; return this.ServiceAPI.post(data); }

	//Remesas
	getRemesas(data) { data.url = this.path_remesas; return this.ServiceAPI.get(data); }
	sendRemesa(data) { data.url = this.path_remesas; return this.ServiceAPI.post(data); }
	getRemesa(data) { data.url = this.path_remesas + 'getRemesa'; return this.ServiceAPI.post(data); }

	//perfil
	getprofileEdit(data) { data.url = this.path_user + "profile-edit"; return this.ServiceAPI.get(data); }
	changePasswordFromProfile(data) { data.url = this.path_user + "change-password"; return this.ServiceAPI.put(data); }
	updateProfile(data) { data.url = this.path_user + "profile"; return this.ServiceAPI.put(data); }
	validaKYC(data) { data.url = this.path_user + "kyc"; return this.ServiceAPI.post(data); }

	//catalogos
	getCurrencies(data) { data.url = this.path_catalogs + "coins"; return this.ServiceAPI.get(data); }
	getTwinBank(data) { data.url = this.path_catalogs + "twin-bank"; return this.ServiceAPI.get(data); }
	getFaqs(data) { data.url = this.path_catalogs + "faqs"; return this.ServiceAPI.get(data); }

	//trading
	gerOrders(data) { data.url = this.path_trading + 'order'; return this.ServiceAPI.get(data); }
	postOrder(data) { data.url = this.path_trading + 'order'; return this.ServiceAPI.post(data); }
	getOrder(data) { data.url = this.path_trading + 'order'; return this.ServiceAPI.get(data); }
	deleteOrder(data) { data.url = this.path_trading + 'order/'; return this.ServiceAPI.delete(data); }
	getOrderBook(data) { data.url = this.path_trading + 'order/book'; return this.ServiceAPI.get(data); }
	getMarketPrice(data) { data.url = this.path_trading + 'price'; return this.ServiceAPI.get(data); }
	getOrdersByUser(data) { data.url = this.path_trading + 'order/user'; return this.ServiceAPI.get(data); }
	getPriceCoin(data) { data.url = this.path_trading + 'price'; return this.ServiceAPI.get(data); }
	getOpenMarkets(data) { data.url = this.path_trading + 'open-markets'; return this.ServiceAPI.get(data); }

	logout(): void {
		localStorage.removeItem("token");
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
			localStorage.setItem(index, data[index]);
		} 
	}

    checkAuth() {
		this.authenticated = (localStorage.getItem("login_status") == "true")? true : false ;
		return this.authenticated;
	}
}

export interface FiltersProduct extends Filters {
    support_user_id?: number;
    user_id?: any;
}

export class Product extends Row {  
    constructor(){
        super();
    }

    public override init(){
        super.init();
        this.data = {
			support_user: {},
            support_user_data: {},
            support_user_settings: {},
			certification: {},
			project: {},
			product: {},
			form: {},
            pager: {
                next: 0,
                previous:0
            }
        };
    }
}