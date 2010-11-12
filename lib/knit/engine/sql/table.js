require("knit/engine/sql/attribute")

knit.engine.sql.Table = function(name, db) {
  this.name = name
  this._db = db
  
  this.attributes = _.map(db.tableDefinition(name).columns, function(column) {
    return new knit.engine.sql.Attribute(column[0])
  })
}

_.extend(knit.engine.sql.Table.prototype, {
  attr: function(attributeName) {
    return _.detect(this.attributes, function(attr){return attr.name == attributeName})
  },
  
  isSame: function(other) {
    return this.name == other.name
  },
  
  inspect: function() {
    return this.name + "[" + 
           _.map(this.attributes, function(attr){return attr.inspect()}).join(",") + 
           "]" 
  },
  // 
  // tuplesSync: function() {
  //   return [].concat(this._tuples)
  // },

  // insertSync: function(tuplesToAdd) {
  //   var self = this
  //   _.each(tuplesToAdd, function(tuple){self._tuples.push(tuple)})
  //   return this
  // }
  
})

knit.engine.sql.Table.prototype.isEquivalent = knit.engine.sql.Table.prototype.isSame