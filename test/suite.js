require("./helper")


var subdir = process.argv.length==3 ? "/" + process.argv[2] : ""

jasmine.requireAllSpecFiles(__dirname + subdir, "_engine.js")
jasmine.requireAllSpecFiles(__dirname + subdir, "_test.js")
