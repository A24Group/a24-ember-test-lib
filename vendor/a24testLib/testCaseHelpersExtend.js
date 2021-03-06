if (typeof a24GetElementFromText === "undefined") {
    var a24GetElementFromText = function (objJquery, sTag, sText, bExact) {
        if (typeof(bExact) === "undefined") {
            bExact = false;
        }
        if (bExact) {
            return objJquery(sTag).filter(
                function() {
                    return objJquery(this)[0].outerText.trim() === sText;
                }
            );
        } else {
            return objJquery(sTag + ":contains('" + sText + "')");
        }
    }
}

if (typeof a24SetInputTextValue === "undefined") {
    var a24SetInputTextValue = function (sFieldName, sValue) {
        a24DoTask(
            100,
            function() {
                a24GetElementFromText(
                    $, "label", sFieldName, true
                ).eq(0).parent().find("input").eq(0).val(sValue);
                a24GetElementFromText(
                    $, "label", sFieldName, true
                ).eq(0).parent().find("input").eq(0).change();
            }
        );
    }
}

if (typeof a24SetAddressSuggestValue === "undefined") {
    var a24SetAddressSuggestValue = function (sFieldName, mValue, iIndex) {
        a24DoTask(
            100,
            function() {
                if (typeof iIndex === "undefined") {
                    iIndex = 0;
                }
                a24GetElementFromText(
                    $, "label", sFieldName, true
                ).eq(iIndex).parent().find("input").eq(0).trigger("onSetAddressSuggestForTest", mValue);
            }
        );
    };
}

if (typeof a24SetInputDropdownValue === "undefined") {
    var a24SetInputDropdownValue = function (sFieldName, iSelectItemIndex) {
        var sDropdownId = "";
        a24DoTask(
            100,
            function() {
                a24GetElementFromText(
                    $, "label", sFieldName, true
                ).eq(0).parent().find("input.select-dropdown").eq(0).focus().click();
            }
        );

        a24DoTask(
            600,
            function() {
                sDropdownId = a24GetElementFromText(
                    $, "label", sFieldName, true
                ).eq(0).parent().find("input.select-dropdown").eq(0).attr("data-activates");
                $("#" + sDropdownId).parent().find("ul.dropdown-content li").eq(iSelectItemIndex).click()
                a24GetElementFromText(
                    $, "label", sFieldName, true
                ).eq(0).parent().find("input.select-dropdown").blur();
            }
        );

        a24DoTask(
            500,
            function() {
                //Wait for the dropdown to finish hiding
                //Reset the values that were calced when the dropdown was shown, this is done to help the template
                //compare pass. (The width and top will get calced each time the dropdown is opened, so doing this wont
                //change how the dropdown works)
                $("#" + sDropdownId).parent().find("ul.dropdown-content").css({
                    width: "0",
                    top: "0",
                    left: "0"
                })
            }
        );
    }
}

if (typeof a24SetInputDateValue === "undefined") {
    var a24SetInputDateValue = function (sFieldName, sValue, iIndex) {
       a24DoTask(
           100,
           function() {
               if (typeof iIndex === "undefined") {
                   iIndex = 0;
               }
               a24GetElementFromText(
                   $, "label", sFieldName, true
               ).eq(iIndex).parent().find(".datepicker").eq(0).trigger("onSetDateForTest", sValue);
           }
       );
    }
}

if (typeof a24SetInputTelNumberCountryCodeValue === "undefined") {
    var a24SetInputTelNumberCountryCodeValue = function (sFieldName, sValue, iIndex) {
        a24DoTask(
            100,
            function() {
                if (typeof iIndex === "undefined") {
                    iIndex = 0;
                }
                a24GetElementFromText(
                    $, ".a24TelInput .a24InputHeader", sFieldName, true
                ).eq(iIndex).parent().find(".input-tel-number-placeholder").eq(0).trigger("onSetCountryCodeForTest", sValue);
            }
        );
    }
}

if (typeof a24SetInputTelNumberValue === "undefined") {
    var a24SetInputTelNumberValue = function (sFieldName, sValue, iIndex) {
        a24DoTask(
            100,
            function() {
                if (typeof iIndex === "undefined") {
                    iIndex = 0;
                }
                a24GetElementFromText(
                    $, ".a24TelInput .a24InputHeader", sFieldName, true
                ).eq(iIndex).parent().find("input").eq(0).val(sValue);
                a24GetElementFromText(
                    $, ".a24TelInput .a24InputHeader", sFieldName, true
                ).eq(iIndex).parent().find("input").eq(0).change();
                a24GetElementFromText(
                    $, ".a24TelInput .a24InputHeader", sFieldName, true
                ).eq(iIndex).parent().find("input").eq(0).blur();
            }
        );
    }
}

