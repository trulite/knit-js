//see http://alexyoung.org/2009/10/22/javascript-dsl/
knit._DSLFunction = function() {
  var _ = knit._util,
      dslLocals = {},
      outerFunction = function(userFunction, what_theKeywordThis_IsSupposedToBe){
        if (what_theKeywordThis_IsSupposedToBe === undefined) {
          what_theKeywordThis_IsSupposedToBe = this
        }
    
        var localNames = []
        var localValues = []
        _.each(_.keys(dslLocals), function(key){
          localNames.push(key)
          localValues.push(dslLocals[key])
        })
    
        var userFunctionBody = "(knit._util.bind(" + userFunction.toString().replace(/\s+$/, "") + ",this))()"
        var wrappingFunctionBody = "(function(" + localNames.join(",") + "){return " + userFunctionBody + "})"
        return eval(wrappingFunctionBody).apply(what_theKeywordThis_IsSupposedToBe, localValues)
      }
  
  return _.extend(outerFunction, {

    dslLocals:dslLocals,

    specialize: function(childDslLocals) {
      var allDslLocals = _.extend({}, outerFunction.dslLocals, childDslLocals)
      var childDslFunction = new knit._DSLFunction()
      _.extend(childDslFunction.dslLocals, allDslLocals)
      return childDslFunction
    }

  }) 
}