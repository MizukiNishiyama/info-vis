"use client";
import { NextPage } from "next";

// import RootPage from "@/src/presentation/pages/Root";
import Home from "../presentation/pages/Home";

const Page: NextPage = () => {
  //MEMO: 開発速度優先のためルータ関連を放棄
  // return <RootPage />;
  return <Home />;
};

export default Page;