if (typeof a24TemplateCompare === "undefined") {
    /**
     * This function is used to compare the html output of ember with the output of the
     * expected template
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  03 May 2016
     *
     * @param objAssert - The assert object used by ember
     * @param sHtml - The html generated by ember
     * @param sTemplateHtml - The html from template that the render should match
     * @param sMessage - Optional custom message to display on failure
     */
    var a24TemplateCompare = function(objAssert, sHtml, sTemplateHtml, sMessage) {

        if (typeof(sMessage) === "undefined") {
            sMessage = "The html did not match the expected template.";
        }
        sHtml = sHtml.trim(); // Trim whitespace

        sHtml = sHtml.replace(/    /g, ""); // Remove all tabs
        sHtml = sHtml.replace(/></g, ">\n<"); // Breakline any >< that are together
        sHtml = sHtml.replace(/ id="ember\d{1,}(_root)?(_table)?(-input)?(_ifr)?"/g, ""); // Remove ember ids
        sHtml = sHtml.replace(/ id="mceu_\d{1,}(-open)?(-body)?(-preview)?"/g, ""); // Remove tinymce ids
        sHtml = sHtml.replace(/ aria-labelledby="mceu_\d{1,}"/g, ""); // Remove tinymce labelled by
        sHtml = sHtml.replace(/ name="ember\d{1,}(_root)?(_table)?"/g, ""); // Remove ember name
        sHtml = sHtml.replace(/ href="#ember\d{1,}(_root)?(_table)?"/g, ""); // Remove ember href
        sHtml = sHtml.replace(/ id="select-options-([A-Za-z0-9\-\_]+)"/g, ""); // Remove select options ids from MDB
        sHtml = sHtml.replace(/ data-activates="select-options-([A-Za-z0-9\-\_]+)"/g, "");//Remove select option ids MDB
        sHtml = sHtml.replace(/ data-ember-action="\d{0,}(_root)?(_table)?"/g, ""); // remove ember data actions
        sHtml = sHtml.replace(/ data-ember-action-\d{1,}="\d{0,}(_root)?(_table)?"/g, ""); // remove ember data actions
        sHtml = sHtml.replace(/ aria-owns="ember\d{1,}(_root)?(_table)?"/g, ""); // remove ember aria-owns values
        sHtml = sHtml.replace(/ aria-controls="ember\d{1,}(_root)?(_table)?"/g, ""); //remove ember aria-controls values
        sHtml = sHtml.replace(/ for="ember\d{1,}(_root)?(_table)?"/g, ""); // remove ember for values
        sHtml = sHtml.replace(/-webkit-/g, ""); // remove any pre webkit tags from styles
        sHtml = sHtml.replace(/ data-pick="[-]?\d{1,}"/g, "");//remove timestamp that isn't used to avoid timezone issues
        sHtml = sHtml.replace(/ style=""/g, ""); // Remove empty style attribute
        sHtml = sHtml.replace(/ style=" "/g, ""); // Remove empty style attribute
        sHtml = sHtml.replace(/ aria-describedby="tooltip\d{1,}"/g, " aria-describedby=\"tooltip\""); // Remove tooltip ids
        sHtml = sHtml.replace(/ id="tooltip\d{1,}"/g, " id=\"tooltip\""); // Remove tooltip ids

        //Remove the space the datepicker adds for the month
        sHtml = sHtml.replace(/ title="Previous month"> <\/div>/g, ' title="Previous month"></div>');
        sHtml = sHtml.replace(/ title="Next month"> <\/div>/g, ' title="Next month"></div>');

        // Remove style properties that get added based on browser support
        // Have to do 3 separate since the order matters
        sHtml = sHtml.replace(/[\s]touch-action:[\s][\S]*;/g, "");// With space in front
        sHtml = sHtml.replace(/touch-action:[\s][\S]*;[\s]/g, "");// With space at back
        sHtml = sHtml.replace(/touch-action:[\s][\S]*;/g, "");// With no spaces

        //Here we strip css properties based on flags
        if (objAssert.bStripTabIndex) {
            sHtml = sHtml.replace(/ tabindex="[-]?\d{1,}"/g, ""); // Removes the tab index
        }

        if (objAssert.bStripCssHeight) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]height:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"height:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]height:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"height:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        //Here we strip css properties based on flags
        if (objAssert.bStripCssMaxHeight) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]max-height:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"max-height:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]max-height:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"max-height:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMaxWidth) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]max-width:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"max-width:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]max-width:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"max-width:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssWidth) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]width:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"width:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]width:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"width:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMarginLeft) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]margin-left:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"margin-left:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]margin-left:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"margin-left:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMarginBottom) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]margin-bottom:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"margin-bottom:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]margin-bottom:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"margin-bottom:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssPaddingRight) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]padding-right:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"padding-right:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]padding-right:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"padding-right:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssTop) {
            sHtml = sHtml.replace(/[\s]top:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"top:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]top:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"top:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssLeft) {
            sHtml = sHtml.replace(/[\s]left:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"left:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]left:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"left:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssTransform) {
            sHtml = sHtml.replace(/[\s]transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);"/g, "\"\"");// With no spaces
        }

        //PhantomJs will replace 0px with 0(only sometimes apparently), so we have to search for any 0px in styles
        //and replace them with 0 for both the sHtml and the sTemplateHtml
        var arrHtmlMatcher = sHtml.match(/[^0-9]{1}0px/g);
        if (arrHtmlMatcher != null) {
            for(var i = 0; i < arrHtmlMatcher.length; i++) {
                sHtml = sHtml.replace(arrHtmlMatcher[i], arrHtmlMatcher[i].substring(0, 2));
            }
        }

        sTemplateHtml = sTemplateHtml.replace(/    /g, ""); // Remove all tabs
        //PhantomJs will replace 0px with 0(only sometimes apparently), so search for any 0px in styles and replace
        //them with 0
        var arrTemplateHtmlMatcher = sTemplateHtml.match(/[^0-9]{1}0px/g);
        if (arrTemplateHtmlMatcher != null) {
            for(var j = 0; j < arrTemplateHtmlMatcher.length; j++) {
                sTemplateHtml = sTemplateHtml.replace(
                    arrTemplateHtmlMatcher[j], arrTemplateHtmlMatcher[j].substring(0, 2)
                );
            }
        }

        objAssert.equal(
            sHtml,
            sTemplateHtml,
            sMessage
        );
    };

}

