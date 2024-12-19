"use server";
import axios from "axios";

import type { Track } from "@/src/types/spotify";
import type { SpotifyArtist } from "@/src/types/spotify-artist";

export async function getSpotifyToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const tokenResponse = await axios({
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    data: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return tokenResponse.data.access_token;
}

export async function getArtist(artistId: string): Promise<SpotifyArtist> {
  const token = await getSpotifyToken();
  const response = await axios({
    method: "get",
    url: `https://api.spotify.com/v1/artists/${artistId}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

// 最大の取得件数は50件
export async function getArtists(artistIds: string[]): Promise<SpotifyArtist[]> {
  const token = await getSpotifyToken();
  const response = await axios({
    method: "get",
    url: `https://api.spotify.com/v1/artists?ids=${artistIds.join(",")}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.artists;
}

export async function getTracksByIds(trackIds: string[]): Promise<Track[]> {
  if (trackIds.length === 0) return [];

  const token = await getSpotifyToken();
  const response = await axios({
    method: "get",
    url: `https://api.spotify.com/v1/tracks?ids=${trackIds.join(",")}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.tracks;
}
