export interface RouteInfo {
    id  :any;
    path?:string;
    module :string;
    title:string;
    type:string;
    icontype:string;
    icon?:string;
    children?:ChildrenItems[];
}

export interface ChildrenItems {
    path:string;
    title:string;
    type?:string;
    module?:string;
    shorten:string;
}

export const Routes:RouteInfo[] = [
    // {
    //     id:"dashboard",
    //     type:"link",
    //     module:"/dashboard/view",
    //     title:"DASHBOARD.DASHBOARD",
    //     icontype:"pe-7s-graph"
    // },
    // {
    //     id:"example",
    //     type:"sub",
    //     module:"/example",
    //     title:"COMMON.EXAMPLE",
    //     icontype:"pe-7s-network",
    //     children: [
    //         { module:"example1", shorten:"CLC", path:"list", title:"COMMON.EXAMPLE1" },
    //         { module:"example2", shorten:"CLC", path:"list", title:"COMMON.EXAMPLE2" },
    //     ]
    // },
    {
        id:"product",
        type:"sub",
        module:"/product",
        title:"PRODUCT.PRODUCT",
        icontype:"pe-7s-network",
        children: [
            { shorten:"ULS", path:"view", title:"PRODUCT.PRODUCT"},
        ]
    },
    {
        id:"user",
        type:"sub",
        module:"/user",
        title:"PROFILE.USERS",
        icontype:"pe-7s-network",
        children: [
            { shorten:"ULS", path:"list", title:"PROFILE.LIST_USER"},
        ]
    },
    {
        id:"user",
        type:"sub",
        module:"/user",
        title:"PROFILE.USERS",
        icontype:"pe-7s-network",
        children: [
            { shorten:"ULS", path:"list", title:"PROFILE.LIST_USER"},
        ]
    },  {
        id:"user",
        type:"sub",
        module:"/user",
        title:"PROFILE.USERS",
        icontype:"pe-7s-network",
        children: [
            { shorten:"ULS", path:"list", title:"PROFILE.LIST_USER"},
        ]
    },
    {
        id:"support_user",
        type:"sub",
        module:"/support_user",
        title:"PROFILE.SUPPORT_USERS",
        icontype:"pe-7s-network",
        children: [
            { shorten:"ULS", path:"list", title:"PROFILE.LIST_SUPPORT_USER"},
        ]
    },
];
