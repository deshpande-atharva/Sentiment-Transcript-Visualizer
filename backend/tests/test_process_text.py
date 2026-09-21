import json

import httpx
import pytest
import respx

from tests.conftest import ANTHROPIC_URL, anthropic_reply


@respx.mock
def test_returns_sentiment_emotion_and_keywords(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200,
            json=anthropic_reply(
                '{"sentiment": 0.87, "emotion": "excited", "keywords": ["thrilled", "grateful", "wonderful"]}'
            ),
        )
    )

    response = client.post("/process_text", json={"text": "I am thrilled and grateful!"})

    assert response.status_code == 200
    assert response.json() == {
        "sentiment": 0.87,
        "emotion": "excited",
        "keywords": ["thrilled", "grateful", "wonderful"],
    }


@respx.mock
def test_negative_sentiment_passes_through_unclamped(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200,
            json=anthropic_reply(
                '{"sentiment": -0.92, "emotion": "angry", "keywords": ["frustrated", "awful"]}'
            ),
        )
    )

    response = client.post("/process_text", json={"text": "Everything is going terribly wrong."})

    assert response.status_code == 200
    assert response.json()["sentiment"] == -0.92
    assert response.json()["emotion"] == "angry"


@respx.mock
def test_forwards_user_text_and_auth_headers_upstream(client):
    route = respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200,
            json=anthropic_reply('{"sentiment": 0, "emotion": "neutral", "keywords": ["meeting"]}'),
        )
    )

    client.post("/process_text", json={"text": "The quarterly meeting is on Tuesday."})

    assert route.called
    request = route.calls.last.request
    assert request.headers["x-api-key"] == "sk-ant-test-key"
    assert request.headers["anthropic-version"] == "2023-06-01"

    payload = json.loads(request.content)
    assert payload["model"] == "claude-sonnet-4-20250514"
    assert payload["max_tokens"] == 500
    assert "The quarterly meeting is on Tuesday." in payload["messages"][0]["content"]


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"text": None},
        {"text": 42},
        {"text": ["not", "a", "string"]},
        {"transcript": "wrong field name"},
    ],
)
@respx.mock
def test_invalid_request_bodies_are_rejected_before_calling_the_model(client, body):
    route = respx.post(ANTHROPIC_URL).mock(return_value=httpx.Response(200))

    response = client.post("/process_text", json=body)

    assert response.status_code == 422
    assert not route.called, "invalid input must never reach the LLM"


@respx.mock
def test_missing_api_key_fails_without_calling_the_model(client, monkeypatch):
    monkeypatch.delenv("ANTHROPIC_API_KEY", raising=False)
    route = respx.post(ANTHROPIC_URL).mock(return_value=httpx.Response(200))

    response = client.post("/process_text", json={"text": "hello"})

    assert response.status_code == 500
    assert "No API key configured" in response.json()["detail"]
    assert not route.called
