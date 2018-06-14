/* jshint node: true */
"use strict";

module.exports = {
    name: "a24-ember-test-lib",
    included: function(app) {
        this._super.included.apply(this, arguments);

        //Testing helpers
        app.import({test: "vendor/a24testLib/testCaseHelpersExtend.js"});
    }
    // This needs to be removed (or be true, but since I cant commit that way I leave it commented out) for ESLint
    // to also run for actual file during test, else it will only run lint for the test files.
    // ,isDevelopingAddon: function() {
    //     return true;
    // }
};
