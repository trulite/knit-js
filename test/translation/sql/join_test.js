require("../../test_helper")
require("./sql_fakes.js")
require("knit/translation/sql")

regarding("join to sql", function() {
  
  beforeEach(function(){ setupPersonHouseCity(this, function(name, attributeNames){return new FakeTable(name, attributeNames)}) })
  var sql = knit.translation.sql
  
  regarding("expression to sql object", function() {
    
    test("cartesian", function(){
      var join = this.$R(function(){
        return join(relation("person"), relation("house"))
      })
      assert.same(
        new sql.Select().
          join(new sql.Join(this.person, this.house, null)),
        join.toSql()
      )
    })

    test("with predicate", function(){
      var join = this.$R(function(){
        return join(relation("person"), relation("house"), eq(attr("house.houseId"), attr("person.houseId")))
      })
      assert.same(
        new sql.Select().
          join(new sql.Join(this.person, this.house, new sql.predicate.Equals(new sql.Column("house.houseId"), new sql.Column("person.houseId")))),
        join.toSql()
      )
    })
    
    test("columns/attributes", function(){
      assert.equal(this.person.attributes().concat(this.house.attributes()),
                   new sql.Select().join(new sql.Join(this.person, this.house, null)).columns())
    })
  })
  
  regarding("sql object to sql statement", function() {
  
    test("cartesian", function(){
      assert.equal(
        "select person.personId as person$$personId, person.houseId as person$$houseId, " +
        "person.name as person$$name, person.age as person$$age, " + 
        "house.houseId as house$$houseId, house.address as house$$address, house.cityId as house$$cityId " +
        "from person join house",
        new sql.Select().
          join(new sql.Join(this.person, this.house, null)).toStatement().sql
      )
    })

    test("with predicate", function(){
      assert.equal(
        "select person.personId as person$$personId, person.houseId as person$$houseId, " +
        "person.name as person$$name, person.age as person$$age, " +
        "house.houseId as house$$houseId, house.address as house$$address, house.cityId as house$$cityId " +
        "from person join house on house.houseId = person.houseId",
        new sql.Select().
          join(new sql.Join(this.person, this.house, new sql.predicate.Equals(new sql.Column("house.houseId"), new sql.Column("person.houseId")))).
          toStatement().sql
      )
    })    
    
    test("and values", function(){
      assert.equal(
        {sql:"select person.personId as person$$personId, person.houseId as person$$houseId, " +
             "person.name as person$$name, person.age as person$$age, " +
             "house.houseId as house$$houseId, house.address as house$$address, house.cityId as house$$cityId " +
             "from person join house on house.houseId = ?", values:[101]},
        new sql.Select().
          join(new sql.Join(this.person, this.house, new sql.predicate.Equals(new sql.Column("house.houseId"), 101))).
          toStatement()
      )
    })    
    
  })
})
