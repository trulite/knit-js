require("./helper")

assert.rawRelationEqual = function(expected, actual) {
  var withoutCostActual = {}
  for(var k in actual) if (k!="cost") withoutCostActual[k] = actual[k]
  
  assert.equal(expected, withoutCostActual)
}


