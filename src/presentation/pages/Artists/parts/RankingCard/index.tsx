import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

type RankingCardProps = {
  artistName: string;
  artistId: string;
  imageUrl: string;
};

export const RankingCard: React.FC<RankingCardProps> = ({ artistName, artistId, imageUrl }) => {
  const path = `/artist/${artistId}`;

  return (
    <Link className="h-32 w-[800px] flex items-center pl-8 border-b hover:bg-slate-100" href={path}>
      <div
        className={clsx("flex justify-center items-center w-32", "transition-colors duration-200")}
      >
        {imageUrl && <Image src={imageUrl} width={96} height={96} alt="artist" />}
      </div>
      <p className="font-bold flex-grow ml-4">{artistName}</p>
    </Link>
  );
};
