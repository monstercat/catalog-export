#!/usr/bin/env node --harmony

'use strict';

let monk = require('monk');
let wrap = require('co-monk');
let co   = require('co');

let db = monk('localhost/test');
let Album = wrap(db.get('Album'));
let Track = wrap(db.get('Track'));

module.exports = function(done) {
  co(function*(){
    let albums = yield Album.find({})
    let tracks = yield Track.find({})
    let albumMap = albums.reduce(function(map, album){
      map[album._id] = album;
      return map;
    }, {})
    let items = tracks.reduce(function(arr, track){
      (track.albums || []).forEach(function(album){
        album = albumMap[album.albumId]
        arr.push({
          release: album,
          track: track,
        });
      });
      return arr;
    }, []);
    items.forEach(function(item){
      process.stdout.write(JSON.stringify(item) + "\n");
    });
    db.close();
  })(done);
}

if (!module.parent) module.exports()
