/* jshint node: true */
"use strict";

module.exports = {
    name: "a24-ember-test-lib",
    included: function(app) {
        this._super.included.apply(this, arguments);

        //Testing helpers
        app.import({test: "vendor/a24testLib/testCaseHelpersExtend.js"});
    },
    isDevelopingAddon: function() {
        return false;
    }
};
