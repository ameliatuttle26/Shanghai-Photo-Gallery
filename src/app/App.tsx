import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './components/ImageW';

interface Photo {
  url: string;
  description: string;
  photographer: string;
}

interface Category {
  id: string;
  name: string;
  photos: Photo[];
}

const categories: Category[] = [
  {
    id: 'category1',
    name: '大型设计公园',
    photos: [
      { url: '/centruy.jpeg', description: '世纪公园', photographer: '唐诗涵' },
      { url: '/centurypark.jpeg', description: '世纪公园', photographer: '唐诗涵' },
      { url: '/bike_path.jpeg', description: '自行车道', photographer: '唐诗涵' },
      { url: '/park_path.jpeg', description: '后滩公园小道', photographer: '唐诗涵' },
      { url: '/park_water.jpeg', description: '后滩公园水景', photographer: '唐诗涵' },
    ]
  },
  {
    id: 'category2',
    name: '日常生活的绿色',
    photos: [
      { url: '/anfu_road_trees.jpg', description: '安福路树木', photographer: '唐诗涵' },
      { url: '/bridge_vines.jpeg', description: '桥上藤蔓', photographer: '唐诗涵' },
      { url: '/road_trees.jpeg', description: '道路树木', photographer: '唐诗涵' },
      { url: '/qiantan_road_trees.jpeg', description: '前滩路树木', photographer: '唐诗涵' },
      { url: '/under.jpeg', description: '桥下的路边树木', photographer: '唐诗涵' },
    ]
  },
  {
    id: 'category3',
    name: '滨水绿色空间',
    photos: [
      { url: '/blossom.jpeg', description: '开花的树木', photographer: '唐诗涵' },
      { url: '/waterpark.jpeg', description: '陆家嘴滨江公园', photographer: '唐诗涵' },
      { url: '/sunset.jpeg', description: '世博公园滨江日落', photographer: '唐诗涵' },
      { url: '/yangpu.jpeg', description: '杨浦滨江', photographer: '唐诗涵' },
      { url: '/bridge.jpeg', description: '普陀滨江', photographer: '唐诗涵' }
    ]
  },
];

