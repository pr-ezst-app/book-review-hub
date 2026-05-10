"""
Auth handler: register and login users for Book Review Hub.
Returns JWT token on success.
"""
import json
import os
import hashlib
import hmac
import base64
import time
import psycopg2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

def make_jwt(user_id: int, username: str) -> str:
    secret = os.environ["JWT_SECRET"].encode()
    header = base64.urlsafe_b64encode(b'{"alg":"HS256","typ":"JWT"}').rstrip(b"=").decode()
    payload = base64.urlsafe_b64encode(
        json.dumps({"user_id": user_id, "username": username, "exp": int(time.time()) + 86400 * 30}).encode()
    ).rstrip(b"=").decode()
    sig = base64.urlsafe_b64encode(
        hmac.new(secret, f"{header}.{payload}".encode(), hashlib.sha256).digest()
    ).rstrip(b"=").decode()
    return f"{header}.{payload}.{sig}"

def verify_jwt(token: str):
    try:
        secret = os.environ["JWT_SECRET"].encode()
        header, payload, sig = token.split(".")
        expected = base64.urlsafe_b64encode(
            hmac.new(secret, f"{header}.{payload}".encode(), hashlib.sha256).digest()
        ).rstrip(b"=").decode()
        if not hmac.compare_digest(sig, expected):
            return None
        data = json.loads(base64.urlsafe_b64decode(payload + "=="))
        if data.get("exp", 0) < time.time():
            return None
        return data
    except Exception:
        return None

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    s = get_schema()
    path = event.get("path", "/")
    body = json.loads(event.get("body") or "{}")
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # POST /register
    if path.endswith("/register"):
        username = (body.get("username") or "").strip()
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        if not username or not email or not password:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "All fields required"})}
        if len(password) < 6:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Password must be at least 6 characters"})}
        try:
            cur.execute(
                f"INSERT INTO {s}.users (username, email, password_hash) VALUES (%s, %s, %s) RETURNING id",
                (username, email, hash_password(password))
            )
            user_id = cur.fetchone()[0]
            conn.commit()
            token = make_jwt(user_id, username)
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "user_id": user_id, "username": username})}
        except psycopg2.errors.UniqueViolation:
            conn.rollback()
            return {"statusCode": 409, "headers": CORS, "body": json.dumps({"error": "Email or username already taken"})}

    # POST /login
    if path.endswith("/login"):
        email = (body.get("email") or "").strip().lower()
        password = body.get("password") or ""
        cur.execute(f"SELECT id, username FROM {s}.users WHERE email=%s AND password_hash=%s", (email, hash_password(password)))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Invalid email or password"})}
        token = make_jwt(row[0], row[1])
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"token": token, "user_id": row[0], "username": row[1]})}

    # GET /me
    if path.endswith("/me"):
        auth = event.get("headers", {}).get("X-Authorization", "")
        token = auth.replace("Bearer ", "")
        data = verify_jwt(token)
        if not data:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}
        cur.execute(f"SELECT id, username, email, bio, avatar FROM {s}.users WHERE id=%s", (data["user_id"],))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "User not found"})}
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "user_id": row[0], "username": row[1], "email": row[2], "bio": row[3], "avatar": row[4]
        })}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}
