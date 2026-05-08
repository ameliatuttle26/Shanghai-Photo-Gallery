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
      { url: '/centruy.jpeg', description: '照片 1', photographer: '唐诗涵' },
      { url: '/centurypark.jpeg', description: '照片 1', photographer: '唐诗涵' },
      { url: '/bike_path.jpeg', description: '照片 2', photographer: '唐诗涵' },
      { url: '/park_path.jpeg', description: '照片 3', photographer: '唐诗涵' },
      { url: '/park_water.jpeg', description: '照片 4', photographer: '唐诗涵' },
      ]
  },
  {
    id: 'category2',
    name: '日常生活的绿色',
    photos: [
      { url: '/anfu_road_trees.jpg', description: '照片 1', photographer: '唐诗涵' },
      { url: '/bridge_vines.jpeg', description: '照片 2', photographer: '唐诗涵' },
      { url: '/road_trees.jpeg', description: '照片 3', photographer: '唐诗涵' },
      { url: '/qiantan_road_trees.jpeg', description: '照片 4', photographer: '唐诗涵' },
      { url: '/under.jpeg', description: '照片 5', photographer: '唐诗涵' },
      ]
  },
  {
    id: 'category3',
    name: '滨水绿色空间',
    photos: [
      { url: '/blossom.jpeg', description: '照片 1', photographer: '唐诗涵' },
      { url: '/waterpark.jpeg', description: '照片 2', photographer: '唐诗涵' },
      { url: '/sunset.jpeg', description: '照片 3', photographer: '唐诗涵' },
      { url: '/yangpu.jpeg', description: '照片 4', photographer: '唐诗涵' },
      { url: '/bridge.jpeg', description: '照片 5', photographer: '唐诗涵' }
    ]
  },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [galleryVisible, setGalleryVisible] = useState(false);
  // For crossfade: track displayed index separately from target
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
    setTimeout(() => {
      setSelectedCategory(null);
    }, 400);
  };

  const goToPhoto = (index: number) => {
    if (isAnimating.current || !selectedCategory) return;
    if (index === displayedIndex) return;
    isAnimating.current = true;
    // Fade out
    setFading(true);
    setTimeout(() => {
      // Swap image while invisible
      setDisplayedIndex(index);
      setSelectedPhotoIndex(index);
      // Fade in
      setFading(false);
      setTimeout(() => {
        isAnimating.current = false;
      }, 300);
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
      if (!selectedCategory) return;
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
      if (e.key === 'Escape') closeGallery();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedCategory, displayedIndex]);

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

        .header-meta {
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #6b6158;
          text-align: right;
          line-height: 1.8;
          font-family: 'DM Mono', monospace;
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
          aspect-ratio: 3/4;
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

      <div className="gallery-root">
        <header className="header">
          <h1 className="header-title">上海的<br /><em>人工自然</em></h1>
          <div className="header-meta">
            {categories.length} 个系列<br />
            {categories.reduce((a, c) => a + c.photos.length, 0)} 张照片
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