var bServiceInProgress = false;

if (typeof a24TemplateCompareWithSave === "undefined") {
    /**
     * This function is used to compare the html output of ember with the output of the
     * expected template, this version will compare and if false, will write the diff to a file
     * using the php helper
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  22 February 2017
     *
     * @param objAssert - The assert object used by ember
     * @param sHtml - The html generated by ember
     * @param sTemplateHtml - The html from template that the render should match
     * @param sTestFileName - The name of the test file
     * @param sHtmlName - The name of the html file
     */
    var a24TemplateCompareWithSave = function(objAssert, sHtml, sTemplateHtml, sTestFileName, sHtmlName) {

        sHtml = sHtml.trim(); // Trim whitespace

        sHtml = sHtml.replace(/    /g, ""); // Remove all tabs
        sHtml = sHtml.replace(/></g, ">\n<"); // Breakline any >< that are together
        sHtml = sHtml.replace(/ id="ember\d{1,}(_root)?(_table)?(-input)?(_ifr)?"/g, ""); // Remove ember ids
        sHtml = sHtml.replace(/ id="mceu_\d{1,}(-open)?(-body)?(-preview)?"/g, ""); // Remove tinymce ids
        sHtml = sHtml.replace(/ aria-labelledby="mceu_\d{1,}"/g, ""); // Remove tinymce labelled by
        sHtml = sHtml.replace(/ name="ember\d{1,}(_root)?(_table)?"/g, ""); // Remove ember name
        sHtml = sHtml.replace(/ href="#ember\d{1,}(_root)?(_table)?"/g, ""); // Remove ember href
        sHtml = sHtml.replace(/ id="select-options-([A-Za-z0-9\-\_]+)"/g, ""); // Remove select options ids from MDB
        sHtml = sHtml.replace(/ data-activates="select-options-([A-Za-z0-9\-\_]+)"/g, "");//Remove select option ids MDB
        sHtml = sHtml.replace(/ data-ember-action="\d{0,}(_root)?(_table)?"/g, ""); // remove ember data actions
        sHtml = sHtml.replace(/ data-ember-action-\d{1,}="\d{0,}(_root)?(_table)?"/g, ""); // remove ember data actions
        sHtml = sHtml.replace(/ aria-owns="ember\d{1,}(_root)?(_table)?"/g, ""); // remove ember aria-owns values
        sHtml = sHtml.replace(/ aria-controls="ember\d{1,}(_root)?(_table)?"/g, ""); //remove ember aria-controls values
        sHtml = sHtml.replace(/ for="ember\d{1,}(_root)?(_table)?"/g, ""); // remove ember for values
        sHtml = sHtml.replace(/-webkit-/g, ""); // remove any pre webkit tags from styles
        sHtml = sHtml.replace(/ data-pick="[-]?\d{1,}"/g, "");//remove timestamp that isn't used to avoid timezone issues
        sHtml = sHtml.replace(/ style=""/g, ""); // Remove empty style attribute
        sHtml = sHtml.replace(/ style=" "/g, ""); // Remove empty style attribute
        sHtml = sHtml.replace(/ aria-describedby="tooltip\d{1,}"/g, " aria-describedby=\"tooltip\""); // Remove tooltip ids
        sHtml = sHtml.replace(/ id="tooltip\d{1,}"/g, " id=\"tooltip\""); // Remove tooltip ids

        //Remove the space the datepicker adds for the month
        sHtml = sHtml.replace(/ title="Previous month"> <\/div>/g, ' title="Previous month"></div>');
        sHtml = sHtml.replace(/ title="Next month"> <\/div>/g, ' title="Next month"></div>');

        // Remove style properties that get added based on browser support
        // Have to do 3 separate since the order matters
        sHtml = sHtml.replace(/[\s]touch-action:[\s][\S]*;/g, "");// With space in front
        sHtml = sHtml.replace(/touch-action:[\s][\S]*;[\s]/g, "");// With space at back
        sHtml = sHtml.replace(/touch-action:[\s][\S]*;/g, "");// With no spaces

        //Here we strip css properties based on flags
        if (objAssert.bStripTabIndex) {
            sHtml = sHtml.replace(/ tabindex="[-]?\d{1,}"/g, ""); // Removes the tab index
        }

        if (objAssert.bStripCssHeight) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]height:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"height:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]height:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"height:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMaxHeight) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]max-height:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"max-height:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]max-height:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"max-height:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMaxWidth) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]max-width:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"max-width:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]max-width:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"max-width:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssWidth) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]width:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"width:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]width:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"width:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMarginLeft) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]margin-left:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"margin-left:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]margin-left:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"margin-left:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssMarginBottom) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]margin-bottom:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"margin-bottom:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]margin-bottom:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"margin-bottom:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssPaddingRight) {
            // Have to do 4 separate since the order matters
            sHtml = sHtml.replace(/[\s]padding-right:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"padding-right:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]padding-right:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"padding-right:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssTop) {
            sHtml = sHtml.replace(/[\s]top:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"top:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]top:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"top:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssLeft) {
            sHtml = sHtml.replace(/[\s]left:[\s][\S]*px;[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"left:[\s][\S]*px;[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]left:[\s][\S]*px;"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"left:[\s][\S]*px;"/g, "\"\"");// With no spaces
        }
        if (objAssert.bStripCssTransform) {
            sHtml = sHtml.replace(/[\s]transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);[\s]/g, " ");// With space in front and back
            sHtml = sHtml.replace(/"transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);[\s]/g, "\"");// With space at back, this means the value is in front
            sHtml = sHtml.replace(/[\s]transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);"/g, "\"");// With space at front, this means the value is at back
            sHtml = sHtml.replace(/"transform:[\s]translate3d\([\S]*px,[\s][\S]*px,[\s][\S]*\);"/g, "\"\"");// With no spaces
        }

        //PhantomJs will replace 0px with 0(only sometimes apparently), so we have to search for any 0px in styles
        //and replace them with 0 for both the sHtml and the sTemplateHtml
        var arrHtmlMatcher = sHtml.match(/[^0-9]{1}0px/g);
        if (arrHtmlMatcher != null) {
            for(var i = 0; i < arrHtmlMatcher.length; i++) {
                sHtml = sHtml.replace(arrHtmlMatcher[i], arrHtmlMatcher[i].substring(0, 2));
            }
        }

        sTemplateHtml = sTemplateHtml.replace(/    /g, ""); // Remove all tabs
        //PhantomJs will replace 0px with 0(only sometimes apparently), so search for any 0px in styles and replace
        //them with 0
        var arrTemplateHtmlMatcher = sTemplateHtml.match(/[^0-9]{1}0px/g);
        if (arrTemplateHtmlMatcher != null) {
            for(var j = 0; j < arrTemplateHtmlMatcher.length; j++) {
                sTemplateHtml = sTemplateHtml.replace(
                    arrTemplateHtmlMatcher[j], arrTemplateHtmlMatcher[j].substring(0, 2)
                );
            }
        }

        var bEqual = sHtml === sTemplateHtml;

        if (bEqual) {
            objAssert.ok(true, "The html in '" + sHtmlName + "' for the test class '" + sTestFileName + "' matched");
        } else {
            objAssert.equal(
                sHtml,
                sTemplateHtml,
                "The html in '" + sHtmlName + "' for the test class '" + sTestFileName +
                "' was expecting to match the html in '/html/integration/components/" +
                sTestFileName + "/" + sHtmlName + "'"
            );

            var objRequestObj = {
                sTestClassName: sTestFileName,
                sTestHtmlName: sHtmlName,
                sHtmlContent: sHtml
            };

            bServiceInProgress = true;

            $.ajax(
                {
                    url: "http://localhost:4110/test-compare-save-result",
                    method: "POST",
                    data: JSON.stringify(objRequestObj)
                }
            ).done(
                function (objResult) {
                    var objResponse = JSON.parse(objResult);
                    objAssert.ok(objResponse.bSuccess, objResponse.sResponseMessage);
                    bServiceInProgress = false;
                }
            ).fail(
                function() {
                    // This will happen when the domain is unreachable
                    bServiceInProgress = false;
                }
            );
        }

    };

}

