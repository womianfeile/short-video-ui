import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AtSign,
  ChevronDown,
  Expand,
  Heart,
  Image,
  MessageCircleMore,
  Plus,
  Search,
  Share2,
  Smile,
  Star,
  X,
} from "lucide-react";
import { content } from "./content";
import "./styles.css";

function compactCount(value, delta = 0) {
  if (typeof value !== "number") return value;
  const next = Math.max(0, value + delta);
  if (next >= 10000) {
    const wan = next / 10000;
    return `${wan.toFixed(wan >= 10 ? 0 : 1)}万`;
  }
  return String(next);
}

function IconButton({ label, active, children, onClick }) {
  return (
    <button className={`icon-button ${active ? "is-active" : ""}`} type="button" aria-label={label} onClick={onClick}>
      <span className="icon-button__glyph" aria-hidden="true">
        {children}
      </span>
      <span className="icon-button__label">{label}</span>
    </button>
  );
}

function PlayGlyph() {
  return (
    <span className="play-glyph" aria-hidden="true">
      <span />
    </span>
  );
}

function VideoStage({ isPlaying, setIsPlaying, videoRef }) {
  const [videoError, setVideoError] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video || videoError) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  return (
    <button className="video-stage" type="button" onClick={togglePlayback} aria-label={isPlaying ? "暂停视频" : "播放视频"}>
      <video
        ref={videoRef}
        className="video-stage__media"
        src={content.video.src}
        poster={content.video.poster}
        playsInline
        loop
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setVideoError(true)}
      />
      {videoError && (
        <div className="video-stage__missing">
          <strong>待放入视频</strong>
          <span>把你拍好的视频放到 public/media/main-video.mp4，或在 src/content.js 修改路径。</span>
        </div>
      )}
      {!isPlaying && !videoError && <PlayGlyph />}
    </button>
  );
}

function DanmakuLayer({ videoRef, isPlaying }) {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      if (videoRef.current) setTime(videoRef.current.currentTime || 0);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [videoRef]);

  return (
    <div className={`danmaku-layer ${isPlaying ? "is-running" : "is-paused"}`} aria-hidden="true">
      {content.danmaku.items.map((item) => {
        const duration = item.duration ?? content.danmaku.defaultDuration;
        const active = time >= item.at && time <= item.at + duration;
        const progress = active ? (time - item.at) / duration : 0;
        return (
          <span
            key={`${item.text}-${item.at}`}
            className={`danmaku-item ${active ? "is-visible" : ""}`}
            style={{
              "--track": item.track,
              "--progress": progress,
              "--duration": `${duration}s`,
            }}
          >
            {item.text}
          </span>
        );
      })}
    </div>
  );
}

function TopTabs() {
  return (
    <header className="top-tabs" aria-label="频道">
      {content.tabs.map((tab) => (
        <span key={tab} className={tab === content.activeTab ? "is-active" : ""}>
          {tab}
        </span>
      ))}
      <Search className="top-tabs__search" aria-hidden="true" strokeWidth={2.45} />
    </header>
  );
}

function RightRail({ liked, setLiked, openComments }) {
  const likeLabel = compactCount(content.counts.like, liked ? 1 : 0);

  return (
    <aside className="right-rail" aria-label="互动按钮">
      <button className="avatar-button" type="button" aria-label="作者头像">
        <img src={content.profile.avatar} alt="" />
      </button>
      <IconButton label={likeLabel} active={liked} onClick={() => setLiked((value) => !value)}>
        <Heart fill="currentColor" strokeWidth={2.15} />
      </IconButton>
      <IconButton label={compactCount(content.counts.comment)} onClick={openComments}>
        <MessageCircleMore strokeWidth={2.25} />
      </IconButton>
      <IconButton label={compactCount(content.counts.favorite)}>
        <Star fill="currentColor" strokeWidth={2.05} />
      </IconButton>
      <IconButton label={compactCount(content.counts.share)}>
        <Share2 strokeWidth={2.3} />
      </IconButton>
    </aside>
  );
}

