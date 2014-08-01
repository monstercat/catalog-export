#!/usr/bin/env node --harmony

'use strict';

let monk = require('monk');
let wrap = require('co-monk');
let co   = require('co');

let db = monk('localhost/test');

let Contract = wrap(db.get('Contract'));
let Track    = wrap(db.get('Track'));

module.exports = function(done) {

  co(function*(){
    var query = {
      track: { $exists: false },
      masters: { $exists: true }
    }

    let contracts = yield Contract.find(query)
    let tracks = yield Track.find({})

    let trackMap = tracks.reduce(function(map, track){
      map[track.artistsTitle + " - " + track.title] = track;
      map[track.title] = track;
      (track.altNames || []).forEach(function(altName){
        map[track.artistsTitle + " - " + altName] = track;
        map[altName] = track;
      });
      return map;
    }, {});

    for (var i = 0, len = contracts.length; i < len; i++) {
      var contract = contracts[i];

      let track = trackMap[contract.masters] || trackMap[contract.trackName]
      if (!track) {
        console.log("missing " + contract.masters)
        continue;
      }

      Contract.updateById(contract._id, { $set: { track: track._id } });
    }

    db.close();
  })(done);
}

if (!module.parent) module.exports()