if (typeof arrTestFunctions === "undefined") {
    var arrTestFunctions = [];
}

if (typeof objDelayTaskPromise === "undefined") {
    var objDelayTaskPromise = null;
}

if (typeof objDelayTaskPromiseResolve === "undefined") {
    var objDelayTaskPromiseResolve = null;
}

if (typeof a24ResetDelayTask === "undefined") {
    var a24ResetDelayTask = function () {
        //Reset all delay task variables
        arrTestFunctions = [];
        objDelayTaskPromise = null;
        objDelayTaskPromiseResolve = null;
    };
}

if (typeof a24StartDelayTask === "undefined") {
    var a24StartDelayTask = function() {

        //Create promise for this test case
        objDelayTaskPromise = new _objStoredEmber.Test.promise(function (objPromiseResolve) {
            objDelayTaskPromiseResolve = objPromiseResolve;
        });

        //Add last task to que that will resolve promise finishing the test case
        arrTestFunctions.push(
            function() {
                objDelayTaskPromiseResolve();
            }
        );

        //Start the first test delay function in a new process so that the a24Wait that calls this function can first
        //return the promise created in this function
        setTimeout(
            function() {
                a24RunDelayTask();
            },
            0
        );
    };
}

if (typeof a24Wait === "undefined") {
    var a24Wait = function() {
        a24StartDelayTask();
        return objDelayTaskPromise;
    };
}

