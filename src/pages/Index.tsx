import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.ezst.app/projects/93ac1fbb-3706-4031-ab6e-f9de317db349/files/a18c7798-57ce-41ea-bffb-1a47a56351f2.jpg";

const SAMPLE_REVIEWS = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    reviewer: "rosereads",
    avatar: "🌸",
    rating: 5,
    text: "This book completely shattered me in the most beautiful way. Every page felt like a warm hug and a gentle reminder that life is full of infinite possibilities.",
    genre: "Fiction",
    date: "May 8, 2026",
    likes: 42,
  },
  {
    id: 2,
    title: "Beach Read",
    author: "Emily Henry",
    reviewer: "bookish.luna",
    avatar: "🌺",
    rating: 4,
    text: "The banter between the leads is chef's kiss. A perfect enemies-to-lovers story wrapped in so much heart. Couldn't put it down!",
    genre: "Romance",
    date: "May 5, 2026",
    likes: 38,
  },
  {
    id: 3,
    title: "A Court of Thorns and Roses",
    author: "Sarah J. Maas",
    reviewer: "fairytalevibes",
    avatar: "✨",
    rating: 5,
    text: "I was NOT prepared for how obsessed I'd become. The world-building is stunning and Tamlin is complicated. Immediately started book two.",
    genre: "Fantasy",
    date: "May 2, 2026",
    likes: 61,
  },
  {
    id: 4,
    title: "People We Meet on Vacation",
    author: "Emily Henry",
    reviewer: "softpages",
    avatar: "🦋",
    rating: 4,
    text: "Nostalgic, tender, and utterly romantic. The dual timeline kept me hooked. Perfect summer read that made me want to book a trip!",
    genre: "Romance",
    date: "April 29, 2026",
    likes: 29,
  },
  {
    id: 5,
    title: "The Name of the Wind",
    author: "Patrick Rothfuss",
    reviewer: "inkdreamer",
    avatar: "🌙",
    rating: 5,
    text: "Absolute masterpiece of fantasy. Kvothe's voice is so vivid and magnetic. This redefined what I thought storytelling could be.",
    genre: "Fantasy",
    date: "April 26, 2026",
    likes: 55,
  },
  {
    id: 6,
    title: "Daisy Jones & The Six",
    author: "Taylor Jenkins Reid",
    reviewer: "velvetpages",
    avatar: "🌹",
    rating: 5,
    text: "Written as oral history interviews and it WORKS. I felt like I was reading a real rockstar memoir. Listened to the audiobook after — even better.",
    genre: "Historical Fiction",
    date: "April 20, 2026",
    likes: 47,
  },
];

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

function ReviewCard({ review }: { review: (typeof SAMPLE_REVIEWS)[0] }) {
  const [liked, setLiked] = useState(false);
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
  );
}

