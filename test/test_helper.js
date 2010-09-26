require.paths.push("./test");
require.paths.push("./lib");

require("jasmine-node.js");

var sys = require('sys');

global["d"] = function(str) {
  sys.puts(str);
};

for(var key in jasmine) {
  global[key] = jasmine[key];
}


assert = require('assert');

jasmine.alreadyRan = false
process.on('exit', function () {
  if (!jasmine.alreadyRan) {  
    var isVerbose = false;
    var showColors = true;
  
    jasmine.execute(function(runner, log){
      jasmine.alreadyRan = true
      process.exit(runner.results().failedCount);
    }, isVerbose, showColors);  
  }
});

