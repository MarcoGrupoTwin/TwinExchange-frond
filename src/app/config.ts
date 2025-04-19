import { Injectable } from "@angular/core";
import {URL_API, URL_WS } from './variables';

@Injectable()
export class Config {
    static readonly host:string             = window.location.host;
    static readonly production:boolean      = true;

    // --------------------------------------------
    // ----------- PRODUCTION ---------------------
    // --------------------------------------------
    //http://localhost:3000
    static readonly api_production:string           = URL_API;
    static readonly url_socket_production:string    = "";
    static readonly port_socket_production:string   = "";
    static readonly api_production_panel:string     = "http://localhost:49200/";
    static readonly api_messages:string             = URL_WS;
    
    // --------------------------------------------
    // ----------- DEVELOPMENT --------------------
    // --------------------------------------------
    static readonly api_local:string                = URL_API;
    static readonly api_development:string          = URL_API;
    static readonly url_socket_development:string   = "";
    static readonly port_socket_development:string  = "";
    static readonly api_development_panel:string     = "http://localhost:63138/";
    static readonly api_messages_development:string = URL_WS;
    
    // --------------------------------------------
    // ----------- KEYS ---------------------------
    // --------------------------------------------
    static readonly brand:string            = "Twin Exchange";
    static readonly application:string      = "Twin Exchange";
    static db_name:string                   = "";   
    static readonly project_name:string     = "";
    static readonly project_version:string  = "dev-1.0";
    static readonly google_key:string       = "";
    static format_language_id:string        = "";    
    static language:string                  = "spanish";
    static lang:string                      = "es";
    static readonly VAPID_PUBLIC_KEY        = "";
    // --------------------------------------------
    // ----------- SETTINGS -----------------------
    // --------------------------------------------
    
    static api_url:string                   = (Config.host.toLocaleLowerCase().includes("localhost"))? Config.api_local : (Config.host.toLocaleLowerCase().includes("test"))? Config.api_development : Config.api_production;   
    // static api_url_socket:string            = (Config.host.toLocaleLowerCase().includes("localhost"))? Config.url_socket_development : (Config.host.toLocaleLowerCase().includes("test"))? Config.url_socket_development : Config.url_socket_production;   
    // static port_socket:string               = (Config.host.toLocaleLowerCase().includes("localhost"))? Config.port_socket_development : (Config.host.toLocaleLowerCase().includes("test"))? Config.port_socket_development : Config.port_socket_production;    // static api_url:string                   = Config.api_production;
    static api_url_panel:string                   = (Config.host.toLocaleLowerCase().includes("localhost"))? Config.api_development_panel : (Config.host.toLocaleLowerCase().includes("test"))? Config.api_development_panel : Config.api_production_panel;   
    static api_url_messages:string                   = (Config.host.toLocaleLowerCase().includes("localhost"))? Config.api_messages_development : (Config.host.toLocaleLowerCase().includes("test"))? Config.api_messages_development : Config.api_messages;
    
    // --------------------------------------------
    // ----------- SETTINGS FORCE -----------------
    // --------------------------------------------
    // static api_url:string               = Config.api_production;
    // static port_socket:string           = Config.port_socket_production;
    // static api_url_socket:string        = Config.url_socket_production;
}