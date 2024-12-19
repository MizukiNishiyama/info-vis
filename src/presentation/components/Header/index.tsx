import Link from "next/link";
import { MdLibraryMusic } from "react-icons/md";

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 h-16 border-b w-full z-50 bg-white">
      <div className="flex pl-12 items-center space-x-4 h-16">
        <Link href="/" className="flex items-center space-x-4">
          <MdLibraryMusic className="text-4xl text-sky-400" />
          <h1 className="font-semibold text-xl text-slate-800">rapper analytics</h1>
        </Link>
      </div>
    </header>
  );
};