function BottomMeta({ videoRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const video = videoRef.current;
      if (video?.duration) setProgress((video.currentTime / video.duration) * 100);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [videoRef]);

  return (
    <section className="bottom-meta" aria-label="视频信息">
      <div className="creator-name">@{content.profile.name}</div>
      <p className="description">
        <span className="description__text">
          {content.description.text} {content.description.tags.map((tag) => `#${tag}`).join(" ")}
        </span>
        <span className="description__more">
          展开
          <ChevronDown aria-hidden="true" strokeWidth={2.2} />
        </span>
      </p>
      <div className="notice">作者声明：虚构演绎，仅供娱乐 ›</div>
      <div className="progress-track" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>
      <nav className="bottom-nav" aria-label="底部导航">
        {content.bottomNav.map((item) => (
          <span key={item.label} className={item.active ? "is-active" : ""}>
            {item.label === "+" ? <Plus aria-hidden="true" strokeWidth={2.8} /> : item.label}
            {item.badge && <em>{item.badge}</em>}
          </span>
        ))}
      </nav>
    </section>
  );
}

function CommentSheet({ open, onClose }) {
  const total = compactCount(content.counts.comment);

  return (
    <div className={`sheet-backdrop ${open ? "is-open" : ""}`} aria-hidden={!open}>
      <section className="comment-sheet" role="dialog" aria-modal="true" aria-label="评论">
        <div className="comment-sheet__handle" />
        <header className="comment-sheet__search">
          <div>
            <span>大家都在搜：</span>
            <strong>{content.searchTopic}</strong>
            <Search aria-hidden="true" size={14} strokeWidth={2.2} />
          </div>
          <button type="button" className="round-tool" aria-label="放大评论区">
            <Expand aria-hidden="true" strokeWidth={2.15} />
          </button>
          <button type="button" className="round-tool" aria-label="关闭评论" onClick={onClose}>
            <X aria-hidden="true" strokeWidth={2.25} />
          </button>
        </header>
        <div className="comment-tabs">
          <span className="is-active">评论 {total}</span>
        </div>
        <div className="comment-list">
          {content.comments.map((comment) => (
            <article className="comment-item" key={`${comment.name}-${comment.time}`}>
              <img className="comment-item__avatar" src={comment.avatar} alt="" />
              <div className="comment-item__body">
                <div className="comment-item__name">{comment.name}</div>
                <p>{comment.text}</p>
                <div className="comment-item__meta">
                  <span>{comment.time}</span>
                  <span>回复</span>
                </div>
                {comment.replyHint && (
                  <button className="reply-toggle" type="button">
                    {comment.replyHint}
                    <ChevronDown aria-hidden="true" strokeWidth={2} />
                  </button>
                )}
              </div>
              <div className="comment-item__like" aria-label={`${comment.likes}赞`}>
                <Heart aria-hidden="true" strokeWidth={1.9} />
                <span>{comment.likes}</span>
              </div>
            </article>
          ))}
        </div>
        <footer className="comment-input" aria-hidden="true">
          <span>分享你此刻的想法</span>
          <i>
            <Image strokeWidth={2.1} />
          </i>
          <i>
            <AtSign strokeWidth={2.1} />
          </i>
          <i>
            <Smile strokeWidth={2.1} />
          </i>
        </footer>
      </section>
    </div>
  );
}

function App() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const appClass = useMemo(() => `app-shell ${commentsOpen ? "has-sheet" : ""}`, [commentsOpen]);

  return (
    <main className={appClass}>
      <VideoStage isPlaying={isPlaying} setIsPlaying={setIsPlaying} videoRef={videoRef} />
      <DanmakuLayer videoRef={videoRef} isPlaying={isPlaying} />
      <TopTabs />
      <RightRail liked={liked} setLiked={setLiked} openComments={() => setCommentsOpen(true)} />
      <BottomMeta videoRef={videoRef} />
      <CommentSheet open={commentsOpen} onClose={() => setCommentsOpen(false)} />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`, { scope: import.meta.env.BASE_URL }).catch(() => {});
  });
}
