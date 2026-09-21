import httpx
import pytest
import respx

from tests.conftest import ANTHROPIC_URL, anthropic_reply

NEUTRAL_FALLBACK_EMOTION = "neutral"


@pytest.mark.parametrize("upstream_status", [401, 429, 500, 529])
@respx.mock
def test_upstream_http_errors_propagate_their_status_code(client, upstream_status):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(upstream_status, json={"error": "upstream failure"})
    )

    response = client.post("/process_text", json={"text": "hello there"})

    assert response.status_code == upstream_status


@respx.mock
def test_error_envelope_in_successful_response_is_rejected(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200, json={"error": {"type": "invalid_request_error", "message": "bad prompt"}}
        )
    )

    response = client.post("/process_text", json={"text": "hello there"})

    assert response.status_code == 400


@respx.mock
def test_markdown_fenced_json_is_unwrapped(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200,
            json=anthropic_reply(
                '```json\n{"sentiment": 0.5, "emotion": "calm", "keywords": ["ocean"]}\n```'
            ),
        )
    )

    response = client.post("/process_text", json={"text": "The ocean is calm."})

    assert response.status_code == 200
    assert response.json() == {"sentiment": 0.5, "emotion": "calm", "keywords": ["ocean"]}


@respx.mock
def test_bare_fence_without_language_hint_is_unwrapped(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200,
            json=anthropic_reply(
                '```\n{"sentiment": -0.1, "emotion": "tired", "keywords": ["sleep"]}\n```'
            ),
        )
    )

    response = client.post("/process_text", json={"text": "I need sleep."})

    assert response.status_code == 200
    assert response.json()["emotion"] == "tired"


@respx.mock
def test_unparseable_model_output_degrades_to_neutral_instead_of_erroring(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200, json=anthropic_reply("Sure! Here is my analysis of your text.")
        )
    )

    response = client.post("/process_text", json={"text": "alpha beta gamma delta epsilon"})

    assert response.status_code == 200
    body = response.json()
    assert body["sentiment"] == 0.0
    assert body["emotion"] == NEUTRAL_FALLBACK_EMOTION
    assert body["keywords"] == ["alpha", "beta", "gamma"]


@respx.mock
def test_schema_violating_model_output_degrades_to_neutral(client):
    respx.post(ANTHROPIC_URL).mock(
        return_value=httpx.Response(
            200, json=anthropic_reply('{"sentiment": 0.4, "keywords": ["missing", "emotion"]}')
        )
    )

    response = client.post("/process_text", json={"text": "one two"})

    assert response.status_code == 200
    body = response.json()
    assert body["emotion"] == NEUTRAL_FALLBACK_EMOTION
    assert body["keywords"] == ["one", "two"]


@respx.mock
def test_upstream_timeout_surfaces_as_server_error(client):
    respx.post(ANTHROPIC_URL).mock(side_effect=httpx.ReadTimeout("timed out"))

    response = client.post("/process_text", json={"text": "hello there"})

    assert response.status_code == 500


@respx.mock
def test_upstream_connection_failure_surfaces_as_server_error(client):
    respx.post(ANTHROPIC_URL).mock(side_effect=httpx.ConnectError("connection refused"))

    response = client.post("/process_text", json={"text": "hello there"})

    assert response.status_code == 500
