// components/PageFlipBook.ts

"use client";

import { landmarks } from "../data/Landmarks";
import { usePageFlipBook } from "../hooks/usePageFlipBook";
import "../app/PageBookFlip.css";

export default function PageFlipBook() {
  const { stageRef, sb3dRef, bookRef, capBoxRef, hintRef } = usePageFlipBook(landmarks);

  return (
    <div className="sb-wrap">
      <header className="sb-header">
        <h2 className="sb-title">Field Notes</h2>
        <p className="sb-subtitle">A sketchbook of the peninsula & the islands</p>
      </header>

      <div className="sb-stage" ref={stageRef}>
        <button className="sb-arrow left" aria-label="previous page">
          <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
            <polyline
              points="11,3 3,22 11,41"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <div className="sb-3d" ref={sb3dRef}>
          <div className="sb-tilt">
            <div className="sb-cast ambient" aria-hidden="true" />
            <div className="sb-cast contact" aria-hidden="true" />
            <div className="sb-cast hair" aria-hidden="true" />
            <div className="sb-book" ref={bookRef} />
          </div>
        </div>

        <button className="sb-arrow right" aria-label="next page">
          <svg viewBox="0 0 14 44" width="14" height="44" fill="none" aria-hidden="true">
            <polyline
              points="3,3 11,22 3,41"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="sb-captions" ref={capBoxRef} />
      <p className="sb-hint" ref={hintRef}>
        Drag the page to turn
      </p>
    </div>
  );
}