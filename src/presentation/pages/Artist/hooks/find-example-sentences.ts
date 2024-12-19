import { LyricsForArtist } from "@/src/types/lyrics-for-artist";

export function findExampleSentences(
  word: string,
  lyrics: LyricsForArtist[],
  maxExamples: number = 3,
): string[] {
  const examples: string[] = [];
  const regex = new RegExp(`\\b${word}\\b`, "gi");

  for (const lyric of lyrics) {
    // 文区切りの正規表現に改行(\n)を追加
    const sentences = lyric.lyrics.split(/[.!?\n]+/);
    for (const sentence of sentences) {
      if (regex.test(sentence) && examples.length < maxExamples) {
        examples.push(sentence.trim());
      }
      if (examples.length >= maxExamples) break;
    }
    if (examples.length >= maxExamples) break;
  }

  return examples;
}
