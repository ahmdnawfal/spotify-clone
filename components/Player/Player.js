import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../../atoms/songAtom";
import useSongInfo from "../../hooks/useSongInfo";
import useSpotify from "../../hooks/useSpotify";
import {
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
  BackwardIcon,
  ChevronDoubleDownIcon,
  ChevronDoubleUpIcon,
  ForwardIcon,
  PlayIcon,
  PlayPauseIcon,
} from "@heroicons/react/24/outline";
import { debounce } from "lodash";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (spotifyApi.getAccessToken()) {
      if (!songInfo) {
        spotifyApi.getMyCurrentPlayingTrack().then((data) => {
          setCurrentTrackId(data?.body?.item?.id);

          spotifyApi.getMyCurrentPlaybackState().then((data) => {
            setIsPlaying(data?.body?.is_playing);
          });
        });
      }
    }
  };

  const handlePlayPause = () => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        if (data?.body?.is_playing) {
          spotifyApi.pause();
          setIsPlaying(false);
        } else {
          spotifyApi.play();
          setIsPlaying(true);
        }
      });
    }
  };

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceAdjustVolume(volume);
    }
  }, [volume]);

  const debounceAdjustVolume = useCallback(
    debounce((volume) => {
      if (spotifyApi.getAccessToken()) {
        spotifyApi.setVolume(volume).catch((err) => {});
      }
    }, 500),
    []
  );

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrackIdState, spotifyApi, session]);

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white  grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10 "
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* center */}
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="buttons" />
        <BackwardIcon className="buttons" />
        {isPlaying ? (
          <PlayPauseIcon
            onClick={handlePlayPause}
            className="buttons w-10 h-10 "
          />
        ) : (
          <PlayIcon onClick={handlePlayPause} className="buttons w-10 h-10" />
        )}
        <ForwardIcon className="buttons" />
        <ArrowUturnLeftIcon className="buttons" />
      </div>
      {/* right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <ChevronDoubleDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="buttons"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <ChevronDoubleUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="buttons"
        />
      </div>
    </div>
  );
}

export default Player;
