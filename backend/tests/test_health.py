def test_health_endpoint_reports_running(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"status": "Backend is running"}
