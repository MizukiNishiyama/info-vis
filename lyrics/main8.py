import time
import csv
from get import fetch_lyrics_and_append_to_csv
import pandas as pd


def fetch_with_retry(track_id, track_name, first_artist, token, lyrics_output_file, retries=3, delay=5):
    """
    fetch_lyrics_and_append_to_csv を再試行する関数

    Args:
        track_id (str): トラックID
        track_name (str): トラック名
        first_artist (str): 最初のアーティスト名
        token (str): Genius API のトークン
        lyrics_output_file (str): 出力先の CSV ファイル名
        retries (int): 再試行回数
        delay (int): 再試行間の待機時間（秒）
    """
    for attempt in range(retries):
        try:
            fetch_lyrics_and_append_to_csv(track_id, track_name, first_artist, token, lyrics_output_file)
            return
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < retries - 1:
                time.sleep(delay)
            else:
                print("All attempts failed.")


def get_lyrics_from_output_csv(output_csv: str, token: str, lyrics_output_file: str):
    """
    output_tracks.csv のデータから track_id, track_name, artist_name を使用して歌詞を取得。

    Args:
        output_csv (str): 入力元の CSV ファイル (output_tracks.csv)
        token (str): Genius API のトークン
        lyrics_output_file (str): 出力先の CSV ファイル名
    """
    # CSVデータを読み込む
    tracks_df = pd.read_csv(output_csv)

    # CSVヘッダーを書き込み（最初だけ実行されるように）
    with open(lyrics_output_file, 'w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(["track_id", "track_name", "song_lyrics"])

    # track_id, track_name, 最初の artist_name を取得
    for _, row in tracks_df.iterrows():
        track_id = row['track_id']
        track_name = row['track_name']
        artist_names = row['artist_name']

        # 最初のアーティスト名を取得 (カンマ区切りで複数の場合)
        first_artist = artist_names.split(",")[0].strip()

        # 歌詞を取得して保存
        fetch_with_retry(track_id, track_name, first_artist, token, lyrics_output_file)


if __name__ == "__main__":
    # Genius API トークンを設定
    genius_token = "ubxw7KlOZ8wKnnUf3FVv0C3CQ-igsvL5i2jApBm6xVJ8iYsnxonroJZAbWoMs2xK"  # 適切なトークンを入力してください

    # 関数を実行
    get_lyrics_from_output_csv("./output/split_csv_files/tracks_rapper_part8.csv", genius_token, "./output/lyrics_output8.csv")