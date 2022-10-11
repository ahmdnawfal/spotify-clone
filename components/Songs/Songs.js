import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistSongs } from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import Song from "../Song/Song";

function Songs() {
  const playlistId = useRecoilValue(playlistIdState);
  const [playlistSong, setPlaylistSong] = useRecoilState(playlistSongs);
  const spotifyApi = useSpotify();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylistSong(data.body.tracks.items);
        })
        .catch((err) => console.log("Something wrong error", err));
    }
  }, [spotifyApi, playlistId]);

  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {playlistSong.map((data, i) => (
        <Song key={data?.track?.id} track={data} order={i} />
      ))}
    </div>
  );
}

export default Songs;