if (typeof a24RunDelayTask === "undefined") {
    var a24RunDelayTask = function() {
        if (arrTestFunctions.length > 0) {
            //This will remove the first function from the array and execute it
            arrTestFunctions.splice(0, 1)[0]();
        }
    };
}

if (typeof a24DelayTask === "undefined") {
    /**
     * This function will schedule a task to execute after the previous scheduled task.
     *
     * @param objEmber - The Ember class that ws imported in the test class
     * @param objThis - The current test function instance
     * @param objFunction - The function to delay
     * @param iDelayMilliseconds - The amount of time to delay the task
     *
     */
    var a24DelayTask = function (objEmber, objThis, objFunction, iDelayMilliseconds) {
        arrTestFunctions.push(
            function () {
                //We use time out here instead of the ember run later specifically so that test code run outside the
                //ember run loop and do not get affected or interfere with ember.
                setTimeout(
                    function() {
                        //Need to run this in a Ember.run so that it forces this run loop to complete before moving on
                        //to the next a24DelayTask, else Ember.run.once in actual code will only
                        //execute after all a24DelayTask in the test case is done
                        objEmber.run(function() {
                            objFunction();
                        });

                        //Here we poll the ember run loop to see if there is still tasks in the que(Run later,
                        //run next, etc), only when all tasks in ember run loop are done will we move on to the next
                        //test case task (a24DoTask)
                        var objPoller = setInterval(
                            function() {
                                if (!objEmber.run.hasScheduledTimers() && !bServiceInProgress) {
                                    clearInterval(objPoller);
                                    objPoller = null;
                                    a24RunDelayTask(); //Run the next task in the queue
                                }
                            },
                            10
                        );
                    },
                    iDelayMilliseconds
                );
            }
        );
    };
}

if (typeof a24SetBrowserSize === "undefined") {
    /**
     * This function will set the test window and media queries to the desired device screen size
     *
     * @param objEmber - The Ember class that ws imported in the test class
     * @param objThis - The current test function instance
     * @param funcSetBreakpointForTest - The function from the freshbooks ember-responsive addon (responsive.js)
     * @param sSize - The desired screen size (tiny|mobile|tablet|desktop|jumbo)
     */
    var a24SetBrowserSize = function (objEmber, objThis, funcSetBreakpointForTest, sSize) {
        objEmber.run(
            function () {
                var iWidth = 0;
                var iFontSize = 0;
                if (sSize === "tiny") {
                    iWidth = 300;
                    iFontSize = 15;
                } else if (sSize === "mobile") {
                    iWidth = 768;
                    iFontSize = 15;
                } else if (sSize === "tablet") {
                    iWidth = 992;
                    iFontSize = 15;
                } else if (sSize === "desktop") {
                    iWidth = 1200;
                    iFontSize = 15.5;
                } else if (sSize === "jumbo") {
                    iWidth = 1440;
                    iFontSize = 16;
                }

                //This will set the property of the window object to the required size
                window.innerWidth = iWidth;
                window.outerWidth = iWidth;

                $("html").eq(0).attr("style", "font-size: " + iFontSize + "px;");

                /**
                 * We set the width of the container to the width specified
                 *
                 * Note: This applies to the container of the test so it will not be visible in
                 * the html dom generated by the render
                 */
                $("#ember-testing").width(iWidth);
                $("div.ember-view").eq(0).width(iWidth);

                //This will set the media queries to the required size
                funcSetBreakpointForTest(objThis, sSize);
            }
        );

        //Fire resize event on windows the same way it would on a real browser when changing size
        objEmber.run(
            $(window), "trigger", "resize"
        );
    };
}

