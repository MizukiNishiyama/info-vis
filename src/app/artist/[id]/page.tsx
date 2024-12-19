import { NextPage } from "next";
import React from "react";
import { Artist } from "@/src/presentation/pages/Artist";

type PageProps = {
  params: {
    id: string;
  };
};

// MEMO: データをバックエンドにおくように変更後は、artistIdに対応するartistNameもこのサーバーコンポーネントで取得するように変更する
const Page: NextPage<PageProps> = async ({ params }) => {
  const { id } = params;
  return <Artist artistId={id} />;
};

export default Page;
