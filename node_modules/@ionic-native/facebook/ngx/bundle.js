'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var tslib = require('tslib');
var core$1 = require('@angular/core');
var core = require('@ionic-native/core');

var Facebook = /** @class */ (function (_super) {
    tslib.__extends(Facebook, _super);
    function Facebook() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.EVENTS = {
            EVENT_NAME_ACTIVATED_APP: 'fb_mobile_activate_app',
            EVENT_NAME_DEACTIVATED_APP: 'fb_mobile_deactivate_app',
            EVENT_NAME_SESSION_INTERRUPTIONS: 'fb_mobile_app_interruptions',
            EVENT_NAME_TIME_BETWEEN_SESSIONS: 'fb_mobile_time_between_sessions',
            EVENT_NAME_COMPLETED_REGISTRATION: 'fb_mobile_complete_registration',
            EVENT_NAME_VIEWED_CONTENT: 'fb_mobile_content_view',
            EVENT_NAME_SEARCHED: 'fb_mobile_search',
            EVENT_NAME_RATED: 'fb_mobile_rate',
            EVENT_NAME_COMPLETED_TUTORIAL: 'fb_mobile_tutorial_completion',
            EVENT_NAME_PUSH_TOKEN_OBTAINED: 'fb_mobile_obtain_push_token',
            EVENT_NAME_ADDED_TO_CART: 'fb_mobile_add_to_cart',
            EVENT_NAME_ADDED_TO_WISHLIST: 'fb_mobile_add_to_wishlist',
            EVENT_NAME_INITIATED_CHECKOUT: 'fb_mobile_initiated_checkout',
            EVENT_NAME_ADDED_PAYMENT_INFO: 'fb_mobile_add_payment_info',
            EVENT_NAME_PURCHASED: 'fb_mobile_purchase',
            EVENT_NAME_ACHIEVED_LEVEL: 'fb_mobile_level_achieved',
            EVENT_NAME_UNLOCKED_ACHIEVEMENT: 'fb_mobile_achievement_unlocked',
            EVENT_NAME_SPENT_CREDITS: 'fb_mobile_spent_credits',
            EVENT_PARAM_CURRENCY: 'fb_currency',
            EVENT_PARAM_REGISTRATION_METHOD: 'fb_registration_method',
            EVENT_PARAM_CONTENT_TYPE: 'fb_content_type',
            EVENT_PARAM_CONTENT_ID: 'fb_content_id',
            EVENT_PARAM_SEARCH_STRING: 'fb_search_string',
            EVENT_PARAM_SUCCESS: 'fb_success',
            EVENT_PARAM_MAX_RATING_VALUE: 'fb_max_rating_value',
            EVENT_PARAM_PAYMENT_INFO_AVAILABLE: 'fb_payment_info_available',
            EVENT_PARAM_NUM_ITEMS: 'fb_num_items',
            EVENT_PARAM_LEVEL: 'fb_level',
            EVENT_PARAM_DESCRIPTION: 'fb_description',
            EVENT_PARAM_SOURCE_APPLICATION: 'fb_mobile_launch_source',
            EVENT_PARAM_VALUE_YES: '1',
            EVENT_PARAM_VALUE_NO: '0',
        };
        return _this;
    }
    Facebook.prototype.getApplicationId = function () { return core.cordova(this, "getApplicationId", {}, arguments); };
    Facebook.prototype.setApplicationId = function (id) { return core.cordova(this, "setApplicationId", {}, arguments); };
    Facebook.prototype.getApplicationName = function () { return core.cordova(this, "getApplicationName", {}, arguments); };
    Facebook.prototype.setApplicationName = function (name) { return core.cordova(this, "setApplicationName", {}, arguments); };
    Facebook.prototype.login = function (permissions) { return core.cordova(this, "login", {}, arguments); };
    Facebook.prototype.loginWithLimitedTracking = function (permissions) { return core.cordova(this, "loginWithLimitedTracking", {}, arguments); };
    Facebook.prototype.checkHasCorrectPermissions = function (permissions) { return core.cordova(this, "checkHasCorrectPermissions", {}, arguments); };
    Facebook.prototype.isDataAccessExpired = function () { return core.cordova(this, "isDataAccessExpired", {}, arguments); };
    Facebook.prototype.reauthorizeDataAccess = function () { return core.cordova(this, "reauthorizeDataAccess", {}, arguments); };
    Facebook.prototype.logout = function () { return core.cordova(this, "logout", {}, arguments); };
    Facebook.prototype.getLoginStatus = function () { return core.cordova(this, "getLoginStatus", {}, arguments); };
    Facebook.prototype.getAccessToken = function () { return core.cordova(this, "getAccessToken", {}, arguments); };
    Facebook.prototype.getCurrentProfile = function () { return core.cordova(this, "getCurrentProfile", {}, arguments); };
    Facebook.prototype.showDialog = function (options) { return core.cordova(this, "showDialog", {}, arguments); };
    Facebook.prototype.api = function (requestPath, permissions, httpMethod) { return core.cordova(this, "api", {}, arguments); };
    Facebook.prototype.logEvent = function (name, params, valueToSum) { return core.cordova(this, "logEvent", { "successIndex": 3, "errorIndex": 4 }, arguments); };
    Facebook.prototype.setAutoLogAppEventsEnabled = function (enabled) { return core.cordova(this, "setAutoLogAppEventsEnabled", { "successIndex": 1, "errorIndex": 2 }, arguments); };
    Facebook.prototype.setAdvertiserIDCollectionEnabled = function (enabled) { return core.cordova(this, "setAdvertiserIDCollectionEnabled", {}, arguments); };
    Facebook.prototype.setAdvertiserTrackingEnabled = function (enabled) { return core.cordova(this, "setAdvertiserTrackingEnabled", {}, arguments); };
    Facebook.prototype.logPurchase = function (value, currency, params) { return core.cordova(this, "logPurchase", {}, arguments); };
    Facebook.prototype.getDeferredApplink = function () { return core.cordova(this, "getDeferredApplink", {}, arguments); };
    Facebook.prototype.activateApp = function () { return core.cordova(this, "activateApp", {}, arguments); };
    Facebook.pluginName = "Facebook";
    Facebook.plugin = "cordova-plugin-facebook-connect";
    Facebook.pluginRef = "facebookConnectPlugin";
    Facebook.repo = "https://github.com/cordova-plugin-facebook-connect/cordova-plugin-facebook-connect";
    Facebook.install = "ionic cordova plugin add cordova-plugin-facebook-connect --variable APP_ID=\"123456789\" --variable APP_NAME=\"myApplication\"";
    Facebook.installVariables = ["APP_ID", "APP_NAME"];
    Facebook.platforms = ["Android", "iOS", "Browser"];
    Facebook.decorators = [
        { type: core$1.Injectable }
    ];
    return Facebook;
}(core.IonicNativePlugin));

exports.Facebook = Facebook;
