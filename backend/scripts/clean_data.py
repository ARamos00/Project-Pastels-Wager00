import pandas as pd
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load the CSV file
df = pd.read_csv('data.csv')
logging.info("Initial data loaded.")

# Ensure correct data types
df['B_Age'] = pd.to_numeric(df['B_Age'], errors='coerce')
df['B_Height'] = pd.to_numeric(df['B_Height'], errors='coerce')
df['B_Weight'] = pd.to_numeric(df['B_Weight'], errors='coerce')
df['B_Wins'] = pd.to_numeric(df['B_Wins'], errors='coerce')
df['B_Losses'] = pd.to_numeric(df['B_Losses'], errors='coerce')
df['B_Draws'] = pd.to_numeric(df['B_Draws'], errors='coerce')

# Drop rows with missing required fields
df = df.dropna(subset=['B_Name', 'B_HomeTown', 'B_Age', 'B_Height', 'B_Weight', 'B_Wins', 'B_Losses', 'B_Draws'])
logging.info("Data cleaned.")

# Rename columns to match the expected structure
df = df.rename(columns={
    'B_Name': 'name',
    'B_HomeTown': 'hometown',
    'B_Age': 'age',
    'B_Height': 'height',
    'B_Weight': 'weight',
    'B_Wins': 'stats.wins',
    'B_Losses': 'stats.losses',
    'B_Draws': 'stats.draws'
})

# Save the cleaned data back to CSV
df.to_csv('cleaned_data.csv', index=False)
logging.info("Cleaned data saved.")





