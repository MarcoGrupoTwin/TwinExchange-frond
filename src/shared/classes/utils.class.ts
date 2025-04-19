import { Injectable } from "@angular/core";
import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from '@ngx-translate/core';

declare var $:any;
// declare var swal:any;
import Swal from "sweetalert2";

@Injectable()
export class Utils {
    public Translation: any = {};

    constructor(
       private TranslateService: TranslateService,
       private NgxSpinnerService: NgxSpinnerService
    ) {
        this.TranslateService.get(["SUCCESS","ERRORS","BUTTONS"]).subscribe((Translation: string) => { this.Translation = Translation; });
    }
       
    public showSpiner(data?:any): void {
        (!data)? data = {} : false ; 
        data.title = (data.title != undefined)? data.title : "";
        this.NgxSpinnerService.show(data.title, { 
            size: (data.size != undefined)? data.size : "large",
            color: (data.color != undefined)? data.color : "white",
            type: (data.type != undefined)? data.type : "line-scale-party",
            bdColor: (data.bdColor != undefined)? data.bdColor : "rgba(100,149,237, .8)",
        });

        this.NgxSpinnerService.show();
    }
   
    public closeSpiner(time?): void {
        var self = this;
        (!time)? time = 0: false;
        
        setTimeout(function(){ 
            self.NgxSpinnerService.hide();
        }, time);
    }
    
    public showError(data:any){
        data.timer = (data.timer != undefined)? data.timer: 0;
        data.error = (data.error != undefined)? data.error: "";
        data.button = (data.button != undefined)? data.button: "OK";
        data.timerProgressBar = (data.timer != undefined)? true: false;
        data.title = (data.title != undefined)? data.title: "";
        
        Swal.fire({
            icon: "error",
            text: data.error,
            title: data.title,
            timer: data.timer,
            allowEscapeKey: false,
            allowOutsideClick: false,
            timerProgressBar: data.timerProgressBar,
            confirmButtonText: data.button,
            confirmButtonColor: "#d33",
        });
    }

    public showLocalNotification(data:any){
        data.timer = (data.timer)? data.timer : 3000;
        data.icon = (data.icon)? data.icon : "success";
        data.message = (data.message)? data.message : "";
        data.timerProgressBar = (data.timer != undefined)? data.timerProgressBar : true;

        Swal.mixin({
            toast: true,
            timer: data.timer,
            position: 'top-end',
            showConfirmButton: false,
            timerProgressBar: data.timerProgressBar,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          }).fire({
            icon: data.icon,
            title: data.message
          });
    }

    public dateToUnixDate(date?: any) {
        if (date) {
            return parseInt((new Date(date.year, date.month - 1, date.day).getTime() / 1000).toFixed(0));
        } else {
            return (new Date().getTime() / 1000).toFixed(0);
        }
    }

    public unixDateToDate(date:number) { 
        let new_date = new Date(date * 1000); 
        let utc_string = new_date.toUTCString(); 
        let time = utc_string.slice(-11, -4); 

        return { month:new_date.getMonth() + 1, day:new_date.getDate(), year:new_date.getFullYear(), time:time };
    }

    public getWeek(date?){
        var today=new Date(),i=0, f, week=(new Date(today.getFullYear(), 0,1).getDay()>0)?1:0;
        while( (f=new Date(today.getFullYear(), 0, ++i)) < today ){
            if(!f.getDay()){
                week++;
            }
        }
        return week;
    }

    public downloadCSV(data:any) { 
        data.file_name = (data.file_name != undefined)? data.file_name + ".csv" : "download-file.csv"; // new Date(date * 1000) 
        let file = window.URL.createObjectURL(data);
        const link = document.createElement('a'); 

        link.href = file;
        link.download = data.file_name; 
        link.setAttribute("style", "display: none");
        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(file);
        link.remove(); 
    }

    public downloadFromLink(url:string, data:any) { 
        data.file_name = (data.file_name != undefined)? data.file_name + ".pdf" : "download-file.pdf";
        const link = document.createElement("a");
        
        link.download = data.file_name; 
        link.setAttribute("target", "_blank");
        link.setAttribute("style", "display: none");
        link.href = url + "&" + this.getPlainParams(data);
        document.body.appendChild(link);
        link.click();
        link.remove(); 
    }

    getPlainParams(data){
        var params = "";
        for(var key in data){
            if(key == "column_data"){
                params += key + "=" + data[key];
            } else {
                params += key + "=" + data[key] + "&";
            }
        }
        return params;
    }

    static genId() {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    static isMobile() {
        return window && window.matchMedia('(max-width: 767px)').matches;
    }
    
    static scrollToTop(selector: string) {
        if (document) {
            const element = <HTMLElement>document.querySelector(selector);
            element.scrollTop = 0;
        }
    }

    public arrangeCarousel(data, deep=3){
        let counter = 0;
        let image_data = [];
        let carousel_data = [];
        let tumbler = parseInt(data.length)/deep;
        
        for(var i=0; i<tumbler; i++){
            for(var k=0; k<deep; k++){
                if(k < deep){
                    if(data[counter] == undefined){
                        data[counter] = {};
                    }

                    image_data.push(data[counter]);
                }
                
                if(k == deep-1){ 
                    carousel_data.push(image_data);
                    image_data = [];
                }

                // console.log("counter: " + counter);
                // console.log(data[counter]);
                counter++;
            }    
        }

        // console.log(carousel_data);
        return carousel_data;
    }

    public sorter(data, field){
        (data == undefined)? data = [] : false;
        
        if( data[field] != undefined ){
            if( data[field] == "DESC" ){
                data[field] = "ASC";
            } else if( data[field] == "ASC" ){
                // data.splice(field);
                let temp_data = data;
                data = [];
                
                for( let key in temp_data ){
                    (key != field)? data[key] = temp_data[key] : false;
                }
            } else if( data[field] == "" ){
                data[field] = "DESC";
            } 
        } else {
            data[field] = "DESC";
        }
        
        return data;
    }
}