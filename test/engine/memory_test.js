require("../helper")
require("knit/engine/memory")
require("../relation_proof")

regarding("memory", function() {
  beforeEach(function(){
    var r = new knit.engine.memory.MutableBaseRelation("foo", [["a",knit.attributeType.Integer], ["b",knit.attributeType.String]])
    this.r = r
    this.$K = knit.createBuilderFunction({bindings:{
      r:r
    }})
  })
  
  relationProof("MemoryRelation", function(attributeNamesAndTypes){ return new knit.engine.memory.MutableBaseRelation("x", attributeNamesAndTypes) } )
  
  regarding("MemoryRelation inspect", function() {
    test("inspect", function(){
      assert.equal("foo[a,b]", this.r.inspect())
    })
  })

  regarding("memory predicate - match", function() {
  
    test("true false match", function(){this.$K(function(){
      assert.equal(true, TRUE.match([[attr("r.b"),1]]))
      assert.equal(false, FALSE.match([[attr("r.b"),1]]))
    })})

    test("equality match", function(){
      assert.equal(true, new knit.algebra.predicate.Equality(this.r.attr("b"), 1).match(this.r.attributes(), [0,1]))
      assert.equal(false, new knit.algebra.predicate.Equality(this.r.attr("b"), 1).match(this.r.attributes(), [0,2]))
      assert.equal(false, new knit.algebra.predicate.Equality(this.r.attr("b"), 1).match(this.r.attributes(), [1,0]))
    })

    test("conjunction match", function(){
      assert.equal(true, 
        new knit.algebra.predicate.Conjunction(
          new knit.algebra.predicate.Equality(this.r.attr("b"), 1),
          new knit.algebra.predicate.Equality(this.r.attr("a"), 999)
        ).match(this.r.attributes(), [999,1])
      )
      assert.equal(false, 
        new knit.algebra.predicate.Conjunction(
          new knit.algebra.predicate.Equality(this.r.attr("b"), 2),
          new knit.algebra.predicate.Equality(this.r.attr("a"), 999)
        ).match(this.r.attributes(), [999,1])
      )
      assert.equal(false, 
        new knit.algebra.predicate.Conjunction(
          new knit.algebra.predicate.Equality(this.r.attr("b"), 1),
          new knit.algebra.predicate.Equality(this.r.attr("a"), 888)
        ).match(this.r.attributes(), [999,1])
      )          
    })
  })
  
  regarding("the cost of doing an in-memory operation is all the iterations that happened in the course of calculating the result", function() {
    
    test("just compiling a relation and doing nothing else is zero cost", function(){this.$K(function(){
      resolve()
      assert.equal(0, relation("r").compile().cost())
    })})
    
    test("the size of the select result is the cost", function(){this.$K(function(){
      resolve()
      relation("r").merge([
        [1, 98],
        [2, 98],
        [3, 99]
      ])
      
      assert.equal(6, select(relation("r"), equality(attr("r.a"), 1)).compile().cost())
      assert.equal(9, select(relation("r"), equality(attr("r.b"), 98)).compile().cost())
      assert.equal(3, select(relation("r"), TRUE).compile().cost())
      assert.equal(6, select(select(relation("r"), TRUE), TRUE).compile().cost())
    })})
    
    test("join cost usually depends greatly on whether a good join predicate is available", function(){this.$K(function(){
      var person = new knit.engine.memory.MutableBaseRelation("person", [["id", knit.attributeType.Integer], 
                                                                ["houseId", knit.attributeType.Integer], 
                                                                ["name", knit.attributeType.String], 
                                                                ["age", knit.attributeType.String]])
      var house = new knit.engine.memory.MutableBaseRelation("house", [["houseId", knit.attributeType.Integer], 
                                                              ["address", knit.attributeType.String],
                                                              ["cityId", knit.attributeType.String]])
      var city = new knit.engine.memory.MutableBaseRelation("city", [["cityId", knit.attributeType.Integer], 
                                                            ["name", knit.attributeType.String]])
      
      person.merge([
        [1, 101, "Jane", 5],
        [2, 101, "Puck", 12],
        [3, 102, "Fanny", 30]
      ])
      
      house.merge([
        [101, "Chimney Hill", 1001],
        [102, "Parnassus", 1002]
      ])

      city.merge([
        [1001, "San Francisco"],
        [1002, "New Orleans"]
      ])
      
      assert.equal(9, join(person, house).compile().cost())
      assert.equal(9 + 18, join(join(person, house), city).compile().cost())
      
      assert.equal(51, join(person, house, equality(person.attr("houseId"), house.attr("houseId"))).compile().cost())
      assert.equal(150,   join(join(person, house, equality(person.attr("houseId"), house.attr("houseId"))),
                               city, equality(house.attr("cityId"), city.attr("cityId"))).compile().cost())
    })})
    
    test("the cost is proportional to the number of rows", function(){this.$K(function(){
      resolve()
      
      relation("r").merge([
        [1, 98],
        [2, 98],
        [3, 99]
      ])
      
      assert.equal(8, order.asc(relation("r"), attr("r.a")).compile().cost())
      assert.equal(8, order.desc(relation("r"), attr("r.a")).compile().cost())

      assert.equal(16, order.asc(order.asc(relation("r"), attr("r.a")), attr("r.b")).compile().cost())
    })})
  })
})
