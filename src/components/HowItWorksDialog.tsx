import { useEffect, useRef } from "react";
import { NOTEBOOKS, asset } from "../data/assets";

interface HowItWorksDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HowItWorksDialog({ open, onClose }: HowItWorksDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button type="button" className="close" aria-label="Close" onClick={onClose}>
        ×
      </button>
      <small>FROM NIGHT-LIGHT DATA TO SOUND</small>
      <h2>Two ways to listen to change.</h2>
      <div className="methods">
        <article>
          <b>01 · READ THE DATA</b>
          <p>
            The radiance notebook reads NASA VIIRS Black Marble HDF5 layers for 2012 and 2023,
            filters invalid and low-quality pixels, then calculates 2023 minus 2012. Grid-cell
            change maps to pitch and intensity; the scan moves west to east.
          </p>
          <a href={asset(NOTEBOOKS.radiance)} download>
            Open data-based notebook ↗
          </a>
        </article>
        <article>
          <b>02 · LISTEN TO THE IMAGE</b>
          <p>
            The visual notebooks summarize map-frame brightness or color by scan position and
            translate the patterns into notes. This is an artistic mapping of rendered imagery,
            not a direct measurement of radiance.
          </p>
          <a href={asset(NOTEBOOKS.india)} download>
            India notebook ↗
          </a>
          <a href={asset(NOTEBOOKS.world)} download>
            World-map notebook ↗
          </a>
        </article>
      </div>
      <p className="source">
        NASA's Earth Information Center visualization compares annual night-light averages and
        change from 2012 to 2023. This player showcases team-made sonifications inspired by that
        work.{" "}
        <a href="https://svs.gsfc.nasa.gov/5313/" target="_blank" rel="noreferrer">
          NASA SVS 5313 ↗
        </a>
      </p>
    </dialog>
  );
}
