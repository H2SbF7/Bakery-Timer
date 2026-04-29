def test_AT01_POST_create_session_valid(client):                               # AT-01
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": 20,
        "completed_at": "2025-05-21T08:00:00Z"                                 
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["cake_name"] == "Cupcake"
    assert data["duration_minutes"] == 20
    assert "id" in data

def test_AT02_POST_cake_name_is_empty(client):                                 # AT-02   
    payload = {
        "duration_minutes": 20,
        "completed_at": "2025-05-21T08:00:00Z"
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["cake_name"] == "Custom"

def test_AT03_POST_duration_is_zero(client):                                   # AT-03   
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": 0,
        "completed_at": "2025-05-21T08:00:00Z"
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 422

def test_AT04_POST_duration_is_negative(client):                               # AT-04
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": -20,
        "completed_at": "2025-05-21T08:00:00Z"
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 422

def test_AT05_POST_missing_duration(client):                                   # AT-05
    payload = {
        "cake_name": "Cupcake",
        "completed_at": "2025-05-21T08:00:00Z"
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 422

def test_AT06_POST_missing_completed_at(client):                               # AT-06
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": 20,
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 422

def test_AT07_POST_completed_at_is_not_isoformat(client):                      # AT-07
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": 20,
        "completed_at": "not-isoformat-date"
    }
    response = client.post("/api/sessions", json=payload)
    assert response.status_code == 422

def test_AT08_GET_sessions_empty(client):                                      # AT-08
    response = client.get("/api/sessions")
    assert response.status_code == 200
    assert response.json() == []

def test_AT09_GET_all_sessions(client):                                        # AT-09
    payloads = [
        {
            "cake_name": "Cupcake",
            "duration_minutes": 20,
            "completed_at": "2025-05-21T08:00:00Z"
        },
        {
            "cake_name": "Bread",
            "duration_minutes": 30,
            "completed_at": "2025-05-21T09:00:00Z"
        },
        {
            "cake_name": "Cookie",
            "duration_minutes": 40,
            "completed_at": "2025-05-21T10:00:00Z"
        }
    ]

    for payload in payloads:
        client.post("/api/sessions", json=payload)
    
    response = client.get("/api/sessions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
                                
    
def test_AT10_GET_sessions_order_by_most_recent(client):                       # AT-10
    payloads = [
        {
            "cake_name": "Cupcake",
            "duration_minutes": 20,
            "completed_at": "2025-05-21T08:00:00Z"
        },
        {
            "cake_name": "Bread",
            "duration_minutes": 30,
            "completed_at": "2025-05-21T09:00:00Z"
        },
        {
            "cake_name": "Cookie",
            "duration_minutes": 40,
            "completed_at": "2025-05-21T10:00:00Z"
        }
    ]
    
    for payload in payloads:
        client.post("/api/sessions", json=payload)
        
    response = client.get("/api/sessions")
    data = response.json()
    assert data[0]["completed_at"] == "2025-05-21T10:00:00Z"
    assert data[1]["completed_at"] == "2025-05-21T09:00:00Z"
    assert data[2]["completed_at"] == "2025-05-21T08:00:00Z"

def test_AT11_saved_session_appeared_in_GET(client):                           # AT-11
    payload = {
        "cake_name": "Cupcake",
        "duration_minutes": 20,
        "completed_at": "2025-05-21T08:00:00Z"
    }
    client.post("/api/sessions", json=payload)
    response = client.get("/api/sessions")
    data = response.json()
    assert any(s["cake_name"] == "Cupcake" and s["duration_minutes"] == 20 for s in data)
