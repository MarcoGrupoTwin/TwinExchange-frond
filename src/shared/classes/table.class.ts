import { Injectable } from "@angular/core";

@Injectable()
export class Table {  
    public headerColumns?:any[];
    public footerColumns?:any[];
    public pagination  ?:any[];
    public dataRows    ?:any[];
    public tempDataRows?:any[];
    public entries     ?:any[];
    public resume      ?:any;
    public pages       ?:Pages;
    public summary     ?:Summary;
    public filters     ?:Filters;
    
    constructor(){}
    
    public init(){
        this.headerColumns = [];
        this.footerColumns = [];
        this.pagination = [];
        this.dataRows = [];
        this.entries = [];
        this.summary = {};
        this.filters = {};
        this.resume = {};
        this.pages = {};
    }          
    
    public clear(): void {
        this.dataRows = [];
    }

    public addRows( data:any, type = "append" ): void {
        for(var key in data){ 
            if(type == "append"){
                this.dataRows.push(data[key]);
            } else {
                this.dataRows.unshift(data[key]);
            }
        }
    }

    public addColumns( data:any ): void {
        for(var key in data){ 
            this.dataRows.push(data[key]);
        }
    }

    public setRows( data:any ): void {
        this.dataRows = data;
    }

    public setColumns( data:any ): void {
        this.headerColumns = data;
    }

    public filterBy( data:any ): void {
        (!this.tempDataRows)? this.tempDataRows = this.dataRows : false;

        // let previous
        console.log(data.value);
        
        if(!data.value){
            this.dataRows = this.tempDataRows.filter(function(item){
                if(item[data.field].toLowerCase().includes(data.value.toLowerCase())){
                    return item;
                }        
            });
        } else {
            this.dataRows = this.dataRows.filter(function(item){
                if(item[data.field].toLowerCase().includes(data.value.toLowerCase())){
                    return item;
                }        
            });
        }         
    }
}

export interface TableInterface {
    headerColumns?:any[];
    footerColumns?:any[];
    pagination  ?:any[];
    dataRows    ?:any[];
    entries     ?:any[];
    resume      ?:any;
    pages       ?:Pages;
    summary     ?:Summary;
}

export interface Summary {
    total       ?:number;
    active      ?:number;
    inactive    ?:number;
    locked      ?:number;
    unlocked    ?:number;
    deleted     ?:number;
    read        ?:number;
    unread      ?:number;
    resume      ?:any;
    formatted_total ?:number;
    formatted_resume ?:any;
}

export interface Resume {
    total       ?:number;
    formatted_total ?:any;
}

export interface Pages {
    total           ?:number;
    next            ?:number;
    current         ?:number;
    previous        ?:number;
    next_first      ?:number;
    next_second     ?:number;
    next_three      ?:number;
    previous_first  ?:number;
    previous_second ?:number;
    previous_three  ?:number;
}

export interface Filters {
    delay   ?:number;
    token   ?:string;
    page    ?:number;
    limit   ?:any;
    active  ?:number;
    locked  ?:number;
    deleted ?:number;
    period  ?:any;
    day     ?:any;
    month   ?:any;
    year    ?:any;
    date    ?:string;
    end_date ?:string;
    start_date ?:string;
    end_date_out ?:string;
    start_date_in ?:string;
    find    ?:string;
    type    ?:string;
    status  ?:string;
    kind    ?:string;
    search  ?:string;
    key     ?:string;
    value   ?:string;
    recursive  ?:boolean;
    mail?:  string;
    cellular?:  string;
    query?:any;
    order_keys?:any;
    order_fields?:any;
    sort_order_fields?:any;
}