import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = os.getenv("BUCKET_NAME")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def download_supabase_images(folder_path):
    subfolder_name = folder_path.strip("/").split("/")[-1]
    local_dir = os.path.join(ROOT_DIR, "downloaded", subfolder_name)

    os.makedirs(local_dir, exist_ok=True)

    files = supabase.storage.from_(BUCKET_NAME).list(path=folder_path)

    for file_info in files:
        file_name = file_info["name"]
        file_path = f"{folder_path}/{file_name}"
        local_file_path = os.path.join(local_dir, file_name)

        print(f"Downloading {file_path} → {local_file_path}")
        res = supabase.storage.from_(BUCKET_NAME).download(file_path)
        with open(local_file_path, "wb") as f:
            f.write(res)

    print(f"Download complete. in {local_dir}")
    return local_dir