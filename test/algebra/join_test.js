require("../helper")
require("knit/algebra/join")
require("./../test_relation.js")

regarding("join", function() {
    
  beforeEach(function(){ setupPersonHouseCity(this) })
  
  test("combines the attributes of the two relations", function (){
    var join = this.$K(function(){return join(relation("person"), relation("house"))})
    assert.equal(["personId", "houseId", "name", "age", "houseId", "address", "cityId"], join.attributes().names())
  })
  
  test("inspect", function(){this.$K(function(){
    assert.equal("join(*person,*house)", 
                 join(relation("person"), relation("house")).inspect())

    assert.equal("join(*person,*house,eq(4,5))", 
                 join(relation("person"), relation("house"), equality(4,5)).inspect())

  })})
  
  regarding("sameness and equivalence", function() {
    
    test("same", function(){this.$K(function(){
      assert.same(join(relation("person"), relation("house")), join(relation("person"), relation("house")))

      assert.notSame(join(relation("person"), relation("house")), join(relation("house"), relation("city")))
      assert.notSame(join(relation("house"), relation("city")), join(relation("person"), relation("house")))
    })})    

    test("same - with predicate", function(){this.$K(function(){
      assert.same(join(relation("person"), relation("house"), equality(attr("person.houseId"), attr("house.houseId"))),
                  join(relation("person"), relation("house"), equality(attr("person.houseId"), attr("house.houseId"))))

      assert.notSame(join(relation("person"), relation("house"), equality(attr("person.name"), attr("house.houseId"))),
                     join(relation("person"), relation("house"), equality(attr("person.houseId"), attr("house.houseId"))))
    })})

    test("same implies equivalent", function(){this.$K(function(){
      assert.equivalent(join(relation("person"), relation("house")), join(relation("person"), relation("house")))
    })})

    test("equivalent with predicate", function(){this.$K(function(){
      assert.equivalent(join(relation("person"), relation("house"), equality(attr("person.houseId"), attr("house.houseId"))),
                        join(relation("person"), relation("house"), equality(attr("person.houseId"), attr("house.houseId"))))

      assert.equivalent(join(relation("person"), relation("house"), equality(attr("house.houseId"), attr("person.houseId"))),
                        join(relation("person"), relation("house"), equality(attr("person.houseId"), attr("house.houseId"))))
    })})

    test("commutativity - two join functions are equivalent if the relations are the same but in different order", function(){this.$K(function(){
      assert.equivalent(join(relation("person"), relation("house")), join(relation("house"), relation("person")))
      assert.notEquivalent(join(relation("person"), relation("house")), join(relation("person"), relation("city")))
    })})

    test("nonassociativity - order of operations (inner/outer) matters", function(){this.$K(function(){
      assert.equivalent(join(join(relation("person"), relation("house")), relation("city")), join(join(relation("person"), relation("house")), relation("city")))
      assert.notEquivalent(join(join(relation("person"), relation("house")), relation("city")), join(relation("person"), join(relation("house"), relation("city"))))
    })})
    
  })
  
  regarding("appendToPredicate", function() {
    test("when there's only a True predicate existing, replace it", function(){this.$K(function(){
      assert.same(join(relation("person"), relation("house")).appendToPredicate(equality(4,5)), join(relation("person"), relation("house"), equality(4,5)))
      assert.same(join(relation("person"), relation("house"), TRUE).appendToPredicate(equality(4,5)), join(relation("person"), relation("house"), equality(4,5)))
    })})    

    test("when there's any other kind of existing predicate, make a conjunction", function(){this.$K(function(){
      assert.same(join(relation("person"), relation("house"), equality(4,5)).appendToPredicate(equality(6,7)),
                  join(relation("person"), relation("house"), conjunction(equality(4,5), equality(6,7))))
    })})    
  })
})