export default function App() {
  const [prologueOpen, setPrologueOpen] = useState(true);
  const [lang, setLang] = useState<'zh' | 'en'>('zh');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const isAnimating = useRef(false);
  const touchStartX = useRef<number | null>(null);

  const openCategory = (category: Category) => {
    setSelectedCategory(category);
    setSelectedPhotoIndex(0);
    setDisplayedIndex(0);
    setFading(false);
    isAnimating.current = false;
    requestAnimationFrame(() => setGalleryVisible(true));
  };

  const closeGallery = () => {
    setGalleryVisible(false);
    setTimeout(() => { setSelectedCategory(null); }, 400);
  };

  const goToPhoto = (index: number) => {
    if (isAnimating.current || !selectedCategory) return;
    if (index === displayedIndex) return;
    isAnimating.current = true;
    setFading(true);
    setTimeout(() => {
      setDisplayedIndex(index);
      setSelectedPhotoIndex(index);
      setFading(false);
      setTimeout(() => { isAnimating.current = false; }, 300);
    }, 250);
  };

  const nextPhoto = () => {
    if (!selectedCategory) return;
    goToPhoto((displayedIndex + 1) % selectedCategory.photos.length);
  };

  const prevPhoto = () => {
    if (!selectedCategory) return;
    goToPhoto(displayedIndex === 0 ? selectedCategory.photos.length - 1 : displayedIndex - 1);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? nextPhoto() : prevPhoto();
    touchStartX.current = null;
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (prologueOpen) {
        if (e.key === 'Escape') setPrologueOpen(false);
        return;
      }
      if (!selectedCategory) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeGallery();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedCategory, displayedIndex, prologueOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Noto+Serif+SC:wght@300;400&family=DM+Mono:wght@300;400&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0e0c0a;
          color: #f2ece3;
          font-family: 'Noto Serif SC', serif;
        }

        .gallery-root {
          min-height: 100vh;
          background: #0e0c0a;
        }

        .header {
          padding: 60px 60px 24px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid #2e2a26;
        }

        .header-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.03em;
          color: #f2ece3;
        }

        .header-title em {
          font-style: italic;
          color: #c4a882;
        }

        .header-right {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 16px;
        }

        .header-meta {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b6158;
          text-align: right;
          line-height: 1.8;
          font-family: 'DM Mono', monospace;
        }

        .prologue-btn {
          background: none;
          border: 1px solid #2e2a26;
          color: #6b6158;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 8px 16px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .prologue-btn:hover {
          border-color: #c4a882;
          color: #c4a882;
        }

        /* Prologue overlay — scrollable */
        .prologue-overlay {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(14, 12, 10, 0.97);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          overflow-y: auto;
          padding: 60px 40px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.5s ease;
        }

        .prologue-overlay.open {
          opacity: 1;
          pointer-events: all;
        }

        .prologue-box {
          max-width: 780px;
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 32px;
          padding-bottom: 60px;
        }

        .prologue-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .prologue-label {
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c4a882;
        }

        .lang-toggle {
          display: flex;
          border: 1px solid #2e2a26;
        }

        .lang-btn {
          background: none;
          border: none;
          color: #6b6158;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          padding: 6px 14px;
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }

        .lang-btn.active {
          background: #2e2a26;
          color: #f2ece3;
        }

        .lang-btn:hover:not(.active) {
          color: #c4a882;
        }

        .prologue-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #f2ece3;
        }

        .prologue-title em {
          font-style: italic;
          color: #c4a882;
        }

        .prologue-divider {
          width: 40px;
          height: 1px;
          background: #2e2a26;
        }

        .prologue-text {
          font-family: 'Noto Serif SC', serif;
          font-size: 1rem;
          font-weight: 300;
          line-height: 2;
          color: #c8bfb4;
        }

        .prologue-text p + p {
          margin-top: 1.2em;
        }

        .prologue-close {
          align-self: flex-start;
          background: none;
          border: 1px solid #2e2a26;
          color: #f2ece3;
          font-family: 'DM Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 12px 24px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s;
        }

        .prologue-close:hover {
          border-color: #c4a882;
          color: #c4a882;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          padding: 2px;
          margin-top: 2px;
        }

        .card {
          position: relative;
          aspect-ratio: 5/6;
          overflow: hidden;
          cursor: pointer;
          background: #111;
        }

        .card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1);
          transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
          display: block;
        }

        .card:hover img { transform: scale(1.08); }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(14,12,10,0.88) 0%, transparent 55%);
          opacity: 0;
          transition: opacity 0.4s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 32px;
        }

        .card:hover .card-overlay { opacity: 1; }

        .card-number {
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c4a882;
          margin-bottom: 8px;
          font-family: 'DM Mono', monospace;
        }

        .card-name {
          font-family: 'Noto Serif SC', serif;
          font-size: clamp(1.2rem, 2.5vw, 2rem);
          font-weight: 400;
          color: #f2ece3;
          line-height: 1.2;
        }

        .card-count {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          color: #6b6158;
          margin-top: 6px;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
        }

        .lightbox {
          position: fixed;
          inset: 0;
          z-index: 100;
          background: #0e0c0a;
          display: flex;
          flex-direction: column;
          opacity: 0;
          transform: scale(1.05);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.4,0,0.2,1);
          pointer-events: none;
        }

        .lightbox.visible {
          opacity: 1;
          transform: scale(1);
          pointer-events: all;
        }

        .lightbox-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 40px;
          border-bottom: 1px solid #2e2a26;
          flex-shrink: 0;
          position: relative;
        }

        .lightbox-category {
          font-family: 'Noto Serif SC', serif;
          font-size: 1.3rem;
          font-weight: 300;
          color: #c4a882;
        }

        .lightbox-counter {
          font-size: 0.8rem;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: #6b6158;
          font-family: 'DM Mono', monospace;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .close-btn {
          background: none;
          border: none;
          color: #f2ece3;
          cursor: pointer;
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          padding: 8px 0;
          transition: color 0.2s;
          font-family: 'DM Mono', monospace;
        }

        .close-btn:hover { color: #c4a882; }

        .lightbox-main {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 24px 80px;
          overflow: hidden;
          min-height: 0;
        }

        .photo-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          max-height: 100%;
          transition: opacity 0.25s ease;
        }

        .photo-wrap.fading { opacity: 0; }
        .photo-wrap.visible { opacity: 1; }

        .photo-wrap img {
          max-height: calc(100vh - 320px);
          max-width: 100%;
          object-fit: contain;
          display: block;
        }

        .caption {
          text-align: center;
          flex-shrink: 0;
        }

        .caption-text {
          font-family: 'Noto Serif SC', serif;
          font-size: 1.5rem;
          font-weight: 300;
          color: #c4a882;
          margin-bottom: 4px;
        }

        .caption-author {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b6158;
          font-family: 'DM Mono', monospace;
        }

        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: 1px solid #2e2a26;
          color: #f2ece3;
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
          z-index: 10;
          flex-shrink: 0;
        }

        .nav-btn:hover {
          border-color: #c4a882;
          color: #c4a882;
          background: rgba(196,168,130,0.05);
        }

        .nav-btn.prev { left: 20px; }
        .nav-btn.next { right: 20px; }

        .lightbox-footer {
          padding: 16px 40px;
          border-top: 1px solid #2e2a26;
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-shrink: 0;
        }

        .thumb-btn {
          width: 56px;
          height: 56px;
          overflow: hidden;
          border: 1px solid transparent;
          cursor: pointer;
          background: none;
          padding: 0;
          transition: border-color 0.2s, opacity 0.2s;
          opacity: 0.4;
          flex-shrink: 0;
        }

        .thumb-btn.active {
          border-color: #c4a882;
          opacity: 1;
        }

        .thumb-btn:hover { opacity: 0.8; }

        .thumb-btn img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>

      <div className={`prologue-overlay ${prologueOpen ? 'open' : ''}`}>
        <div className="prologue-box">

          <div className="prologue-top-row">
            <div className="prologue-label">{lang === 'zh' ? '序言' : 'Prologue'}</div>
            <div className="lang-toggle">
              <button
                className={`lang-btn ${lang === 'zh' ? 'active' : ''}`}
                onClick={() => setLang('zh')}
              >中文</button>
              <button
                className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
                onClick={() => setLang('en')}
              >EN</button>
            </div>
          </div>

          {lang === 'zh' ? (
            <h2 className="prologue-title">上海的<br /><em>人工自然</em></h2>
          ) : (
            <h2 className="prologue-title">Shanghai's<br /><em>Man-made Nature</em></h2>
          )}

          <div className="prologue-divider" />

          {lang === 'zh' ? (
            <div className="prologue-text">
              <p>上海的绿色空间常常被说"太人工"，这没有错。上海没有很多自然形成的风景。但这座城市种了很多树，建了很多公园，也在江边修了可以散步的地方。这让我想到一个问题：这样的地方，算不算"自然"？</p>
              <p>这些照片是我在上海读书四年里拍的。刚来的时候，我一个人，什么都不了解，有时候感到很孤独。慢慢地，我发现散步成了我调整状态的方式，走过公园，沿着江边，走在有很多树的街道上。这些地方承载了我很多珍贵的时刻：和朋友一起走，一个人在雨天走路，冬天看到树枝光秃秃的，春天又看到它们重新开花。</p>
              <p>后来我意识到，真正重要的不是那些大公园，而是每天都能看到的绿色：楼下的一棵树，路边的一片草地。这些地方不需要你专门去找，它们就在那里，已经成为日常生活的一部分。"真正"自然，而是我们是否应该重新思考"自然"的意义。</p>
              <p>一开始我以为这个项目需要专门出去拍照，但后来发现，这四年里我已经拍下了很多。这些绿色空间早就融入了我的生活。我想通过这些照片，表达我对这些地方的感谢。也希望看到这些照片的人能感受到：自然是有价值的，就算它是人建造出来的。</p>
            </div>
          ) : (
            <div className="prologue-text">
              <p>This project documents Shanghai's green spaces. Shanghai is often criticized for having a landscaping style that feels artificial or man-made. Although the city doesn't have much naturally occurring landscape, it has built many parks, lined the streets with trees, and created riverside walkways. These spaces aren't just beautiful; they also help the city address environmental and everyday quality-of-life challenges.</p>
              <p>These photos were taken over four years of studying in Shanghai. When I first arrived, I was alone and didn't know anything, and felt lonely at times. Gradually, I found that long walks became my way of coping, through parks, along the river, down streets lined with trees. These places held some of my most cherished moments: walking with friends, walking alone in the rain, watching branches go bare in winter and bloom again in spring.</p>
              <p>I came to realize that it wasn't the big parks that mattered most, but the everyday green: the tree outside my building, the strip of grass along the road. These things don't need you to seek them out. They are just there, woven into everyday life.</p>
              <p>At first, I thought this project would require me to go out and shoot specifically for it, but I realized that over four years, I had already been capturing it. These green spaces had long become part of my life. Through these photos, I want to express my gratitude for these places, and I hope that whoever sees them can feel it too: nature has value, even when it is built or designed by human hands.</p>
            </div>
          )}

          <button className="prologue-close" onClick={() => setPrologueOpen(false)}>
            {lang === 'zh' ? '进入画廊 →' : 'Enter Gallery →'}
          </button>

        </div>
      </div>

      <div className="gallery-root">
        <header className="header">
          <h1 className="header-title">上海的<br /><em>人工自然</em></h1>
          <div className="header-right">
            <div className="header-meta">
              {categories.length} 个系列<br />
              {categories.reduce((a, c) => a + c.photos.length, 0)} 张照片
            </div>
            <button className="prologue-btn" onClick={() => setPrologueOpen(true)}>
              序言
            </button>
          </div>
        </header>

        <div className="grid">
          {categories.map((category, i) => (
            <div key={category.id} className="card" onClick={() => openCategory(category)}>
              <ImageWithFallback src={category.photos[0].url} alt={category.name} />
              <div className="card-overlay">
                <div className="card-number">{String(i + 1).padStart(2, '0')}</div>
                <div className="card-name">{category.name}</div>
                <div className="card-count">{category.photos.length} 张照片</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div
          className={`lightbox ${galleryVisible ? 'visible' : ''}`}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="lightbox-header">
            <span className="lightbox-category">{selectedCategory.name}</span>
            <span className="lightbox-counter">
              {String(displayedIndex + 1).padStart(2, '0')} / {String(selectedCategory.photos.length).padStart(2, '0')}
            </span>
            <button className="close-btn" onClick={closeGallery}>关闭 ×</button>
          </div>

          <div className="lightbox-main">
            <button className="nav-btn prev" onClick={prevPhoto} aria-label="Previous">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className={`photo-wrap ${fading ? 'fading' : 'visible'}`}>
              <ImageWithFallback
                src={selectedCategory.photos[displayedIndex].url}
                alt={selectedCategory.photos[displayedIndex].description}
              />
              <div className="caption">
                <div className="caption-text">{selectedCategory.photos[displayedIndex].description}</div>
                <div className="caption-author">— {selectedCategory.photos[displayedIndex].photographer}</div>
              </div>
            </div>

            <button className="nav-btn next" onClick={nextPhoto} aria-label="Next">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="lightbox-footer">
            {selectedCategory.photos.map((photo, index) => (
              <button
                key={index}
                className={`thumb-btn ${index === displayedIndex ? 'active' : ''}`}
                onClick={() => goToPhoto(index)}
              >
                <ImageWithFallback src={photo.url} alt={photo.description} />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}