if (typeof a24SetBrowserWidth === "undefined") {
    /**
     * This function will set the test window and media queries to the desired device screen size
     *
     * @param objEmber - The Ember class that ws imported in the test class
     * @param objThis - The current test function instance
     * @param funcSetBreakpointForTest - The function from the freshbooks ember-responsive addon (responsive.js)
     * @param iWidth - The width (in px) to set the screen to
     */
    var a24SetBrowserWidth = function (objEmber, objThis, funcSetBreakpointForTest, iWidth) {
        objEmber.run(
            function () {
                var sSize;
                var iFontSize = 0;
                if (iWidth <= 300) {
                    sSize = "tiny";
                    iFontSize = 15;
                } else if (iWidth <= 768) {
                    sSize = "mobile";
                    iFontSize = 15;
                } else if (iWidth <= 992) {
                    sSize = "tablet";
                    iFontSize = 15;
                } else if (iWidth <= 1200) {
                    sSize = "desktop";
                    iFontSize = 15.5;
                } else if (iWidth <= 1440) {
                    sSize = "jumbo";
                    iFontSize = 16;
                }

                //This will set the property of the window object to the required size
                window.innerWidth = iWidth;
                window.outerWidth = iWidth;

                $("html").eq(0).attr("style", "font-size: " + iFontSize + "px;");

                /**
                 * We set the width of the container to the width specified
                 *
                 * Note: This applies to the container of the test so it will not be visible in
                 * the html dom generated by the render
                 */
                $("#ember-testing").width(iWidth);
                $("div.ember-view").eq(0).width(iWidth);

                //This will set the media queries to the required size
                funcSetBreakpointForTest(objThis, sSize);
            }
        );

        //Fire resize event on windows the same way it would on a real browser when changing size
        objEmber.run(
            $(window), "trigger", "resize"
        );
    };
}

if (typeof a24SetBrowserHeight === "undefined") {
    /**
     * This function will set the height of the ember test container and window
     *
     * @param objEmber - The Ember class that ws imported in the test class
     * @param iHeight - The height (in px) to set the screen to
     */
    var a24SetBrowserHeight = function (objEmber, iHeight) {
        objEmber.run(
            function () {
                //This will set the property of the window object to the required size
                window.innerHeight = iHeight;
                window.outerHeight = iHeight;

                /**
                 * We set the height of the container to the height specified
                 *
                 * Note: This applies to the container of the test so it will not be visible in
                 * the html dom generated by the render
                 */
                $("#ember-testing").height(iHeight);
                $("div.ember-view").eq(0).height(iHeight);
            }
        );

        //Fire resize event on windows the same way it would on a real browser when changing size
        objEmber.run(
            $(window), "trigger", "resize"
        );
    };
}

// ************************************
//    NEW TEST MANAGEMENT CODE BELOW
// ************************************

if (typeof _iGlobalTimeMultiplier === "undefined") {
    /**
     * GLOBAL TIME MULTIPLIER
     */
    var _iGlobalTimeMultiplier = 1;
}

if (typeof _arrGlobalClassesBackups === "undefined") {
    /**
     * Stores the global js class backups
     *
     * @type Array
     */
    var _arrGlobalClassesBackups = [];
}

if (typeof _objStoredEmber === "undefined") {
    /**
     * Stores the Ember object for the tests
     *
     * @type Object
     */
    var _objStoredEmber = null;
}

if (typeof _objStoredThis === "undefined") {
    /**
     * Stores the instance of the current running testcase
     *
     * @type Object
     */
    var _objStoredThis = null;
}

if (typeof _funcStoredSetBreakpointForTest === "undefined") {
    /**
     * Stores the breakpoint set function
     *
     * @type Function
     */
    var _funcStoredSetBreakpointForTest = null;
}

if (typeof a24GenerateIntegrationSetup === "undefined") {
    /**
     * Generate an object, used when creating an integration suite, containing the generic beforeEach. This beforeEach will reset the test render space
     * so that all tests can start with a clean slate.
     *
     * @param objEmber - The ember object
     * @param funcSetBreakpointForTest - set breakpoint function
     * @param funcBeforeEach - The function to execute on 'beforeEach'
     * @param funcAfterEach - The function to execute on 'afterEach'
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  30 August 2016
     *
     * @return A generic object used for creating integration suites
     */
    var a24GenerateIntegrationSetup = function (objEmber, funcSetBreakpointForTest, funcBeforeEach, funcAfterEach) {
        _objStoredEmber = objEmber;
        _funcStoredSetBreakpointForTest = funcSetBreakpointForTest;

        // Default Object
        var objIntegrationSetup = {
            integration: true,
            beforeEach: function (objAssert) {

                // Store the this object
                _objStoredThis = this;

                /**
                 * General resets
                 */
                // ***********************************
                a24ResetDelayTask();
                $(":root")[0].ontouchstart = function () {
                };
                // ***********************************

                /**
                 * The code below will be used to set the testing window to the correct default layout
                 * and size. This will also set things like the zoom level and font sizes so that all tests
                 * start with a clean slate.
                 *
                 * This ensures that no single test case can affect any other test case
                 *
                 * ============   1240  =============
                 * |                                |
                 * |                                |
                 * |           Zoom: 100%           |
                 * |         Size: Desktop         720
                 * |      Wrapped in container      |
                 * |                                |
                 * |                                |
                 * ==================================
                 */
                // ***********************************
                var iViewportHeight = 400;
                $("#ember-testing-container").attr(
                    "style",
                    "overflow: auto; height: " + iViewportHeight
                        + "px; width: 100%; background-color: #D2E0E6;position: absolute;top: 0px;"
                );
                $("#qunit").attr("style", "position: absolute;top: " + iViewportHeight + "px;width: 100%;");
                $("#ember-testing").attr(
                    "style",
                    "zoom: 100% !important; background-color: #ffffff; margin: 0 auto; transform:none !important;"
                );
                a24SetBrowserWidth(objEmber, this, funcSetBreakpointForTest, 1240);
                a24SetBrowserHeight(objEmber, 720);
                // ***********************************

                // Backup global a24
                _createBackupGlobalA24();

                // Call the funcBeforeEach if not empty
                if (typeof funcBeforeEach !== "undefined") {
                    funcBeforeEach.apply(this, [objAssert]);
                }
            },
            afterEach: function (objAssert) {
                // Call the funcAfterEach if not empty
                if (typeof funcAfterEach !== "undefined") {
                    funcAfterEach.apply(this, [objAssert]);
                }

                _restoreBackupGlobalA24();

                /**
                 * The code below will be used to restore browser changes made
                 */
                // ***********************************
                $("#ember-testing").removeAttr("style");
                $("#ember-testing-container").removeAttr("style");
                $("#qunit").removeAttr("style");
                // ***********************************

                _objStoredThis = null;
            }
        };

        return objIntegrationSetup;
    };
}

