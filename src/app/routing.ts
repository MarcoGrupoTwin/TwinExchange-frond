import { Routes } from "@angular/router";

import { ComponentLayout as LayoutInside } from "../layout/layout-inside/component";
import { ComponentLayout as LayoutOutSideFront } from "../layout/layout-outside-front/component";
import { ComponentLayout as LayoutOutside } from "../layout/layout-outside/component";

export const Routing: Routes = [
    {
        path: "",
        redirectTo: "/usuario/index",
        pathMatch: "full",
    },
    {
        //sin header ni footer
        path: "",
        component: LayoutOutside,
        children: [
            {
                path: "usuario",
                loadChildren: () => import("../pages/user/module/module").then(item => item.ModuleOutside)
            },
        ]
    },
    {
        //con header y footer sin login
        path: "",
        component: LayoutOutSideFront,
        children: [
            {
                path: "usuario",
                loadChildren: () => import("../pages/user/module/module").then(item => item.ModuleOutsideSide)
            },
        ]
    },
    {
        //con header y footer con login
        path: "",
        component: LayoutInside,
        children: [
            {
                path: "usuario",
                loadChildren: () => import("../pages/cliente/module/module").then(item => item.Module)
            },
        ]
    },
    {
        path: "**",
        redirectTo: "/usuario/error"
    }
];
