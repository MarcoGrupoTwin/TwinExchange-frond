import { Routes } from "@angular/router";

import { ListComponent as IndexClient } from "../index/component";
import { ListComponent as Lightning } from "../lightning/component";
import { ListComponent as Send } from "../send/component";
import { ListComponent as Wallet } from "../wallet/component";
import { ListComponent as Payment } from "../payment/component";
import { ListComponent as Fund } from "../fund/component";
import { ListComponent as Movements } from "../movements/component";
import { ListComponent as Code } from "../code/component";
import { ListComponent as Saving } from "../saving/component";
import { ListComponent as Loan } from "../loan/component";
import { ListComponent as Remittance } from "../remittance/component";
import { ListComponent as Redeem } from "../redeem/component";
import { ListComponent as Charge } from "../charge/component";
import { ListComponent as Support } from "../support/component";

export const Routing: Routes = [
    {
        path: "",
        children: [{
            path: "trading",
            component: IndexClient
        }]
    },
    {
        path: "",
        children: [{
            path: "lightning",
            component: Lightning
        }]
    },
    {
        path: "",
        children: [{
            path: "send",
            component: Send
        }]
    },
    {
        path: "",
        children: [{
            path: "wallet",
            component: Wallet
        }]
    },
    {
        path: "",
        children: [{
            path: "movements",
            component: Movements
        }]
    },
    {
        path: "",
        children: [{
            path: "code",
            component: Code
        }]
    },
    {
        path: "",
        children: [{
            path: "redeem",
            component: Redeem
        }]
    },
    {
        path: "",
        children: [{
            path: "fund",
            component: Fund
        }]
    },
    {
        path: "",
        children: [{
            path: "charge",
            component: Charge
        }]
    },
    {
        path: "",
        children: [{
            path: "payment",
            component: Payment
        }]
    },
    {
        path: "",
        children: [{
            path: "saving",
            component: Saving
        }]
    },
    {
        path: "",
        children: [{
            path: "loan",
            component: Loan
        }]
    },
    {
        path: "",
        children: [{
            path: "remittance",
            component: Remittance
        }]
    },
    {
        path: "",
        children: [{
            path: "support",
            component: Support
        }]
    }
];

export const RoutingSales: Routes = [
    
];