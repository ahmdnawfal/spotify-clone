import React from "react";
import Head from "next/head";
import Sidebar from "../components/Sidebar/Sidebar";
import Center from "../components/Center/Center";
import { getSession } from "next-auth/react";
import Player from "../components/Player/Player";

const Home = () => {
  return (
    <div className="bg-black overflow-hidden h-screen">
      <Head>
        <title>Spotify clone</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex">
        <Sidebar />

        <Center />
      </main>

      <div className="sticky bottom-0">
        <Player />
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: {
      session,
    },
  };
}

export default Home;
