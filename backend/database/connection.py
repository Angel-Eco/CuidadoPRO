import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

def get_supabase_client() -> Client:
    """Create and return a Supabase client instance."""
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_SERVICE_KEY")
    
    # Debug information (commented out for production)
    # print(f"SUPABASE_URL: {url[:20] + '...' if url else 'NOT SET'}")
    # print(f"SUPABASE_SERVICE_KEY: {'SET' if key else 'NOT SET'}")
    
    if not url or not key:
        raise ValueError("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in environment variables")
    
    # Validate URL format
    if not url.startswith('https://'):
        raise ValueError("SUPABASE_URL must start with 'https://'")
    
    if '.supabase.co' not in url:
        raise ValueError("SUPABASE_URL must be a valid Supabase URL (containing '.supabase.co')")
    
    try:
        return create_client(url, key)
    except Exception as e:
        raise ValueError(f"Failed to create Supabase client: {str(e)}")
