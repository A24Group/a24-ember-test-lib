// Require fs and path
var fs = require("fs");
var path = require("path");

// Template directory
var sTemplateDir = '../testsTemplates/integration/components';

// If the template directory does not exist, skip the template prepare
if (!fs.existsSync(sTemplateDir)) {
    console.log("No Tokens to replace since the directory is empty");
    process.exit(1);
}

// Create the testing directory
var sTargetDirectory = "../tests/integration/components";
// Create the directory
sTargetDirectory.split(path.sep).reduce(
    function(sParentDir, sChildDir) {
        const sCurrentDir = path.resolve(sParentDir, sChildDir);

        if (!fs.existsSync(sCurrentDir)) {
            fs.mkdirSync(sCurrentDir);
        }

        return sCurrentDir;
    },
    ""
);

// Loop through all the files in the integration components directory
fs.readdir(
    sTemplateDir,
    function(objError, arrFiles) {

        // If the error is true
        if(objError) {
            console.error("Could not list the directory.", objError);
            process.exit(1);
        }

        var iTestCount = arrFiles.length;

        if(iTestCount === 0) {
            console.error("No templates found for prepare.");
            process.exit(1);
        }

        console.log("Found " + iTestCount + " test files to prepare...");

        // Itterate over the files found
        for (var i = 0; i < iTestCount; i++) {

            var sFile = arrFiles[i];

            var sOriginFile = "../testsTemplates/integration/components/" + sFile;
            var sNewFile = "../tests/integration/components/" + sFile;
        
            // Copy the file accross
            copyFileSync(
                sOriginFile,
                sNewFile
            );

            // Get the name of the test
            var sComponentName = sFile.split(".")[0];

            console.log("Replacing tokens for " + sComponentName);
            
            // Get the content of the file
            var sFileData = fs.readFileSync(
                sNewFile,
                "utf8"
            );
            
            // Split the test class into single line items
            var arrTestLines = sFileData.split('\n');

            // Create a new counter
            var iTokenCount = 0;

            for (var l = 0; l < arrTestLines.length; l++) {

                // Get the current line
                var sTestcaseLine = arrTestLines[l];

                // If the current line matches the regex pattern
                var bLineMatch = (/^ *\/\/ *\^\^\w+\.html\^\^/m).test(sTestcaseLine); 
                
                if (bLineMatch) {
                    // Increment the counter
                    iTokenCount++;

                    // Split the token up and find only the filename
                    var sFileIdentifier = sTestcaseLine.split("^^")[1];

                    // build up the full path to the file for the token
                    var sTokenValueFile = "../testsTemplates/html/integration/components/" +
                        sComponentName + "/" +
                        sFileIdentifier;

                    // Check if the token exists
                    if (!fs.existsSync(sTokenValueFile)) {
                        // Print to console if the token was not found
                        console.log("\x1b[31m" + "No such html: " + sTokenValueFile + "\x1b[0m");
                        continue;
                    }
                    
                    // Read the content of the html file
                    var sTokenFileContent = fs.readFileSync(
                        sTokenValueFile,
                        "utf8"
                    );

                    var sTokenReplaceString = sTokenFileContent.trim();
                    sTokenReplaceString = sTokenReplaceString.replace(/\'/g, "\\'");
                    // Split the new lines for use in js files
                    sTokenReplaceString = sTokenReplaceString.replace(/\n/g ,"' + \n'\\n");
                    
                    // JS CODE GOES HERE
                    arrTestLines[l] = "a24TemplateCompareWithSave(" +
                        "objAssert, " +
                        "this.$().html().trim()," +
                        "'" + sTokenReplaceString + "'," +
                        "'" + sComponentName + "'," +
                        "'" + sFileIdentifier + "'" +
                    ");";
                }
            }
            console.log("...replaced " + iTokenCount + " tokens");

            var sFinalPreparedJS = arrTestLines.join("\n");
            
            fs.writeFileSync(
                sNewFile,
                sFinalPreparedJS,
                "utf8"
            );
        }
    }
);

// Copy files using sync
function copyFileSync(sSource, sTarget) {
    
    var sTargetFile = sTarget;
    //if target is a directory a new file with the same name will be created
    if (fs.existsSync(sTarget)) {
        if (fs.lstatSync(sTarget).isDirectory()) {
            sTargetFile = path.join(sTarget, path.basename(sSource));
        }
    }
    fs.writeFileSync(sTargetFile, fs.readFileSync(sSource));
}
