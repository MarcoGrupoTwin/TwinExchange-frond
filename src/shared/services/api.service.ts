import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { delay, tap } from "rxjs/operators";

import { Config } from "src/app/config";
import { error } from "console";
@Injectable({ providedIn:"root" })
export class Service {
	public token:string = localStorage.getItem("token");
	public api_url:string = Config.api_url;
	public delay:number = 0;
	public full_path = undefined;
	public headers = new HttpHeaders(
		{
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + localStorage.getItem('token')
		}
	);

	constructor(
		public HttpClient:HttpClient,
		public router:Router
	) {	}

	getToken(){
	}

	getApiUrl(){
		return this.api_url;
	}
	
	get(data):any {
		let headers = new HttpHeaders(
			{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		);
		data.delay = (data.delay)? data.delay:this.delay;
		(!data.token)? data.token = localStorage.getItem("token"):false;
		data.full_url = (data.full_path == true)? data.url:this.api_url + data.url;
		this.full_path = (data.id == undefined) ? data.full_url : data.full_url + data.id;
		return this.HttpClient.get(this.full_path, { headers:headers, params: data, observe: 'response' } )
			.pipe(
				delay(data.delay),
				tap((response: HttpResponse<any>) => {
					const refreshToken = response.headers.get('refresh');
					if(refreshToken){
						//localStorage.removeItem("token");
						console.log('se venció la sesión:',refreshToken);
						localStorage.setItem("token", refreshToken);
					}
				},(error) => {
					if (error.status !== 401) {
						const refreshToken = error.headers.get('refresh');
						if (refreshToken) {
							//localStorage.removeItem("token");
							console.log('se venció la sesión:',refreshToken);
							localStorage.setItem("token", refreshToken);
						}
					}else{
						//localStorage.clear()
						this.router.navigate(["usuario/index"]);
					}
				})
			);
	}

	post(data, form_data?:boolean):any {
		let headers = new HttpHeaders(
			{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		);
		if(form_data == true){
			console.log(data);
			data.append("token", localStorage.getItem("token"));
			var full_url = (data.get("full_path") == true)? data.get("url"):this.api_url + data.get("url");
			return this.HttpClient.post(this.api_url + data.url, data).pipe(delay(this.delay));
		} else {
			var formData = new FormData();
			data.delay = (data.delay)? data.delay:this.delay;
			var full_url = (data.full_path == true)? data.url:this.api_url + data.url;
			(!data.token)? data.token = localStorage.getItem("token"):false;
			for (var i in data) { formData.append(i, data[i]); }
			return this.HttpClient.post(full_url, data, { headers:headers, observe: 'response' } )
				.pipe(
					delay(data.delay),
					tap((response: HttpResponse<any>) => {
						const refreshToken = response.headers.get('refresh');
						if(refreshToken){
							//localStorage.removeItem("token");
							console.log('se venció la sesión:',refreshToken);
							localStorage.setItem("token", refreshToken);
						}
					},(error) => {
						if (error.status !== 401) {
							const refreshToken = error.headers.get('refresh');
							if (refreshToken) {
								//localStorage.removeItem("token");
								console.log('se venció la sesión:',refreshToken);
								localStorage.setItem("token", refreshToken);
							}
						}else{
							localStorage.clear()
							this.router.navigate(["usuario/index"]);
						}
					})
				)
		}
	}
	delete(data, form_data?:boolean):any {
		let headers = new HttpHeaders(
			{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		);
		if(form_data == true){
			data.append("token", localStorage.getItem("token"));
			var full_url = (data.get("full_path") == true)? data.get("url"):this.api_url + data.get("url");
			return this.HttpClient.post(this.api_url + data.url, data).pipe(delay(this.delay));
		} else {
			var formData = new FormData();
			data.delay = (data.delay)? data.delay:this.delay;
			var full_url = (data.full_path == true)? data.url:this.api_url + data.url;
			(!data.token)? data.token = localStorage.getItem("token"):false;
			for (var i in data) { formData.append(i, data[i]); }
			return this.HttpClient.delete(full_url, { headers:headers, body:data, observe: 'response' } )
				.pipe(
					delay(data.delay),
					tap((response: HttpResponse<any>) => {
						const refreshToken = response.headers.get('refresh');
						if(refreshToken){
							//localStorage.removeItem("token");
							console.log('se venció la sesión:',refreshToken);
							localStorage.setItem("token", refreshToken);
						}
					},(error) => {
						if (error.status !== 401) {
							const refreshToken = error.headers.get('refresh');
							if (refreshToken) {
								//localStorage.removeItem("token");
								console.log('se venció la sesión:',refreshToken);
								localStorage.setItem("token", refreshToken);
							}
						}else{
							localStorage.clear()
							this.router.navigate(["usuario/index"]);
						}
					})
				)
		}
	}
	put(data, form_data?:boolean):any {
		let headers = new HttpHeaders(
			{
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + localStorage.getItem('token')
			}
		);
		if(form_data == true){
			console.log(data);
			data.append("token", localStorage.getItem("token"));
			var full_url = (data.get("full_path") == true)? data.get("url"):this.api_url + data.get("url");
			return this.HttpClient.post(this.api_url + data.url, data).pipe(delay(this.delay));
		} else {
			var formData = new FormData();
			data.delay = (data.delay)? data.delay:this.delay;
			var full_url = (data.full_path == true)? data.url:this.api_url + data.url;
			(!data.token)? data.token = localStorage.getItem("token"):false;
			for (var i in data) { formData.append(i, data[i]); }
			return this.HttpClient.put(full_url, data, { headers:headers, observe: 'response' } )
				.pipe(
					delay(data.delay),
					tap((response: HttpResponse<any>) => {
						const refreshToken = response.headers.get('refresh');
						if(refreshToken){
							//localStorage.removeItem("token");
							console.log('se venció la sesión:',refreshToken);
							localStorage.setItem("token", refreshToken);
						}
					},(error) => {
						if (error.status !== 401) {
							const refreshToken = error.headers.get('refresh');
							if (refreshToken) {
								//localStorage.removeItem("token");
								console.log('se venció la sesión:',refreshToken);
								localStorage.setItem("token", refreshToken);
							}
						}else{
							localStorage.clear()
							this.router.navigate(["usuario/index"]);
						}
					})
				);
		}
	}

	download(data):any {
		(!data.token)? data.token = this.token:false;
		data.delay = (data.delay)? data.delay:this.delay; 
		return this.HttpClient.get(this.api_url + data.url, { params:data, responseType:"blob", observe:"body" }).pipe(delay(data.delay));
	}	
	
}