if (typeof a24GenerateUnitSetup === "undefined") {
    /**
     * Generate an object, used when creating an unit test suite, containing the generic beforeEach. This beforeEach will mock all generic
     * a24 helpers.
     *
     * @param objEmber - The ember object
     * @param funcBeforeEach - The function to execute on 'beforeEach'
     * @param funcAfterEach - The function to execute on 'afterEach'
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  8 September 2016
     *
     * @return A generic object used for creating integration suites
     */
    var a24GenerateUnitSetup = function (objEmber,
                                         funcBeforeEach,
                                         funcAfterEach) {
        // Default Object
        var objUnitSetup = {
            beforeEach: function (objAssert) {
                // Store the this object
                _objStoredThis = this;
                _objStoredEmber = objEmber;

                //Reset variables
                a24ResetDelayTask();

                // Backup global a24
                _createBackupGlobalA24();

                // Call the funcBeforeEach if not empty
                if (typeof funcBeforeEach !== "undefined") {
                    funcBeforeEach.apply(this, [objAssert]);
                }
            },
            afterEach: function (objAssert) {
                // Call the funcAfterEach if not empty
                if (typeof funcAfterEach !== "undefined") {
                    funcAfterEach.apply(this, [objAssert]);
                }

                _restoreBackupGlobalA24();

                _objStoredThis = null;
            }
        };

        return objUnitSetup;
    };
}

if (typeof a24GenerateRouteSetup === "undefined") {
    /**
     * Generate an object, used when creating an unit test suite for routes, containing the generic beforeEach. This beforeEach will mock all generic
     * a24 helpers. Will also add the google-analytics service since all routes require it.
     *
     * @param objEmber - The ember object
     * @param funcBeforeEach - The function to execute on 'beforeEach'
     * @param funcAfterEach - The function to execute on 'afterEach'
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  8 September 2016
     *
     * @return A generic object used for creating integration suites
     */
    var a24GenerateRouteSetup = function (objEmber,
                                          funcBeforeEach,
                                          funcAfterEach) {
        var objUnitSetupForRoute = a24GenerateUnitSetup(
            objEmber,
            funcBeforeEach,
            funcAfterEach
        );

        objUnitSetupForRoute.needs = ["service:google-analytics", "service:navigation"];

        return objUnitSetupForRoute;
    };
}

