import { assert } from "chai";
import { db } from "../src/models/db.js";
import { testPlaylist, testPlaylists } from "./fixtures.js";

suite("Playlist Model tests", () => {
    setup(async () => {
      db.init();
      await db.playlistStore.deleteAllPlaylists();
      for (let i = 0; i < testPlaylists.length; i += 1) {
        // eslint-disable-next-line no-await-in-loop
        testPlaylists[i] = await db.playlistStore.addPlaylist(testPlaylists[i]);
      }
    });
  
    test("create a playlist", async () => {
      const newPlaylist = await db.playlistStore.addPlaylist(testPlaylist);
      assert.equal(newPlaylist, testPlaylist);
    });
  
    test("delete all playlists", async () => {
      let returnedPlaylists = await db.playlistStore.getAllPlaylists();
      assert.equal(returnedPlaylists.length, 3);
      await db.playlistStore.deleteAllPlaylists();
      returnedPlaylists = await db.playlistStore.getAllPlaylists();
      assert.equal(returnedPlaylists.length, 0);
    });
  
    test("get a playlist - success", async () => {
      const playlist = await db.playlistStore.addPlaylist(testPlaylist);
      const returnedPlaylist = await db.playlistStore.getPlaylistById(playlist._id);
      assert.deepEqual(playlist, returnedPlaylist);
    });
  
    test("delete One playlist - success", async () => {
      await db.playlistStore.deletePlaylistById(testPlaylists[0]._id);
      const returnedPlaylists = await db.playlistStore.getAllPlaylists();
      assert.equal(returnedPlaylists.length, testPlaylists.length - 1);
      const deletedPlaylist = await db.playlistStore.getPlaylistById(testPlaylists[0]._id);
      assert.isNull(deletedPlaylist);
    });
  
    test("get a playlist - failures", async () => {
      const noPlaylistWithId = await db.playlistStore.getPlaylistById("123");
      assert.isNull(noPlaylistWithId);
    });
  
    test("get a playlist - bad params", async () => {
      let nullPlaylist = await db.playlistStore.getPlaylistById("");
      assert.isNull(nullPlaylist);
    });
  
    test("delete One Playlist - fail", async () => {
      await db.playlistStore.deletePlaylistById("bad-id");
      const getAllPlaylists = await db.playlistStore.getAllPlaylists();
      assert.equal(testPlaylists.length, getAllPlaylists.length);
    });
  });