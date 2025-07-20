import plotly.graph_objects as go
from plotly.subplots import make_subplots
import pandas as pd
from langchain.tools import tool
import os
import uuid
from typing import List, Dict

@tool
def create_dashboard(analysis_results: List[Dict]) -> str:
    """ 
    Creates an interactive HTML dashboard from the analysis results.
    The dashboard includes a bar chart of damage scores and a detailed table.
    Saves the dashboard to a file and returns the file path.

    Args:
        analysis_results: A list of dictionaries, where each dictionary 
                          represents the analysis of one image and must contain
                          'image_path', 'damage_score', and 'explanation'.
    """
    if not analysis_results:
        return "Error: No analysis results provided to create a dashboard."

    # --- 1. Prepare Data ---
    df = pd.DataFrame(analysis_results)
    # Extract just the filename for cleaner labels
    df['image_name'] = df['image_path'].apply(lambda p: os.path.basename(p))
    df = df.sort_values(by='damage_score', ascending=False)

    # --- 2. Create Figure ---
    fig = make_subplots(
        rows=2, cols=1, 
        shared_xaxes=False,
        vertical_spacing=0.1,
        subplot_titles=("Damage Score per Image", "Detailed Analysis"),
        specs=[[{"type": "bar"}], [{"type": "table"}]]
    )

    # --- 3. Add Bar Chart ---
    fig.add_trace(go.Bar(
        x=df['image_name'], 
        y=df['damage_score'],
        marker=dict(
        color=df['damage_score'],
        colorscale='Reds'
     ),
        showlegend=False,
        text=df['damage_score'],
        hoverinfo='x+y'
    ), row=1, col=1)

    # --- 4. Add Table ---
    fig.add_trace(go.Table(
        header=dict(values=['Image Name', 'Damage Score', 'Explanation'],
                    fill_color='paleturquoise',
                    align='left'),
        cells=dict(values=[df.image_name, df.damage_score, df.explanation],
                   fill_color='lavender',
                   align='left')
    ), row=2, col=1)

    # --- 5. Style and Save ---
    fig.update_layout(
        title_text='Disaster Analysis Dashboard',
        height=1000,
        showlegend=False,
        margin=dict(l=20, r=20, t=100, b=20)
    )
    fig.update_yaxes(title_text="Damage Score (0-10)", row=1, col=1)
    fig.add_trace(go.Scattermapbox(
        lat=df['latitude'],
        lon=df['longitude'],
        mode='markers',
        marker=go.scattermapbox.Marker(
            size=10,
            color=df['damage_score'],
            colorscale='Reds',
            cmin=0,
            cmax=10,
            showscale=True
        ),
        text=[f"Image: {row['image_name']}<br>Damage: {row['damage_score']}<br>Explanation: {row['explanation']}" for index, row in df.iterrows()],
        hoverinfo='text'
    ), row=2, col=1)

    fig.update_layout(
        mapbox_style="open-street-map",
        mapbox_center_lat = df['latitude'].mean() if not df['latitude'].empty else 0,
        mapbox_center_lon = df['longitude'].mean() if not df['longitude'].empty else 0,
        mapbox_zoom=8
    )

    # Create unique output directory
    output_dir = os.path.join("outputs", "dashboards")
    os.makedirs(output_dir, exist_ok=True)
    file_name = f"dashboard_{str(uuid.uuid4())[:8]}.html"
    file_path = os.path.join(output_dir, file_name)

    fig.write_html(file_path)

    print(f"Dashboard created successfully at: {file_path}")
    return f"Dashboard successfully created and saved to {file_path}"