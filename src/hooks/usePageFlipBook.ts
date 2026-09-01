// hooks/usePageFlipBook.ts

import { useEffect, useRef } from "react";
import type { Plate } from "../types/plate";
import { STRIP_COUNT as N, SPAN, BETA } from "./curlConstants";

type TurnState = { dir: "next" | "prev"; from: number; to: number; t: number } | null;

type SpringState =
  | { kind: "spring"; v: number; target: number; done: () => void; k: number; c: number }
  | { kind: "tween"; from: number; target: number; dur: number; e: number; done: () => void }
  | null;

/**
 * Drives the page-flip effect imperatively via refs. This intentionally does
 * NOT use React state for per-frame animation values — updating state 60x/sec
 * would cause React to re-render every frame, which is far too slow for a
 * physically-animated curl. Instead the hook mutates DOM styles directly
 * (same approach as the original vanilla-JS version) and only exposes the
 * refs the JSX needs to attach to its elements.
 */
export function usePageFlipBook(plates: Plate[]) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sb3dRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const capBoxRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const stage = stageRef.current!;
    const sb3d = sb3dRef.current!;
    const book = bookRef.current!;
    const capBox = capBoxRef.current!;
    const hint = hintRef.current!;
    const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let idx = 0;
    let turn: TurnState = null;
    let strips: HTMLDivElement[] = [];
    let spring: SpringState = null;
    let raf: number | null = null;
    let last = 0;
    let capOut: HTMLParagraphElement | null = null;
    let capIn: HTMLParagraphElement | null = null;
    let drag: { dir: "next" | "prev"; x0: number; w: number; moved: number; vel: number; tPrev: number } | null =
      null;

    function el<K extends keyof HTMLElementTagNameMap>(t: K, c?: string) {
      const e = document.createElement(t);
      if (c) e.className = c;
      return e;
    }

    function imgEl(i: number, side: "left" | "right") {
      const im = new Image();
      im.className = "sb-half-img " + side;
      im.draggable = false;
      im.alt = "";
      im.src = plates[i].image;
      return im;
    }

    function halfEl(pos: "left" | "right", i: number) {
      const d = el("div", "sb-half " + pos);
      d.appendChild(imgEl(i, pos));
      d.appendChild(el("div", "gutter-shade " + pos));
      return d;
    }

    function buildCurl(dir: "next" | "prev", from: number, to: number) {
      strips = [];
      const c = el("div", "curl " + dir);
      c.style.setProperty("--n", String(N));
      c.style.setProperty("--span", String(SPAN));
      let host: HTMLElement = c;
      for (let i = 0; i < N; i++) {
        const s = el("div", "strip");
        s.style.setProperty("--i", String(i));
        const gut = "calc(var(--bw) * 0.5)";
        const sw = "calc(var(--bw) * " + SPAN + " / " + N + ")";
        const A = "calc(-1 * (" + gut + " + " + i + " * " + sw + "))"; // faces the from-page
        const B = "calc(" + (i + 1) + " * " + sw + " - " + gut + ")"; // faces the to-page
        const f = el("div", "face front");
        const b = el("div", "face back");
        const dress = (e: HTMLElement, url: string, px: string) => {
          e.style.backgroundImage = "url(" + url + ")";
          e.style.backgroundPositionX = px;
        };
        dress(f, plates[from].image, dir === "next" ? A : B);
        dress(b, plates[to].image, dir === "next" ? B : A);
        f.appendChild(el("div", "sh"));
        f.appendChild(el("div", "gl"));
        b.appendChild(el("div", "sh"));
        b.appendChild(el("div", "gl"));
        s.appendChild(f);
        s.appendChild(b);
        if (i === N - 1) s.classList.add("edge");
        host.appendChild(s);
        host = s;
        strips.push(s);
      }
      return c;
    }

    function applyTurn(t: number) {
      const th = Math.PI * t; // how far the leaf has swung
      const beta = BETA * Math.sin(Math.PI * t); // flat at both ends
      const D = 180 / Math.PI;
      const tt = th + beta;
      const td = (2 * beta) / N;
      sb3d.style.setProperty("--tt", (tt * D).toFixed(2) + "deg");
      sb3d.style.setProperty("--td", (td * D).toFixed(3) + "deg");
      sb3d.style.setProperty("--shade", Math.sin(Math.PI * t).toFixed(3));
      fadeCaption(t);
      for (let i = 0; i < strips.length; i++) {
        const l1 = Math.abs(Math.cos(tt - i * td)); // facing at this strip's near edge
        const l2 = Math.abs(Math.cos(tt - (i + 1) * td)); // ...and at its far edge
        const st = strips[i].style;
        st.setProperty("--lit", l1.toFixed(3));
        st.setProperty("--a1", ((1 - l1) * 0.62).toFixed(3));
        st.setProperty("--a2", ((1 - l2) * 0.62).toFixed(3));
      }
    }

    function paint() {
      book.textContent = "";
      if (!turn) {
        const f = el("div", "sb-full");
        const im = new Image();
        im.src = plates[idx].image;
        im.alt = plates[idx].title;
        im.draggable = false;
        f.appendChild(im);
        book.appendChild(f);
        sb3d.style.setProperty("--shade", "0");
      } else {
        const next = turn.dir === "next";
        book.appendChild(halfEl("left", next ? turn.from : turn.to));
        book.appendChild(halfEl("right", next ? turn.to : turn.from));
        book.appendChild(buildCurl(turn.dir, turn.from, turn.to));
        applyTurn(turn.t);
      }
      const a = el("button", "sb-zone sb-prev");
      const b = el("button", "sb-zone sb-next");
      a.setAttribute("aria-label", "previous page");
      b.setAttribute("aria-label", "next page");
      book.appendChild(a);
      book.appendChild(b);
      layout();
      caption();
    }

    function caption() {
      capBox.textContent = "";
      capOut = capIn = null;
      if (turn) {
        capOut = el("p", "sb-caption live") as HTMLParagraphElement;
        capOut.textContent = plates[turn.from].title;
        capBox.appendChild(capOut);
        capIn = el("p", "sb-caption live") as HTMLParagraphElement;
        capIn.textContent = plates[turn.to].title;
        capBox.appendChild(capIn);
        fadeCaption(turn.t);
      } else {
        const p = el("p", "sb-caption") as HTMLParagraphElement;
        p.textContent = plates[idx].title;
        capBox.appendChild(p);
      }
    }

    function fadeCaption(t: number) {
      if (!capOut || !capIn) return;
      const out = 1 - Math.max(0, Math.min(1, (t - 0.1) / 0.28));
      const inn = Math.max(0, Math.min(1, (t - 0.56) / 0.3));
      capOut.style.opacity = out.toFixed(3);
      capIn.style.opacity = inn.toFixed(3);
    }

    function layout() {
      sb3d.style.setProperty("--bw", book.clientWidth + "px");
    }

    function animateTo(target: number, onDone: () => void, stiff = 150, damp = 22) {
      spring = { kind: "spring", v: 0, target, done: onDone, k: stiff, c: damp };
      kick();
    }

    function tick(now: number) {
      raf = null;
      const dt = Math.min(0.032, (now - last) / 1000 || 0.016);
      last = now;
      if (spring && turn) {
        const s = spring;
        if (s.kind === "tween") {
          s.e += dt;
          const k = Math.min(1, s.e / s.dur);
          turn.t = s.from + (s.target - s.from) * k;
          applyTurn(turn.t);
          if (k >= 1) {
            spring = null;
            const d = s.done;
            d && d();
          }
        } else {
          const x = turn.t - s.target;
          s.v += (-s.k * x - s.c * s.v) * dt;
          turn.t += s.v * dt;
          if (Math.abs(turn.t - s.target) < 0.002 && Math.abs(s.v) < 0.02) {
            turn.t = s.target;
            spring = null;
            applyTurn(turn.t);
            const d = s.done;
            d && d();
          } else {
            applyTurn(turn.t);
          }
        }
      }
      if (spring && raf === null) raf = requestAnimationFrame(tick);
    }

    function kick() {
      if (raf === null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    }

    function startTurn(dir: "next" | "prev", t: number) {
      spring = null;
      if (turn) {
        idx = turn.to;
        turn = null;
      }
      const from = idx;
      const M = plates.length;
      turn = { dir, from, to: dir === "next" ? (from + 1) % M : (from - 1 + M) % M, t };
      paint();
    }

    function commit() {
      if (!turn) return;
      if (REDUCED) {
        idx = turn.to;
        turn = null;
        paint();
        return;
      }
      animateTo(1, () => {
        idx = turn!.to;
        turn = null;
        paint();
      });
    }

    function cancel() {
      if (!turn) return;
      animateTo(
        0,
        () => {
          turn = null;
          paint();
        },
        150,
        24
      );
    }

    function step(dir: "next" | "prev") {
      if (turn) {
        idx = turn.to;
        turn = null;
      }
      startTurn(dir, 0);
      commit();
    }

    function hideHint() {
      hint.classList.add("gone");
    }

    function bookRect() {
      return book.getBoundingClientRect();
    }

    function onPointerDown(e: PointerEvent) {
        if (e.button !== 0) return;
        // Let the arrow buttons handle their own click — capturing the
        // pointer here would swallow the click event before it reaches them.
        if ((e.target as HTMLElement).closest(".sb-arrow")) return;
        const onBook = (e.target as HTMLElement).closest(".sb-zone");
        hideHint();
        if (!onBook) return;
        e.preventDefault();
        stage.setPointerCapture(e.pointerId);
        const r = bookRect();
        const dir: "next" | "prev" = (e.clientX - r.left) / r.width > 0.5 ? "next" : "prev";
        startTurn(dir, 0);
        drag = { dir, x0: e.clientX, w: r.width, moved: 0, vel: 0, tPrev: performance.now() };
    }

    function onPointerMove(e: PointerEvent) {
      if (!drag) return;
      const dx = e.clientX - drag.x0;
      drag.moved = Math.max(drag.moved, Math.abs(dx));
      const raw = (drag.dir === "next" ? -dx : dx) / (drag.w * 0.62);
      const t = Math.max(0, Math.min(1, raw));
      const now = performance.now();
      drag.vel = (t - (turn ? turn.t : 0)) / Math.max(0.001, (now - drag.tPrev) / 1000);
      drag.tPrev = now;
      if (turn) {
        turn.t = t;
        applyTurn(t);
      }
    }

    function endDrag() {
      if (!drag) return;
      const d = drag;
      drag = null;
      if (!turn) return;
      if (d.moved < 6) {
        commit();
        return;
      }
      const go = turn.t > 0.42 || d.vel > 1.1;
      if (go) commit();
      else cancel();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      e.preventDefault();
      hideHint();
      step(e.key === "ArrowRight" ? "next" : "prev");
    }

    function onResize() {
      layout();
    }
    function onDragStart(e: Event) {
      e.preventDefault();
    }
    function onSelectStart(e: Event) {
      e.preventDefault();
    }

    // boot
    idx = 0;
    paint();

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove);
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("dragstart", onDragStart);
    stage.addEventListener("selectstart", onSelectStart);
    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);

    const leftBtn = stage.querySelector<HTMLButtonElement>(".sb-arrow.left");
    const rightBtn = stage.querySelector<HTMLButtonElement>(".sb-arrow.right");
    const onLeft = () => {
      hideHint();
      step("prev");
    };
    const onRight = () => {
      hideHint();
      step("next");
    };
    leftBtn?.addEventListener("click", onLeft);
    rightBtn?.addEventListener("click", onRight);

    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", endDrag);
      stage.removeEventListener("pointercancel", endDrag);
      stage.removeEventListener("dragstart", onDragStart);
      stage.removeEventListener("selectstart", onSelectStart);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("keydown", onKeyDown);
      leftBtn?.removeEventListener("click", onLeft);
      rightBtn?.removeEventListener("click", onRight);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { stageRef, sb3dRef, bookRef, capBoxRef, hintRef };
}