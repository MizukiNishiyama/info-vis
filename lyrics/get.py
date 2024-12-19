import lyricsgenius
import csv

def fetch_lyrics_and_append_to_csv(track_id: str, track_name: str, artist_name: str, token: str, output_file: str = "lyrics.csv"):
    """
    指定されたトラックID、楽曲名、アーティスト名に基づいて歌詞を取得し、CSVファイルに追記する関数。

    Args:
        track_id (str): トラックID
        track_name (str): 楽曲名
        artist_name (str): アーティスト名
        token (str): Genius APIのトークン
        output_file (str): 出力するCSVファイル名 (デフォルトは "lyrics.csv")
    """
    # Genius APIクライアントを作成
    genius = lyricsgenius.Genius(token, timeout=15)

    # アーティストを検索
    artist = genius.search_artist(artist_name, max_songs=5)

    # 指定した曲を検索して、該当する曲の歌詞を取得
    song = genius.search_song(track_name, artist.name)

    if not song:
        print(f"楽曲 '{track_name}' が見つかりませんでした。")
        return

    song_lyrics = song.lyrics

    # CSVファイルに出力するデータを準備
    data = [track_id, track_name, song_lyrics]

    # CSVファイルに追記する
    with open(output_file, 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(data)

    print(f"'{track_name}' の歌詞が '{output_file}' に追加されました。")

# 使用例
# fetch_lyrics_and_save_to_csv("Estelle", "American Boy", "your_genius_api_token", "custom_lyrics.csv")
