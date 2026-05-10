import { useState, useEffect, createContext, useContext } from "react";
import Icon from "@/components/ui/icon";

const AUTH_URL = "https://functions.poehali.dev/0ef8e7e8-8cdf-4a70-b2e3-78fd321c1078";
const REVIEWS_URL = "https://functions.poehali.dev/f09d4dcc-ba62-4147-8c6c-61452b6bcd4f";

type AuthUser = { token: string; user_id: number; username: string };
const AuthCtx = createContext<{ user: AuthUser | null; setUser: (u: AuthUser | null) => void }>({ user: null, setUser: () => {} });

const HERO_IMG = "https://cdn.ezst.app/projects/93ac1fbb-3706-4031-ab6e-f9de317db349/files/a18c7798-57ce-41ea-bffb-1a47a56351f2.jpg";


const GENRES = ["All", "Fiction", "Romance", "Fantasy", "Historical Fiction", "Thriller", "Non-Fiction"];

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: "Home" },
  { id: "browse", label: "Browse", icon: "BookOpen" },
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "profile", label: "Profile", icon: "User" },
  { id: "search", label: "Search", icon: "Search" },
  { id: "contact", label: "Contact", icon: "Mail" },
];

function StarRating({
  rating,
  interactive = false,
  onRate,
}: {
  rating: number;
  interactive?: boolean;
  onRate?: (r: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl transition-transform ${interactive ? "cursor-pointer hover:scale-125" : ""}`}
          style={{ color: (hovered || rating) >= star ? "#f48fb1" : "#f8bbd0" }}
          onMouseEnter={() => interactive && setHovered(star)}
          onMouseLeave={() => interactive && setHovered(0)}
          onClick={() => interactive && onRate && onRate(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

type Review = {
  id: number; title: string; author: string; genre: string;
  rating: number; text: string; likes: number; date: string;
  reviewer: string; avatar: string; user_id: number;
};

function ReviewCard({ review, onDelete }: { review: Review; onDelete?: (id: number) => void }) {
  const { user } = useContext(AuthCtx);
  const [liked, setLiked] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const isOwner = user && user.user_id === review.user_id;

  const handleDelete = async () => {
    if (!user || !window.confirm("Delete this review? This can't be undone 💔")) return;
    setDeleting(true);
    const res = await fetch(`${REVIEWS_URL}/${review.id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${user.token}` },
    });
    if (res.ok) {
      onDelete?.(review.id);
    } else {
      alert("Something went wrong — couldn't delete the review.");
      setDeleting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-6 hover-scale animate-fade-in flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-playfair font-semibold text-lg" style={{ color: "#6d2b4e" }}>
            {review.title}
          </h3>
          <p className="text-sm font-lato" style={{ color: "#a06080" }}>
            by {review.author}
          </p>
        </div>
        <span
          className="text-xs px-3 py-1 rounded-full font-lato font-semibold whitespace-nowrap"
          style={{ background: "#fce4ec", color: "#c2185b" }}
        >
          {review.genre}
        </span>
      </div>

      <StarRating rating={review.rating} />

      <p className="font-lato text-sm leading-relaxed" style={{ color: "#5d3a4a" }}>
        "{review.text}"
      </p>

      <div
        className="flex items-center justify-between pt-2 border-t"
        style={{ borderColor: "#f8d7e3" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{review.avatar}</span>
          <div>
            <p className="text-sm font-semibold font-caveat" style={{ color: "#c2185b" }}>
              @{review.reviewer}
            </p>
            <p className="text-xs font-lato" style={{ color: "#b08090" }}>
              {review.date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOwner && onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-lato font-semibold transition-all hover:scale-105"
              style={{ background: "#fce4ec", color: "#c2185b", opacity: deleting ? 0.5 : 1 }}
            >
              <Icon name="Trash2" size={12} />
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button
            onClick={() => setLiked(!liked)}
            className="flex items-center gap-1.5 text-sm transition-all hover:scale-110"
            style={{ color: liked ? "#c2185b" : "#d4a0b0" }}
          >
            <span className="text-base">{liked ? "💖" : "🤍"}</span>
            <span className="font-lato">{liked ? review.likes + 1 : review.likes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function HomePage({ setPage }: { setPage: (p: string) => void }) {
  const [latestReviews, setLatestReviews] = useState<Review[]>([]);
  useEffect(() => {
    fetch(REVIEWS_URL).then((r) => r.json()).then((d) => setLatestReviews(d.slice(0, 3))).catch(() => {});
  }, []);
  return (
    <div className="flex flex-col gap-0">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${HERO_IMG})`,
            filter: "brightness(0.55) saturate(1.2)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(194,24,91,0.45) 0%, rgba(255,240,245,0.15) 100%)",
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto px-8 text-center w-full">
          <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
            <p className="font-caveat text-2xl mb-3" style={{ color: "#fce4ec" }}>
              welcome to
            </p>
            <h1
              className="font-playfair text-6xl md:text-7xl font-bold leading-tight mb-6"
              style={{ color: "#fff0f5" }}
            >
              Book Review
              <br />
              <span style={{ color: "#f48fb1", fontStyle: "italic" }}>Hub</span>
            </h1>
          </div>
          <div className="animate-fade-in" style={{ animationDelay: "150ms" }}>
            <p
              className="font-lato text-lg mb-10"
              style={{ color: "#fce4ec", lineHeight: "1.8" }}
            >
              A cozy corner for readers who love to share stories, discover new
              worlds, and connect over the books that changed them 💖
            </p>
          </div>
          <div
            className="animate-fade-in flex flex-col sm:flex-row gap-4 justify-center"
            style={{ animationDelay: "300ms" }}
          >
            <button
              onClick={() => setPage("browse")}
              className="px-8 py-4 rounded-full font-lato font-semibold text-base transition-all hover:scale-105 hover:shadow-xl"
              style={{
                background: "#f48fb1",
                color: "#fff",
                boxShadow: "0 4px 20px rgba(244,143,177,0.5)",
              }}
            >
              Browse Reviews 📚
            </button>
            <button
              onClick={() => setPage("browse")}
              className="px-8 py-4 rounded-full font-lato font-semibold text-base transition-all hover:scale-105"
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "#fff",
                border: "2px solid rgba(255,255,255,0.5)",
                backdropFilter: "blur(8px)",
              }}
            >
              Write a Review ✍️
            </button>
          </div>
        </div>

        <div
          className="absolute top-12 right-16 text-5xl animate-float"
          style={{ animationDelay: "0s" }}
        >
          📖
        </div>
        <div
          className="absolute bottom-24 left-12 text-4xl animate-float"
          style={{ animationDelay: "1s" }}
        >
          🌸
        </div>
        <div
          className="absolute top-1/3 right-8 text-3xl animate-float"
          style={{ animationDelay: "2s" }}
        >
          ✨
        </div>
      </section>

      {/* Stats */}
      <section
        className="py-16 px-6"
        style={{ background: "rgba(255,255,255,0.6)" }}
      >
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { num: "2,400+", label: "Reviews Shared", emoji: "📝" },
            { num: "1,200+", label: "Books Discovered", emoji: "📚" },
            { num: "850+", label: "Happy Readers", emoji: "💕" },
          ].map((s) => (
            <div key={s.label} className="animate-fade-in">
              <div className="text-4xl mb-2">{s.emoji}</div>
              <div className="font-playfair text-4xl font-bold text-gradient">
                {s.num}
              </div>
              <div className="font-lato text-sm mt-1" style={{ color: "#a06080" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Latest Reviews */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-caveat text-xl mb-2" style={{ color: "#c2185b" }}>
              freshly written
            </p>
            <h2
              className="font-playfair text-4xl font-bold"
              style={{ color: "#6d2b4e" }}
            >
              Latest Reviews
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mb-10">
            {latestReviews.length === 0 ? (
              <div className="md:col-span-3 text-center py-8 text-4xl animate-float">📖</div>
            ) : latestReviews.map((r) => (
              <ReviewCard key={r.id} review={r} />
            ))}
          </div>
          <div className="text-center">
            <button
              onClick={() => setPage("browse")}
              className="px-8 py-3 rounded-full font-lato font-semibold transition-all hover:scale-105"
              style={{
                background: "transparent",
                color: "#c2185b",
                border: "2px solid #f48fb1",
              }}
            >
              See all reviews →
            </button>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{
          background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)",
        }}
      >
        <h2
          className="font-playfair text-4xl font-bold mb-4"
          style={{ color: "#6d2b4e" }}
        >
          Ready to share your story?
        </h2>
        <p
          className="font-lato mb-8 max-w-md mx-auto"
          style={{ color: "#8d5070" }}
        >
          Join our cozy community of readers. Create your account and start
          reviewing today ✨
        </p>
        <button
          onClick={() => setPage("profile")}
          className="px-10 py-4 rounded-full font-lato font-bold text-base transition-all hover:scale-105 hover:shadow-xl"
          style={{
            background: "#c2185b",
            color: "#fff",
            boxShadow: "0 6px 24px rgba(194,24,91,0.35)",
          }}
        >
          Join the Club 💖
        </button>
      </section>
    </div>
  );
}

function BrowsePage() {
  const { user } = useContext(AuthCtx);
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [newReview, setNewReview] = useState({
    title: "", author: "", text: "", rating: 0, genre: "Fiction",
  });

  useEffect(() => {
    fetch(REVIEWS_URL)
      .then((r) => r.json())
      .then((data) => { setReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = (id: number) => setReviews((prev) => prev.filter((r) => r.id !== id));

  const handleSubmit = async () => {
    if (!user) { setError("Please sign in to post a review"); return; }
    setError("");
    setSubmitting(true);
    const res = await fetch(REVIEWS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${user.token}` },
      body: JSON.stringify(newReview),
    });
    const data = await res.json();
    if (res.ok) {
      setReviews((prev) => [data, ...prev]);
      setNewReview({ title: "", author: "", text: "", rating: 0, genre: "Fiction" });
      setShowForm(false);
    } else {
      setError(data.error || "Something went wrong");
    }
    setSubmitting(false);
  };

  const filtered = selectedGenre === "All"
    ? reviews
    : reviews.filter((r) => r.genre === selectedGenre);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "top") return b.rating - a.rating;
    if (sortBy === "liked") return b.likes - a.likes;
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="font-caveat text-xl mb-1" style={{ color: "#c2185b" }}>discover & explore</p>
        <h2 className="font-playfair text-4xl font-bold" style={{ color: "#6d2b4e" }}>All Book Reviews</h2>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-8">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGenre(g)}
            className="px-5 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: selectedGenre === g ? "#f48fb1" : "rgba(255,255,255,0.7)",
              color: selectedGenre === g ? "#fff" : "#c2185b",
              border: "1.5px solid #f8bbd0",
              boxShadow: selectedGenre === g ? "0 4px 16px rgba(244,143,177,0.4)" : "none",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <p className="font-lato text-sm" style={{ color: "#a06080" }}>{sorted.length} reviews found</p>
        <div className="flex items-center gap-2">
          <span className="font-lato text-sm" style={{ color: "#a06080" }}>Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl px-3 py-1.5 text-sm font-lato outline-none"
            style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.8)", color: "#6d2b4e" }}
          >
            <option value="newest">Newest</option>
            <option value="top">Top Rated</option>
            <option value="liked">Most Liked</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-4xl animate-float">📖</div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🌸</div>
          <p className="font-playfair text-xl" style={{ color: "#6d2b4e" }}>No reviews yet — be the first!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {sorted.map((r) => <ReviewCard key={r.id} review={r} onDelete={handleDelete} />)}
        </div>
      )}

      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-playfair text-2xl font-semibold" style={{ color: "#6d2b4e" }}>✍️ Write a Review</h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#f48fb1", color: "#fff" }}
          >
            {showForm ? "Cancel" : "+ Add Review"}
          </button>
        </div>
        {!user && showForm && (
          <p className="font-lato text-sm mb-4" style={{ color: "#c2185b" }}>
            Please sign in to post a review 💖
          </p>
        )}
        {error && <p className="font-lato text-sm mb-4" style={{ color: "#c2185b" }}>{error}</p>}
        {showForm && (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            <input
              placeholder="Book title..."
              value={newReview.title}
              onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.9)", color: "#5d3a4a" }}
            />
            <input
              placeholder="Author name..."
              value={newReview.author}
              onChange={(e) => setNewReview({ ...newReview, author: e.target.value })}
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.9)", color: "#5d3a4a" }}
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="Share your thoughts about this book..."
                rows={4}
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full resize-none"
                style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.9)", color: "#5d3a4a" }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-lato text-sm" style={{ color: "#a06080" }}>Your rating:</span>
              <StarRating rating={newReview.rating} interactive onRate={(r) => setNewReview({ ...newReview, rating: r })} />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-8 py-3 rounded-full font-lato font-semibold text-sm transition-all hover:scale-105"
                style={{ background: "#c2185b", color: "#fff", boxShadow: "0 4px 16px rgba(194,24,91,0.3)", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Publishing…" : "Publish Review 💖"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage({ setPage }: { setPage: (p: string) => void }) {
  const { user } = useContext(AuthCtx);
  const [myReviews, setMyReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    fetch(`${REVIEWS_URL}?user_id=${user.user_id}`)
      .then((r) => r.json())
      .then((data) => { setMyReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [user]);

  const handleDelete = async (id: number) => {
    if (!user || !window.confirm("Delete this review? 💔")) return;
    const res = await fetch(`${REVIEWS_URL}/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${user.token}` },
    });
    if (res.ok) setMyReviews((prev) => prev.filter((r) => r.id !== id));
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h2 className="font-playfair text-3xl font-bold mb-3" style={{ color: "#6d2b4e" }}>Sign in to view your dashboard</h2>
        <button
          onClick={() => setPage("profile")}
          className="px-8 py-3 rounded-full font-lato font-semibold transition-all hover:scale-105"
          style={{ background: "#c2185b", color: "#fff" }}
        >
          Sign In 💖
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-caveat text-xl" style={{ color: "#c2185b" }}>your cozy corner</p>
        <h2 className="font-playfair text-4xl font-bold" style={{ color: "#6d2b4e" }}>My Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
        {[
          { label: "Reviews Written", val: String(myReviews.length), emoji: "📝" },
          { label: "Total Likes", val: String(myReviews.reduce((a, r) => a + r.likes, 0)), emoji: "💖" },
          { label: "Avg Rating", val: myReviews.length ? (myReviews.reduce((a, r) => a + r.rating, 0) / myReviews.length).toFixed(1) : "—", emoji: "⭐" },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-2xl p-5 text-center hover-scale">
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div className="font-playfair text-3xl font-bold" style={{ color: "#c2185b" }}>{s.val}</div>
            <div className="font-lato text-xs mt-1" style={{ color: "#a06080" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h3 className="font-playfair text-2xl font-semibold mb-6" style={{ color: "#6d2b4e" }}>My Reviews</h3>
        {loading ? (
          <div className="text-center py-8 text-3xl animate-float">📖</div>
        ) : myReviews.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">✍️</div>
            <p className="font-lato" style={{ color: "#a06080" }}>You haven't written any reviews yet.</p>
            <button
              onClick={() => setPage("browse")}
              className="mt-4 px-6 py-2 rounded-full font-lato text-sm font-semibold"
              style={{ background: "#fce4ec", color: "#c2185b" }}
            >
              Write your first review →
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {myReviews.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-4 rounded-2xl hover-scale"
                style={{ background: "#fff5f8" }}
              >
                <div>
                  <p className="font-playfair font-semibold" style={{ color: "#6d2b4e" }}>{r.title}</p>
                  <p className="text-xs font-lato" style={{ color: "#a06080" }}>{r.date} · {r.likes} likes</p>
                </div>
                <div className="flex items-center gap-3">
                  <StarRating rating={r.rating} />
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="p-2 rounded-xl transition-colors hover:bg-pink-100"
                    style={{ color: "#e57373" }}
                    title="Delete review"
                  >
                    <Icon name="Trash2" size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user, setUser } = useContext(AuthCtx);
  const [isSignUp, setIsSignUp] = useState(false);
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [myReviews, setMyReviews] = useState<Review[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch(`${REVIEWS_URL}?user_id=${user.user_id}`)
      .then((r) => r.json())
      .then(setMyReviews)
      .catch(() => {});
  }, [user]);

  const handleAuth = async () => {
    setError(""); setLoading(true);
    const path = isSignUp ? "/register" : "/login";
    const body = isSignUp
      ? { username: form.username, email: form.email, password: form.password }
      : { email: form.email, password: form.password };
    const res = await fetch(`${AUTH_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setUser(data);
      localStorage.setItem("brh_user", JSON.stringify(data));
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="text-5xl mb-4">{isSignUp ? "🌸" : "💖"}</div>
          <h2 className="font-playfair text-3xl font-bold mb-2" style={{ color: "#6d2b4e" }}>
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="font-lato text-sm mb-8" style={{ color: "#a06080" }}>
            {isSignUp ? "Join our cozy reading community" : "Sign in to your reading world"}
          </p>
          {error && <p className="font-lato text-sm mb-4" style={{ color: "#c2185b" }}>{error}</p>}
          <div className="flex flex-col gap-4">
            {isSignUp && (
              <input
                placeholder="Username..."
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
                style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.9)", color: "#5d3a4a" }}
              />
            )}
            <input
              placeholder="Email address..."
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.9)", color: "#5d3a4a" }}
            />
            <input
              type="password"
              placeholder="Password..."
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleAuth()}
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{ border: "1.5px solid #f8bbd0", background: "rgba(255,255,255,0.9)", color: "#5d3a4a" }}
            />
            <button
              onClick={handleAuth}
              disabled={loading}
              className="w-full py-3 rounded-full font-lato font-bold text-sm transition-all hover:scale-105"
              style={{ background: "#c2185b", color: "#fff", boxShadow: "0 4px 16px rgba(194,24,91,0.3)", opacity: loading ? 0.6 : 1 }}
            >
              {loading ? "Please wait…" : isSignUp ? "Create Account 🌸" : "Sign In 💖"}
            </button>
          </div>
          <p className="font-lato text-sm mt-6" style={{ color: "#a06080" }}>
            {isSignUp ? "Already have an account? " : "New here? "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }} className="font-semibold hover:underline" style={{ color: "#c2185b" }}>
              {isSignUp ? "Sign In" : "Join the Club"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="glass-card rounded-3xl p-8 mb-8" style={{ background: "linear-gradient(135deg, #fce4ec 0%, #fff0f5 100%)" }}>
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="text-8xl">🌸</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-playfair text-3xl font-bold mb-1" style={{ color: "#6d2b4e" }}>@{user.username}</h2>
            <p className="font-caveat text-lg mb-4" style={{ color: "#c2185b" }}>Passionate reader ✨</p>
            <div className="flex gap-6 justify-center md:justify-start">
              {[
                [String(myReviews.length), "Reviews"],
                [String(myReviews.reduce((a, r) => a + r.likes, 0)), "Likes"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div className="font-playfair font-bold text-xl" style={{ color: "#c2185b" }}>{n}</div>
                  <div className="font-lato text-xs" style={{ color: "#a06080" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => { setUser(null); localStorage.removeItem("brh_user"); }}
            className="px-5 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#fce4ec", color: "#c2185b" }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h3 className="font-playfair text-xl font-semibold mb-6" style={{ color: "#6d2b4e" }}>My Reviews</h3>
        {myReviews.length === 0 ? (
          <p className="font-lato text-sm text-center py-6" style={{ color: "#a06080" }}>No reviews yet — go write one! 📖</p>
        ) : (
          <div className="flex flex-col gap-3">
            {myReviews.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 rounded-2xl hover-scale" style={{ background: "#fff5f8" }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📕</span>
                  <div>
                    <p className="font-lato font-semibold text-sm" style={{ color: "#5d3a4a" }}>{r.title}</p>
                    <p className="font-lato text-xs" style={{ color: "#a06080" }}>{r.author}</p>
                  </div>
                </div>
                <StarRating rating={r.rating} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Review[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const all: Review[] = await fetch(REVIEWS_URL).then((r) => r.json()).catch(() => []);
    const q = query.toLowerCase();
    setResults(all.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.author.toLowerCase().includes(q) ||
        r.genre.toLowerCase().includes(q) ||
        r.text.toLowerCase().includes(q)
    ));
    setSearched(true);
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="font-caveat text-xl mb-1" style={{ color: "#c2185b" }}>
          find your next read
        </p>
        <h2
          className="font-playfair text-4xl font-bold"
          style={{ color: "#6d2b4e" }}
        >
          Search Books
        </h2>
      </div>

      <div className="flex gap-3 mb-8">
        <input
          placeholder="Search by title, author, or genre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1 rounded-2xl px-6 py-4 font-lato text-sm outline-none"
          style={{
            border: "2px solid #f8bbd0",
            background: "rgba(255,255,255,0.9)",
            color: "#5d3a4a",
            fontSize: "16px",
          }}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-4 rounded-2xl font-lato font-semibold transition-all hover:scale-105"
          style={{ background: "#f48fb1", color: "#fff", minWidth: "100px" }}
        >
          Search 🔍
        </button>
      </div>

      {!searched && (
        <div className="mb-10 animate-fade-in">
          <p className="font-lato text-sm mb-4" style={{ color: "#a06080" }}>
            Popular searches:
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              "Emily Henry",
              "Fantasy",
              "Romance",
              "Matt Haig",
              "Sarah J. Maas",
              "Historical Fiction",
              "Fiction",
            ].map((tag) => (
              <button
                key={tag}
                onClick={() => setQuery(tag)}
                className="px-4 py-2 rounded-full font-lato text-sm transition-all hover:scale-105"
                style={{
                  background: "#fce4ec",
                  color: "#c2185b",
                  border: "1.5px solid #f8bbd0",
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {searched && (
        <div className="animate-fade-in">
          <p className="font-lato text-sm mb-6" style={{ color: "#a06080" }}>
            {results.length} result{results.length !== 1 ? "s" : ""} for "
            <strong>{query}</strong>"
          </p>
          {results.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-6">
              {results.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">📭</div>
              <h3
                className="font-playfair text-2xl font-semibold mb-2"
                style={{ color: "#6d2b4e" }}
              >
                No results found
              </h3>
              <p className="font-lato" style={{ color: "#a06080" }}>
                Try a different title, author, or genre 🌸
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="font-caveat text-xl mb-1" style={{ color: "#c2185b" }}>
          we'd love to hear from you
        </p>
        <h2
          className="font-playfair text-4xl font-bold"
          style={{ color: "#6d2b4e" }}
        >
          Get in Touch
        </h2>
      </div>

      <div className="glass-card rounded-3xl p-10">
        {!sent ? (
          <div className="flex flex-col gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label
                  className="block font-lato text-xs font-semibold mb-2"
                  style={{ color: "#c2185b" }}
                >
                  Your Name
                </label>
                <input
                  placeholder="Your lovely name..."
                  className="w-full rounded-xl px-4 py-3 font-lato text-sm outline-none"
                  style={{
                    border: "1.5px solid #f8bbd0",
                    background: "rgba(255,255,255,0.9)",
                    color: "#5d3a4a",
                  }}
                />
              </div>
              <div>
                <label
                  className="block font-lato text-xs font-semibold mb-2"
                  style={{ color: "#c2185b" }}
                >
                  Email Address
                </label>
                <input
                  placeholder="your@email.com"
                  className="w-full rounded-xl px-4 py-3 font-lato text-sm outline-none"
                  style={{
                    border: "1.5px solid #f8bbd0",
                    background: "rgba(255,255,255,0.9)",
                    color: "#5d3a4a",
                  }}
                />
              </div>
            </div>
            <div>
              <label
                className="block font-lato text-xs font-semibold mb-2"
                style={{ color: "#c2185b" }}
              >
                Topic
              </label>
              <select
                className="w-full rounded-xl px-4 py-3 font-lato text-sm outline-none"
                style={{
                  border: "1.5px solid #f8bbd0",
                  background: "rgba(255,255,255,0.9)",
                  color: "#5d3a4a",
                }}
              >
                <option>General question</option>
                <option>Bug report</option>
                <option>Feature request</option>
                <option>Partnership</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label
                className="block font-lato text-xs font-semibold mb-2"
                style={{ color: "#c2185b" }}
              >
                Message
              </label>
              <textarea
                placeholder="Tell us everything..."
                rows={5}
                className="w-full rounded-xl px-4 py-3 font-lato text-sm outline-none resize-none"
                style={{
                  border: "1.5px solid #f8bbd0",
                  background: "rgba(255,255,255,0.9)",
                  color: "#5d3a4a",
                }}
              />
            </div>
            <button
              onClick={() => setSent(true)}
              className="w-full py-4 rounded-full font-lato font-bold text-sm transition-all hover:scale-105"
              style={{
                background: "#c2185b",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(194,24,91,0.3)",
              }}
            >
              Send Message 💌
            </button>
          </div>
        ) : (
          <div className="text-center py-10 animate-fade-in">
            <div className="text-7xl mb-6">💌</div>
            <h3
              className="font-playfair text-3xl font-bold mb-3"
              style={{ color: "#6d2b4e" }}
            >
              Message Sent!
            </h3>
            <p className="font-lato" style={{ color: "#a06080" }}>
              Thank you for reaching out! We'll get back to you within 24 hours
              🌸
            </p>
            <button
              onClick={() => setSent(false)}
              className="mt-6 px-6 py-2 rounded-full font-lato text-sm font-semibold"
              style={{ background: "#fce4ec", color: "#c2185b" }}
            >
              Send another
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mt-8">
        {[
          { icon: "Mail", label: "Email", val: "hello@bookhub.com" },
          { icon: "MessageCircle", label: "Chat", val: "Live support" },
          { icon: "Instagram", label: "Instagram", val: "@bookreviewhub" },
        ].map((c) => (
          <div
            key={c.label}
            className="glass-card rounded-2xl p-5 text-center hover-scale"
          >
            <Icon
              name={c.icon}
              fallback="Mail"
              size={20}
              className="mx-auto mb-2"
              style={{ color: "#f48fb1" }}
            />
            <p
              className="font-lato text-xs font-semibold"
              style={{ color: "#c2185b" }}
            >
              {c.label}
            </p>
            <p className="font-lato text-xs mt-1" style={{ color: "#a06080" }}>
              {c.val}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Index() {
  const [currentPage, setCurrentPage] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { return JSON.parse(localStorage.getItem("brh_user") || "null"); } catch { return null; }
  });

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setPage={setCurrentPage} />;
      case "browse":
        return <BrowsePage />;
      case "dashboard":
        return <DashboardPage setPage={setCurrentPage} />;
      case "profile":
        return <ProfilePage />;
      case "search":
        return <SearchPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage setPage={setCurrentPage} />;
    }
  };

  return (
    <AuthCtx.Provider value={{ user, setUser }}>
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fff0f5 0%, #fff9f5 50%, #fce4ec 100%)",
      }}
    >
      {/* Navigation */}
      <nav
        className="sticky top-0 z-50"
        style={{
          background: "rgba(255,240,245,0.85)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid #f8bbd0",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage("home")}
            className="flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span className="text-2xl">📖</span>
            <span
              className="font-playfair text-xl font-bold"
              style={{ color: "#c2185b" }}
            >
              Book Review Hub
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
                style={{
                  background:
                    currentPage === item.id ? "#f48fb1" : "transparent",
                  color: currentPage === item.id ? "#fff" : "#8d5070",
                }}
              >
                <Icon name={item.icon} fallback="Home" size={15} />
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage("profile")}
            className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: user ? "#fce4ec" : "#c2185b",
              color: user ? "#c2185b" : "#fff",
              boxShadow: "0 3px 12px rgba(194,24,91,0.25)",
            }}
          >
            <Icon name="User" size={15} />
            {user ? `@${user.username}` : "Sign In"}
          </button>

          <button
            className="md:hidden p-2 rounded-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: "#c2185b" }}
          >
            <Icon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden px-6 pb-4 animate-fade-in flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl font-lato text-sm font-semibold text-left transition-all"
                style={{
                  background:
                    currentPage === item.id ? "#fce4ec" : "transparent",
                  color: currentPage === item.id ? "#c2185b" : "#8d5070",
                }}
              >
                <Icon name={item.icon} fallback="Home" size={16} />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </nav>

      <main>{renderPage()}</main>

      {/* Footer */}
      <footer
        className="mt-16 py-12 px-6 text-center"
        style={{
          background: "rgba(252,228,236,0.5)",
          borderTop: "1px solid #f8bbd0",
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl">📖</span>
          <span
            className="font-playfair text-lg font-bold"
            style={{ color: "#c2185b" }}
          >
            Book Review Hub
          </span>
        </div>
        <p
          className="font-caveat text-lg mb-4"
          style={{ color: "#a06080" }}
        >
          Made with love for readers everywhere 💖
        </p>
        <div className="flex justify-center gap-6">
          {["Home", "Browse", "Contact"].map((p) => (
            <button
              key={p}
              onClick={() => setCurrentPage(p.toLowerCase())}
              className="font-lato text-sm hover:underline"
              style={{ color: "#c2185b" }}
            >
              {p}
            </button>
          ))}
        </div>
        <p
          className="font-lato text-xs mt-6"
          style={{ color: "#b08090" }}
        >
          © 2026 Book Review Hub. All rights reserved.
        </p>
      </footer>
    </div>
    </AuthCtx.Provider>
  );
}