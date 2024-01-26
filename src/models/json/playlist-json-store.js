import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { trackJsonStore } from "./track-json-store.js";

export const playlistJsonStore = {
  async getAllPlaylists() {
    await db.read();
    return db.data.playlists;
  },

  async addPlaylist(playlist) {
    await db.read();
    playlist._id = v4();
    playlist.tracks = [];
    db.data.playlists.push(playlist);
    await db.write();
    return playlist;
  },

  async getPlaylistById(id) {
    await db.read();
    let p = db.data.playlists.find((playlist) => playlist._id === id);
    if (p === undefined) {
      p = null;
      return p;
    }
    p.tracks = await trackJsonStore.getTracksByPlaylistId(p._id);
    if (p.tracks === undefined) {
      p.tracks = null;
    }
    return p;
  },

  async getUserPlaylists(userid) {
    await db.read();
    return db.data.playlists.filter((playlist) => playlist.userid === userid);
  },

  async deletePlaylistById(id) {
    await db.read();
    const index = db.data.playlists.findIndex((playlist) => playlist._id === id);
    if (index !== -1) db.data.playlists.splice(index, 1);
    await db.write();
  },

  async deleteAllPlaylists() {
    db.data.playlists = [];
    await db.write();
  },
};