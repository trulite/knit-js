require("../../test_helper")
require("./sql_fakes.js")
require("knit/translation/sql")

regarding("starting relation", function() {
  
  beforeEach(function(){ setupPersonHouseCity(this, function(name, attributeNames){return new FakeTable(name, attributeNames)}) })
  var sql = knit.translation.sql
  
  test("convert a straight relation reference to sql", function(){
    var relation = this.$R(function(){
      return relation("person")
    })
    assert.equal(
      new sql.Select().
        from("person"),
      relation.toSql()
    )
  })

})