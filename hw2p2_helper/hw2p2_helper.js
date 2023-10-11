"use strict";

const f = (a, b) => [].concat(...a.map(d => b.map(e => [].concat(d, e))));
const cartesian = (a, b, ...c) => (b ? cartesian(f(a, b), ...c) : a);

const expected_files = cartesian(["entire", "top", "bottom", "left", "right"], ["genuine", "impostor", "cmc", "roc"])
/*NPY files that follow the format <dataset>_<item>.npy, where <dataset> is each of entire, top, bottom, left, and right, and <item> is each of genuine, impostor, cmc, and roc. These files will be processed by a grading script, so they need to be uniquely named ithin the ZIP file for full points.*/
const expected_filenames = expected_files.map(pair => pair[0] + "_" + pair[1] + ".npy");

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + "$"; // $& means the whole matched string
}

//console.log(expected_filenames);

var $result = $("#result");
$("#file").on("change", function(evt) {
    // remove content
    $result.html("");
    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");

    // Closure to capture the file information.
    function handleFile(f) {
        var $title = $("<h4>", {
            text : f.name
        });
        var $fileContent = $("<ul>");
        $result.append($title);
        $result.append($fileContent);

        var dateBefore = new Date();
        JSZip.loadAsync(f)                                   // 1) read the Blob
            .then(function(zip) {
            
                expected_filenames.forEach(function(exf) {
                    // get matches.
                    const matches = zip.file(new RegExp(escapeRegExp(exf)));
                    
                    if (matches.length == 0) {
                       $fileContent.append($("<li>", {text: "⚠️ " + exf + " - 0 found", "class": "alert alert-danger"}));
                    } else if (matches.length == 1) {
                       $fileContent.append($("<li>", {text: "✅ " + exf + " - 1 found (" + matches[0].name + ")"}))
                    } else {
                       $fileContent.append($("<li>", {text: "⚠️ " +exf + " - " + matches.length + " found (" + matches.map((a) => `${a.name}`).join(", ") + ")"}));
                    }
                });
            }, function (e) {
                $result.append($("<div>", {
                    "class" : "alert alert-danger",
                    text : "Error reading " + f.name + ": " + e.message
                }));
            });
    }

    var files = evt.target.files;
    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }
});