function HomePage({ setPage }: { setPage: (p: string) => void }) {
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
            {SAMPLE_REVIEWS.slice(0, 3).map((r) => (
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
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    title: "",
    author: "",
    text: "",
    rating: 0,
    genre: "Fiction",
  });

  const filtered =
    selectedGenre === "All"
      ? SAMPLE_REVIEWS
      : SAMPLE_REVIEWS.filter((r) => r.genre === selectedGenre);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="text-center mb-10">
        <p className="font-caveat text-xl mb-1" style={{ color: "#c2185b" }}>
          discover & explore
        </p>
        <h2
          className="font-playfair text-4xl font-bold"
          style={{ color: "#6d2b4e" }}
        >
          All Book Reviews
        </h2>
      </div>

      {/* Genre filters */}
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
              boxShadow:
                selectedGenre === g
                  ? "0 4px 16px rgba(244,143,177,0.4)"
                  : "none",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center mb-8">
        <p className="font-lato text-sm" style={{ color: "#a06080" }}>
          {filtered.length} reviews found
        </p>
        <div className="flex items-center gap-2">
          <span className="font-lato text-sm" style={{ color: "#a06080" }}>
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-xl px-3 py-1.5 text-sm font-lato outline-none"
            style={{
              border: "1.5px solid #f8bbd0",
              background: "rgba(255,255,255,0.8)",
              color: "#6d2b4e",
            }}
          >
            <option value="newest">Newest</option>
            <option value="top">Top Rated</option>
            <option value="liked">Most Liked</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filtered.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>

      {/* Write Review */}
      <div className="glass-card rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3
            className="font-playfair text-2xl font-semibold"
            style={{ color: "#6d2b4e" }}
          >
            ✍️ Write a Review
          </h3>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#f48fb1", color: "#fff" }}
          >
            {showForm ? "Cancel" : "+ Add Review"}
          </button>
        </div>
        {showForm && (
          <div className="grid md:grid-cols-2 gap-4 animate-fade-in">
            <input
              placeholder="Book title..."
              value={newReview.title}
              onChange={(e) =>
                setNewReview({ ...newReview, title: e.target.value })
              }
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{
                border: "1.5px solid #f8bbd0",
                background: "rgba(255,255,255,0.9)",
                color: "#5d3a4a",
              }}
            />
            <input
              placeholder="Author name..."
              value={newReview.author}
              onChange={(e) =>
                setNewReview({ ...newReview, author: e.target.value })
              }
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{
                border: "1.5px solid #f8bbd0",
                background: "rgba(255,255,255,0.9)",
                color: "#5d3a4a",
              }}
            />
            <div className="md:col-span-2">
              <textarea
                placeholder="Share your thoughts about this book..."
                rows={4}
                value={newReview.text}
                onChange={(e) =>
                  setNewReview({ ...newReview, text: e.target.value })
                }
                className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full resize-none"
                style={{
                  border: "1.5px solid #f8bbd0",
                  background: "rgba(255,255,255,0.9)",
                  color: "#5d3a4a",
                }}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="font-lato text-sm" style={{ color: "#a06080" }}>
                Your rating:
              </span>
              <StarRating
                rating={newReview.rating}
                interactive
                onRate={(r) => setNewReview({ ...newReview, rating: r })}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="px-8 py-3 rounded-full font-lato font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: "#c2185b",
                  color: "#fff",
                  boxShadow: "0 4px 16px rgba(194,24,91,0.3)",
                }}
              >
                Publish Review 💖
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DashboardPage() {
  const myReviews = SAMPLE_REVIEWS.slice(0, 3);
  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-10">
        <p className="font-caveat text-xl" style={{ color: "#c2185b" }}>
          your cozy corner
        </p>
        <h2
          className="font-playfair text-4xl font-bold"
          style={{ color: "#6d2b4e" }}
        >
          My Dashboard
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Reviews Written", val: "12", emoji: "📝" },
          { label: "Books Read", val: "47", emoji: "📚" },
          { label: "Total Likes", val: "284", emoji: "💖" },
          { label: "Followers", val: "38", emoji: "🌸" },
        ].map((s) => (
          <div
            key={s.label}
            className="glass-card rounded-2xl p-5 text-center hover-scale"
          >
            <div className="text-3xl mb-2">{s.emoji}</div>
            <div
              className="font-playfair text-3xl font-bold"
              style={{ color: "#c2185b" }}
            >
              {s.val}
            </div>
            <div className="font-lato text-xs mt-1" style={{ color: "#a06080" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-3xl p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3
            className="font-playfair text-2xl font-semibold"
            style={{ color: "#6d2b4e" }}
          >
            My Recent Reviews
          </h3>
          <button
            className="text-sm font-lato font-semibold hover:underline"
            style={{ color: "#c2185b" }}
          >
            View all →
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {myReviews.map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 rounded-2xl hover-scale"
              style={{ background: "#fff5f8" }}
            >
              <div>
                <p
                  className="font-playfair font-semibold"
                  style={{ color: "#6d2b4e" }}
                >
                  {r.title}
                </p>
                <p className="text-xs font-lato" style={{ color: "#a06080" }}>
                  {r.date} · {r.likes} likes
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StarRating rating={r.rating} />
                <button
                  className="p-2 rounded-xl transition-colors hover:bg-pink-100"
                  style={{ color: "#c2185b" }}
                >
                  <Icon name="Edit2" size={14} />
                </button>
                <button
                  className="p-2 rounded-xl transition-colors hover:bg-pink-100"
                  style={{ color: "#e57373" }}
                >
                  <Icon name="Trash2" size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h3
          className="font-playfair text-2xl font-semibold mb-6"
          style={{ color: "#6d2b4e" }}
        >
          📖 My Reading List
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            "The Seven Husbands of Evelyn Hugo",
            "It Ends with Us",
            "Atomic Habits",
          ].map((book) => (
            <div
              key={book}
              className="p-4 rounded-2xl flex items-center gap-3 hover-scale cursor-pointer"
              style={{ background: "#fff5f8", border: "1.5px solid #f8bbd0" }}
            >
              <span className="text-2xl">📕</span>
              <span
                className="font-lato text-sm font-semibold"
                style={{ color: "#5d3a4a" }}
              >
                {book}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-6 py-20">
        <div className="glass-card rounded-3xl p-10 text-center">
          <div className="text-5xl mb-4">{isSignUp ? "🌸" : "💖"}</div>
          <h2
            className="font-playfair text-3xl font-bold mb-2"
            style={{ color: "#6d2b4e" }}
          >
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="font-lato text-sm mb-8" style={{ color: "#a06080" }}>
            {isSignUp
              ? "Join our cozy reading community"
              : "Sign in to your reading world"}
          </p>

          <div className="flex flex-col gap-4">
            {isSignUp && (
              <input
                placeholder="Your name..."
                className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
                style={{
                  border: "1.5px solid #f8bbd0",
                  background: "rgba(255,255,255,0.9)",
                  color: "#5d3a4a",
                }}
              />
            )}
            <input
              placeholder="Email address..."
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{
                border: "1.5px solid #f8bbd0",
                background: "rgba(255,255,255,0.9)",
                color: "#5d3a4a",
              }}
            />
            <input
              type="password"
              placeholder="Password..."
              className="rounded-xl px-4 py-3 font-lato text-sm outline-none w-full"
              style={{
                border: "1.5px solid #f8bbd0",
                background: "rgba(255,255,255,0.9)",
                color: "#5d3a4a",
              }}
            />
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3 rounded-full font-lato font-bold text-sm transition-all hover:scale-105"
              style={{
                background: "#c2185b",
                color: "#fff",
                boxShadow: "0 4px 16px rgba(194,24,91,0.3)",
              }}
            >
              {isSignUp ? "Create Account 🌸" : "Sign In 💖"}
            </button>
          </div>

          <p className="font-lato text-sm mt-6" style={{ color: "#a06080" }}>
            {isSignUp ? "Already have an account? " : "New here? "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold hover:underline"
              style={{ color: "#c2185b" }}
            >
              {isSignUp ? "Sign In" : "Join the Club"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div
        className="glass-card rounded-3xl p-8 mb-8"
        style={{
          background: "linear-gradient(135deg, #fce4ec 0%, #fff0f5 100%)",
        }}
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="text-8xl">🌸</div>
          <div className="flex-1 text-center md:text-left">
            <h2
              className="font-playfair text-3xl font-bold mb-1"
              style={{ color: "#6d2b4e" }}
            >
              rosereads
            </h2>
            <p className="font-caveat text-lg mb-3" style={{ color: "#c2185b" }}>
              Passionate reader & hopeless romantic 📚✨
            </p>
            <p
              className="font-lato text-sm mb-4"
              style={{ color: "#8d5070" }}
            >
              I love cozy fantasy, emotional romances, and books that make me
              cry happy tears. Always looking for my next 5-star read!
            </p>
            <div className="flex gap-6 justify-center md:justify-start">
              {[
                ["12", "Reviews"],
                ["47", "Books Read"],
                ["38", "Followers"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <div
                    className="font-playfair font-bold text-xl"
                    style={{ color: "#c2185b" }}
                  >
                    {n}
                  </div>
                  <div
                    className="font-lato text-xs"
                    style={{ color: "#a06080" }}
                  >
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            className="px-5 py-2 rounded-full font-lato text-sm font-semibold transition-all hover:scale-105"
            style={{ background: "#f48fb1", color: "#fff" }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8 mb-6">
        <h3
          className="font-playfair text-xl font-semibold mb-4"
          style={{ color: "#6d2b4e" }}
        >
          Favourite Genres
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            "Romance 💕",
            "Fantasy ✨",
            "Fiction 📖",
            "Historical Fiction 🏰",
          ].map((g) => (
            <span
              key={g}
              className="px-4 py-2 rounded-full font-lato text-sm font-semibold"
              style={{
                background: "#fce4ec",
                color: "#c2185b",
                border: "1.5px solid #f8bbd0",
              }}
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-3xl p-8">
        <h3
          className="font-playfair text-xl font-semibold mb-6"
          style={{ color: "#6d2b4e" }}
        >
          Reading History
        </h3>
        <div className="flex flex-col gap-3">
          {SAMPLE_REVIEWS.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="flex items-center justify-between p-4 rounded-2xl hover-scale"
              style={{ background: "#fff5f8" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📕</span>
                <div>
                  <p
                    className="font-lato font-semibold text-sm"
                    style={{ color: "#5d3a4a" }}
                  >
                    {r.title}
                  </p>
                  <p
                    className="font-lato text-xs"
                    style={{ color: "#a06080" }}
                  >
                    {r.author}
                  </p>
                </div>
              </div>
              <StarRating rating={r.rating} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof SAMPLE_REVIEWS>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    const q = query.toLowerCase();
    setResults(
      SAMPLE_REVIEWS.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q) ||
          r.genre.toLowerCase().includes(q) ||
          r.text.toLowerCase().includes(q)
      )
    );
    setSearched(true);
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

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage setPage={setCurrentPage} />;
      case "browse":
        return <BrowsePage />;
      case "dashboard":
        return <DashboardPage />;
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
              background: "#c2185b",
              color: "#fff",
              boxShadow: "0 3px 12px rgba(194,24,91,0.25)",
            }}
          >
            <Icon name="User" size={15} />
            Sign In
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
  );
}