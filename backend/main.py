import json
import os
import re

import httpx
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextInput(BaseModel):
    text: str

@app.get("/")
def read_root():
    return {"status": "Backend is running"}

@app.post("/process_text")
async def process_text(input_data: TextInput):
    try:
        api_key = os.getenv("ANTHROPIC_API_KEY")
        
        if not api_key:
            raise HTTPException(status_code=500, detail="No API key configured")
        
        print(f"📝 Processing text: {input_data.text}")
        
        headers = {
            "x-api-key": api_key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json"
        }
        
        payload = {
            "model": "claude-sonnet-4-20250514",
            "max_tokens": 500,
            "system": "You are a JSON-only API. Return ONLY valid JSON, no markdown, no explanations, no code blocks.",
            "messages": [{
                "role": "user",
                "content": f"""Analyze this text and return ONLY a JSON object (no markdown formatting, no code blocks):

Text: "{input_data.text}"

Return this exact structure:
{{"sentiment": <number -1 to 1>, "emotion": "<one word>", "keywords": ["word1", "word2", "word3"]}}

Rules:
- sentiment: -1 (very negative) to 1 (very positive)
- emotion: ONE word (happy/sad/angry/excited/calm/neutral/etc)
- keywords: 3-5 most important words from the text"""
            }]
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload,
                timeout=30.0
            )
        
        if response.status_code != 200:
            print(f"❌ API Error: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=response.text)
        
        response_data = response.json()
        
        if 'error' in response_data:
            raise HTTPException(status_code=400, detail=response_data['error'])
        
        response_text = response_data['content'][0]['text'].strip()
        print(f"📄 Raw response: {response_text}")
        
        # Remove markdown code blocks if present
        if response_text.startswith('```'):
            # Remove ```json or ``` at start and ``` at end
            response_text = re.sub(r'^```(?:json)?\s*', '', response_text)
            response_text = re.sub(r'\s*```$', '', response_text)
            response_text = response_text.strip()
            print(f"📄 Cleaned response: {response_text}")
        
        # Parse the JSON
        try:
            result = json.loads(response_text)
            print(f"✅ Parsed result: {result}")
            
            # Validate the structure
            if 'sentiment' not in result or 'emotion' not in result or 'keywords' not in result:
                raise ValueError("Missing required fields")
            
            return result
            
        except (json.JSONDecodeError, ValueError) as e:
            print(f"❌ Failed to parse: {response_text}")
            print(f"❌ Error: {e}")
            
            # Last resort fallback
            return {
                "sentiment": 0.0,
                "emotion": "neutral",
                "keywords": input_data.text.split()[:3]
            }
        
    except HTTPException:
        # Preserve deliberate status codes (upstream 4xx/5xx, missing config) instead of
        # collapsing them into a generic 500 via the handler below.
        raise

    except Exception as e:
        print(f"❌ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)