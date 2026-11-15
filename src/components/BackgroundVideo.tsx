import { useEffect, useRef } from "react";
import { asset } from "../data/assets";

export function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // React doesn't reliably set the muted attribute; autoplay needs it
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) v.pause();
  }, []);

  return (
    <div className="sky" aria-hidden="true">
      <video
        ref={ref}
        className="sky-video"
        src={asset("assets/video/globe.mp4")}
        poster={asset("assets/images/globe-bg-poster.jpg")}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
    </div>
  );
}