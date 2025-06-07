// PureView/SVGLogo.js
import { createElement, createComponent, useState, useEffect } from "./core.js"; // Path relatif disesuaikan

export const SVGLogo = createComponent(function SVGLogo({ src, className = "" }) {
  const [svgContent, setSvgContent] = useState(null);

  useEffect(() => {
    async function fetchSvg() {
      try {
        const response = await fetch(src);
        if (!response.ok) {
          throw new Error(`Gagal memuat SVG: ${response.statusText}`);
        }
        const text = await response.text();
        setSvgContent(text);
      } catch (error) {
        console.error("Error fetching SVG:", error);
        // Fallback jika gagal memuat SVG
        setSvgContent('<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="red"/><text x="5" y="30" font-size="20" fill="white">Err</text></svg>');
      }
    }
    fetchSvg();
  }, [src]); // Jalankan efek saat src berubah

  if (!svgContent) {
    // Placeholder saat SVG sedang dimuat
    return createElement("div", { className: `${className} bg-gray-200 animate-pulse rounded-md` });
  }

  return createElement("div", {
    className: className,
    dangerouslySetInnerHTML: { __html: svgContent },
  });
});

export default SVGLogo;
