from langchain.tools import tool
from langchain_community.utilities import GoogleSearchAPIWrapper
import os

# Ensure you have GOOGLE_API_KEY and GOOGLE_CSE_ID in your .env file

@tool
def search_web(query: str) -> str:
    """Performs a web search for the given query and returns the results."""
    search = GoogleSearchAPIWrapper()
    return search.run(query)
