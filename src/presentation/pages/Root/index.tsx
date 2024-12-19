import { useRouter } from "next/navigation";
import { FC, useEffect } from "react";

import Loading from "@/src/presentation/components/Loading";
import { HomePath } from "@/src/presentation/routing/path";

const RootPage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(HomePath);
  }, [router]);

  return <Loading />;
};

export default RootPage;
