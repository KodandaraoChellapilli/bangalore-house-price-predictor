import json
import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import ShuffleSplit, cross_val_score, train_test_split

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_PATH = PROJECT_ROOT / "data" / "bengaluru_house_prices.csv"
MODEL_PATH = PROJECT_ROOT / "model" / "bangalore_home_prices_model.pickle"
MODEL_PATH_NOTEBOOK_NAME = PROJECT_ROOT / "model" / "banglore_home_prices_model.pickle"
COLUMNS_PATH = PROJECT_ROOT / "model" / "columns.json"


def is_float(value: str) -> bool:
    try:
        float(value)
    except Exception:
        return False
    return True


def convert_sqft_to_num(value: str):
    tokens = value.split("-")
    if len(tokens) == 2:
        return (float(tokens[0]) + float(tokens[1])) / 2
    try:
        return float(value)
    except Exception:
        return None


def remove_pps_outliers(df: pd.DataFrame) -> pd.DataFrame:
    df_out = pd.DataFrame()
    for _, sub_df in df.groupby("location"):
        mean = np.mean(sub_df.price_per_sqft)
        std = np.std(sub_df.price_per_sqft)
        reduced_df = sub_df[(sub_df.price_per_sqft > (mean - std)) & (sub_df.price_per_sqft <= (mean + std))]
        df_out = pd.concat([df_out, reduced_df], ignore_index=True)
    return df_out


def remove_bhk_outliers(df: pd.DataFrame) -> pd.DataFrame:
    exclude_indices = np.array([])
    for _, location_df in df.groupby("location"):
        bhk_stats = {}
        for bhk, bhk_df in location_df.groupby("bhk"):
            bhk_stats[bhk] = {
                "mean": np.mean(bhk_df.price_per_sqft),
                "std": np.std(bhk_df.price_per_sqft),
                "count": bhk_df.shape[0],
            }
        for bhk, bhk_df in location_df.groupby("bhk"):
            stats = bhk_stats.get(bhk - 1)
            if stats and stats["count"] > 5:
                exclude_indices = np.append(
                    exclude_indices, bhk_df[bhk_df.price_per_sqft < (stats["mean"])].index.values
                )
    return df.drop(exclude_indices, axis="index")


def build_training_frame(csv_path: Path) -> pd.DataFrame:
    df1 = pd.read_csv(csv_path)
    df2 = df1.drop(["area_type", "society", "balcony", "availability"], axis="columns")
    df3 = df2.dropna()
    df3["bhk"] = df3["size"].apply(lambda x: int(x.split(" ")[0]))

    df4 = df3.copy()
    df4["total_sqft"] = df4["total_sqft"].apply(convert_sqft_to_num)

    # Exact notebook behavior: do not drop rows with invalid sqft conversion before later filters.
    df5 = df4.copy()
    df5["price_per_sqft"] = df5["price"] * 100000 / df5["total_sqft"]
    df5.location = df5.location.apply(lambda x: x.strip())

    location_stats = df5.groupby("location")["location"].agg("count").sort_values(ascending=False)
    location_stats_less_than_10 = location_stats[location_stats <= 10]

    df5.location = df5.location.apply(lambda x: "other" if x in location_stats_less_than_10 else x)
    df6 = df5[~(df5.total_sqft / df5.bhk < 300)]
    df7 = remove_pps_outliers(df6)
    df8 = remove_bhk_outliers(df7)
    df9 = df8[df8.bath < df8.bhk + 2]
    df10 = df9.drop(["size", "price_per_sqft"], axis="columns")

    dummies = pd.get_dummies(df10.location, dtype=int)
    df11 = pd.concat([df10, dummies.drop("other", axis="columns")], axis="columns")
    df12 = df11.drop("location", axis="columns")
    return df12


def train_and_export():
    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found at: {DATA_PATH}")

    df12 = build_training_frame(DATA_PATH)
    x = df12.drop(["price"], axis="columns")
    y = df12.price

    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=10)

    model = LinearRegression()
    model.fit(x_train, y_train)
    test_score = model.score(x_test, y_test)

    cv = ShuffleSplit(n_splits=5, test_size=0.2, random_state=0)
    cv_scores = cross_val_score(LinearRegression(), x, y, cv=cv)

    with MODEL_PATH.open("wb") as file:
        pickle.dump(model, file)

    # Keep notebook typo filename too, for compatibility with existing scripts.
    with MODEL_PATH_NOTEBOOK_NAME.open("wb") as file:
        pickle.dump(model, file)

    columns = {"data_columns": [col.lower() for col in x.columns]}
    with COLUMNS_PATH.open("w", encoding="utf-8") as file:
        json.dump(columns, file)

    print("Training completed.")
    print(f"Rows used for modeling: {len(df12)}")
    print(f"LinearRegression test score: {test_score:.4f}")
    print(f"Cross-validation mean score: {float(np.mean(cv_scores)):.4f}")
    print(f"Model saved to: {MODEL_PATH}")
    print(f"Columns saved to: {COLUMNS_PATH}")


if __name__ == "__main__":
    train_and_export()
