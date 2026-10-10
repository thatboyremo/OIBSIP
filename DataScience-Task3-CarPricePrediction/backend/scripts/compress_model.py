"""Optional: re-save the model with compression so it is easier to commit/deploy.
Usage: python scripts/compress_model.py model/car_price_model.pkl model/car_price_model.compressed.pkl
Note: compression shrinks the FILE; the loaded model still needs the same RAM.
"""
import sys, joblib
src, dst = sys.argv[1], sys.argv[2]
joblib.dump(joblib.load(src), dst, compress=("xz", 3))
print("saved", dst)
