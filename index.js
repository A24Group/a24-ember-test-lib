/* eslint-env node */
"use strict";

module.exports = {
    name: require("./package").name,
    included: function(app) {
        this._super.included.apply(this, arguments);

        //Testing helpers
        app.import({test: "vendor/a24testLib/testCaseHelpersExtend.js"});
    },

    // For eslint to run during test we need isDevelopingAddon to return true. So below it will return true when
    // the ENV is test AND when the module running matches the addon. So test in parent app will NOT run eslint in this
    // addon, thus if an addon has failing eslint test it will not break the parent apps test.
    isDevelopingAddon: function() {
        if (process.env.EMBER_ENV === "test" && this.app && this.moduleName() === this.app.project.name()) {
            return true;
        } else {
            return false; //For devs, toggle this flag to true to enable dev mode during serve
        }
    }
};
