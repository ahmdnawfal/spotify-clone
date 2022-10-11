import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import {
  HomeIcon,
  MagnifyingGlassIcon,
  BuildingLibraryIcon,
  PlusCircleIcon,
  RssIcon,
} from "@heroicons/react/24/outline";

import { HeartIcon } from "@heroicons/react/24/solid";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../../atoms/playlistAtom";

function Sidebar() {
  const { data: session, status } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getFeaturedPlaylists().then((data) => {
        setPlaylists(data.body.playlists.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div
      className="text-gray-500 p-5 text-xs border-r border-gray-900 
      h-screen overflow-y-scroll scrollbar-hide lg:text-sm sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-35"
    >
      <div className="space-y-4">
        <button className="flex items-center space-x-2 hover:text-white">
          <HomeIcon className="w-5 h-5 text-white/70" />
          <p>Home</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <MagnifyingGlassIcon className="w-5 h-5 text-white/70" />
          <p>Search</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <BuildingLibraryIcon className="w-5 h-5 text-white/70" />
          <p>Your Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="w-5 h-5 text-white" />
          <p>Create Playlist</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <HeartIcon className="w-5 h-5 text-blue-500" />
          <p>Your Library</p>
        </button>
        <button className="flex items-center space-x-2 hover:text-white">
          <RssIcon className="w-5 h-5 text-green-500" />
          <p>Your episodes</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {playlists.map((playlist) => (
          <p
            key={playlist.id}
            onClick={() => setPlaylistId(playlist)}
            className="cursor-pointer hover:text-white"
          >
            {playlist.name}
          </p>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
