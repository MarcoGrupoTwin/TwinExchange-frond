// import { Injectable } from "@angular/core";

// @Injectable({ providedIn: "root" })
// export class WebSocketService {
// 	private port:any;
// 	private url:string;
// 	public Socket: WebSocket;
// 	public messages: any[] = [];
// 	public connected = false;

// 	constructor() { }

// 	public connect(url, port){
// 		this.port = port;
// 		this.url = url;
		
// 		try {
// 			// this.Socket = new WebSocket("ws://" + this.url + ":" + this.port);
// 			if(port){
// 				this.Socket = new WebSocket("wss://" + this.url + ":" + this.port);
// 			} else {
// 				this.Socket = new WebSocket("wss://" + this.url );
// 			}

// 			this.connected = true;
// 			// console.log("conected");
// 		} catch (error) {
// 			console.error(error);
// 		}

// 		return true;
// 	}

// 	public start(url, port){
// 		this.connect(url,port);
		
// 		this.Socket.onmessage = (event) => {
// 			// console.log(event);
// 			let data = JSON.parse(event.data);
//        		this.messages.push(data);
// 		}
// 	}

// 	public onOpen(){
// 		this.Socket.onopen = (event) => {
// 			console.log("successful open", event);
// 		}
// 	}

// 	public send(data, callback = undefined) {
// 		var self = this;
// 		this.waitForConnection(function () {
// 			self.Socket.send(data);
			
// 			if (typeof callback !== "undefined") {
// 			  	callback();
// 			}
			
// 		}, 1000);
// 	};
	
// 	public waitForConnection(callback, interval) {
// 		if (this.Socket.readyState === 1) {
// 			callback();
// 		} else {
// 			var self = this;
// 			// optional: implement backoff for interval here
// 			setTimeout(function () {
// 				self.waitForConnection(callback, interval);
// 			}, interval);
// 		}
// 	};

// 	public close(code?, reason?, event?) {
// 		(!code)? code = 1000 : false;
// 		(!reason)? reason = "NORMAL_CLOUSURE" : false;

// 		if(event){
// 			this.Socket.onclose = (event) => {
// 				console.log("CLOSE:", event);
// 			}
// 		}

// 		if(this.connected == true){
// 			this.Socket.close(code, reason);
// 			// this.connected = false;
// 		}
// 	}	

// 	//@Todo
// 	public onReceived(){
// 		return this.Socket.onmessage;
// 	}
// }