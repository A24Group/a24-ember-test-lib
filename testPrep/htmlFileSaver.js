// Require http and fs
const http = require("http");
const fs = require("fs");
const path = require("path");
const pretty =require("pretty");

// Details
const iServerPort = 4110;

// The standard http response function
var createStandardResponse = function(bSuccess, sResponseMessage) {
    return JSON.stringify(
        {
            bSuccess: bSuccess,
            sResponseMessage: sResponseMessage
        }
    );
}

// Run the serer
const objServer = http.createServer(function(objRequest, objResponse) {

    // If the request url matches the route
    if (objRequest.url === "/test-compare-save-result") {
        // Store body as array
        var mBody = [];
        objRequest.on("data", function(objChunk) {
            // Push various chuncks to body
            mBody.push(objChunk);
        }).on("end", function() {
            
            // store final body
            mBody = Buffer.concat(mBody).toString();
            var objJsonRequest = JSON.parse(mBody);
            
            // Handle missing properties
            if (
                !objJsonRequest.sTestClassName ||
                !objJsonRequest.sTestHtmlName ||
                !objJsonRequest.sHtmlContent
            ) {
                var sMessage = "Missing param "
                if (!objJsonRequest.sTestClassName) {
                    sMessage += "sTestClassName";
                }
                if (!objJsonRequest.sTestHtmlName) {
                    sMessage += "sTestHtmlName";
                }
                if (!objJsonRequest.sHtmlContent) {
                    sMessage += "sHtmlContent";
                }

                response.end(
                    createStandardResponse(
                        false,
                        sMessage
                    )
                );
                return;
            }

            // Everything looks good, start with file save

            var sOutputBaseFolder = "../testsTemplates/htmlDiff/integration/components/";

            var sTestClassName = objJsonRequest.sTestClassName;
            var sTestHtmlName = objJsonRequest.sTestHtmlName;
            var sTestHtml = ("" + objJsonRequest.sHtmlContent).trim();

            var sFullPathToHTML = sOutputBaseFolder + sTestClassName;

            // Create each directory using a reduce
            sFullPathToHTML.split(
                path.sep
            ).reduce(
                function (sCurrentPath, sFolder) {
                    sCurrentPath += sFolder + path.sep;
                    if (!fs.existsSync(sCurrentPath)){
                        fs.mkdirSync(sCurrentPath);
                    }
                    return sCurrentPath;
                },
                ""
            );

            // Final location for html diff file
            var sDiffFileLocation = sFullPathToHTML + path.sep + sTestHtmlName;
            
            // Final HTML to place in diff file
            var sHTMLParsed = pretty(sTestHtml, {
                indent_size: 4
            });

            // Write the html file
            fs.writeFileSync(
                sDiffFileLocation,
                sHTMLParsed,
                "utf8"
            );

            // Respond with success
            objResponse.end(
                createStandardResponse(
                    true,
                    "Successfully saved file"
                )
            );

        });
    } else {
        objResponse.end(
            createStandardResponse(
                false,
                "Route sent in to Ember Test Helper is not supported."
            )
        );
    }
    
}).listen(iServerPort); // With specified port