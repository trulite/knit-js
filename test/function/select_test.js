require("../test_helper.js")
require("knit/function/select")
require("./test_relation.js")

regarding("select", function() {
    
  beforeEach(function() {
    person = knit(function(){return testRelation([
      ["id", knit.Attribute.IntegerType],
      ["house_id", knit.Attribute.IntegerType],
      ["name", knit.Attribute.StringType],
      ["age", knit.Attribute.IntegerType]
    ])})    
    
    house = knit(function(){return testRelation([
      ["house_id", knit.Attribute.IntegerType],
      ["address", knit.Attribute.StringType],
      ["city_id", knit.Attribute.IntegerType]
    ])})
  })
  
  regarding("sameness and equivalence", function() {
    
    test("same", function (){knit(function(){
      assert.equal(true, select(person, TRUE).isSame(select(person, TRUE)))
      
      assert.equal(false, select(person, TRUE).isSame(select(person, FALSE)))
      assert.equal(false, select(person, TRUE).isSame(select(house, TRUE)))
    })})
    
    xtest("commutativity - order of selects doesn't matter (effectively a conjunction)", function (){knit(function(){
      assert.equal(true, select(select(person, FALSE), TRUE).
                           isEquivalent(select(select(person, TRUE), FALSE)))
      
      assert.equal(false, select(select(person, FALSE), TRUE).
                            isEquivalent(select(select(person, FALSE), FALSE)))
      
      assert.equal(false, select(select(person, FALSE), TRUE).
                            isSame(select(select(person, TRUE), FALSE)))
    })})
    
    xtest("selection splitting", function (){knit(function(){
      assert.equal(true, select(person, conjunction(TRUE, FALSE)).
                           isEquivalent(select(select(person, TRUE), FALSE)))
      
      assert.equal(true, select(person, conjunction(TRUE, FALSE)).
                           isEquivalent(select(select(person, FALSE), TRUE)))
      
      assert.equal(false, select(person, conjunction(TRUE, FALSE)).
                            isEquivalent(select(select(person, TRUE), TRUE)))
      
      assert.equal(false, select(person, conjunction(TRUE, FALSE)).
                            isSame(select(select(person, TRUE), FALSE)))
    })})
    
  })
  
  xregarding("merging and splitting", function() {
    
    test("merge a nested selection, becomes a conjunction", function(){knit(function(){      
      assert.equal(true, select(select(person, TRUE), FALSE).
                           merge().isSame(select(person, conjunction(TRUE, FALSE))))
    })})
      
    test("merge a fully merged selection does nothing", function(){knit(function(){
      assert.equal(true, select(person, conjunction(TRUE, FALSE)).
                           merge().isSame(select(person, conjunction(TRUE, FALSE))))
    })})
      
  })
})

