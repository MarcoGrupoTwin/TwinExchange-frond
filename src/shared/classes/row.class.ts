export class Row {  
    public data:any;
    public form_data: { 
        data:any[],
        rows:[{
            data:{},
            fields:[{}] 
        }] 
    };

    constructor(){}
    
    public init(){
        this.data = {
            pager: {
                next: 0,
                previous:0
            }
        };

        this.form_data = { 
            data:[],
            rows:[{
                data:{},
                fields:[{}] 
            }] 
        };
    }          
    
    public setData( data: any ): void {
        for(var key in data){ 
            if(this.data[key] != undefined){
                this.data[key] = data[key];
            }
        }
    }

    public getData(levels?): any {
        if(levels){
            let return_data:any = {};
            
            for(let key in this.data){
                if(levels.indexOf(key) > -1){
                    return_data[key] = this.data[key];
                }
            }

            return return_data;
        } 

        return this.data;
    }

    public getDataValues(levels?): any {
        let return_data:any = {};

        for(let key in this.data){
            if(levels){
                if(levels.indexOf(key) > -1){
                    for(let value in this.data[key]){
                        return_data[value] = this.data[key][value];
                    }
                }
            } else {
                for(let value in this.data[key]){
                    return_data[value] = this.data[key][value];
                }
            }
        }

        return return_data;
    }

    public getValue(level:string, param:string): any {
        if(this.data[level][param].indexOf() > -1){
            return this.data[level][param];
        }
    }
}