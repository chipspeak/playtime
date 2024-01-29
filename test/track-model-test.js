import { assert } from "chai";
import { EventEmitter } from "events";
import { get } from "mongoose";
import { db } from "../src/models/db.js";
import { testTrack } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Track Model tests", () => {
  setup(async () => {
    db.init("mongo");
    await db.trackStore.deleteAllTracks();
  });

  test("create a track", async () => {
    const newPlaylist = await db.playlistStore.addPlaylist(testTrack);
    const newTrack = await db.trackStore.addTrack(newPlaylist.tracks[0]);
    assertSubset(newTrack, newPlaylist.track);
  });

  test("delete all tracks", async () => {
    let returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 0);
    await db.trackStore.deleteAllTracks();
    returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 0);
  });

  test("get a track - success", async () => {
    const newPlaylist = await db.playlistStore.addPlaylist(testTrack);
    const track = await db.trackStore.addTrack(newPlaylist.track);
    const returnedTrack = await db.trackStore.getTrackById(track._id);
    assertSubset(track, returnedTrack);
  });

  test("delete One track - success", async () => {
    const newPlaylist = await db.playlistStore.addPlaylist(testTrack);
    const track = await db.trackStore.addTrack(newPlaylist.tracks[0]);
    await db.trackStore.deleteTrack(track._id);
    const returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 0); // Since we deleted the only track, the length should be 0
    const deletedTrack = await db.trackStore.getTrackById(track._id);
    assert.isNull(deletedTrack); // The track should be deleted, so this should be null
  });

  test("get a track - bad params", async () => {
    const nullTrack = await db.trackStore.getTrackById("");
    assert.isNull(nullTrack);
  });

  test("delete One Track - fail", async () => {
    const newPlaylist = await db.playlistStore.addPlaylist(testTrack);
    const track = await db.trackStore.addTrack(newPlaylist.tracks[0]);
    await db.trackStore.deleteTrack("bad-id");
    const returnedTracks = await db.trackStore.getAllTracks();
    assert.equal(returnedTracks.length, 1); // Since deletion failed, the length should remain unchanged
    const stillExistingTrack = await db.trackStore.getTrackById(track._id);
    assert.isNotNull(stillExistingTrack); // The track should still exist
  });
});
