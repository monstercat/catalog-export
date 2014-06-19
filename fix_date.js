#!/usr/bin/env node

var interact = require('json-interact');

interact(function(obj, done){
  obj.release.releaseDate = new Date(+obj.release.released);
  this.push(obj);
  done();
});
