import pandas as pd
import plotly.express as px
import os

# Ensure the public directory exists
output_dir = 'public'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

try:
    # Load your data
    data_path = 'scripts/data.csv'  # Update this to the correct path
    data = pd.read_csv(data_path)

    # Generate graphs
    fig_age = px.histogram(data, x='age', title='Age Distribution')
    fig_age.write_html(os.path.join(output_dir, 'fighter_age_distribution.html'))

    fig_weight = px.histogram(data, x='weight', title='Weight Distribution')
    fig_weight.write_html(os.path.join(output_dir, 'fighter_weight_distribution.html'))

    print("Graphs generated successfully.")
except Exception as e:
    print(f"Error generating graphs: {e}")
