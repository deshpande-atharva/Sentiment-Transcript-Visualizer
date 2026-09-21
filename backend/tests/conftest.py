import pytest
from fastapi.testclient import TestClient

from main import app

ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"


@pytest.fixture(autouse=True)
def fake_api_key(monkeypatch):
    """Guarantee a deterministic key so tests never depend on a developer's .env."""
    monkeypatch.setenv("ANTHROPIC_API_KEY", "sk-ant-test-key")


@pytest.fixture
def client():
    with TestClient(app) as test_client:
        yield test_client


def anthropic_reply(text: str) -> dict:
    """Build the subset of the Anthropic Messages API envelope that main.py reads."""
    return {
        "id": "msg_test",
        "type": "message",
        "role": "assistant",
        "content": [{"type": "text", "text": text}],
    }
