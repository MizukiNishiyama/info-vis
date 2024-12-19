import { getRappers } from "@/src/utils/get-rappers";

export async function getRapperNameById(artistId: string): Promise<string> {
  const rappers = await getRappers();
  let rapperName = "";
  rappers.forEach((rapper) => {
    if (rapper.id === artistId) rapperName = rapper.name;
  });

  return rapperName;
}
