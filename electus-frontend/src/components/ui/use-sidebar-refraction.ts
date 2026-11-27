import { useEffect, useId, type RefObject } from "react";

function roundedDistance(x: number, y: number, halfWidth: number, halfHeight: number, radius: number) {
  const dx = Math.abs(x) - halfWidth + radius;
  const dy = Math.abs(y) - halfHeight + radius;
  return Math.hypot(Math.max(dx, 0), Math.max(dy, 0)) + Math.min(Math.max(dx, dy), 0) - radius;
}

export function useSidebarRefraction(root: RefObject<HTMLElement>, distortion: number) {
  const id = `sidebar-lens-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  useEffect(() => {
    const surface = root.current;
    if (!surface || !distortion || !CSS.supports("backdrop-filter", `url(#${id})`) ||
      !/Chrome|Chromium|Edg/.test(navigator.userAgent) || /CriOS/.test(navigator.userAgent)) return;

    const preference = matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more), (forced-colors: active)");
    const namespace = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(namespace, "svg");
    const filter = document.createElementNS(namespace, "filter");
    const image = document.createElementNS(namespace, "feImage");
    const displacement = document.createElementNS(namespace, "feDisplacementMap");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("class", "gn-sidebar-filter");
    filter.id = id;
    filter.setAttribute("color-interpolation-filters", "sRGB");
    image.setAttribute("preserveAspectRatio", "none");
    image.setAttribute("width", "100%");
    image.setAttribute("height", "100%");
    image.setAttribute("result", "lens");
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "lens");
    displacement.setAttribute("scale", String(distortion));
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "G");
    filter.append(image, displacement);
    svg.append(filter);
    surface.append(svg);

    const update = () => {
      surface.style.removeProperty("--gn-displacement");
      if (preference.matches) return;
      const { offsetWidth: width, offsetHeight: height } = surface;
      if (!width || !height) return;

      const canvas = document.createElement("canvas");
      canvas.width = Math.min(130, Math.ceil(width / 2));
      canvas.height = Math.min(200, Math.ceil(height / 2));
      const context = canvas.getContext("2d");
      if (!context) return;
      const pixels = context.createImageData(canvas.width, canvas.height);
      const radius = Math.min(parseFloat(getComputedStyle(surface).borderTopLeftRadius) || 26, width / 2, height / 2);
      const bevel = Math.min(18, height / 4);
      const distance = (x: number, y: number) => roundedDistance(x - width / 2, y - height / 2, width / 2, height / 2, radius);
      for (let row = 0; row < canvas.height; row++) {
        for (let column = 0; column < canvas.width; column++) {
          const x = (column + .5) * width / canvas.width;
          const y = (row + .5) * height / canvas.height;
          const depth = distance(x, y);
          const bend = depth < 0 ? Math.sin(Math.min(1, -depth / bevel) * Math.PI) : 0;
          const dx = distance(x + 1, y) - distance(x - 1, y);
          const dy = distance(x, y + 1) - distance(x, y - 1);
          const length = Math.hypot(dx, dy) || 1;
          const pixel = (row * canvas.width + column) * 4;
          pixels.data[pixel] = 128 + dx / length * bend * 110;
          pixels.data[pixel + 1] = 128 + dy / length * bend * 110;
          pixels.data[pixel + 2] = 128;
          pixels.data[pixel + 3] = 255;
        }
      }
      context.putImageData(pixels, 0, 0);
      image.setAttribute("href", canvas.toDataURL());
      surface.style.setProperty("--gn-displacement", `url(#${id})`);
    };

    // Rebuild the lens after the sidebar settles to avoid drawing it on every FLIP frame.
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(update, 80);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(surface);
    preference.addEventListener("change", update);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      preference.removeEventListener("change", update);
      surface.style.removeProperty("--gn-displacement");
      svg.remove();
    };
  }, [root, id, distortion]);
}
