/* 重新整理網頁時，強制從最上面開始 */
if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
});

document.addEventListener("DOMContentLoaded", () => {
  window.scrollTo(0, 0);

  /* 1. 網頁滾動進入畫面漸顯動畫 */
  const els = document.querySelectorAll(".project, .panel, .hero-card");

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("show");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  els.forEach((el) => io.observe(el));

  /* 2. 懸停圖片時變換背景色 */
  const imgWraps = document.querySelectorAll(".img-wrap");
  const bgLayer = document.querySelector(".interactive-bg");
  const defaultColor = "#f5f2eb";

  imgWraps.forEach((wrap) => {
    const targetColor = wrap.getAttribute("data-color");

    wrap.addEventListener("mouseenter", () => {
      if (bgLayer && targetColor) {
        bgLayer.style.backgroundColor = targetColor;
      }
    });

    wrap.addEventListener("mouseleave", () => {
      if (bgLayer) {
        bgLayer.style.backgroundColor = defaultColor;
      }
    });
  });

  /* 3. 圖片點擊放大 Lightbox */
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxClose = document.querySelector(".lightbox-close");

  if (!lightbox || !lightboxImg || !lightboxClose) {
    console.warn("Lightbox 結構不存在，請檢查 index.html 最下面有沒有 lightbox div。");
    return;
  }

  document.addEventListener("click", (e) => {
    const img = e.target.closest("img");

    if (!img) return;

    /* 很重要：避免點到放大後的圖片又再次觸發 */
    if (img.classList.contains("lightbox-img")) return;

    const canZoom =
      img.classList.contains("zoomable") ||
      img.closest(".img-wrap");

    if (!canZoom) return;

    if (!img.src) return;

    e.preventDefault();
    e.stopPropagation();

    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "Zoomed image";

    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightboxImg.removeAttribute("src");
    lightboxImg.alt = "Zoomed image";
    document.body.style.overflow = "";

    if (bgLayer) {
      bgLayer.style.backgroundColor = defaultColor;
    }
  }

  lightboxClose.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });

  /* 4. 圖片破圖處理 */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", () => {
      const parent = img.closest(".img-wrap") || img.closest(".tool-item");

      if (parent) {
        parent.classList.add("missing-image");
      }

      img.style.display = "none";
    });
  });
});
