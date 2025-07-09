import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score, f1_score
import joblib
import os
import numpy as np

# Load data
df = pd.read_csv(r'C:\Users\Admin\Desktop\CRP - Copy\srcc\backend\crime_dataset_india.csv')

# Use only 2020-2024 for training
df['Date of Occurrence'] = pd.to_datetime(df['Date of Occurrence'], errors='coerce')
df = df[df['Date of Occurrence'].dt.year.between(2020, 2024)]

# Feature engineering
df['Month'] = df['Date of Occurrence'].dt.month.astype(str)
df['Hour'] = pd.to_datetime(df['Time of Occurrence'], errors='coerce').dt.hour
df['TimeOfDay'] = pd.cut(
    df['Hour'],
    bins=[-1, 5, 11, 17, 21, 24],
    labels=['Night', 'Morning', 'Afternoon', 'Evening', 'Night2']
)
df['TimeOfDay'] = df['TimeOfDay'].replace('Night2', 'Night')
df['DayOfWeek'] = df['Date of Occurrence'].dt.day_name()

# Bin Victim Age
bins = [0, 18, 30, 45, 60, 120]
labels = ['0-18', '19-30', '31-45', '46-60', '60+']
df['AgeGroup'] = pd.cut(pd.to_numeric(df['Victim Age'], errors='coerce'), bins=bins, labels=labels, right=False)

print("Unique AgeGroup values:", df['AgeGroup'].unique())
print("Unique TimeOfDay values:", df['TimeOfDay'].unique())
print("Unique Gender values:", df['Victim Gender'].unique())
print("Unique Month values:", df['Month'].unique())
print("Unique DayOfWeek values:", df['DayOfWeek'].unique())

# Drop rows with missing values in required columns
df = df.dropna(subset=['City', 'AgeGroup', 'Victim Gender', 'TimeOfDay', 'Month', 'Crime Description', 'DayOfWeek'])

# Remove rare crime types (optional, for better accuracy)
crime_counts = df['Crime Description'].value_counts()
common_crimes = crime_counts[crime_counts > 50].index
df = df[df['Crime Description'].isin(common_crimes)]

# Encode features
le_city = LabelEncoder()
le_age_group = LabelEncoder()
le_gender = LabelEncoder()
le_time_of_day = LabelEncoder()
le_month = LabelEncoder()
le_day_of_week = LabelEncoder()
le_crime = LabelEncoder()

df['City_enc'] = le_city.fit_transform(df['City'])
df['AgeGroup_enc'] = le_age_group.fit_transform(df['AgeGroup'])
df['Gender_enc'] = le_gender.fit_transform(df['Victim Gender'])
df['TimeOfDay_enc'] = le_time_of_day.fit_transform(df['TimeOfDay'])
df['Month_enc'] = le_month.fit_transform(df['Month'])
df['DayOfWeek_enc'] = le_day_of_week.fit_transform(df['DayOfWeek'])
df['Crime_enc'] = le_crime.fit_transform(df['Crime Description'])

X = df[['City_enc', 'AgeGroup_enc', 'Gender_enc', 'TimeOfDay_enc', 'Month_enc', 'DayOfWeek_enc']]
y = df['Crime_enc']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Model with hyperparameter tuning (simple grid)
best_score = 0
best_model = None
for n in [100, 200, 300]:
    clf = RandomForestClassifier(n_estimators=n, class_weight='balanced', random_state=42)
    clf.fit(X_train, y_train)
    y_pred = clf.predict(X_test)
    score = f1_score(y_test, y_pred, average='weighted')
    if score > best_score:
        best_score = score
        best_model = clf

# Cross-validation
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(best_model, X, y, cv=cv, scoring='f1_weighted')
print(f"Cross-validated F1 score: {np.mean(cv_scores):.3f} (+/- {np.std(cv_scores):.3f})")

# Final evaluation
y_pred = best_model.predict(X_test)
print('Accuracy:', accuracy_score(y_test, y_pred))
print('F1 Score:', f1_score(y_test, y_pred, average='weighted'))
print('Classification Report:')
print(classification_report(y_test, y_pred, target_names=le_crime.classes_))
print('Confusion Matrix:')
print(confusion_matrix(y_test, y_pred))

# Save model and encoders
os.makedirs('models', exist_ok=True)
joblib.dump(best_model, 'models/crime_predictor.pkl')
label_encoders = {
    'city': le_city,
    'age_group': le_age_group,
    'gender': le_gender,
    'time_of_day': le_time_of_day,
    'month': le_month,
    'day_of_week': le_day_of_week,
    'crime': le_crime
}
joblib.dump(label_encoders, 'models/label_encoders.pkl')
print("Label encoder classes (age_group):", le_age_group.classes_)
print("Label encoder classes (time_of_day):", le_time_of_day.classes_)
print("Label encoder classes (gender):", le_gender.classes_)
print("Label encoder classes (month):", le_month.classes_)
print("Label encoder classes (day_of_week):", le_day_of_week.classes_)