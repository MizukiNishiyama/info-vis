import Link from "next/link";
import { IoIosCloseCircle, IoIosArrowForward } from "react-icons/io";
import { ScrollArea } from "@/components/ui/scroll-area";
import { artistIdToName } from "@/src/consts/artistid-to-name";
import { useArtistDescription } from "@/src/presentation/hooks/use-artist-description";

type FocusedArtistDrawerProps = {
  focusedArtistId: string | undefined;
  setFocusedArtistId: (artistId: string | undefined) => void;
};

export const FocusedArtistDrawer: React.FC<FocusedArtistDrawerProps> = ({
  focusedArtistId,
  setFocusedArtistId,
}) => {
  const { artistDescription } = useArtistDescription({ focusedArtistId });

  const artistName = focusedArtistId ? artistIdToName[focusedArtistId] || " " : "";

  return (
    <div
      className={`
        fixed top-0 right-0 h-full w-80 bg-white z-50
        shadow-[-4px_0_0.5px_0_rgb(0_0_0/0.02)]
        transition-transform duration-500 ease-in-out
        ${focusedArtistId ? "translate-x-0" : "translate-x-full"}
      `}
    >
      <ScrollArea className="px-8 pt-32 pb-12 h-full relative">
        {focusedArtistId && (
          <>
            <div className="mb-2 font-semibold text-sky-400 text-sm">Artist Profile</div>
            <Link
              className="flex items-center justify-between mb-8 group"
              href={`/artist/${focusedArtistId}`}
            >
              <div className="text-2xl text-slate-800 font-semibold group-hover:text-sky-400">
                {artistName}
              </div>
              <IoIosArrowForward className="text-gray-400 text-xl" />
            </Link>
            <div className="text-sm text-slate-800 leading-loose">{artistDescription}</div>
            <IoIosCloseCircle
              className="text-2xl text-slate-800 cursor-pointer absolute top-24 right-7 z-50"
              onClick={() => setFocusedArtistId(undefined)}
            />
          </>
        )}
      </ScrollArea>
    </div>
  );
};
