import { NavLinks } from "./NavLinks";

export const Sidebar: React.FC = () => {
  return (
    <div className="space-y-2 fixed h-full top-24 left-9">
      <NavLinks />
    </div>
  );
};
