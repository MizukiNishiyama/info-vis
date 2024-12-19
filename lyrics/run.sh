#!/bin/bash
#SBATCH -p p               # パーティション名
#SBATCH --gres=gpu:1       # GPUリソース1台を要求
#SBATCH -t 24:00:00        # 最大実行時間
#SBATCH -o output.log      # 標準出力の出力先ファイル
#SBATCH -e error.log       # エラー出力の出力先ファイル

module load python         # 必要ならモジュールをロード
python3 main2.py         # Pythonスクリプトを実行
