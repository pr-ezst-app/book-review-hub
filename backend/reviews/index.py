"""
Reviews handler: list all reviews, create a review, delete own review.
Delete is protected — only the review owner can delete their review.
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
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
}

def get_schema():
    return os.environ.get("MAIN_DB_SCHEMA", "public")

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

def get_user(event):
    auth = event.get("headers", {}).get("X-Authorization", "")
    token = auth.replace("Bearer ", "")
    return verify_jwt(token)

def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    s = get_schema()
    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()

    # GET / — list all reviews
    if method == "GET":
        params = event.get("queryStringParameters") or {}
        genre = params.get("genre")
        user_id = params.get("user_id")

        query = f"""
            SELECT r.id, r.title, r.author, r.genre, r.rating, r.text, r.likes, r.created_at,
                   u.username, u.avatar, r.user_id
            FROM {s}.reviews r
            JOIN {s}.users u ON r.user_id = u.id
        """
        conditions = []
        args = []
        if genre:
            conditions.append("r.genre = %s")
            args.append(genre)
        if user_id:
            conditions.append("r.user_id = %s")
            args.append(int(user_id))
        if conditions:
            query += " WHERE " + " AND ".join(conditions)
        query += " ORDER BY r.created_at DESC"

        cur.execute(query, args)
        rows = cur.fetchall()
        reviews = [
            {
                "id": r[0], "title": r[1], "author": r[2], "genre": r[3],
                "rating": r[4], "text": r[5], "likes": r[6],
                "date": r[7].strftime("%b %d, %Y"),
                "reviewer": r[8], "avatar": r[9], "user_id": r[10]
            }
            for r in rows
        ]
        return {"statusCode": 200, "headers": CORS, "body": json.dumps(reviews)}

    # POST / — create review
    if method == "POST":
        user = get_user(event)
        if not user:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Please sign in to post a review"})}
        body = json.loads(event.get("body") or "{}")
        title = (body.get("title") or "").strip()
        author = (body.get("author") or "").strip()
        text = (body.get("text") or "").strip()
        genre = (body.get("genre") or "Fiction").strip()
        rating = int(body.get("rating") or 0)
        if not title or not author or not text or rating < 1 or rating > 5:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Title, author, review text and rating (1-5) are required"})}
        cur.execute(
            f"INSERT INTO {s}.reviews (user_id, title, author, genre, rating, text) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id, created_at",
            (user["user_id"], title, author, genre, rating, text)
        )
        row = cur.fetchone()
        conn.commit()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({
            "id": row[0], "title": title, "author": author, "genre": genre,
            "rating": rating, "text": text, "likes": 0,
            "date": row[1].strftime("%b %d, %Y"),
            "reviewer": user["username"], "avatar": "🌸", "user_id": user["user_id"]
        })}

    # DELETE /{id} — delete own review
    if method == "DELETE":
        user = get_user(event)
        if not user:
            return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}
        parts = path.rstrip("/").split("/")
        try:
            review_id = int(parts[-1])
        except ValueError:
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Invalid review id"})}
        cur.execute(f"SELECT user_id FROM {s}.reviews WHERE id=%s", (review_id,))
        row = cur.fetchone()
        if not row:
            return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Review not found"})}
        if row[0] != user["user_id"]:
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "You can only delete your own reviews"})}
        cur.execute(f"DELETE FROM {s}.reviews WHERE id=%s", (review_id,))
        conn.commit()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"success": True})}

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}