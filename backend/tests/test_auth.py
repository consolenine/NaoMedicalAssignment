def test_signup(test_client):
    response = test_client.post(
        "/api/auth/signup",
        json={
            "username": "test_user",
            "password": "securepassword123",
            "role": "patient",
        },
    )
    assert response.status_code == 200
    assert response.json() == {"message": "User created successfully"}

    # Test duplicate signup
    duplicate_response = test_client.post(
        "/api/auth/signup",
        json={
            "username": "test_user",
            "password": "securepassword123",
            "role": "patient",
        },
    )
    assert duplicate_response.status_code == 400
    assert duplicate_response.json()["detail"] == "Username already taken"

def test_login(test_client):
    # Create a user first
    test_client.post(
        "/api/auth/signup",
        json={
            "username": "test_user_login",
            "password": "securepassword123",
            "role": "patient",
        },
    )

    # Test valid login
    response = test_client.post(
        "/api/auth/login",
        data={"username": "test_user_login", "password": "securepassword123"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert response.json()["token_type"] == "bearer"

    # Test invalid login
    invalid_response = test_client.post(
        "/api/auth/login",
        data={"username": "wrong_user", "password": "wrongpassword"},
    )
    assert invalid_response.status_code == 401
    assert invalid_response.json()["detail"] == "Invalid credentials"
