document.addEventListener('DOMContentLoaded', () => {
  // 1. 網頁滾動進入畫面漸顯動畫偵測
  const els = document.querySelectorAll('.project, .panel, .hero-card');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('show');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach((el) => io.observe(el));

  // 2. 懸停變換網頁底色與點擊放大燈箱（Lightbox）整合功能
  const imgWraps = document.querySelectorAll('.img-wrap');
  const bgLayer = document.querySelector('.interactive-bg');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const defaultColor = '#f5f2eb';

  imgWraps.forEach(wrap => {
    const img = wrap.querySelector('img');
    const targetColor = wrap.getAttribute('data-color');

    // 懸停切換底色
    wrap.addEventListener('mouseenter', () => {
      if (bgLayer && targetColor) {
        bgLayer.style.backgroundColor = targetColor;
      }
    });

    // 滑鼠移出恢復預設色
    wrap.addEventListener('mouseleave', () => {
      if (bgLayer) {
        bgLayer.style.backgroundColor = defaultColor;
      }
    });

    // 點選左鍵放大圖片
    if (img && img.classList.contains('zoomable')) {
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        const imgSrc = img.getAttribute('src');
        lightboxImg.setAttribute('src', imgSrc);
        lightbox.classList.add('active');
        
        // 點開大圖時背景同步變色
        if (bgLayer && targetColor) {
          bgLayer.style.backgroundColor = targetColor;
        }
      });
    }
  });

  // 關閉燈箱控制
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    if (bgLayer) bgLayer.style.backgroundColor = defaultColor;
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target !== lightboxImg) {
      closeLightbox();
    }
  });
});