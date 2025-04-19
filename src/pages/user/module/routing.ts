import { Routes, RouterModule } from "@angular/router";

import { ViewComponent as LoginSupportUser } from "../login/component";
import { IndexComponent as ViewIndex } from "../index/component";
import { IndexComponent as Validate } from "../validate/component";
import { ViewComponent as ErrorComponent } from "../error/component";

export const RoutingOutside: Routes = [
    //Sin header ni footer
    { 
        path: "",
        children: [{
            path: "login",
            component: LoginSupportUser
        }]
    },
];

export const RoutingOutsideFront: Routes = [
    //Con header y footer
    {
        path: "",
        children: [{
            path: "index",
            component: ViewIndex
        }]
    },
    {
        path: "",
        children: [{
            path: "error",
            component: ErrorComponent
        }]
    },
    {
        path: "",
        children: [{
            path: "validate",
            component: Validate
        }]
    },
];