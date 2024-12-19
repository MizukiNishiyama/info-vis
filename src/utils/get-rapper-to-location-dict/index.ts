import * as d3 from "d3";

export async function getRapperToLocationDict(): Promise<Map<string, string>> {
  const data = await d3.csv("/data/rapper_location.csv");
  const rapper_to_id = await d3.csv("/data/rappers_with_spotify_ids.csv");

  const rapper_to_location = new Map<string, string>();
  const rapper_to_id_map = new Map<string, string>();
  rapper_to_id.forEach((rapper) => rapper_to_id_map.set(rapper.name, rapper.id));

  data.forEach((rapper) => {
    const id = rapper_to_id_map.get(rapper.name);
    if (id && rapper.hometown) {
      rapper_to_location.set(id, rapper.hometown);
    }
  });

  return rapper_to_location;
}