if (typeof _createBackupGlobalA24 === "undefined") {
    /**
     * Create backup copies of a24 global helpers
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  2 September 2016
     */
    function _createBackupGlobalA24() {

        /**
         * The code below will be used to create copies of our global objects.
         *
         * This allows developers to change the methods in each test without having them worry
         * about it affecting any of the other tests.
         */
        // ***********************************
        _arrGlobalClassesBackups["a24"] = $.extend(true, {}, typeof a24 !== "undefined" ? a24 : {} );
        _arrGlobalClassesBackups["a24Enums"] = $.extend(true, {}, typeof a24Enums !== "undefined" ? a24Enums : {});
        _arrGlobalClassesBackups["a24RSVP"] = $.extend(true, {}, typeof a24RSVP !== "undefined" ? a24RSVP : {});
        _arrGlobalClassesBackups["a24Constants"] = $.extend(true, {}, typeof a24Constants !== "undefined" ? a24Constants : {});
        _arrGlobalClassesBackups["a24DateManager"] = $.extend(true, {}, typeof a24DateManager !== "undefined" ? a24DateManager : {});
        _arrGlobalClassesBackups["a24RestUrlConstruct"] = $.extend(true, {}, typeof a24RestUrlConstruct !== "undefined" ? a24RestUrlConstruct : {});
        _arrGlobalClassesBackups["a24RestCallHelper"] = $.extend(true, {}, typeof a24RestCallHelper !== "undefined" ? a24RestCallHelper : {});
        _arrGlobalClassesBackups["a24RestResponseHandler"] = $.extend(true, {}, typeof a24RestResponseHandler !== "undefined" ? a24RestResponseHandler : {});
        _arrGlobalClassesBackups["a24SafeStrings"] = $.extend(true, {}, typeof a24SafeStrings !== "undefined" ? a24SafeStrings : {});
        _arrGlobalClassesBackups["a24Strings"] = $.extend(true, {}, typeof a24Strings !== "undefined" ? a24Strings : {});
        _arrGlobalClassesBackups["a24TokenStrings"] = $.extend(true, {}, typeof a24TokenStrings !== "undefined" ? a24TokenStrings : {});
        _arrGlobalClassesBackups["a24Validation"] = $.extend(true, {}, typeof a24Validation !== "undefined" ? a24Validation : {});
        _arrGlobalClassesBackups["momentHelper"] = $.extend(true, {}, typeof momentHelper !== "undefined" ? momentHelper : {});
        _arrGlobalClassesBackups["objTimeZoneDate"] = $.extend(true, {}, typeof _objTimeZoneDate !== "undefined" ? _objTimeZoneDate : {});
        // ***********************************
    }
}

if (typeof _restoreBackupGlobalA24 === "undefined") {
    /**
     * Restore backup copies of a24 global helpers
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  2 September 2016
     */
    function _restoreBackupGlobalA24() {

        /**
         * The code below will be used to restore copies of our global objects.
         */
        // ***********************************
        a24 = $.extend(true, {}, _arrGlobalClassesBackups["a24"]);
        a24Enums = $.extend(true, {}, _arrGlobalClassesBackups["a24Enums"]);
        a24RSVP = $.extend(true, {}, _arrGlobalClassesBackups["a24RSVP"]);
        a24Constants = $.extend(true, {}, _arrGlobalClassesBackups["a24Constants"]);
        a24DateManager = $.extend(true, {}, _arrGlobalClassesBackups["a24DateManager"]);
        a24RestUrlConstruct = $.extend(true, {}, _arrGlobalClassesBackups["a24RestUrlConstruct"]);
        a24RestCallHelper = $.extend(true, {}, _arrGlobalClassesBackups["a24RestCallHelper"]);
        a24RestResponseHandler = $.extend(true, {}, _arrGlobalClassesBackups["a24RestResponseHandler"]);
        a24SafeStrings = $.extend(true, {}, _arrGlobalClassesBackups["a24SafeStrings"]);
        a24Strings = $.extend(true, {}, _arrGlobalClassesBackups["a24Strings"]);
        a24TokenStrings = $.extend(true, {}, _arrGlobalClassesBackups["a24TokenStrings"]);
        a24Validation = $.extend(true, {}, _arrGlobalClassesBackups["a24Validation"]);
        momentHelper = $.extend(true, {}, _arrGlobalClassesBackups["momentHelper"]);
        _objTimeZoneDate = $.extend(true, {}, _arrGlobalClassesBackups["objTimeZoneDate"]);
        // Reset the array
        _arrGlobalClassesBackups = [];
        // ***********************************
    }
}

if (typeof a24DoTask === "undefined") {
    /**
     * This is used to run any task (optionally with a delay) that deals with the ember run loop
     *
     * @param iDelayMilliseconds - Delay in milliseconds to wait before running this code
     * @param objFunction - A function containing the code to run
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  2 September 2016
     */
    var a24DoTask = function (iDelayMilliseconds, objFunction) {
        a24DelayTask(_objStoredEmber, _objStoredThis, objFunction, iDelayMilliseconds);
    };
}

if (typeof a24SetBrowserWidthByName === "undefined") {
    /**
     * Set the browser width by using the pre-defined size name
     *
     * @param sSize - The pre-defined size name
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  2 September 2016
     */
    var a24SetBrowserWidthByName = function (sSize) {
        a24SetBrowserSize(_objStoredEmber, _objStoredThis, _funcStoredSetBreakpointForTest, sSize);
    };
}

if (typeof a24SetBrowserWidthByPixels === "undefined") {
    /**
     * Set the browser width by using the px value
     *
     * @param iWidth - The px value of the width of the browser
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  2 September 2016
     */
    var a24SetBrowserWidthByPixels = function (iWidth) {
        a24SetBrowserWidth(_objStoredEmber, _objStoredThis, _funcStoredSetBreakpointForTest, iWidth);
    };
}

if (typeof a24SetBrowserHeightByPixels === "undefined") {
    /**
     * Set the browser height by using the px value
     *
     * @param iHeight - The px value of the height of the browser
     *
     * @author Michael Barnard <michael.barnard@a24group.com>
     * @since  2 September 2016
     */
    var a24SetBrowserHeightByPixels = function (iHeight) {
        a24SetBrowserHeight(_objStoredEmber, iHeight);
    };
}
