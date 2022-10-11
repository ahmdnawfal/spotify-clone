import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/songAtom";
import useSpotify from "./useSpotify";

function useSongInfo() {
  const spotfiyApi = useSpotify();
  const [currentTrackId, setCurrentTrackID] =
    useRecoilState(currentTrackIdState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (spotfiyApi.getAccessToken()) {
        if (currentTrackId) {
          const trackInfo = await fetch(
            `https://api.spotify.com/v1/tracks/${currentTrackId}`,
            {
              headers: {
                Authorization: `Bearer ${spotfiyApi.getAccessToken()}`,
              },
            }
          ).then((res) => res.json());
          setSongInfo(trackInfo);
        }
      }
    };
    fetchSongInfo();
  }, [currentTrackId, spotfiyApi]);

  return songInfo;
}

export default useSongInfo;
