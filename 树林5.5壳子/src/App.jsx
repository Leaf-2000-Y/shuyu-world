import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronDown, ChevronUp, RotateCcw, Layers,
  Target, Search, CheckCircle, Circle, ArrowUpRight, Star,
  BookMarked, GitBranch, Brain, Cpu, Repeat,
  ArrowLeft, ArrowRight, Quote, Feather
} from 'lucide-react';

// ── Global styles (always mounted) ───────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    /* ── fonts (self-hosted Playfair Display + system stack for Chinese) ── */
    /* Self-hosted woff2 — fast in China, no external requests, ~67KB total */
    @font-face {
      font-family: 'Playfair Display';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/playfair-400-normal.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Playfair Display';
      font-style: italic;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/playfair-400-italic.woff2') format('woff2');
    }
    @font-face {
      font-family: 'Playfair Display';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/playfair-700-normal.woff2') format('woff2');
    }

    /* ── reset ── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; overflow: hidden; }
    body { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Source Han Serif SC", "Songti SC", serif; }

    /* ══ WILLPOWER TEST (3-second hold) — embedded card ══════════════════════ */
    .ra-will {
      margin: 3rem 0; padding: 3rem 2rem;
      background: linear-gradient(135deg, #14100a 0%, #1a1208 50%, #0B0805 100%);
      color: #FAF8F3;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column; align-items: center;
      user-select: none; -webkit-user-select: none;
      border: 1px solid rgba(201,162,39,0.15);
    }
    .ra-will::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse at center, rgba(201,162,39,0.08) 0%, transparent 60%);
    }
    .ra-will::after {
      content: '体验 / TRY IT'; position: absolute; top: -10px; left: 2rem;
      background: #1a1208; padding: 0 0.8rem; color: #C9A227;
      font-size: 0.7rem; letter-spacing: 0.3em;
    }
    .ra-will-intro {
      max-width: 480px; text-align: center; margin-bottom: 2.5rem;
      position: relative; z-index: 1;
    }
    .ra-will-intro-title {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: #FAF8F3; font-size: clamp(1.2rem, 2vw, 1.5rem);
      margin-bottom: 0.8rem; letter-spacing: 0.05em;
    }
    .ra-will-intro-sub {
      color: rgba(250,248,243,0.6); font-size: 0.9rem;
      line-height: 1.8;
    }
    .ra-will-orb-wrap {
      position: relative; width: 160px; height: 160px;
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    }
    .ra-will-ring {
      position: absolute; inset: 0;
      transform: rotate(-90deg); pointer-events: none;
    }
    .ra-will-ring circle {
      fill: none; stroke-width: 2;
      transition: stroke 0.3s ease;
    }
    .ra-will-ring .bg { stroke: rgba(201,162,39,0.15); }
    .ra-will-ring .fg {
      stroke: #C9A227; stroke-linecap: round;
      filter: drop-shadow(0 0 10px rgba(201,162,39,0.6));
      transition: stroke-dashoffset 60ms linear;
    }
    .ra-will-orb {
      width: 14px; height: 14px; border-radius: 50%;
      background: #C9A227;
      box-shadow:
        0 0 16px rgba(201,162,39,0.8),
        0 0 40px rgba(201,162,39,0.4),
        0 0 80px rgba(201,162,39,0.2);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                  box-shadow 0.3s ease;
      animation: ra-orb-pulse 2.4s ease-in-out infinite;
    }
    @keyframes ra-orb-pulse {
      0%, 100% { transform: scale(1); }
      50%      { transform: scale(1.15); }
    }
    .ra-will-orb-wrap.holding .ra-will-orb {
      transform: scale(2.2); animation: none;
      box-shadow:
        0 0 30px rgba(201,162,39,1),
        0 0 70px rgba(201,162,39,0.6),
        0 0 140px rgba(201,162,39,0.3);
    }
    .ra-will-orb-wrap.passed .ra-will-orb {
      transform: scale(6); animation: none;
      box-shadow: 0 0 200px rgba(201,162,39,0.8);
    }
    .ra-will-prompt {
      margin-top: 2.5rem; min-height: 4rem; text-align: center;
      position: relative; z-index: 1;
    }
    .ra-will-prompt-main {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: rgba(250,248,243,0.92); font-size: clamp(1.05rem, 1.8vw, 1.3rem);
      letter-spacing: 0.1em; margin-bottom: 0.5rem;
    }
    .ra-will-prompt-sub {
      color: rgba(201,162,39,0.6); font-size: 0.78rem;
      letter-spacing: 0.2em;
    }
    .ra-will-prompt.failed .ra-will-prompt-main {
      color: #C9A227; font-style: italic;
    }
    .ra-will-attempts {
      margin-top: 1rem; color: rgba(201,162,39,0.4);
      font-size: 0.7rem; letter-spacing: 0.2em;
    }
    .ra-will-coda {
      margin-top: 2.5rem; padding-top: 2rem; max-width: 540px;
      border-top: 1px solid rgba(201,162,39,0.15);
      color: rgba(250,248,243,0.7); font-size: 0.92rem;
      line-height: 1.9; text-align: center;
      position: relative; z-index: 1;
    }
    .ra-will-coda strong { color: #C9A227; font-weight: 500; }

    /* ══ STAGE SELF-PICK (Ch01) ═══════════════════════════════════════════════ */
    .ra-stage-pick {
      margin-top: 3rem; padding: 2rem;
      border: 1px solid rgba(201,162,39,0.2);
      background: linear-gradient(135deg, rgba(201,162,39,0.04), transparent);
    }
    .ra-stage-pick-q {
      color: #2D2416; font-size: 1.05rem; font-weight: 500;
      margin-bottom: 0.4rem; letter-spacing: 0.05em;
    }
    .ra-stage-pick-hint {
      color: rgba(45,36,22,0.55); font-size: 0.85rem; margin-bottom: 1.5rem;
    }
    .ra-stage-buttons {
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.6rem;
      margin-bottom: 1.5rem;
    }
    @media (max-width: 700px) {
      .ra-stage-buttons { grid-template-columns: repeat(2, 1fr); }
    }
    .ra-stage-btn {
      padding: 0.9rem 0.6rem; background: #fff;
      border: 1px solid rgba(45,36,22,0.15);
      cursor: pointer; transition: all 0.3s ease;
      font-family: inherit; text-align: center;
    }
    .ra-stage-btn-num {
      display: block; font-family: 'Playfair Display', serif;
      font-size: 0.75rem; color: #C9A227; letter-spacing: 0.2em;
      margin-bottom: 0.3rem;
    }
    .ra-stage-btn-label {
      display: block; color: #2D2416; font-size: 0.95rem; font-weight: 500;
    }
    .ra-stage-btn:hover {
      border-color: #C9A227; transform: translateY(-2px);
      box-shadow: 0 6px 18px rgba(45,36,22,0.08);
    }
    .ra-stage-btn.selected {
      background: #2D2416; border-color: #2D2416;
    }
    .ra-stage-btn.selected .ra-stage-btn-num,
    .ra-stage-btn.selected .ra-stage-btn-label {
      color: #C9A227;
    }
    .ra-stage-feedback {
      padding: 1.5rem 1.8rem; background: #2D2416;
      border-left: 3px solid #C9A227;
      animation: ra-fade-up 0.5s ease;
    }
    @keyframes ra-fade-up {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .ra-stage-feedback-label {
      color: #C9A227; font-size: 0.7rem; letter-spacing: 0.3em;
      margin-bottom: 0.6rem;
    }
    .ra-stage-feedback-text {
      color: #FAF8F3; font-size: 1rem; line-height: 1.9;
    }

    /* ══ COMPOUND VISUALIZER (Ch02) ══════════════════════════════════════════ */
    .ra-compound {
      margin-top: 3rem; padding: 2.2rem; background: #fff;
      border: 1px solid rgba(45,36,22,0.1);
    }
    .ra-compound-title {
      color: #2D2416; font-size: 1.1rem; font-weight: 500;
      margin-bottom: 0.4rem;
    }
    .ra-compound-sub {
      color: rgba(45,36,22,0.55); font-size: 0.85rem; margin-bottom: 1.5rem;
    }
    .ra-compound-input-row {
      display: flex; gap: 0.7rem; flex-wrap: wrap; margin-bottom: 2rem;
    }
    .ra-compound-input {
      flex: 1; min-width: 200px;
      padding: 0.7rem 1rem; border: 1px solid rgba(45,36,22,0.15);
      background: #FAF8F3; font-family: inherit; font-size: 0.95rem;
      color: #2D2416; outline: none; transition: border-color 0.3s ease;
    }
    .ra-compound-input:focus { border-color: #C9A227; }
    .ra-compound-input.num { max-width: 110px; flex: 0 0 110px; text-align: right; }
    .ra-compound-bars {
      display: flex; align-items: flex-end; justify-content: space-between;
      gap: 0.8rem; height: 240px; padding: 1rem 0; margin-bottom: 1rem;
      border-bottom: 1px solid rgba(45,36,22,0.1);
    }
    .ra-compound-bar-col {
      flex: 1; display: flex; flex-direction: column;
      align-items: center; justify-content: flex-end; height: 100%;
    }
    .ra-compound-bar {
      width: 100%; max-width: 60px;
      background: linear-gradient(180deg, #e8c84a 0%, #C9A227 50%, #8B6914 100%);
      box-shadow: inset 0 -2px 0 rgba(0,0,0,0.1), 0 0 10px rgba(201,162,39,0.3);
      transition: height 1.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
    }
    .ra-compound-bar-value {
      position: absolute; top: -1.6rem; left: 50%;
      transform: translateX(-50%);
      font-family: 'Playfair Display', serif; font-size: 0.8rem;
      color: #2D2416; font-weight: 600; white-space: nowrap;
    }
    .ra-compound-bar-day {
      margin-top: 0.6rem; font-size: 0.7rem;
      color: rgba(45,36,22,0.55); letter-spacing: 0.1em;
    }
    .ra-compound-summary {
      text-align: center; padding: 1rem; background: rgba(201,162,39,0.06);
      border: 1px dashed rgba(201,162,39,0.3); margin-top: 1rem;
    }
    .ra-compound-summary strong {
      color: #C9A227; font-family: 'Playfair Display', serif;
      font-size: 1.4rem; font-weight: 700;
    }

    /* ══ COMMITMENT CARD (Outro) ═════════════════════════════════════════════ */
    .ra-commit {
      margin: 4rem 0; padding: 0;
      background: linear-gradient(135deg, #1a1208 0%, #2D2416 50%, #1a1208 100%);
      border: 1px solid rgba(201,162,39,0.3);
      position: relative; overflow: hidden;
    }
    .ra-commit::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      opacity: 0.04;
    }
    .ra-commit-glyph {
      position: absolute; right: -2rem; bottom: -3rem;
      font-family: 'Playfair Display', serif;
      font-size: 14rem; color: rgba(201,162,39,0.05);
      line-height: 1; pointer-events: none;
    }
    .ra-commit-inner { padding: 3rem 2.5rem; position: relative; z-index: 1; }
    .ra-commit-eyebrow {
      color: rgba(201,162,39,0.55); font-size: 0.7rem;
      letter-spacing: 0.5em; text-align: center; margin-bottom: 1.5rem;
    }
    .ra-commit-title {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: #FAF8F3; font-weight: 400; text-align: center;
      font-size: clamp(1.4rem, 2.5vw, 2rem); letter-spacing: 0.1em;
      margin-bottom: 2rem;
    }
    .ra-commit-fields { display: flex; flex-direction: column; gap: 1.2rem; margin-bottom: 2rem; }
    .ra-commit-field-label {
      color: #C9A227; font-size: 0.7rem; letter-spacing: 0.25em;
      margin-bottom: 0.5rem;
    }
    .ra-commit-input, .ra-commit-textarea {
      width: 100%; padding: 0.9rem 1.2rem;
      background: rgba(250,248,243,0.04);
      border: 1px solid rgba(201,162,39,0.25); color: #FAF8F3;
      font-family: inherit; font-size: 1rem; line-height: 1.6;
      outline: none; transition: all 0.3s ease;
    }
    .ra-commit-input:focus, .ra-commit-textarea:focus {
      border-color: #C9A227; background: rgba(250,248,243,0.06);
    }
    .ra-commit-input::placeholder, .ra-commit-textarea::placeholder {
      color: rgba(250,248,243,0.3);
    }
    .ra-commit-textarea { resize: vertical; min-height: 70px; }
    .ra-commit-card {
      margin-top: 2rem; padding: 2.5rem 2rem;
      border: 1px solid #C9A227; background: rgba(201,162,39,0.04);
      text-align: center;
    }
    .ra-commit-card-q {
      color: rgba(201,162,39,0.6); font-size: 0.7rem;
      letter-spacing: 0.3em; margin-bottom: 1rem;
    }
    .ra-commit-card-line {
      font-family: 'Playfair Display','Noto Serif SC',serif;
      color: #FAF8F3; font-size: clamp(1.2rem, 2vw, 1.6rem);
      line-height: 1.6; margin-bottom: 0.8rem; font-style: italic;
    }
    .ra-commit-card-action {
      color: #C9A227; font-size: 1rem;
      letter-spacing: 0.05em; margin-bottom: 2rem;
    }
    .ra-commit-card-dates {
      display: flex; justify-content: space-around; gap: 1rem;
      padding-top: 1.5rem; border-top: 1px dashed rgba(201,162,39,0.3);
    }
    .ra-commit-date-block {
      flex: 1; text-align: center;
    }
    .ra-commit-date-label {
      color: rgba(201,162,39,0.5); font-size: 0.65rem;
      letter-spacing: 0.3em; margin-bottom: 0.4rem;
    }
    .ra-commit-date-value {
      font-family: 'Playfair Display', serif;
      color: #FAF8F3; font-size: 1.2rem; font-weight: 500;
    }
    .ra-commit-meta {
      text-align: center; color: rgba(201,162,39,0.4);
      font-size: 0.75rem; letter-spacing: 0.2em;
      margin-top: 1.5rem; font-style: italic;
    }
    .ra-commit-save {
      display: block; margin: 1.5rem auto 0;
      background: #C9A227; color: #2D2416; border: none;
      padding: 0.9rem 2.5rem; font-family: inherit;
      font-size: 0.9rem; letter-spacing: 0.2em; cursor: pointer;
      transition: all 0.3s ease;
    }
    .ra-commit-save:hover {
      background: #e8c84a;
      box-shadow: 0 6px 20px rgba(201,162,39,0.3);
    }
    .ra-commit-save:disabled {
      opacity: 0.4; cursor: not-allowed;
    }

    /* ══ READING PROGRESS BAR ════════════════════════════════════════════════ */
    .ra-progress {
      position: fixed; top: 0; left: 220px; right: 0; height: 3px;
      background: linear-gradient(90deg,
        rgba(201,162,39,0.05) 0%,
        rgba(201,162,39,0.08) 50%,
        rgba(201,162,39,0.05) 100%);
      z-index: 200;
      backdrop-filter: blur(2px);
    }
    .ra-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #8B6914 0%, #C9A227 50%, #e8c84a 100%);
      transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow:
        0 0 10px rgba(201,162,39,0.6),
        0 0 20px rgba(201,162,39,0.3);
      position: relative;
    }
    /* glowing tip at the leading edge */
    .ra-progress-fill::after {
      content: ''; position: absolute; right: 0; top: -2px; bottom: -2px;
      width: 6px; border-radius: 50%;
      background: radial-gradient(circle, #fff 0%, #e8c84a 40%, transparent 70%);
      opacity: 0.9;
    }

    /* ══ PAPER TEXTURE (subtle grain) ════════════════════════════════════════ */
    .ra-grain::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
      opacity: 0.04; mix-blend-mode: multiply; z-index: 0;
    }

    /* ══ LANDING ═══════════════════════════════════════════════════════════ */
    .ra-landing {
      position: fixed; inset: 0; background: #0D0A05;
      display: flex; align-items: center; justify-content: center;
      overflow: hidden;
    }
    .ra-landing::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background:
        radial-gradient(ellipse at 20% 30%, rgba(201,162,39,0.05) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 70%, rgba(201,162,39,0.04) 0%, transparent 50%);
    }
    .ra-landing-corner {
      position: absolute; color: rgba(201,162,39,0.4);
      font-size: 0.65rem; letter-spacing: 0.3em; z-index: 5;
    }
    .ra-landing-corner.tl { top: 2rem; left: 2rem; }
    .ra-landing-corner.tr { top: 2rem; right: 2rem; }
    .ra-landing-corner.bl { bottom: 2rem; left: 2rem; }
    .ra-landing-corner.br { bottom: 2rem; right: 2rem; text-align: right; }

    /* Floating gold dust particles */
    .ra-dust {
      position: absolute; width: 2px; height: 2px; border-radius: 50%;
      background: #C9A227; box-shadow: 0 0 6px #C9A227;
      animation: ra-float 12s linear infinite; opacity: 0;
    }
    @keyframes ra-float {
      0%   { transform: translateY(100vh) translateX(0); opacity: 0; }
      10%  { opacity: 0.5; }
      90%  { opacity: 0.3; }
      100% { transform: translateY(-10vh) translateX(50px); opacity: 0; }
    }
    /* Landing exit — let doors keep opening AND landing fades out.
       Both stay dark, continuous with the chapter-entrance curtains that come next. */
    .ra-out { opacity: 0; transition: opacity 1.1s cubic-bezier(0.4, 0, 0.2, 1); }
    .ra-out .ra-door.left  { transform: rotateY(-150deg); transition: transform 1.3s cubic-bezier(0.5, 0, 0.2, 1); }
    .ra-out .ra-door.right { transform: rotateY( 150deg); transition: transform 1.3s cubic-bezier(0.5, 0, 0.2, 1); }
    .ra-out .ra-crack      { width: 10px; filter: blur(6px); box-shadow: 0 0 80px rgba(201,162,39,0.8); transition: all 1.0s ease-out; }
    .ra-out .ra-hero, .ra-out .ra-entry { opacity: 0; transition: opacity 0.5s ease-out; }

    .ra-phrase {
      position: absolute; left: 50%; top: 50%;
      transform: translate(-50%, -50%);
      color: #C9A227; font-size: clamp(1.1rem, 2.5vw, 1.8rem);
      letter-spacing: 0.25em; text-align: center; opacity: 0;
      transition: opacity 1.2s ease, transform 1.2s ease;
      white-space: nowrap; text-shadow: 0 0 30px rgba(201,162,39,0.5);
    }
    .ra-phrase.show { opacity: 1; transform: translate(-50%, -50%); }
    .ra-phrase.hide { opacity: 0; transform: translate(-50%, -60%); }

    /* ── Two-door split (cinematic) ── */
    .ra-door-wrap {
      position: absolute; inset: 0; perspective: 1800px;
      display: flex; align-items: stretch; justify-content: center;
      pointer-events: none;
    }
    .ra-door {
      position: absolute; top: 0; height: 100%; width: 50%;
      background: linear-gradient(180deg, #14100a 0%, #1a1208 40%, #2D2416 70%, #1a1208 100%);
      transition: transform 2.4s cubic-bezier(0.6, 0, 0.2, 1);
      box-shadow: inset 0 0 60px rgba(0,0,0,0.6);
    }
    .ra-door::after {
      content: ''; position: absolute; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      opacity: 0.06; pointer-events: none;
    }
    .ra-door.left {
      left: 0; transform-origin: left center;
      border-right: 1px solid #C9A22744;
      box-shadow: inset -2px 0 4px rgba(201,162,39,0.15), inset 0 0 60px rgba(0,0,0,0.6);
    }
    .ra-door.right {
      right: 0; transform-origin: right center;
      border-left: 1px solid #C9A22744;
      box-shadow: inset 2px 0 4px rgba(201,162,39,0.15), inset 0 0 60px rgba(0,0,0,0.6);
    }
    .ra-door.open.left  { transform: rotateY(-105deg); }
    .ra-door.open.right { transform: rotateY( 105deg); }

    /* Glyph 重 painted on the doors (split between halves) */
    .ra-door-glyph-half {
      position: absolute; top: 50%; transform: translateY(-50%);
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(8rem, 22vw, 22rem); font-weight: 700;
      color: rgba(201,162,39,0.18); line-height: 1;
      pointer-events: none; user-select: none;
      transition: opacity 1.5s ease;
    }
    .ra-door.open .ra-door-glyph-half { opacity: 0; }
    .ra-door.left  .ra-door-glyph-half { right: -0.5em; overflow: hidden; }
    .ra-door.right .ra-door-glyph-half { left:  -0.5em; overflow: hidden; }

    /* Gold crack of light revealed when doors open */
    .ra-crack {
      position: absolute; left: 50%; top: 0; transform: translateX(-50%);
      width: 0; height: 100%; opacity: 0;
      background: linear-gradient(180deg,
        transparent 0%,
        rgba(201,162,39,0.4) 15%,
        rgba(232,200,74,0.9) 50%,
        rgba(201,162,39,0.4) 85%,
        transparent 100%);
      box-shadow:
        0 0 60px rgba(201,162,39,0.6),
        0 0 120px rgba(201,162,39,0.3),
        0 0 200px rgba(201,162,39,0.15);
      transition: width 1.8s cubic-bezier(0.5,0,0.2,1), opacity 0.6s ease;
      filter: blur(0.5px);
    }
    .ra-crack.show {
      width: 3px; opacity: 1;
    }

    .ra-hero { opacity: 0; transition: opacity 2.5s ease; pointer-events: none; }
    .ra-hero.show { opacity: 1; }
    .ra-hero-inner {
      position: absolute; inset: 0;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center; text-align: center;
    }

    .ra-entry { opacity: 0; transition: opacity 1.8s ease; }
    .ra-entry.show { opacity: 1; pointer-events: auto; }

    .ra-btn {
      background: transparent; border: 1px solid #C9A227; color: #C9A227;
      padding: 0.9rem 3rem; font-family: 'Noto Serif SC', serif;
      font-size: 1rem; letter-spacing: 0.2em; cursor: pointer;
      transition: all 0.4s ease; position: relative; overflow: hidden;
    }
    .ra-btn::before {
      content: ''; position: absolute; inset: 0;
      background: #C9A227; transform: translateX(-100%);
      transition: transform 0.4s ease; z-index: -1;
    }
    .ra-btn:hover::before { transform: translateX(0); }
    .ra-btn:hover { color: #0D0A05; }

    /* ══ LAYOUT ═════════════════════════════════════════════════════════════ */
    .ra-app {
      display: flex; height: 100vh; overflow: hidden;
      font-family: 'Noto Serif SC', serif; background: #FAF8F3; color: #2D2416;
    }

    .ra-sidebar {
      width: 220px; flex-shrink: 0; height: 100vh;
      background: #140E06; border-right: 1px solid rgba(201,162,39,0.2);
      display: flex; flex-direction: column; padding: 2rem 0; z-index: 100;
    }
    .ra-sidebar-logo {
      padding: 0 1.5rem 2rem;
      border-bottom: 1px solid rgba(201,162,39,0.15); margin-bottom: 1.5rem;
    }
    .ra-nav-item {
      padding: 0.7rem 1.5rem; color: rgba(201,162,39,0.5);
      font-size: 0.8rem; letter-spacing: 0.1em; cursor: pointer;
      transition: all 0.3s ease; border-left: 2px solid transparent;
      display: flex; align-items: center; gap: 0.6rem;
    }
    .ra-nav-item:hover { color: #C9A227; background: rgba(201,162,39,0.05); }
    .ra-nav-item.active {
      color: #C9A227; border-left-color: #C9A227;
      background: rgba(201,162,39,0.08);
    }

    .ra-main { flex: 1; overflow-y: auto; height: 100vh; }

    /* ══ COMPONENTS ══════════════════════════════════════════════════════════ */
    .ra-quote {
      border-left: 3px solid #C9A227; padding: 1.2rem 1.5rem;
      background: rgba(201,162,39,0.04); margin: 1.5rem 0;
      font-style: italic; color: #5a4020; font-size: 1.05rem; line-height: 1.8;
    }

    .ra-tag {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(201,162,39,0.1); color: #C9A227;
      padding: 0.3rem 0.8rem; font-size: 0.75rem; letter-spacing: 0.1em;
      border: 1px solid rgba(201,162,39,0.2);
    }

    .ra-card {
      background: #fff; border: 1px solid rgba(45,36,22,0.1);
      transition: all 0.4s ease; cursor: pointer; position: relative; overflow: hidden;
    }
    .ra-card::before {
      content: ''; position: absolute; left: 0; top: 0; bottom: 0;
      width: 3px; background: #C9A227;
      transform: scaleY(0); transition: transform 0.4s ease; transform-origin: bottom;
    }
    .ra-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(45,36,22,0.12); }
    .ra-card:hover::before { transform: scaleY(1); }

    .ra-stage-item {
      display: flex; align-items: flex-start; gap: 1.5rem;
      padding: 1.2rem 0; border-bottom: 1px solid rgba(45,36,22,0.08);
      opacity: 0; transform: translateX(-20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .ra-stage-item.show { opacity: 1; transform: translateX(0); }
    .ra-stage-num {
      width: 36px; height: 36px; border: 1px solid #C9A227;
      display: flex; align-items: center; justify-content: center;
      color: #C9A227; font-size: 0.8rem; flex-shrink: 0; margin-top: 2px;
    }

    .ra-method-card {
      background: #fff; border: 1px solid rgba(45,36,22,0.1);
      padding: 1.8rem; position: relative; overflow: hidden;
      transition: all 0.3s ease; cursor: pointer;
    }
    .ra-method-card:hover { box-shadow: 0 8px 24px rgba(45,36,22,0.1); }
    .ra-method-num {
      position: absolute; right: 1.2rem; top: 1rem;
      font-size: 3rem; color: rgba(201,162,39,0.1); font-weight: 700; line-height: 1;
    }

    .ra-flow-step {
      display: flex; align-items: center; gap: 1rem;
      background: #fff; border: 1px solid rgba(45,36,22,0.1);
      padding: 1rem 1.4rem; margin-bottom: 0.6rem; cursor: pointer;
      transition: all 0.3s ease;
    }
    .ra-flow-step:hover { border-color: #C9A227; background: rgba(201,162,39,0.03); }
    .ra-flow-arrow {
      color: #C9A227; display: flex; align-items: center;
      justify-content: center; margin: 0.3rem 0;
    }

    .ra-tool-card {
      border: 1px solid rgba(45,36,22,0.1); padding: 1.5rem;
      background: #fff; transition: all 0.3s ease;
    }
    .ra-tool-card:hover { border-color: #C9A227; }
    .ra-tool-badge {
      display: inline-block; padding: 0.2rem 0.7rem;
      font-size: 0.7rem; letter-spacing: 0.12em; border: 1px solid currentColor;
      margin-bottom: 0.8rem;
    }

    .ra-chapter-bg {
      position: relative; overflow: hidden;
    }
    .ra-chapter-bg::after {
      content: ''; position: absolute; right: -100px; top: -100px;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,162,39,0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    /* ══ CHAPTER FOOTER NAV ══════════════════════════════════════════════════ */
    .ra-chap-nav {
      display: grid; grid-template-columns: 1fr 1fr; gap: 1px;
      background: rgba(201,162,39,0.15); margin-top: 4rem;
      border-top: 1px solid rgba(201,162,39,0.2);
    }
    .ra-chap-nav-item {
      background: #FAF8F3; padding: 2rem 2.5rem; cursor: pointer;
      transition: background 0.3s ease; display: flex; flex-direction: column;
      gap: 0.4rem; min-height: 110px; justify-content: center;
    }
    .ra-chap-nav-item:hover { background: #fff; }
    .ra-chap-nav-item.disabled { opacity: 0.3; cursor: not-allowed; pointer-events: none; }
    .ra-chap-nav-label {
      font-size: 0.7rem; color: #C9A227; letter-spacing: 0.2em;
      display: flex; align-items: center; gap: 0.4rem;
    }
    .ra-chap-nav-title { font-size: 1rem; color: #2D2416; font-weight: 500; }

    /* ══ STAGE INTENSITY BARS (Ch01) ═════════════════════════════════════════ */
    .ra-stage-bar {
      display: flex; gap: 3px; height: 6px; margin-top: 0.6rem;
    }
    .ra-stage-bar-cell {
      flex: 1; background: rgba(201,162,39,0.12);
      transition: background 0.4s ease;
    }
    .ra-stage-bar-cell.fill { background: #C9A227; box-shadow: 0 0 6px rgba(201,162,39,0.5); }

    /* ══ WORKFLOW CONNECTOR (Ch04) ═══════════════════════════════════════════ */
    .ra-workflow {
      position: relative;
    }
    .ra-workflow::before {
      content: ''; position: absolute; left: 24px; top: 30px; bottom: 30px;
      width: 1px; background: linear-gradient(to bottom,
        rgba(201,162,39,0.5) 0%,
        rgba(201,162,39,0.2) 50%,
        rgba(201,162,39,0.5) 100%);
    }
    .ra-workflow-row {
      position: relative; display: flex; gap: 1.5rem;
      padding: 1rem 0; align-items: flex-start;
    }
    .ra-workflow-dot {
      width: 48px; height: 48px; border-radius: 50%;
      background: #FAF8F3; border: 2px solid #C9A227;
      display: flex; align-items: center; justify-content: center;
      color: #C9A227; font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
      position: relative; z-index: 1; transition: all 0.3s ease;
      font-family: 'Playfair Display', serif;
    }
    .ra-workflow-row.active .ra-workflow-dot {
      background: #C9A227; color: #FAF8F3; transform: scale(1.1);
      box-shadow: 0 0 0 6px rgba(201,162,39,0.15);
    }

    /* ══ PULSING DOT (sidebar active) ════════════════════════════════════════ */
    .ra-pulse {
      width: 6px; height: 6px; border-radius: 50%; background: #C9A227;
      box-shadow: 0 0 8px #C9A227;
      animation: ra-pulse 2s ease-in-out infinite;
    }
    @keyframes ra-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(1.3); }
    }

    /* ══ PULL QUOTE (oversized) ══════════════════════════════════════════════ */
    .ra-pullquote {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.4rem, 3vw, 2.2rem);
      line-height: 1.6; color: #2D2416; font-style: italic;
      padding: 2.5rem 0 2.5rem 3rem; position: relative;
      max-width: 720px;
    }
    .ra-pullquote::before {
      content: '"'; position: absolute; left: 0; top: 0;
      font-size: 6rem; color: #C9A227; opacity: 0.3;
      font-family: 'Playfair Display', serif; line-height: 1;
    }

    /* ══ FADE-IN ON SCROLL ═══════════════════════════════════════════════════ */
    .ra-fade { opacity: 0; transform: translateY(20px);
                transition: opacity 0.8s ease, transform 0.8s ease; }
    .ra-fade.visible { opacity: 1; transform: translateY(0); }

    /* ══ PAGE TRANSITION (chapter switch) ════════════════════════════════════
       Page is rendered immediately but stays subtly low until the curtains
       split open at ~1700ms. Just a gentle fade — the *real* reveal is the
       curtains parting and uncovering it. */
    .ra-page {
      animation: ra-page-in 900ms cubic-bezier(0.25, 0.1, 0.25, 1) both;
      animation-delay: 1700ms;
    }
    @keyframes ra-page-in {
      0%   { opacity: 0.3; transform: translateY(8px); }
      100% { opacity: 1; transform: translateY(0); }
    }

    /* ══ CHAPTER ENTRANCE: TWIN-CURTAIN SPLIT ════════════════════════════════
       Total 2.8s. Two dark panels slide in to cover, hold to display info,
       then slide apart to REVEAL the next page (not fade — slide).
       This solves the black→white flash because the new page is uncovered
       spatially, not by color transition. */
    .ra-entrance {
      position: fixed; inset: 0; z-index: 500; pointer-events: none;
    }

    /* Two curtain panels */
    .ra-entrance-curtain {
      position: absolute; top: 0; height: 100%; width: 50%;
      background: linear-gradient(180deg, #14100a 0%, #1a1208 35%, #0B0805 70%, #050302 100%);
    }
    .ra-entrance-curtain::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
      opacity: 0.06;
    }
    .ra-entrance-curtain.left {
      left: 0;
      box-shadow: inset -2px 0 4px rgba(201,162,39,0.12), inset 0 0 80px rgba(0,0,0,0.55);
      animation: ra-curtain-left 2800ms cubic-bezier(0.55, 0, 0.2, 1) forwards;
    }
    .ra-entrance-curtain.right {
      right: 0;
      box-shadow: inset 2px 0 4px rgba(201,162,39,0.12), inset 0 0 80px rgba(0,0,0,0.55);
      animation: ra-curtain-right 2800ms cubic-bezier(0.55, 0, 0.2, 1) forwards;
    }
    @keyframes ra-curtain-left {
      0%   { transform: translateX(-100%); }
      9%   { transform: translateX(0); }
      62%  { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
    @keyframes ra-curtain-right {
      0%   { transform: translateX(100%); }
      9%   { transform: translateX(0); }
      62%  { transform: translateX(0); }
      100% { transform: translateX(100%); }
    }

    /* Central golden seam — appears when curtains meet, fades as they part */
    .ra-entrance-seam {
      position: absolute; left: 50%; top: 0; bottom: 0; width: 2px;
      transform: translateX(-50%);
      background: linear-gradient(180deg,
        transparent 0%, rgba(201,162,39,0.7) 30%, rgba(232,200,74,0.9) 50%,
        rgba(201,162,39,0.7) 70%, transparent 100%);
      box-shadow: 0 0 16px rgba(201,162,39,0.55), 0 0 40px rgba(201,162,39,0.3);
      filter: blur(0.5px);
      animation: ra-seam 2800ms ease forwards;
    }
    @keyframes ra-seam {
      0%   { opacity: 0; }
      14%  { opacity: 1; }
      58%  { opacity: 1; }
      66%  { opacity: 0; }
      100% { opacity: 0; }
    }

    /* Content layer (number, label, title, bar) */
    .ra-entrance-content {
      position: absolute; inset: 0; z-index: 2;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      pointer-events: none;
    }
    .ra-entrance-content > * {
      opacity: 0; transform: translateY(12px); filter: blur(6px);
      animation: ra-entrance-child 2800ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
    }
    @keyframes ra-entrance-child {
      0%   { opacity: 0; transform: translateY(12px); filter: blur(6px); }
      18%  { opacity: 1; transform: translateY(0); filter: blur(0); }
      55%  { opacity: 1; transform: translateY(0); filter: blur(0); }
      66%  { opacity: 0; transform: translateY(-8px); filter: blur(4px); }
      100% { opacity: 0; }
    }
    .ra-entrance-num   { animation-delay: 120ms; }
    .ra-entrance-label { animation-delay: 280ms; }
    .ra-entrance-title { animation-delay: 440ms; }
    .ra-entrance-bar   { animation-delay: 600ms; }

    .ra-entrance-num {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(7rem, 20vw, 16rem); font-weight: 700; line-height: 1;
      color: rgba(201,162,39,0.16); letter-spacing: -0.05em;
      text-shadow: 0 0 80px rgba(201,162,39,0.15);
    }
    .ra-entrance-label {
      color: rgba(201,162,39,0.55); font-size: 0.75rem;
      letter-spacing: 0.55em; margin: 1.8rem 0 1.2rem;
    }
    .ra-entrance-title {
      color: #FAF8F3; font-family: 'Noto Serif SC', serif;
      font-size: clamp(1.6rem, 3.6vw, 2.6rem); font-weight: 400;
      letter-spacing: 0.18em;
    }
    .ra-entrance-bar {
      width: 80px; height: 1px;
      background: linear-gradient(90deg, transparent, #C9A227, transparent);
      margin-top: 2.2rem; box-shadow: 0 0 8px rgba(201,162,39,0.5);
    }

    /* ══ MOUSE GLOW (subtle follower) ════════════════════════════════════════ */
    .ra-glow {
      position: fixed; pointer-events: none; z-index: 1;
      width: 500px; height: 500px; border-radius: 50%;
      background: radial-gradient(circle, rgba(201,162,39,0.07) 0%, transparent 60%);
      transform: translate(-50%, -50%); transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    }

    /* ══ INK REVEAL (line-by-line on scroll) ═════════════════════════════════ */
    .ra-ink-line {
      display: block; opacity: 0; transform: translateY(15px);
      filter: blur(6px);
      transition: opacity 1s ease, transform 1s ease, filter 1s ease;
    }
    .ra-ink-line.shown {
      opacity: 1; transform: translateY(0); filter: blur(0);
    }

    /* ══ DRAMATIC FATE CARDS (Ch03) ══════════════════════════════════════════ */
    .ra-fate-row {
      display: flex; gap: 1rem; height: 380px; perspective: 1500px;
      transition: gap 0.5s ease;
    }
    .ra-fate {
      flex: 1; padding: 2rem; background: #fff; cursor: pointer;
      border: 1px solid rgba(45,36,22,0.1); position: relative; overflow: hidden;
      transition: flex 0.5s cubic-bezier(0.4,0,0.2,1),
                  background 0.5s ease, transform 0.5s ease,
                  filter 0.5s ease, box-shadow 0.5s ease;
      display: flex; flex-direction: column; justify-content: space-between;
    }
    .ra-fate-num {
      position: absolute; right: 1.2rem; top: 0.5rem;
      font-family: 'Playfair Display', serif; font-size: 5rem;
      color: rgba(201,162,39,0.06); font-weight: 700; line-height: 1;
    }
    .ra-fate-row:hover .ra-fate:not(:hover) {
      flex: 0.6; filter: grayscale(0.5) brightness(0.92);
      transform: scale(0.97);
    }
    .ra-fate:hover {
      flex: 2; box-shadow: 0 30px 60px rgba(45,36,22,0.15);
      transform: scale(1.02); z-index: 2;
    }
    .ra-fate-desc {
      max-height: 0; opacity: 0; overflow: hidden;
      transition: max-height 0.5s ease 0.1s, opacity 0.4s ease 0.2s;
    }
    .ra-fate:hover .ra-fate-desc {
      max-height: 200px; opacity: 1;
    }
    .ra-fate-hint {
      color: rgba(45,36,22,0.4); font-size: 0.75rem;
      letter-spacing: 0.15em; transition: opacity 0.3s ease;
    }
    .ra-fate:hover .ra-fate-hint { opacity: 0; }

    /* ══ ACTION CARD (writeable) ═════════════════════════════════════════════ */
    .ra-action {
      margin: 4rem 0 0; padding: 2.5rem; background: #fff;
      border: 1px dashed rgba(201,162,39,0.5); position: relative;
    }
    .ra-action::before {
      content: '行动卡 / ACTION'; position: absolute; top: -10px; left: 2rem;
      background: #fff; padding: 0 0.8rem; color: #C9A227;
      font-size: 0.7rem; letter-spacing: 0.3em;
    }
    .ra-action h4 {
      font-size: 1.15rem; color: #2D2416; font-weight: 500;
      margin-bottom: 0.5rem; letter-spacing: 0.05em;
    }
    .ra-action-prompt {
      color: rgba(45,36,22,0.65); font-size: 0.9rem;
      line-height: 1.8; margin-bottom: 1.5rem;
    }
    .ra-action-textarea {
      width: 100%; min-height: 100px; padding: 1rem;
      border: 1px solid rgba(45,36,22,0.15); background: #FAF8F3;
      font-family: inherit; font-size: 0.95rem; line-height: 1.7;
      color: #2D2416; resize: vertical; outline: none;
      transition: border-color 0.3s ease;
    }
    .ra-action-textarea:focus { border-color: #C9A227; }

    /* ── Quick-pick chips ── */
    .ra-chips {
      display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1rem;
    }
    .ra-chip {
      padding: 0.5rem 1rem; background: #FAF8F3;
      border: 1px solid rgba(45,36,22,0.15); color: #5a4020;
      font-family: inherit; font-size: 0.85rem; cursor: pointer;
      transition: all 0.25s ease; line-height: 1.4;
      display: inline-flex; align-items: center; gap: 0.4rem;
      border-radius: 20px;
    }
    .ra-chip:hover {
      background: #fff; border-color: #C9A227; color: #2D2416;
      transform: translateY(-1px);
    }
    .ra-chip.selected {
      background: #2D2416; color: #C9A227;
      border-color: #2D2416;
    }
    .ra-chip.selected:hover { background: #2D2416; color: #C9A227; }
    .ra-chip-other {
      border-style: dashed; color: rgba(45,36,22,0.55);
    }
    .ra-chip-other:hover { color: #C9A227; }
    .ra-chips-hint {
      color: rgba(45,36,22,0.45); font-size: 0.75rem;
      letter-spacing: 0.1em; margin-bottom: 0.7rem;
      display: flex; align-items: center; gap: 0.5rem;
    }
    .ra-chips-hint::before, .ra-chips-hint::after {
      content: ''; flex: 1; height: 1px; background: rgba(45,36,22,0.08);
    }
    .ra-action-row {
      display: flex; align-items: center; justify-content: space-between;
      margin-top: 1rem; gap: 1rem;
    }
    .ra-action-save {
      background: #2D2416; color: #C9A227; border: none; padding: 0.7rem 1.8rem;
      font-family: inherit; font-size: 0.85rem; letter-spacing: 0.2em;
      cursor: pointer; transition: all 0.3s ease;
    }
    .ra-action-save:hover { background: #C9A227; color: #2D2416; }
    .ra-action-save.saved { background: rgba(201,162,39,0.2); color: #8B6914; }
    .ra-action-meta {
      color: rgba(45,36,22,0.4); font-size: 0.7rem; letter-spacing: 0.15em;
    }

    /* ══ PREFACE (序) ════════════════════════════════════════════════════════ */
    .ra-preface {
      min-height: 100vh; background:
        radial-gradient(ellipse at 30% 25%, rgba(201,162,39,0.10) 0%, transparent 55%),
        radial-gradient(ellipse at 75% 75%, rgba(201,162,39,0.06) 0%, transparent 55%),
        #0B0805;
      color: #FAF8F3;
      display: flex; align-items: center; justify-content: center;
      padding: 6rem 3rem; position: relative; overflow: hidden;
    }
    /* Subtle vertical golden meditation line on left */
    .ra-preface::before {
      content: ''; position: absolute;
      left: clamp(2rem, 8vw, 7rem); top: 12vh; bottom: 12vh; width: 1px;
      background: linear-gradient(to bottom,
        transparent 0%, rgba(201,162,39,0.3) 25%,
        rgba(201,162,39,0.5) 50%, rgba(201,162,39,0.3) 75%, transparent 100%);
      pointer-events: none;
    }
    /* Decorative giant glyph */
    .ra-preface-glyph {
      position: absolute; right: -2rem; bottom: -6rem;
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(22rem, 38vw, 38rem);
      color: rgba(201,162,39,0.045); line-height: 1; font-weight: 700;
      pointer-events: none; user-select: none; letter-spacing: -0.05em;
    }
    .ra-preface-content {
      max-width: 700px; position: relative; z-index: 1;
      padding-left: clamp(0px, 4vw, 3rem);
    }

    /* Heading area */
    .ra-preface-eyebrow {
      color: rgba(201,162,39,0.55); font-size: 0.7rem;
      letter-spacing: 0.55em; margin-bottom: 1.5rem;
      display: flex; align-items: center; gap: 1rem;
    }
    .ra-preface-eyebrow::after {
      content: ''; flex: 1; height: 1px; background: rgba(201,162,39,0.2);
    }
    .ra-preface-title {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      color: #FAF8F3; font-weight: 400;
      letter-spacing: 0.18em; margin-bottom: 4rem;
      opacity: 0.85;
    }

    /* Body lines */
    .ra-preface-line {
      font-family: 'Noto Serif SC', serif;
      font-size: clamp(1rem, 1.5vw, 1.18rem);
      line-height: 2.4;
      color: rgba(250,248,243,0.78);
      margin-bottom: 1.8rem;
      letter-spacing: 0.04em;
    }
    .ra-preface-line strong {
      color: #C9A227; font-weight: 500;
      text-shadow: 0 0 16px rgba(201,162,39,0.25);
    }
    /* Lead lines (the three "重复" mantras) */
    .ra-preface-lead {
      font-family: 'Playfair Display', 'Noto Serif SC', serif;
      font-size: clamp(1.7rem, 3.2vw, 2.6rem);
      line-height: 1.5; letter-spacing: 0.05em;
      color: #C9A227; font-style: italic;
      margin: 3rem 0; padding-left: 1.5rem;
      border-left: 2px solid rgba(201,162,39,0.4);
      text-shadow: 0 0 30px rgba(201,162,39,0.2);
    }
    .ra-preface-lead.final {
      font-size: clamp(1.4rem, 2.5vw, 2rem);
      color: #FAF8F3; opacity: 0.9; font-style: normal;
      letter-spacing: 0.15em;
    }
    .ra-preface-divider {
      width: 60px; height: 1px; background: rgba(201,162,39,0.35);
      margin: 2.5rem 0;
    }

    /* Enter row at bottom */
    .ra-preface-enter {
      margin-top: 4rem; display: flex; align-items: center;
      gap: 2rem; flex-wrap: wrap;
    }

    /* ══ ANCHOR NAV (right floating mini-toc) ════════════════════════════════ */
    .ra-anchors {
      position: fixed; right: 2rem; top: 50%; transform: translateY(-50%);
      display: flex; flex-direction: column; gap: 1rem; z-index: 80;
    }
    .ra-anchor {
      display: flex; align-items: center; gap: 0.8rem; cursor: pointer;
      color: rgba(45,36,22,0.4); transition: all 0.3s ease;
      font-size: 0.7rem; letter-spacing: 0.1em;
    }
    .ra-anchor-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: rgba(201,162,39,0.3); transition: all 0.3s ease;
    }
    .ra-anchor:hover { color: #C9A227; }
    .ra-anchor:hover .ra-anchor-dot { background: #C9A227; }
    .ra-anchor.active {
      color: #C9A227;
    }
    .ra-anchor.active .ra-anchor-dot {
      background: #C9A227; transform: scale(1.5);
      box-shadow: 0 0 8px rgba(201,162,39,0.6);
    }
    .ra-anchor-label {
      max-width: 0; overflow: hidden; white-space: nowrap;
      transition: max-width 0.3s ease;
    }
    .ra-anchor:hover .ra-anchor-label,
    .ra-anchor.active .ra-anchor-label { max-width: 200px; }
    @media (max-width: 1100px) { .ra-anchors { display: none; } }

    /* ══ BACK TO TOP BUTTON ══════════════════════════════════════════════════ */
    .ra-totop {
      position: fixed; right: 2rem; bottom: 2rem; width: 44px; height: 44px;
      background: #2D2416; color: #C9A227; border: 1px solid rgba(201,162,39,0.3);
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(10px); transition: all 0.3s ease;
      z-index: 150; pointer-events: none;
    }
    .ra-totop.show { opacity: 1; transform: translateY(0); pointer-events: auto; }
    .ra-totop:hover { background: #C9A227; color: #2D2416; }

    /* ══ KEYBOARD HINT (subtle) ══════════════════════════════════════════════ */
    .ra-kbd {
      display: inline-block; padding: 2px 6px; min-width: 18px; text-align: center;
      border: 1px solid rgba(201,162,39,0.3); border-bottom-width: 2px;
      font-family: 'Playfair Display', serif; font-size: 0.7rem;
      color: rgba(201,162,39,0.7); margin: 0 2px;
    }

    /* ══ CHAPTER HERO SVG DECORATIONS ════════════════════════════════════════ */
    .ra-hero-deco {
      position: absolute; right: 2rem; top: 50%; transform: translateY(-50%);
      width: clamp(120px, 18vw, 220px); height: clamp(120px, 18vw, 220px);
      opacity: 0.85; pointer-events: none;
    }
    .ra-hero-deco svg { width: 100%; height: 100%; }
    @media (max-width: 900px) { .ra-hero-deco { display: none; } }

    /* ══ SPIRAL ANIMATION (Ch02) ═════════════════════════════════════════════ */
    @keyframes ra-spin-slow { from { transform: rotate(0); } to { transform: rotate(360deg); } }
    .ra-spin { animation: ra-spin-slow 80s linear infinite; transform-origin: center; }

    /* ══ DIRECTORY HERO BIG GLYPH ════════════════════════════════════════════ */
    .ra-dir-glyph {
      position: absolute; right: -2rem; top: -3rem; font-family: 'Playfair Display', serif;
      font-size: clamp(14rem, 22vw, 22rem); color: rgba(201,162,39,0.05);
      line-height: 1; font-weight: 700; pointer-events: none; user-select: none;
      letter-spacing: -0.05em;
    }

    /* ══ PULL QUOTE BLOCK (oversized typography, gold accent) ════════════════ */
    .ra-bigquote {
      position: relative; padding: 5rem 2rem 4rem; margin: 4.5rem 0;
      text-align: center;
      background:
        linear-gradient(180deg,
          rgba(201,162,39,0.025) 0%,
          rgba(201,162,39,0.06) 50%,
          rgba(201,162,39,0.025) 100%);
      border-top: 1px solid rgba(201,162,39,0.25);
      border-bottom: 1px solid rgba(201,162,39,0.25);
    }
    /* Decorative giant left quote mark */
    .ra-bigquote::before {
      content: '"';
      position: absolute; top: 1.4rem; left: 50%; transform: translateX(-50%);
      font-family: 'Playfair Display', Georgia, serif;
      font-size: clamp(3rem, 5vw, 4.5rem); font-weight: 700;
      color: #C9A227; opacity: 0.45; line-height: 1;
      pointer-events: none; letter-spacing: -0.05em;
    }
    /* Center seam — short golden line under the quote mark */
    .ra-bigquote::after {
      content: ''; position: absolute; bottom: -1px; left: 50%;
      transform: translateX(-50%);
      width: 80px; height: 1px;
      background: linear-gradient(90deg, transparent, #C9A227, transparent);
      box-shadow: 0 0 8px rgba(201,162,39,0.5);
    }
    .ra-bigquote-text {
      font-family: 'Playfair Display','Noto Serif SC', Georgia, serif;
      font-size: clamp(1.5rem, 3.2vw, 2.4rem);
      line-height: 1.65; letter-spacing: 0.02em;
      color: #2D2416; font-style: italic;
      max-width: 720px; margin: 0 auto;
    }
    .ra-bigquote-text strong {
      color: #C9A227; font-weight: 500; font-style: normal;
      text-shadow: 0 0 24px rgba(201,162,39,0.18);
    }

    @media (max-width: 768px) {
      .ra-sidebar { display: none; }
      .ra-main { width: 100%; }
      .ra-progress { left: 0; }
      .ra-chap-nav { grid-template-columns: 1fr; }
    }
  `}</style>
);

// ── Willpower Test (3-second hold, embedded as Ch01 demo) ───────────────────
const WillpowerTest = () => {
  const HOLD_MS = 3000;
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [attempts, setAttempts] = useState(0);
  const startRef = useRef(0);
  const rafRef = useRef(null);
  const passedRef = useRef(false);

  const SIZE = 160, RADIUS = 72;
  const CIRC = 2 * Math.PI * RADIUS;

  const beginHold = (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (passedRef.current) return;
    if (status === 'failed') { setStatus('idle'); setProgress(0); }
    setStatus('holding');
    startRef.current = Date.now();
    const tick = () => {
      const pct = Math.min(100, ((Date.now() - startRef.current) / HOLD_MS) * 100);
      setProgress(pct);
      if (pct >= 100) {
        passedRef.current = true;
        setStatus('passed');
      } else {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const endHold = () => {
    if (passedRef.current || status !== 'holding') return;
    cancelAnimationFrame(rafRef.current);
    setStatus('failed');
    setAttempts(a => a + 1);
    setTimeout(() => setProgress(0), 900);
  };

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  let mainText = '按住光点 3 秒';
  let subText  = '鼠标 / 手指按住不要松开';
  if (status === 'holding') {
    mainText = '继续按住……';
    subText  = `${(progress / 100 * 3).toFixed(1)} / 3.0 秒`;
  }
  if (status === 'failed') {
    if (attempts === 1) {
      mainText = '看吧 —— 你已经松手了';
      subText  = '连 3 秒都需要意志';
    } else if (attempts === 2) {
      mainText = '再试一次';
      subText  = '一个道理重复 21 天，是 60480 倍的难';
    } else {
      mainText = '没关系。重复，重复，重复';
      subText  = '再来一次';
    }
  }
  if (status === 'passed') {
    mainText = '你做到了';
    subText  = '——3 秒而已。但你刚才确实用上了意志';
  }

  return (
    <div className="ra-will">
      <div className="ra-will-intro">
        <div className="ra-will-intro-title">那么先做一件事——</div>
        <div className="ra-will-intro-sub">
          按住下面这个金色光点 <strong style={{color:'#C9A227'}}>3 秒</strong>，
          中途不要松开。
        </div>
      </div>

      <div className={`ra-will-orb-wrap ${status}`}
           onMouseDown={beginHold} onMouseUp={endHold} onMouseLeave={endHold}
           onTouchStart={beginHold} onTouchEnd={endHold} onTouchCancel={endHold}>
        <svg className="ra-will-ring" viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <circle className="bg" cx={SIZE/2} cy={SIZE/2} r={RADIUS} />
          <circle className="fg" cx={SIZE/2} cy={SIZE/2} r={RADIUS}
                  strokeDasharray={CIRC}
                  strokeDashoffset={CIRC - (progress / 100) * CIRC} />
        </svg>
        <div className="ra-will-orb" />
      </div>

      <div className={`ra-will-prompt ${status}`}>
        <div className="ra-will-prompt-main">{mainText}</div>
        <div className="ra-will-prompt-sub">{subText}</div>
        {attempts > 0 && status !== 'passed' && (
          <div className="ra-will-attempts">第 {attempts + 1} 次</div>
        )}
      </div>

      {(status === 'passed' || attempts >= 2) && (
        <div className="ra-will-coda">
          {status === 'passed' ? (
            <>3 秒，你按住了。<br/>
            但试着想象一下：把"早睡"按住 <strong>21 天</strong>。把"少刷手机"按住 <strong>100 天</strong>。<br/>
            <strong>知道</strong>和<strong>做到</strong>之间，差的就是这种意志的延续。</>
          ) : (
            <>这就是<strong>意志的缝隙</strong>。<br/>
            知道要按住，知道只有 3 秒，知道松手就失败——
            但身体还是松开了。<br/>
            生活里的"知道却没做到"，每一次都是同样的机制。</>
          )}
        </div>
      )}
    </div>
  );
};

// ── Landing Page ──────────────────────────────────────────────────────────────
const LandingPage = ({ onEnter }) => {
  const [phase, setPhase] = useState(0);
  const [crackVisible, setCrackVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [entryVisible, setEntryVisible] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 800),
      setTimeout(() => setPhase(2), 3500),
      setTimeout(() => setPhase(3), 6500),
      setTimeout(() => setCrackVisible(true), 7000),
      setTimeout(() => setHeroVisible(true), 7800),
      setTimeout(() => setEntryVisible(true), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const handleEnter = () => { setTransitioning(true); setTimeout(onEnter, 1200); };

  // generate floating dust particles
  const dust = Array.from({ length: 18 }, (_, i) => ({
    left: `${(i * 53) % 100}%`,
    delay: `${(i * 0.7) % 12}s`,
    duration: `${10 + (i % 6)}s`,
  }));

  return (
    <div className={`ra-landing ${transitioning ? 'ra-out' : ''}`}>
      {/* Floating gold dust */}
      {dust.map((d, i) => (
        <span key={i} className="ra-dust"
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }} />
      ))}

      {/* Corner brand */}
      <div className="ra-landing-corner tl">
        <div style={{ color:'#C9A227', fontSize:'0.75rem', letterSpacing:'0.25em', marginBottom:'0.3rem' }}>
          HOPER · 希望者
        </div>
        <div style={{ fontSize:'0.6rem', opacity:0.6 }}>文库 Vol.001 · 2025.05.05</div>
      </div>
      <div className="ra-landing-corner tr">MMXXV</div>
      <div className="ra-landing-corner br">
        240 分钟直播 · 22 万字逐字稿
      </div>

      {/* Phrases */}
      <p className={`ra-phrase ${phase === 1 ? 'show' : phase > 1 ? 'hide' : ''}`}>
        你的注意力，每天被切碎成 10 秒
      </p>
      <p className={`ra-phrase ${phase === 2 ? 'show' : phase > 2 ? 'hide' : ''}`}
         style={{ fontSize: 'clamp(0.9rem,1.8vw,1.3rem)', color: 'rgba(201,162,39,0.75)' }}>
        但你最值钱的东西，恰恰是它
      </p>

      {/* Two-door split (cinematic) */}
      {phase >= 3 && (
        <div className="ra-door-wrap">
          <div className={`ra-door left ${crackVisible ? 'open' : ''}`}>
            <span className="ra-door-glyph-half">莽</span>
          </div>
          <div className={`ra-door right ${crackVisible ? 'open' : ''}`}>
            <span className="ra-door-glyph-half">莽</span>
          </div>
          <div className={`ra-crack ${crackVisible ? 'show' : ''}`} />
        </div>
      )}

      {/* Hero */}
      <div className={`ra-hero ${heroVisible ? 'show' : ''}`}>
        <div className="ra-hero-inner">
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.75rem',
                       letterSpacing: '0.4em', marginBottom: '1.5rem' }}>
            COMPOUND · ATTENTION · SOUL
          </p>
          <h1 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2rem,5vw,4rem)', color: '#FAF8F3',
                        fontWeight: 400, letterSpacing: '0.05em',
                        textShadow: '0 0 40px rgba(201,162,39,0.3)', lineHeight: 1.3 }}>
            年轻人，就是要莽
          </h1>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: 'clamp(0.95rem,1.6vw,1.1rem)',
                       letterSpacing: '0.3em', marginTop: '1.2rem' }}>
            复利 · 注意力 · 心力
          </p>
          <p style={{ color: 'rgba(250,248,243,0.45)', fontSize: 'clamp(0.78rem,1.2vw,0.9rem)',
                       letterSpacing: '0.15em', marginTop: '0.8rem', fontStyle: 'italic' }}>
            一场四小时的直播，做成一本可以反复翻阅的书
          </p>
        </div>
      </div>

      {/* Entry */}
      <div className={`ra-entry ${entryVisible ? 'show' : ''}`}
           style={{ position: 'absolute', bottom: '12vh', left: 0, right: 0,
                     display: 'flex', justifyContent: 'center',
                     pointerEvents: entryVisible ? 'auto' : 'none' }}>
        <button className="ra-btn" onClick={handleEnter}>
          开始阅读 →
        </button>
      </div>
    </div>
  );
};

// ── SVG Hero Decorations ─────────────────────────────────────────────────────
const HeroDecoCh01 = () => ( // 5 horizontal bars deepening
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      {[1,2,3,4,5].map(i => (
        <rect key={i} x={20} y={i*30 - 10} width={160} height={4}
              fill="#C9A227" opacity={0.15 + i * 0.15} />
      ))}
      <text x={100} y={185} textAnchor="middle" fontSize="9"
            fill="#C9A227" opacity={0.6} letterSpacing="2">
        DEEPENING
      </text>
    </svg>
  </div>
);

const HeroDecoCh02 = () => ( // spiral
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      <g className="ra-spin">
        <path d="M100,100 m-70,0 a70,70 0 1,0 140,0 a70,70 0 1,0 -140,0"
              fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.4" />
        <path d="M100,100 m-50,0 a50,50 0 1,0 100,0 a50,50 0 1,0 -100,0"
              fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.5" />
        <path d="M100,100 m-30,0 a30,30 0 1,0 60,0 a30,30 0 1,0 -60,0"
              fill="none" stroke="#C9A227" strokeWidth="0.7" opacity="0.6" />
      </g>
      {/* spiraling path */}
      <path d="M 100 100 m -10 0 q 0 -10 10 -10 q 20 0 20 20 q 0 30 -30 30 q -40 0 -40 -40 q 0 -50 50 -50 q 60 0 60 60"
            fill="none" stroke="#C9A227" strokeWidth="1.5" opacity="0.8" />
      <circle cx="160" cy="40" r="3" fill="#C9A227" />
    </svg>
  </div>
);

const HeroDecoCh03 = () => ( // mining contrast: dot vs pickaxe wedge
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      <g opacity="0.3">
        {Array.from({length: 20}).map((_, i) => (
          <circle key={i} cx={20 + (i*23) % 160} cy={20 + ((i*47) % 160)}
                  r={1 + (i % 3)} fill="#C9A227" />
        ))}
      </g>
      <line x1="40" y1="100" x2="160" y2="100" stroke="#C9A227" strokeWidth="0.5" opacity="0.5" />
      <text x="40" y="92" fontSize="11" fill="#C9A227" opacity="0.6"
            fontFamily="Playfair Display" fontStyle="italic">ore</text>
      <text x="160" y="115" fontSize="11" fill="#C9A227" opacity="0.9" textAnchor="end"
            fontFamily="Playfair Display" fontStyle="italic">miner</text>
      <path d="M 100 60 L 100 140 M 80 80 L 120 80" stroke="#C9A227" strokeWidth="2" opacity="0.8" />
    </svg>
  </div>
);

const HeroDecoCh04 = () => ( // closed loop with 5 nodes
  <div className="ra-hero-deco">
    <svg viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="65" fill="none" stroke="#C9A227"
              strokeWidth="0.8" opacity="0.4" strokeDasharray="3 3" />
      {[0,1,2,3,4].map(i => {
        const angle = (i * 72 - 90) * Math.PI / 180;
        const x = 100 + Math.cos(angle) * 65;
        const y = 100 + Math.sin(angle) * 65;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={i === 0 ? 8 : 5}
                    fill={i === 0 ? '#C9A227' : '#FAF8F3'}
                    stroke="#C9A227" strokeWidth="1.5" />
            <text x={x} y={y + 3} textAnchor="middle" fontSize="7"
                  fill={i === 0 ? '#FAF8F3' : '#C9A227'}
                  fontFamily="Playfair Display" fontWeight="600">
              {i + 1}
            </text>
          </g>
        );
      })}
      <text x="100" y="105" textAnchor="middle" fontSize="9"
            fill="#C9A227" opacity="0.5" letterSpacing="2">LOOP</text>
    </svg>
  </div>
);

// ── Action Card (chips + optional textarea, persisted to localStorage) ──────
const ActionCard = ({ id, title, prompts, chips, chipsLabel, placeholder, hint }) => {
  const key = `ra-action-${id}`;
  const [picked, setPicked] = useState([]);     // selected chip values
  const [custom, setCustom] = useState('');     // free-text "其他" content
  const [showCustom, setShowCustom] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [justSaved, setJustSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const data = JSON.parse(raw);
        setPicked(data.picked || []);
        setCustom(data.custom || '');
        if (data.custom && data.custom.trim()) setShowCustom(true);
        setSavedAt(data.savedAt || null);
      }
    } catch (e) {}
  }, [key]);

  const togglePick = (chip) => {
    setPicked(prev => prev.includes(chip)
      ? prev.filter(c => c !== chip)
      : [...prev, chip]);
  };

  const save = () => {
    try {
      // Compose human-readable saved value
      const parts = [];
      if (picked.length) parts.push(picked.join(' · '));
      if (custom && custom.trim()) parts.push(custom.trim());
      const value = parts.join('\n\n');

      const ts = new Date().toLocaleString('zh-CN', { hour12: false });
      localStorage.setItem(key, JSON.stringify({
        picked, custom, value, savedAt: ts, title
      }));
      setSavedAt(ts);
      setJustSaved(true);
      setTimeout(() => setJustSaved(false), 1800);
    } catch (e) {}
  };

  const hasContent = picked.length > 0 || (custom && custom.trim());

  return (
    <div className="ra-action">
      <h4>{title}</h4>
      {prompts && (
        <div className="ra-action-prompt">
          {prompts.map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{ color: '#C9A227', flexShrink: 0 }}>·</span>
              <span>{p}</span>
            </div>
          ))}
        </div>
      )}

      {chips && chips.length > 0 && (
        <>
          <div className="ra-chips-hint">{chipsLabel || '点击挑选 · 可多选'}</div>
          <div className="ra-chips">
            {chips.map((chip, i) => (
              <button key={i} type="button"
                      className={`ra-chip ${picked.includes(chip) ? 'selected' : ''}`}
                      onClick={() => togglePick(chip)}>
                {picked.includes(chip) && <span style={{fontSize:'0.7rem'}}>✓</span>}
                {chip}
              </button>
            ))}
            <button type="button"
                    className={`ra-chip ra-chip-other ${showCustom ? 'selected' : ''}`}
                    onClick={() => setShowCustom(s => !s)}>
              {showCustom ? '✕ 收起' : '+ 其他（自己写）'}
            </button>
          </div>
        </>
      )}

      {(showCustom || !chips) && (
        <textarea className="ra-action-textarea" value={custom}
                  onChange={e => setCustom(e.target.value)}
                  placeholder={placeholder} />
      )}

      <div className="ra-action-row">
        <span className="ra-action-meta">
          {hint || '保存到本地浏览器 · 不上传任何服务器'}
          {savedAt && ` · 已保存 ${savedAt}`}
        </span>
        <button className={`ra-action-save ${justSaved ? 'saved' : ''}`}
                onClick={save}
                disabled={!hasContent}
                style={{ opacity: hasContent ? 1 : 0.4,
                          cursor: hasContent ? 'pointer' : 'not-allowed' }}>
          {justSaved ? '✓ 已保存' : '保 存'}
        </button>
      </div>
    </div>
  );
};

// ── Preface Page (序：重复有万钧之力) ────────────────────────────────────────
// Sequenced reveal with varying delays for breathing rhythm
const PrefaceLine = ({ delay, className = 'ra-preface-line', children }) => {
  const [shown, setShown] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => setShown(true), delay);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={className}
         style={{ opacity: shown ? 1 : 0,
                   transform: shown ? 'translateY(0)' : 'translateY(20px)',
                   filter: shown ? 'blur(0)' : 'blur(8px)',
                   transition: 'opacity 1.6s ease, transform 1.6s ease, filter 1.6s ease' }}>
      {children}
    </div>
  );
};

const PrefacePage = ({ onNav }) => {
  // Floating ambient dust
  const dust = Array.from({ length: 14 }, (_, i) => ({
    left: `${(i * 71) % 100}%`,
    delay: `${(i * 0.9) % 12}s`,
    duration: `${12 + (i % 5)}s`,
  }));

  return (
    <section className="ra-preface">
      {/* Ambient floating dust */}
      {dust.map((d, i) => (
        <span key={i} className="ra-dust"
              style={{ left: d.left, animationDelay: d.delay, animationDuration: d.duration }} />
      ))}

      <span className="ra-preface-glyph">编</span>

      <div className="ra-preface-content">
        <PrefaceLine delay={200}>
          <p className="ra-preface-eyebrow">PREFACE · 编者按</p>
        </PrefaceLine>

        <PrefaceLine delay={500}>
          <h1 className="ra-preface-title">关于这份文档</h1>
        </PrefaceLine>

        {/* Lead */}
        <PrefaceLine delay={1000} className="ra-preface-lead">
          一场四小时的直播，<br/>做成一本可以反复翻阅的书。
        </PrefaceLine>

        <PrefaceLine delay={1900}>
          <p className="ra-preface-line">
            这不是摘要，也不是逐字稿，而是一份<strong>"直播平替稿"</strong>——
            把树林 5 月 5 日整场直播的全部观点、案例、戳人时刻，按底层逻辑重新组织，
            复原成一份"读它就等于看完直播"的完整文档。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={2700}>
          <p className="ra-preface-line">
            原始素材是 <strong>22 万字、5500 行逐字稿</strong>。
            这份整理稿做了三件事：按主题逻辑重排顺序、保留所有不可替代的原话和案例、
            用引用与金句单页让你既能从头读完也能随时翻阅。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={3500}>
          <div className="ra-preface-divider" />
        </PrefaceLine>

        <PrefaceLine delay={3900}>
          <p className="ra-preface-line">
            全文<strong>四篇十一章 + 附录</strong>，约 50 页。
            如果你只读这份文档不看原直播，你会拿到 <strong>90%</strong> 树林想给你的东西。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={4800}>
          <p className="ra-preface-line">
            剩下的 10%，是他在直播里那些只属于现场的、靠语气和情绪传递的部分——
            那些没办法被任何文字复刻。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={5700}>
          <p className="ra-preface-line">
            这场直播表面的题目是 <strong>"年轻人，就是要莽"</strong>。
            但树林真正想说的可能是另一句话——他在结尾说的：
          </p>
        </PrefaceLine>

        {/* The closing line that defines this whole book */}
        <PrefaceLine delay={6700} className="ra-preface-lead">
          "改变世界。<br/>世界不死，理想不灭，<br/>现在随便喊。"
        </PrefaceLine>

        <PrefaceLine delay={7600}>
          <p className="ra-preface-line">
            这是一个 <strong>28 岁的人</strong>停更大半年之后的第一场直播。
            他想把这半年沉默换来的所有东西，<strong>毫无保留地交给愿意听的人</strong>。
          </p>
        </PrefaceLine>

        <PrefaceLine delay={8400} className="ra-preface-lead final">
          —— 整理者 · 2026
        </PrefaceLine>

        <PrefaceLine delay={9400}>
          <div className="ra-preface-enter">
            <button onClick={() => onNav('directory')}
                    style={{ background: 'transparent', border: '1px solid #C9A227',
                              color: '#C9A227', padding: '1rem 2.8rem',
                              fontFamily: "'Noto Serif SC',serif", fontSize: '0.95rem',
                              letterSpacing: '0.3em', cursor: 'pointer',
                              transition: 'all 0.4s ease' }}
                    onMouseEnter={e => { e.target.style.background = '#C9A227'; e.target.style.color = '#0B0805'; }}
                    onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#C9A227'; }}>
              进入目录 →
            </button>
            <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.7rem',
                            letterSpacing: '0.2em', display: 'flex',
                            alignItems: 'center', gap: '0.4rem' }}>
              或按 <span className="ra-kbd">→</span> 直接进入
            </span>
          </div>
        </PrefaceLine>
      </div>
    </section>
  );
};

// ── Stage Picker (Ch01: where am I right now?) ──────────────────────────────
const StagePicker = ({ stages }) => {
  const [picked, setPicked] = useState(null);
  const KEY = 'ra-stage-picked';
  useEffect(() => {
    try { const v = localStorage.getItem(KEY); if (v) setPicked(parseInt(v)); } catch (e) {}
  }, []);
  const choose = (i) => {
    setPicked(i);
    try { localStorage.setItem(KEY, String(i)); } catch (e) {}
  };
  const feedback = [
    { label:'信息阶段 · 现在该做的',
      text:'你刚刚听过它。下一步只有一件事——把它写到你今天必看的地方。手机壁纸、桌面便签、笔记扉页都行。让它至少不要消失。' },
    { label:'认同阶段 · 现在该做的',
      text:'你"觉得对"了，但卡在了最深的缝隙——意志的缝隙。下一步：今天就用它做一个真实的小决定。一次就好。让认同长出第一个动作。' },
    { label:'执行阶段 · 现在该做的',
      text:'你已经做过几次。下一步不是做更多，而是做得更稳定。给自己设一个触发器："每次 X 发生，我就用这个原则。"让执行从偶然变成自动。' },
    { label:'习惯阶段 · 现在该做的',
      text:'你已经能默认这样做。下一步是检验：在你最累、最焦虑、最自我批判的时候，它还会出现吗？让它在压力下也成立，才会真正变成你的气质。' },
    { label:'气质阶段 · 现在该做的',
      text:'恭喜——别人能从你身上看见它了。但人不能停。回到第 01 步，找一个新的道理，重新开始一次螺旋。一个气质好的人，永远在重复一些更深的东西。' },
  ];
  return (
    <div className="ra-stage-pick">
      <div className="ra-stage-pick-q">那么——你现在在哪一阶段？</div>
      <p className="ra-stage-pick-hint">挑一个，看一下你的下一步是什么</p>
      <div className="ra-stage-buttons">
        {stages.map((s, i) => (
          <button key={i}
                  className={`ra-stage-btn ${picked === i ? 'selected' : ''}`}
                  onClick={() => choose(i)}>
            <span className="ra-stage-btn-num">{s.n}</span>
            <span className="ra-stage-btn-label">{s.label}</span>
          </button>
        ))}
      </div>
      {picked !== null && (
        <div className="ra-stage-feedback" key={picked}>
          <div className="ra-stage-feedback-label">{feedback[picked].label}</div>
          <p className="ra-stage-feedback-text">{feedback[picked].text}</p>
        </div>
      )}
    </div>
  );
};

// ── Compound Visualizer (Ch02: see compounding with your own habit) ─────────
const CompoundVisualizer = () => {
  const KEY = 'ra-compound';
  const [thing, setThing] = useState('');
  const [amount, setAmount] = useState(100);
  const [unit, setUnit] = useState('字');
  const [animated, setAnimated] = useState(false);
  const days = [1, 7, 21, 100, 365];

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setThing(d.thing || '');
        setAmount(d.amount || 100);
        setUnit(d.unit || '字');
        setAnimated(true);
      }
    } catch (e) {}
  }, []);

  const persist = (next = {}) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ thing, amount, unit, ...next }));
    } catch (e) {}
  };

  const handleVisualize = () => {
    setAnimated(false);
    setTimeout(() => setAnimated(true), 30);
    persist();
  };

  // bar heights (log-scaled so 365 isn't off the chart)
  const totals = days.map(d => d * (Number(amount) || 0));
  const maxTotal = Math.max(...totals, 1);
  const heights = totals.map(t => Math.max(8, (Math.log(t + 1) / Math.log(maxTotal + 1)) * 100));

  const fmt = (n) => n >= 1000 ? n.toLocaleString('zh-CN') : String(n);

  return (
    <div className="ra-compound">
      <div className="ra-compound-title">复利可视化器</div>
      <p className="ra-compound-sub">
        输入你今天准备做的一件小事，看看它在 1 / 7 / 21 / 100 / 365 天后会变成什么。
      </p>

      <div className="ra-compound-input-row">
        <input className="ra-compound-input" type="text" placeholder="例：每天写"
               value={thing} onChange={e => setThing(e.target.value)} />
        <input className="ra-compound-input num" type="number" min="1"
               value={amount} onChange={e => setAmount(e.target.value)} />
        <input className="ra-compound-input num" type="text" placeholder="单位"
               value={unit} onChange={e => setUnit(e.target.value)}
               style={{ maxWidth: 80, flex: '0 0 80px' }} />
        <button className="ra-action-save" onClick={handleVisualize}
                style={{ background: '#C9A227', color: '#2D2416' }}>
          看 →
        </button>
      </div>

      <div className="ra-compound-bars">
        {days.map((d, i) => (
          <div key={d} className="ra-compound-bar-col">
            <div className="ra-compound-bar"
                 style={{
                   height: animated ? `${heights[i]}%` : '0%',
                   transitionDelay: `${i * 200}ms`,
                 }}>
              {animated && (
                <span className="ra-compound-bar-value">
                  {fmt(totals[i])} {unit}
                </span>
              )}
            </div>
            <div className="ra-compound-bar-day">{d} 天</div>
          </div>
        ))}
      </div>

      {animated && thing && (
        <div className="ra-compound-summary">
          一年之后：你「{thing}」积累的总量是
          <strong> {fmt(totals[4])} {unit}</strong>
          <br />
          <span style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.8rem' }}>
            前提：不要反复清零
          </span>
        </div>
      )}
    </div>
  );
};

// ── Commitment Card (Outro: 21-day pledge) ──────────────────────────────────
const CommitmentCard = () => {
  const KEY = 'ra-commit';
  const [principle, setPrinciple] = useState('');
  const [action, setAction] = useState('');
  const [savedAt, setSavedAt] = useState(null);
  const [revealAt, setRevealAt] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const d = JSON.parse(raw);
        setPrinciple(d.principle || '');
        setAction(d.action || '');
        setSavedAt(d.savedAt || null);
        setRevealAt(d.revealAt || null);
      }
    } catch (e) {}
  }, []);

  // Pre-fill principle from Ch01 action card (if user picked one)
  useEffect(() => {
    if (principle) return;
    try {
      const raw = localStorage.getItem('ra-action-ch01');
      if (raw) {
        const d = JSON.parse(raw);
        if (d.picked && d.picked.length > 0) setPrinciple(d.picked[0]);
        else if (d.custom) setPrinciple(d.custom.split('\n')[0].slice(0, 30));
      }
    } catch (e) {}
  }, []);

  const save = () => {
    if (!principle.trim() || !action.trim()) return;
    const now = new Date();
    const target = new Date(now.getTime() + 21 * 24 * 3600 * 1000);
    const fmt = (d) => `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
    const ts = fmt(now);
    const reveal = fmt(target);
    try {
      localStorage.setItem(KEY, JSON.stringify({
        principle, action, savedAt: ts, revealAt: reveal
      }));
      setSavedAt(ts); setRevealAt(reveal);
    } catch (e) {}
  };

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  })();
  const target21 = (() => {
    const d = new Date(Date.now() + 21 * 24 * 3600 * 1000);
    return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
  })();

  const ready = principle.trim() && action.trim();

  return (
    <div className="ra-commit">
      <span className="ra-commit-glyph">诺</span>
      <div className="ra-commit-inner">
        <p className="ra-commit-eyebrow">21-DAY COMMITMENT</p>
        <h3 className="ra-commit-title">写一份给自己的承诺</h3>

        <div className="ra-commit-fields">
          <div>
            <div className="ra-commit-field-label">那句道理</div>
            <input className="ra-commit-input" type="text"
                   placeholder="例：不要反复归零"
                   value={principle}
                   onChange={e => setPrinciple(e.target.value)} />
          </div>
          <div>
            <div className="ra-commit-field-label">未来 21 天，我承诺这样做</div>
            <textarea className="ra-commit-textarea"
                      placeholder="例：每天睡前问自己一遍：今天有什么留下了？"
                      value={action}
                      onChange={e => setAction(e.target.value)} />
          </div>
        </div>

        {/* Live preview card */}
        <div className="ra-commit-card">
          <div className="ra-commit-card-q">我的承诺</div>
          <div className="ra-commit-card-line">
            「{principle || '——你的那句道理——'}」
          </div>
          <div className="ra-commit-card-action">
            {action || '——你给自己的承诺——'}
          </div>
          <div className="ra-commit-card-dates">
            <div className="ra-commit-date-block">
              <div className="ra-commit-date-label">承诺于</div>
              <div className="ra-commit-date-value">{savedAt || today}</div>
            </div>
            <div className="ra-commit-date-block">
              <div className="ra-commit-date-label">21 天后回来</div>
              <div className="ra-commit-date-value">{revealAt || target21}</div>
            </div>
          </div>
        </div>

        <button className="ra-commit-save" onClick={save} disabled={!ready}>
          {savedAt ? '✓ 已封印 · 重新承诺' : '封 印 这 份 承 诺'}
        </button>

        <p className="ra-commit-meta">
          {savedAt
            ? `已保存到本地浏览器 · ${revealAt} 那天回来看看你做到了什么`
            : '保存后 21 天后回来 · 也是给"重复"的一次实战'}
        </p>
      </div>
    </div>
  );
};

// ── Chapter Entrance Overlay (full-screen ceremony) ─────────────────────────
const ChapterEntrance = ({ pageId, navKey }) => {
  // Only show for actual chapters
  const chapterMap = {
    preface: { num: '序', label: 'PREFACE',     title: '编者按 · 关于这份文档' },
    ch01:    { num: '壹', label: 'PART ONE',    title: '底层操作系统 · 注意力' },
    ch02:    { num: '贰', label: 'PART TWO',    title: '身体的物理学' },
    ch03:    { num: '叁', label: 'PART THREE',  title: '商业世界的真相' },
    ch04:    { num: '肆', label: 'PART FOUR',   title: 'AI 时代与心力' },
    outro:   { num: '∞',  label: 'APPENDIX',    title: '金句索引 · 后记' },
  };
  const meta = chapterMap[pageId];
  if (!meta) return null;
  return (
    <div className="ra-entrance" key={navKey}>
      {/* Two curtain panels — close in to cover, then split apart to reveal */}
      <div className="ra-entrance-curtain left" />
      <div className="ra-entrance-curtain right" />
      {/* Golden seam where the curtains meet */}
      <div className="ra-entrance-seam" />
      {/* Content (number / label / title / bar) sits centered above curtains */}
      <div className="ra-entrance-content">
        <div className="ra-entrance-num">{meta.num}</div>
        <div className="ra-entrance-label">{meta.label}</div>
        <div className="ra-entrance-title">{meta.title}</div>
        <div className="ra-entrance-bar" />
      </div>
    </div>
  );
};

// ── Mouse Glow (subtle follower) ─────────────────────────────────────────────
const MouseGlow = () => {
  const ref = useRef(null);
  useEffect(() => {
    const onMove = (e) => {
      if (ref.current) {
        ref.current.style.left = e.clientX + 'px';
        ref.current.style.top  = e.clientY + 'px';
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return <div ref={ref} className="ra-glow" />;
};

// ── Ink Reveal (line-by-line on scroll) ──────────────────────────────────────
const InkReveal = ({ lines, as: Tag = 'div', style, lineStyle, delay = 80 }) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        lines.forEach((_, i) =>
          setTimeout(() => setShown(s => Math.max(s, i + 1)), i * delay)
        );
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [lines, delay]);
  return (
    <Tag ref={ref} style={style}>
      {lines.map((line, i) => (
        <span key={i} className={`ra-ink-line ${i < shown ? 'shown' : ''}`}
              style={lineStyle}>
          {line}
        </span>
      ))}
    </Tag>
  );
};

// ── Anchor Nav (floating right-side mini-TOC) ────────────────────────────────
const AnchorNav = ({ scrollEl, items }) => {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const el = scrollEl?.current;
    if (!el) return;
    const onScroll = () => {
      const probe = el.scrollTop + el.clientHeight * 0.3;
      let curr = 0;
      items.forEach((it, i) => {
        const node = document.getElementById(it.id);
        if (node && node.offsetTop <= probe) curr = i;
      });
      setActive(curr);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollEl, items]);
  const goTo = (id) => {
    const node = document.getElementById(id);
    const el = scrollEl?.current;
    if (node && el) el.scrollTo({ top: node.offsetTop - 40, behavior: 'smooth' });
  };
  return (
    <nav className="ra-anchors">
      {items.map((it, i) => (
        <div key={it.id} className={`ra-anchor ${i === active ? 'active' : ''}`}
             onClick={() => goTo(it.id)}>
          <span className="ra-anchor-label">{it.label}</span>
          <span className="ra-anchor-dot" />
        </div>
      ))}
    </nav>
  );
};

// ── Back to top button ───────────────────────────────────────────────────────
const BackToTop = ({ scrollEl, threshold = 400 }) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const el = scrollEl?.current;
    if (!el) return;
    const onScroll = () => setShow(el.scrollTop > threshold);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [scrollEl, threshold]);
  return (
    <button className={`ra-totop ${show ? 'show' : ''}`}
            onClick={() => scrollEl.current?.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Back to top">
      <ChevronUp size={18} />
    </button>
  );
};

// ── Sidebar ───────────────────────────────────────────────────────────────────
export const PAGE_ORDER = ['preface', 'directory', 'ch01', 'ch02', 'ch03', 'ch04', 'outro'];
export const PAGE_META = {
  preface:   { label: '编者按',                icon: <Feather    size={13} />, time: '2 min' },
  directory: { label: '目录',                  icon: <BookMarked size={13} />, time: '1 min' },
  ch01:      { label: '壹 · 上篇 · 注意力',     icon: <Repeat     size={13} />, time: '9 min' },
  ch02:      { label: '贰 · 中篇 · 身体',       icon: <RotateCcw  size={13} />, time: '11 min' },
  ch03:      { label: '叁 · 下篇 · 商业',       icon: <Brain      size={13} />, time: '9 min' },
  ch04:      { label: '肆 · 终篇 · AI 与心力',  icon: <Cpu        size={13} />, time: '10 min' },
  outro:     { label: '金句索引 · 后记',        icon: <Star       size={13} />, time: '4 min' },
};

const Sidebar = ({ active, onNav }) => {
  const idx = PAGE_ORDER.indexOf(active);
  const progress = ((idx + 1) / PAGE_ORDER.length) * 100;

  return (
    <nav className="ra-sidebar">
      <div className="ra-sidebar-logo">
        <div style={{ color: '#C9A227', fontSize: '0.75rem', letterSpacing: '0.3em', marginBottom: '0.4rem' }}>
          HOPER · 希望者
        </div>
        <div style={{ color: 'rgba(250,248,243,0.3)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          文库 Vol.001 · 2025.05.05
        </div>
      </div>

      {PAGE_ORDER.map((id, i) => {
        const item = PAGE_META[id];
        const isActive = active === id;
        return (
          <div key={id}
               className={`ra-nav-item ${isActive ? 'active' : ''}`}
               onClick={() => onNav(id)}
               style={{ position: 'relative' }}>
            {item.icon}
            <span style={{ flex: 1 }}>{item.label}</span>
            {isActive && <span className="ra-pulse" />}
            {!isActive && (
              <span style={{ fontSize: '0.6rem', opacity: 0.4, letterSpacing: 0 }}>
                {item.time}
              </span>
            )}
          </div>
        );
      })}

      {/* Reading progress + keyboard hint */}
      <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(201,162,39,0.1)' }}>
        <div style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.6rem',
                       letterSpacing: '0.2em', marginBottom: '0.5rem',
                       display: 'flex', justifyContent: 'space-between' }}>
          <span>READING</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 2, background: 'rgba(201,162,39,0.15)', overflow: 'hidden', marginBottom: '1.2rem' }}>
          <div style={{ width: `${progress}%`, height: '100%',
                         background: 'linear-gradient(90deg,#C9A227,#e8c84a)',
                         transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                       color: 'rgba(201,162,39,0.45)', fontSize: '0.6rem',
                       letterSpacing: '0.1em' }}>
          <span className="ra-kbd">←</span>
          <span className="ra-kbd">→</span>
          <span style={{ marginLeft: '0.4rem' }}>切换章节</span>
        </div>
      </div>
    </nav>
  );
};

// ── Chapter footer nav (prev/next) ───────────────────────────────────────────
const ChapterNav = ({ current, onNav }) => {
  const idx = PAGE_ORDER.indexOf(current);
  const prev = idx > 0 ? PAGE_ORDER[idx - 1] : null;
  const next = idx < PAGE_ORDER.length - 1 ? PAGE_ORDER[idx + 1] : null;
  return (
    <div className="ra-chap-nav">
      <div className={`ra-chap-nav-item ${!prev ? 'disabled' : ''}`}
           onClick={() => prev && onNav(prev)}>
        <div className="ra-chap-nav-label">
          <ArrowLeft size={11} /> 上一章
        </div>
        {prev && <div className="ra-chap-nav-title">{PAGE_META[prev].label.replace(/^Ch\d+ · /,'')}</div>}
      </div>
      <div className={`ra-chap-nav-item ${!next ? 'disabled' : ''}`}
           onClick={() => next && onNav(next)}
           style={{ textAlign: 'right', alignItems: 'flex-end' }}>
        <div className="ra-chap-nav-label" style={{ justifyContent: 'flex-end' }}>
          下一章 <ArrowRight size={11} />
        </div>
        {next && <div className="ra-chap-nav-title">{PAGE_META[next].label.replace(/^Ch\d+ · /,'')}</div>}
      </div>
    </div>
  );
};

// ── Directory ────────────────────────────────────────────────────────────────
const DirectoryPage = ({ onNav }) => {
  const parts = [
    { id: 'ch01', num: '壹', cn: '上篇', en: 'PART ONE', color: '#8B6914',
      title: '底层操作系统', sub: '注意力如何被分配、消耗、聚焦',
      desc: '在你想做任何事之前，先理解你的注意力是如何被分配、被消耗、被聚焦的。这是这场直播——也是这本书——的根。',
      chapters: [
        { n: '01', t: '复利的本质是注意力' },
        { n: '02', t: '注意力的劫持与压强' },
      ],
      tags: ['复利', '压强公式', '虐恋三要素'] },
    { id: 'ch02', num: '贰', cn: '中篇', en: 'PART TWO', color: '#6B4F12',
      title: '身体的物理学', sub: '人首先是一台烧炭的机器',
      desc: '一切赚钱、幸福、深度行动的能力，都建立在身体能量供给之上。能量先于认知，身体先于心智。',
      chapters: [
        { n: '03', t: '人是烧炭的机器' },
        { n: '04', t: '高酮、多巴胺与攻击性' },
        { n: '05', t: 'DMN 默认网络' },
      ],
      tags: ['ATP / 血糖', '60 分能量线', '深夜 EMO'] },
    { id: 'ch03', num: '叁', cn: '下篇', en: 'PART THREE', color: '#4A3A0A',
      title: '商业世界的真相', sub: '资本如何进化，你又被怎样剥削',
      desc: '这个世界一直在剥削你——只是手法越来越精细。从你的土地，到你的劳动力，到你的注意力，到你未来的钱。',
      chapters: [
        { n: '06', t: '资本演进史：从地主到注意力' },
        { n: '07', t: '杠杆思维与陌生人交易' },
        { n: '08', t: '营销不邪恶' },
      ],
      tags: ['资本四阶段', '杠杆 × 陌生人', '营销中性化'] },
    { id: 'ch04', num: '肆', cn: '终篇', en: 'PART FOUR', color: '#2D2416',
      title: 'AI 时代与心力', sub: '智能将平价，护城河是审美与心力',
      desc: '当智能即将平价，护城河是什么？审美、心力、诚意正心——以及一个 28 岁的人停更大半年之后想明白的所有事。',
      chapters: [
        { n: '09', t: 'AI 代差与审美护城河' },
        { n: '10', t: '世界观→结果：八步循环链' },
        { n: '11', t: '诚意正心：树林的回归与告白' },
      ],
      tags: ['AI 代差', '八步循环', '诚意正心'] },
  ];
  return (
    <section style={{ background: '#FAF8F3', padding: '5rem 3rem', minHeight: '100vh',
                       position: 'relative', overflow: 'hidden' }}>
      <span className="ra-dir-glyph">莽</span>
      <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <p style={{ color: '#C9A227', fontSize: '0.75rem', letterSpacing: '0.4em', marginBottom: '1rem' }}>
          — TABLE OF CONTENTS —
        </p>
        <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                      fontSize: 'clamp(2.2rem,4.5vw,3.2rem)',
                      color: '#2D2416', fontWeight: 400, marginBottom: '0.5rem' }}>
          四篇 · 十一章 · 一份附录
        </h2>
        <p style={{ color: 'rgba(45,36,22,0.55)', fontSize: '0.85rem',
                     letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
          约 50 页 · 38 分钟阅读 · 推荐按顺序，可随时翻阅
        </p>
        <div className="ra-quote" style={{ maxWidth: 640 }}>
          如果你只读这份文档不看原直播，<br/>
          你会拿到 90% 树林想给你的东西。
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(400px,1fr))',
                       gap: '1.5rem', marginTop: '3rem' }}>
          {parts.map(p => (
            <div key={p.id} className="ra-card" onClick={() => onNav(p.id)}
                 style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between',
                             alignItems: 'flex-start', marginBottom: '1.2rem' }}>
                <div>
                  <span style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                                  fontSize: '3.5rem',
                                  color: p.color, opacity: 0.18, lineHeight: 1, fontWeight: 400 }}>
                    {p.num}
                  </span>
                  <span style={{ display: 'block', color: '#C9A227', fontSize: '0.65rem',
                                  letterSpacing: '0.3em', marginTop: '0.3rem' }}>
                    {p.en} · {p.cn}
                  </span>
                </div>
                <ArrowUpRight size={16} style={{ color: '#C9A227', marginTop: '0.5rem' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', color: '#2D2416', fontWeight: 500,
                            marginBottom: '0.3rem' }}>{p.title}</h3>
              <p style={{ color: '#C9A227', fontSize: '0.85rem', letterSpacing: '0.1em',
                           marginBottom: '1rem', fontStyle: 'italic' }}>{p.sub}</p>
              <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.88rem',
                           lineHeight: 1.85, marginBottom: '1.2rem' }}>{p.desc}</p>
              {/* Chapter list */}
              <div style={{ marginBottom: '1.2rem', paddingTop: '1rem',
                             borderTop: '1px dashed rgba(201,162,39,0.25)' }}>
                {p.chapters.map(c => (
                  <div key={c.n} style={{ display: 'flex', alignItems: 'baseline',
                                             gap: '0.8rem', padding: '0.3rem 0',
                                             color: 'rgba(45,36,22,0.7)', fontSize: '0.85rem' }}>
                    <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                    fontSize: '0.78rem', fontWeight: 600,
                                    width: '22px' }}>
                      {c.n}
                    </span>
                    <span>{c.t}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {p.tags.map(t => <span key={t} className="ra-tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ── Part I · 上篇 · 注意力 ────────────────────────────────────────────────────
const Ch01Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      {/* Hero */}
      <div className="ra-chapter-bg"
           style={{ background: 'linear-gradient(135deg,#FAF8F3 0%,#F0EBE0 100%)',
                     padding: '6rem 3rem 4rem', position: 'relative' }}>
        <HeroDecoCh01 />
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>
            PART I · 壹 / 肆
          </p>
          <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2rem,4vw,3.2rem)',
                        color: '#2D2416', fontWeight: 400, marginBottom: '0.4rem', lineHeight: 1.3 }}>
            底层操作系统
          </h2>
          <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.1em',
                       marginBottom: '2rem', fontStyle: 'italic' }}>
            注意力如何被分配、消耗、聚焦
          </p>
          <div className="ra-quote" style={{ maxWidth: 620 }}>
            在你想做任何事之前，先理解你的注意力<br/>
            是如何被分配、被消耗、被聚焦的。<br />
            <strong style={{ color: '#2D2416' }}>这是这场直播——也是这本书——的根。</strong>
          </div>
        </div>
      </div>

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* CHAPTER 1 · 复利的本质是注意力 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div id="ch1-compound" style={{ scrollMarginTop: '40px' }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                       marginBottom: '0.6rem' }}>第 一 章 · CHAPTER ONE</p>
          <h3 style={{ fontSize: '1.6rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginBottom: '0.5rem',
                        fontFamily: "'Playfair Display','Noto Serif SC',serif" }}>
            复利的本质是注意力
          </h3>
          <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.9rem',
                       fontStyle: 'italic', marginBottom: '2rem' }}>
            "我大概在大半年时间里，刚刚摸到了'复利'这个词的门槛。"
          </p>

          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            你以前一定听过这个词。第八大奇迹。所有讲投资的人都在用它，所有讲成长的人都在引用它。
            但你大概率没真正用过它——除了用它来吓唬自己。
          </p>

          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            这场直播一开场，树林给出了一个反转：<strong style={{color:'#2D2416'}}>复利不是钱滚钱，
            它的本体是注意力</strong>——一份注意力的投入，能在多长时间维度里、被多少人接收到、产生多少回报。
            这个定义把"复利"从一个金融术语翻译成了一件你每天都在做、却从来没用对的事。
          </p>

          {/* ── 锁在脑子里的认知不会复利 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            锁在脑子里的认知不会复利
          </h4>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你的所有最厉害的东西<br/>
              都在你的<strong>脑子里面</strong>，<br/>
              你并没有公开给这个世界。<br/>
              只有世界看到了，<br/>
              世界才能给你<strong>定价</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginTop: '1.5rem' }}>
            树林说他大半年里每天写一万字以上，但全部锁在备忘录里没发出去——所以他没增加任何粉丝。
            他用这件事戳的不是"应该多发朋友圈"这种鸡汤，是一个更狠的真相：
            <strong style={{color:'#2D2416'}}>没有被外界看到的认知，无法被定价</strong>。
            它不进入复利循环，它只是消耗。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginTop: '1rem' }}>
            这就是为什么很多"很有想法"的人赚不到钱。不是认知不够——是认知没有变成可被外界看到、
            可被定价的资产。这一步叫<strong style={{color:'#C9A227'}}>"封装"</strong>。
            封装能力比认知本身更稀缺。
          </p>

          {/* ── 急切就是不复利 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            急切就是不复利
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1rem' }}>
            你白天和心仪的人聊得很好。互道晚安之后，他上了王者荣耀，你打开网易云开始云起来。
            多巴胺褪去，血清素不足，刚好今天又没晒太阳。你睡不着，抓心挠肝，发出"你喜不喜欢我"。
            嘉豪附体，赶紧补了一大段。第二天对方睡醒一看：十几条消息。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1rem' }}>
            原本你们这段关系可能有三四年的可能。前面已经聊了两个月，临门一脚都暧昧了。
            但你的<strong style={{color:'#2D2416'}}>急切</strong>——这种当下立马就要结果、被注意力劫持的行为——
            让对方瞬间下头。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            这个例子的杀伤力在于：你能立刻代入，每个人都做过。它真正的含义不是"恋爱要慢"，
            是<strong style={{color:'#C9A227'}}>急切就是不复利</strong>——
            你把未来几年可能的相遇，换成了当下一晚上的确定性。
          </p>

          {/* ── 复利的结构 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            什么是真正的复利
          </h4>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', position: 'relative', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>复利的结构</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.4rem,2.5vw,1.9rem)',
                         letterSpacing: '0.05em', lineHeight: 1.6, marginBottom: '1.2rem' }}>
              <strong style={{color:'#C9A227'}}>1 份注意力 → N 份回流</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.92rem',
                         lineHeight: 1.95, fontStyle: 'italic' }}>
              "我用我的现在的直播服务了七八千人——我用一份时间换了你们四千份的注意力，
              那我就会越来越有钱。"
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1rem' }}>
            同样是一份时间——你拿去刷短视频，复利系数是<strong style={{color:'#c0392b'}}>负的</strong>；
            你拿去和朋友吃饭，复利系数<strong>接近 1</strong>；你拿去写一篇能发出去的文档，
            复利系数<strong style={{color:'#C9A227'}}>可以是几百倍</strong>；
            你拿去做一个能反复销售的产品，复利系数<strong style={{color:'#C9A227'}}>可以是几千几万倍</strong>。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            分水岭在于：这一份注意力的产出，<strong>能不能被外界看到、能不能被多次接收、能不能在未来持续回报</strong>。
            三个能，就是复利；三个不能，就只是消耗。
          </p>

          {/* 复利可视化器 — 配合"1 份注意力 → N 份回流" */}
          <CompoundVisualizer />

          {/* 本章收束 */}
          <div style={{ marginTop: '3rem', padding: '1.8rem 2rem',
                         background: '#2D2416', borderLeft: '3px solid #C9A227' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>本章收束</p>
            <p style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 1.95 }}>
              复利不是钱滚钱，是注意力的产出能被多少人接收、能持续多久。<br/>
              <span style={{color:'#C9A227'}}>你赚不到钱，是因为你最厉害的东西，从未走出你的脑子。</span>
            </p>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* PULL QUOTE 01 · 论短视频 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div style={{ margin: '5rem 0', padding: '4rem 2rem',
                       background: 'linear-gradient(135deg, #14100a 0%, #1a1208 100%)',
                       textAlign: 'center', position: 'relative', overflow: 'hidden',
                       borderTop: '1px solid rgba(201,162,39,0.3)',
                       borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
          <div style={{ position: 'absolute', left: '1rem', top: '0.5rem',
                         color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                         letterSpacing: '0.3em' }}>PULL QUOTE · 01</div>
          <div style={{ position: 'absolute', right: '1rem', bottom: '0.5rem',
                         color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                         letterSpacing: '0.3em' }}>论 短 视 频</div>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
                       lineHeight: 1.7, fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
            如果从今天开始，<br/>
            我<strong style={{color:'#C9A227', fontStyle:'normal'}}>一分钟打断你一次</strong>。<br/>
            无论你做什么——<br/>
            你这辈子还能有<br/>什么<strong style={{color:'#C9A227', fontStyle:'normal'}}>出息</strong>？
          </p>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: '0.8rem',
                       letterSpacing: '0.4em', marginTop: '2rem' }}>
            — 树 林
          </p>
        </div>

        {/* ════════════════════════════════════════════════════════════════ */}
        {/* CHAPTER 2 · 注意力的劫持与压强 */}
        {/* ════════════════════════════════════════════════════════════════ */}
        <div id="ch2-attention" style={{ scrollMarginTop: '40px' }}>
          <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                       marginBottom: '0.6rem' }}>第 二 章 · CHAPTER TWO</p>
          <h3 style={{ fontSize: '1.6rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginBottom: '0.5rem',
                        fontFamily: "'Playfair Display','Noto Serif SC',serif" }}>
            注意力的劫持与压强
          </h3>
          <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.9rem',
                       fontStyle: 'italic', marginBottom: '2rem' }}>
            "瘾的本质是什么？瘾的本质是——不可撤销的注意力。"
          </p>

          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            上一章讲了复利的本体是注意力。这一章讲两件事：<strong>你的注意力正在被怎样劫持，
            以及抢回来之后该怎么用。</strong>
          </p>

          {/* ── 三重劫持 ── */}
          <h4 style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem' }}>
            三重劫持
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            劫持有三种形态。<strong>第一种是切碎。</strong>
            树林讲短视频，没有用任何"碎片化阅读不好"这种空话。他直接抛出一个让人脊背发凉的画面——
            如果有人每分钟打断你一次、连续一整天，你能做成什么事？哪怕做手艺活也不行，连性体验都会变得糟糕。
            但短视频做的就是这件事，而且更狠：不是 1 分钟打断一次，是
            <strong style={{color:'#c0392b'}}> 20 秒、10 秒打断一次</strong>。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            这件事最深的代价不是浪费当下时间，是它在
            <strong style={{color:'#2D2416'}}>系统性摧毁你做"长动作"的能力</strong>。
            一篇一万字的文章至少需要 20 个小时连续投入。10 秒打断一次的大脑，再也聚不回来。
            而所有真正能赚到钱的事——写一篇能传播的长文、做一个可卖的产品、谈成一个大客户——都是长动作。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.4rem' }}>
            <strong>第二种劫持是情绪。</strong>同样是刷手机：搞笑段子是当下愉悦、消费完就结束；
            但"年轻人没希望了""老登抢走了你们的机会"这类内容，会在你未来 3 到 4 个小时里持续压低自我评价。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            <strong>第三种是关系，也就是虐恋。</strong>三个特征同时出现就是它：
          </p>
          <div style={{ background: 'linear-gradient(135deg, #fdf0ed 0%, #fdf8e8 100%)',
                          border: '1px solid rgba(192,57,43,0.3)',
                          padding: '1.8rem 2rem', marginBottom: '1.5rem' }}>
            <p style={{ color: '#c0392b', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>虐恋三要素</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.2rem,2.2vw,1.6rem)',
                         lineHeight: 1.6, marginBottom: '1rem' }}>
              <strong style={{color:'#c0392b'}}>高性吸引</strong> +
              <strong style={{color:'#c0392b'}}> 高情绪波动</strong> +
              <strong style={{color:'#c0392b'}}> 高需求感</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.75)', fontSize: '0.88rem',
                         lineHeight: 1.9, fontStyle: 'italic' }}>
              性吸引让你一见面所有问题都解决；高需求感让你一分开就焦虑恐慌；
              情绪波动让你的多巴胺剧烈起伏。三件加在一起就是上瘾。
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            这种关系最可怕的地方不是过程多痛苦，是它在
            <strong style={{color:'#c0392b'}}>分手之后的几个月、甚至几百天里</strong>，
            每隔一段时间还来吸走你一次。一段虐恋的真实代价不是它存在的两个月，
            是它在你余下未来 100 天、200 天、500 天里的每一次反刍。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            而好的爱情是反过来的：
          </p>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              好的爱情会让你<strong>打开和开放</strong>——<br/>
              不会让你的思维收缩，<br/>
              不会让你的行动收缩，<br/>
              也不会让你的情绪收缩。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论好的关系
            </p>
          </div>

          {/* ── 压强公式 ── */}
          <h4 id="ch2-pressure" style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '3rem', marginBottom: '1rem',
                        scrollMarginTop: '40px' }}>
            压强公式 · P = F / S
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            把注意力抢回来之后，下一个问题是：放在哪里。树林给了一个非常具象的画面——
            一根细高跟为什么能把厚木板刺穿？体重没变，但接触面积小到像一根针，压强就大到能穿透。
          </p>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem' }}>压强公式</p>
            <p style={{ fontFamily: "'Playfair Display',serif",
                         color: '#2D2416', fontSize: 'clamp(2rem,4vw,3rem)',
                         letterSpacing: '0.1em', lineHeight: 1.4, fontStyle: 'italic' }}>
              <strong style={{color:'#C9A227'}}>P</strong> ={' '}
              <strong style={{color:'#C9A227'}}>F</strong> /{' '}
              <strong style={{color:'#C9A227'}}>S</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.85rem',
                         marginTop: '1rem', lineHeight: 1.8 }}>
              P = 注意力的产出　|　F = 注意力总量　|　S = 聚焦面积<br/>
              <strong style={{color:'#2D2416'}}>F 不变，S 越小，P 越大</strong>
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '2rem' }}>
            大部分人想做的事很多——读书、健身、写作、副业、考研——一天分十件事做，每件事 10% 的注意力。
            结果什么都做了一点，什么都没做出来。<strong style={{color:'#c0392b'}}>S 太大</strong>，
            每件事的压强都不足以穿透那块木板。
          </p>

          {/* ── 焦虑与最小动作 ── */}
          <h4 id="ch2-anxiety" style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                        fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem',
                        scrollMarginTop: '40px' }}>
            焦虑与最小动作
          </h4>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            压强公式还能解释焦虑——这是树林在直播里最精彩的一段：
          </p>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              焦虑的本质是<br/>
              你的注意力放在了<strong>未来</strong>——<br/>
              许多无限的未来。<br/>
              你的身体只能在当下，<br/>
              而你的脑子去到了那么远的地方。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.85rem',
                         letterSpacing: '0.15em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — "我他妈到底在哪？我快凉了。"
            </p>
          </div>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginTop: '1.5rem', marginBottom: '1rem' }}>
            用压强公式翻译就是：你的注意力被无限多个"未来时刻"分散了，
            <strong style={{color:'#c0392b'}}>S 趋于无穷大，P 趋于零</strong>——
            所以你浑身紧绷却什么都做不了。
          </p>
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '1.5rem' }}>
            解药不是"想开点"，是<strong style={{color:'#C9A227'}}>把动作缩到极小</strong>：
          </p>
          <div style={{ background: 'rgba(201,162,39,0.06)',
                          border: '1px dashed rgba(201,162,39,0.4)',
                          padding: '1.5rem 1.8rem', marginBottom: '2rem' }}>
            <p style={{ color: 'rgba(45,36,22,0.85)', fontSize: '0.95rem',
                         lineHeight: 2, fontStyle: 'italic' }}>
              你做不了高考 → 那做语文。<br/>
              做不了语文 → 那做作文。<br/>
              做不了作文 → 那做开头两句话。<br/>
              <span style={{color:'#C9A227', fontStyle:'normal'}}>
                这种总能做了吧？开头两句话写完，你已经在写作文了。
              </span>
            </p>
          </div>

          {/* 意志测试 — 完美匹配"压强压在最小面积上"的主题 */}
          <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
                       lineHeight: 1.95, marginBottom: '0.5rem' }}>
            <strong>慢即是快</strong>——把同样的注意力压在更小的面积上。
            连"按住 3 秒"都需要一整面注意力的聚焦：
          </p>

          <WillpowerTest />

          {/* 本章收束 */}
          <div style={{ marginTop: '3rem', padding: '1.8rem 2rem',
                         background: '#2D2416', borderLeft: '3px solid #C9A227' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '0.8rem' }}>本章收束</p>
            <p style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 1.95 }}>
              抢回注意力的关键，不是多做，是<strong style={{color:'#C9A227'}}>更少</strong>。<br/>
              把一件事做到，胜过同时做十件事都没结果。
            </p>
          </div>
        </div>

        {/* ── 行动卡 ── */}
        <ActionCard
          id="ch01"
          title="挑出你今天的「最小动作」"
          prompts={[
            '焦虑的解药是把 S 缩到极小：你做不了高考，那就做开头两句话。',
            '挑一个你今天就能完成的最小动作——它必须小到你不会再为它焦虑。',
          ]}
          chipsLabel="今天的最小动作（可多选）"
          chips={[
            '深蹲 5 个',
            '写 100 字',
            '发一条朋友圈',
            '读 5 页书',
            '出门走 10 分钟',
            '关闭一个 app',
            '回一个搁置的消息',
            '把一件未完成的事推进 1 步',
            '联系一个许久没联系的朋友',
            '把桌面收拾干净',
          ]}
          placeholder="或者写下：你今天准备做的那件最小的事……"
        />

        <ChapterNav current="ch01" onNav={onNav} />
      </div>
    </section>
  );
};


// ──────────────────────────────────────────────────────────────────────────
// Helpers for Part chapters
// ──────────────────────────────────────────────────────────────────────────
const PartHero = ({ partNum, partRoman, totalParts, title, subtitle, leadQuote, deco }) => (
  <div className="ra-chapter-bg"
       style={{ background: 'linear-gradient(135deg,#FAF8F3 0%,#F0EBE0 100%)',
                 padding: '6rem 3rem 4rem', position: 'relative' }}>
    {deco}
    <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
      <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.4em', marginBottom: '1.2rem' }}>
        PART {partRoman} · {partNum} / 肆
      </p>
      <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                    fontSize: 'clamp(2rem,4vw,3.2rem)',
                    color: '#2D2416', fontWeight: 400, marginBottom: '0.4rem', lineHeight: 1.3 }}>
        {title}
      </h2>
      <p style={{ fontSize: '1.2rem', color: '#8B6914', letterSpacing: '0.1em',
                   marginBottom: '2rem', fontStyle: 'italic' }}>
        {subtitle}
      </p>
      {leadQuote && (
        <div className="ra-quote" style={{ maxWidth: 620 }}>{leadQuote}</div>
      )}
    </div>
  </div>
);

const ChapterIntro = ({ num, en, title, lead }) => (
  <>
    <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                 marginBottom: '0.6rem' }}>第 {num} 章 · CHAPTER {en}</p>
    <h3 style={{ fontSize: '1.6rem', color: '#2D2416', letterSpacing: '0.05em',
                  fontWeight: 500, marginBottom: '0.5rem',
                  fontFamily: "'Playfair Display','Noto Serif SC',serif" }}>
      {title}
    </h3>
    {lead && (
      <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.9rem',
                   fontStyle: 'italic', marginBottom: '2rem' }}>
        {lead}
      </p>
    )}
  </>
);

const SubH = ({ id, children }) => (
  <h4 id={id} style={{ fontSize: '1.1rem', color: '#2D2416', letterSpacing: '0.05em',
                fontWeight: 500, marginTop: '2.5rem', marginBottom: '1rem',
                scrollMarginTop: '40px' }}>
    {children}
  </h4>
);

const Para = ({ children, style }) => (
  <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.95rem',
               lineHeight: 1.95, marginBottom: '1.4rem', ...style }}>
    {children}
  </p>
);

const ChapterClose = ({ children }) => (
  <div style={{ marginTop: '3rem', padding: '1.8rem 2rem',
                  background: '#2D2416', borderLeft: '3px solid #C9A227' }}>
    <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                 marginBottom: '0.8rem' }}>本章收束</p>
    <p style={{ color: '#FAF8F3', fontSize: '1rem', lineHeight: 1.95 }}>
      {children}
    </p>
  </div>
);

const PullQuote = ({ num, label, children, attr }) => (
  <div style={{ margin: '5rem 0', padding: '4rem 2rem',
                  background: 'linear-gradient(135deg, #14100a 0%, #1a1208 100%)',
                  textAlign: 'center', position: 'relative', overflow: 'hidden',
                  borderTop: '1px solid rgba(201,162,39,0.3)',
                  borderBottom: '1px solid rgba(201,162,39,0.3)' }}>
    <div style={{ position: 'absolute', left: '1rem', top: '0.5rem',
                   color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                   letterSpacing: '0.3em' }}>PULL QUOTE · {num}</div>
    <div style={{ position: 'absolute', right: '1rem', bottom: '0.5rem',
                   color: 'rgba(201,162,39,0.4)', fontSize: '0.65rem',
                   letterSpacing: '0.3em' }}>{label}</div>
    <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                 color: '#FAF8F3', fontSize: 'clamp(1.4rem, 3.2vw, 2.2rem)',
                 lineHeight: 1.7, fontStyle: 'italic', maxWidth: 600, margin: '0 auto' }}>
      {children}
    </p>
    {attr && (
      <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: '0.8rem',
                   letterSpacing: '0.4em', marginTop: '2rem' }}>
        — {attr}
      </p>
    )}
  </div>
);

// ── Part II · 中篇 · 身体 ─────────────────────────────────────────────────────
const Ch02Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <PartHero partNum="贰" partRoman="II" title="身体的物理学"
                subtitle="人首先是一台烧炭的机器"
                deco={<HeroDecoCh02 />}
                leadQuote={<>
                  人首先是一台烧炭的机器，<br/>
                  然后才是一台思考的机器。<br/>
                  <strong style={{ color: '#2D2416' }}>一切赚钱、幸福、深度行动的能力，都建立在身体能量供给之上。</strong>
                </>} />

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* CHAPTER 3 · 人是烧炭的机器 */}
        <div id="ch3-burning" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="三" en="THREE" title="人是烧炭的机器"
                        lead='"人的本质是烧炭的机器。你的本质，其实你就是个烧炭的。"' />

          <Para>
            所有的鸡汤都告诉你：要有梦想、要有意志、要有计划。但树林讲了一个更底层、也更冒犯的真相——
            <strong style={{color:'#2D2416'}}>所有这些都建立在你这台机器还在烧炭。</strong>
          </Para>
          <Para>
            葡萄糖、脂肪、蛋白质，三种"炭"被氧化释放化学能，转换成 ATP。高能磷酸键断裂，能量出来——
            这才是你能思考、能行动、能"有执行力"的物质基础。这不是文学修辞，
            <strong style={{color:'#C9A227'}}>它是字面意义上的：你以为你在思考，其实是你的细胞在烧炭。</strong>
          </Para>

          <SubH id="ch3-lottery">基因彩票</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              有钱人就是<strong>中基因彩票</strong>了——<br/>
              他们的 ATP 先天就比更多人更多。<br/>
              能量供给更多，<strong>烧不完的能量</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论 ATP
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            "性能量"不只是性欲。它驱动出来的是五件事：<strong>性欲、探索欲、攻击性、表达欲、食欲</strong>。
            如果你长时间没有食欲、没有表达欲、没有探索欲，本质就是身体的消化和恢复系统出了问题——能量底子塌了。
          </Para>
          <Para>
            这就解释了一个让所有人都不舒服的现象：<strong>为什么"努力"对某些人是天然的，对另一些人是反人性的？</strong>
            不是意志问题，是底层供能系统的差异。
            一个 ATP 充足的人，思考有惯性，行动有惯性，野心有惯性。一个 ATP 不足的人，光是从床上爬起来就要消耗大量意志力。
          </Para>

          <SubH id="ch3-bloodsugar">血糖与前额叶</SubH>
          <Para>
            这一章里树林反复强调一个被低估的杠杆——<strong>血糖</strong>。原因很物理：
          </Para>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '1.5rem 2rem', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(45,36,22,0.85)', fontSize: '0.95rem', lineHeight: 1.95 }}>
              <strong style={{color:'#c0392b'}}>血糖一波动 → 前额叶下线</strong><br/>
              前额叶是控制理性、决策、长期规划的；前额叶一死，<strong style={{color:'#c0392b'}}>杏仁核</strong>
              （恐惧、焦虑、性欲的中心）就上线。所以一个血糖剧烈波动的人，会持续处在焦虑、易怒、决策能力差的状态。
              他自己以为是"心态不好"——其实是身体在告诉他，能量底子塌了。
            </p>
          </div>
          <Para>
            更细的：<strong>饿、性欲、焦虑这三件事是一体的</strong>。你饿的时候性欲会增强、焦虑也会增强。
            所以稳定饮食、平稳血糖，是稳定情绪的物理基础，不是心理建设。
          </Para>

          <SubH>身体决定大脑</SubH>
          <Para>
            这一章最反"心灵鸡汤"的命题是——你的所有思维、感受、决策能力，都建立在身体能量供给之上。
            一个 ATP 不够、血糖剧烈波动、长期睡眠不足的人，无论看多少书、听多少道理，都很难有真正的执行力。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你不是因为<strong>想清楚了</strong>才去运动，<br/>
              是因为你<strong>运动了</strong>才想得清楚。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 能量先于认知，身体先于心智
            </p>
          </div>
          <ChapterClose>
            所有"我应该……但我做不到"，<br/>
            <span style={{color:'#C9A227'}}>多半不是意志问题——是炭不够。先把这台机器养护好。</span>
          </ChapterClose>
        </div>

        {/* CHAPTER 4 · 高酮、多巴胺与攻击性 */}
        <div id="ch4-androgen" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="四" en="FOUR" title="高酮、多巴胺与攻击性"
                        lead='"当你的生命能量高了，你自然就外放外溢。"' />

          <Para>
            上一章讲了能量从何而来。这一章讲：<strong>能量怎么变成对外的攻击性、表达欲、行动力</strong>——
            以及为什么"内耗"的人本质上是能量不足。
          </Para>

          <SubH id="ch4-60line">60 分这条线</SubH>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem' }}>生命能量的 60 分线</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.3rem,2.5vw,1.8rem)',
                         letterSpacing: '0.05em', lineHeight: 1.6 }}>
              60 分以下：<strong style={{color:'#c0392b'}}>内耗</strong>　|
              60 分以上：<strong style={{color:'#C9A227'}}>外耗</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.88rem',
                         lineHeight: 1.9, fontStyle: 'italic', marginTop: '1rem' }}>
              "60 分以下，你这个人就会疯狂地内耗。<br/>
              60 分以上，就会大量地外耗。如果你是 90 分，你就疯狂外耗。"
            </p>
          </div>
          <Para>
            60 分以下的人，是<strong style={{color:'#c0392b'}}>"审判席思维"</strong>——他不光自己审判自己，
            还要请孔子苏格拉底来一起审判。任何他这一生学过的"正确道理"，都成了攻击他的武器。
            能量低的时候，外界的一切都在否定他。
          </Para>
          <Para>
            60 分以上的人是反过来的——<strong style={{color:'#C9A227'}}>"游乐场思维"</strong>。
            树林举的例子是特朗普：你有问题，都是你们的问题，我美国赢了。这不是疯，是配得感拉满。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              他把这个世界当游乐场，<br/>
              他的能量太高了。<br/>
              任何人的负面评价、诋毁、攻击，<br/>
              都<strong>不进入他的自我评价</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论高能量者
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            同样一句"你不行"——能量低的人会把它收进自己反复反刍；能量高的人会把它弹回去，"你才不行"。
            <strong style={{color:'#C9A227'}}>区别不在心态，在 ATP。</strong>
          </Para>

          <SubH>高酮与攻击性</SubH>
          <Para>
            具体到激素层面，树林讲到一个被忽视的关键——<strong>睾酮</strong>。
            睾酮高的人攻击性高，会更不恐惧这个世界，敢冒犯他人。睾酮低的人——典型是日本"平成废宅"
            ——肌肉萎缩、神经系统习惯了待在家里、惯性越来越大。
          </Para>
          <Para>
            而提升睾酮最快的方式有两个：<strong style={{color:'#C9A227'}}>深蹲和跑步</strong>。
            这就是为什么树林反复说："不敢卖东西？兄弟，你需要深蹲。""不敢发朋友圈？深蹲。"
            ——不是开玩笑。这是把"勇气"翻译成了一个具体的、物理的、可干预的指标。
          </Para>

          <SubH id="ch4-five">五种在线</SubH>
          <Para>当一个人能量真的高起来之后，会有五件事同时"在线"：</Para>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))',
                          gap: '0.8rem', marginBottom: '1.5rem' }}>
            {[
              { n:'01', label:'性欲', desc:'不是猥琐，是身体的活力指标' },
              { n:'02', label:'探索欲', desc:'总想去新的地方、试新的事' },
              { n:'03', label:'攻击性', desc:'敢冒犯、敢拒绝、敢说不' },
              { n:'04', label:'表达欲', desc:'有话要说、有作品要发' },
              { n:'05', label:'食欲', desc:'能吃、消化好、对食物有兴趣' },
            ].map(item => (
              <div key={item.n}
                    style={{ background: '#fff', border: '1px solid rgba(45,36,22,0.1)',
                              padding: '1.2rem', borderTop: '3px solid #C9A227' }}>
                <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                  {item.n}
                </span>
                <p style={{ color: '#2D2416', fontSize: '1.05rem', fontWeight: 500,
                              marginTop: '0.4rem', marginBottom: '0.3rem' }}>
                  {item.label}
                </p>
                <p style={{ color: 'rgba(45,36,22,0.6)', fontSize: '0.82rem',
                              lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <Para>
            这五件事中只要有一件长期不在线，就是身体在告诉你：<strong style={{color:'#c0392b'}}>能量塌了</strong>。
          </Para>

          <SubH>内耗是一种能量状态</SubH>
          <Para>
            所有"内耗"的真相，是当一个人能量不够外放的时候，
            <strong>所有注意力会被迫往内：审视自己、批判自己、复盘过去、焦虑未来</strong>。
            这不是性格，是注意力没有去向。
          </Para>
          <Para>
            摆脱内耗的方式不是"想开点"——是把能量先升上来。
            <strong style={{color:'#C9A227'}}>睡眠、饮食、运动、晒太阳</strong>，
            这四件事会自动让你从内耗滑向外耗。
          </Para>

          <ChapterClose>
            <span style={{color:'#C9A227'}}>能量高的人冒犯世界，能量低的人审判自己。</span><br/>
            要外耗，先把炭烧起来。
          </ChapterClose>
        </div>

        {/* PULL QUOTE 02 · 论默认网络 */}
        <PullQuote num="02" label="论 默 认 网 络" attr="树林">
          你为什么<strong style={{color:'#C9A227', fontStyle:'normal'}}>深夜 EMO</strong>？<br/>
          因为白天能量耗尽了，<br/>
          你的注意力<br/>
          再也<strong style={{color:'#C9A227', fontStyle:'normal'}}>没地方可以去了</strong>。
        </PullQuote>

        {/* CHAPTER 5 · DMN 默认网络 */}
        <div id="ch5-dmn" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="五" en="FIVE" title="DMN 默认网络"
                        lead='"晚上的 EMO 就是这样：白天能量耗尽，DMN 启动，开始 4 小时的自我攻击。"' />

          <Para>
            这是直播里最技术、也最戳人的一章。<strong>那些深夜里把你拽进去的痛苦，本质是大脑里一个叫
            DMN 的网络在运行</strong>。理解它，你就能阻断它。
          </Para>

          <SubH>一个中性网络</SubH>
          <Para>
            <strong>DMN（默认网络）</strong>，是大脑在"漫游"状态下激活的神经回路。
            它本身是中性的——很多有灵感的人、文思泉涌的人，启动的也是 DMN。
            <strong style={{color:'#C9A227'}}>问题在于：它启动的时候你是什么能量状态。</strong>
          </Para>
          <Para>
            能量高的时候，DMN 让你发散、有灵感、有创造；能量低的时候，DMN 让你坠入三件事——
          </Para>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.8rem',
                          marginBottom: '1.5rem' }}>
            {[
              { n:'1', label:'叙事', desc:'我是谁，我从哪来，我要到哪去。开始追问意义。' },
              { n:'2', label:'比较', desc:'刷别人的朋友圈，看别人多厉害，回过头审视自己有多差。' },
              { n:'3', label:'自我批判', desc:'我太菜了，我太烂了，我配不上。' },
            ].map(item => (
              <div key={item.n}
                    style={{ background: '#fdf0ed', border: '1px solid rgba(192,57,43,0.2)',
                              padding: '1.2rem' }}>
                <span style={{ color: '#c0392b', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.75rem', letterSpacing: '0.2em' }}>
                  STEP {item.n}
                </span>
                <p style={{ color: '#2D2416', fontSize: '1rem', fontWeight: 500,
                              marginTop: '0.4rem', marginBottom: '0.3rem' }}>
                  {item.label}
                </p>
                <p style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.82rem',
                              lineHeight: 1.7 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <Para>
            这就是<strong style={{color:'#c0392b'}}>深夜 EMO 的三步曲</strong>。它有非常清晰的物理学原因：
            白天太阳没晒够，血清素不足；晚上血清素无法转化为褪黑素，你睡不着。
            睡不着的时候你刷短视频，音乐让你的情绪剧烈起伏，多巴胺被反复消耗。
            等你想睡的时候，能量已经枯竭了，你没力气向外，注意力被迫向内。
            <strong>DMN 启动。</strong>
          </Para>

          <SubH>启动后的两条路</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              我 DMN 一启动我就<strong>开始写东西</strong>，<br/>
              写完我就立马发公众号。<br/><br/>
              你 DMN 一启动开始<strong>骂自己</strong>——<br/>
              我是废物，我是垃圾，我废了。<br/>
              4 小时结束，<br/>
              <strong>你的任何资产都没积累</strong>。<br/>
              我 3-4 个小时，4 篇文章都写出来了。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论 DMN 启动后的两条路
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            这一段戳到的是：<strong>同样的时间、同样的 DMN 启动，能量高的人在产出资产，能量低的人在消耗自己。</strong>
          </Para>

          <SubH id="ch5-block">阻断 DMN 的方法</SubH>
          <Para>
            DMN 的可怕之处在于它会自我循环——你越自我攻击，能量越低；能量越低，越无法外耗；
            越无法外耗，注意力越往内；越往内，攻击越深。<strong>这是一个螺旋下降。</strong>
          </Para>
          <Para>
            阻断它的方法不是"想开点"——你越想越深。是<strong style={{color:'#C9A227'}}>动作</strong>。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你<strong>多想都没用</strong>——<br/>
              因为你想也是在语言里面循环你自己。<br/>
              你只有<strong>行动</strong>才能阻断。<br/>
              就站起来做个<strong style={{color:'#C9A227', fontStyle:'normal'}}>深蹲</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            动作的物理意义是：它强行打断了你大脑当前的循环。
            一个深蹲提升睾酮，让攻击性回升；一次跑步消耗多巴胺，让你重新有"奖赏待遇"；
            一次写作，把内耗的能量转化为外耗的输出。
          </Para>
          <Para>
            这就是为什么树林给所有 IP 营学员的硬规定是：
            <strong style={{color:'#C9A227'}}>每天打卡、每天锻炼、每天输出</strong>。
            不是为了产出本身，是为了不让你的 DMN 把你吃掉。
          </Para>

          <SubH>用 DMN 而不是被 DMN 用</SubH>
          <Para>
            树林讲了一个反向用法。他自己 DMN 启动的时候，会做四件事：
            <strong>问自己今天要做什么、明天后天的计划、反思过去做对做错、立刻记录下来</strong>。
            这是把同一个 DMN 网络从"自我攻击模式"切换到"规划反思模式"。
          </Para>
          <Para>
            关键的差别是：他在反思的时候<strong style={{color:'#C9A227'}}>不批判自己</strong>。
            "哪个事做错了，让我有什么损失，未来避免就好。"——而不是"我怎么这么烂"。
            这不是情绪管理技巧，是一个人在自己面前的尊严。
          </Para>

          <ChapterClose>
            深夜 EMO 不是性格——是 DMN 启动 + 能量耗尽。<br/>
            <span style={{color:'#C9A227'}}>阻断它的不是想，是动。</span>
          </ChapterClose>
        </div>

        <ActionCard
          id="ch02"
          title="今晚 / 明天先做的一件「上能量」的事"
          prompts={[
            '能量先于认知。摆脱内耗的不是想，是动。',
            '挑一件你今晚 / 明天起就能做、能让你能量上来的事。',
          ]}
          chipsLabel="一件能让你「炭烧起来」的事（可多选）"
          chips={[
            '今晚 11 点前睡',
            '明早晒 10 分钟太阳',
            '深蹲 20 个',
            '跑步 / 散步 30 分钟',
            '吃一顿正经的早饭',
            '断糖 1 天',
            '把短视频 app 卸载',
            '把社交软件设静音',
            '今晚关掉手机网络',
            'DMN 启动时先做 5 个深蹲再说',
          ]}
          placeholder="或者写下你的具体做法……"
        />

        <ChapterNav current="ch02" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Part III · 下篇 · 商业 ────────────────────────────────────────────────────
const Ch03Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <PartHero partNum="叁" partRoman="III" title="商业世界的真相"
                subtitle="资本如何进化，你又被怎样剥削"
                deco={<HeroDecoCh03 />}
                leadQuote={<>
                  这个世界一直在剥削你——<strong style={{ color: '#2D2416' }}>只是手法越来越精细</strong>。<br/>
                  从你的土地，到你的劳动力，<br/>
                  到你的注意力，到你未来的钱。
                </>} />

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* CHAPTER 6 · 资本演进史 */}
        <div id="ch6-capital" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="六" en="SIX" title="资本演进史：从地主到注意力"
                        lead='"第一阶段拿走你的土地。第四阶段——拿走你未来的钱。"' />

          <Para>
            这一章是树林整场直播里最有结构感的一段——他用四个时代讲清楚了
            <strong>"剥削"这件事是怎样从粗暴变得精细</strong>。
          </Para>

          <SubH id="ch6-stages">四个阶段</SubH>
          <div style={{ marginBottom: '2rem' }}>
            {[
              { n:'壹', en:'I', age:'地主阶级', what:'粮食剩余',
                desc:'农民最开始是有地的。但有人不擅长积累，有多少吃多少。一遇荒年要借高利贷，利滚利还不上就拿田来抵。土地慢慢聚集到 1-5 个人手里。' },
              { n:'贰', en:'II', age:'工厂主', what:'劳动剩余',
                desc:'你工作 10 个小时，我给你 2 个小时的钱，剩下的 8 个小时是我的超额利润。同时我提供工具、场地、确定性。' },
              { n:'叁', en:'III', age:'信息时代', what:'注意力',
                desc:'你工作时间的剩余已经被剥完了。但他们发现你休息的时间还有大量注意力。于是有了短视频、有了广告、有了你下班还在刷的算法。' },
              { n:'肆', en:'IV', age:'平台时代', what:'未来现金流',
                desc:'更恐怖的是：今天的钱用完了，明天的钱也给我用了。每一个平台——阿里、字节、美团、滴滴——都有小额贷，利率 24%。"消费贷正常 3-4%，24% 就是抢你的钱。"' },
            ].map((s, i) => (
              <div key={i}
                    style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem 0',
                              borderBottom: '1px dashed rgba(201,162,39,0.25)',
                              alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 70 }}>
                  <div style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                                  fontSize: '2.4rem', color: '#C9A227',
                                  fontWeight: 700, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ color: 'rgba(45,36,22,0.4)', fontSize: '0.65rem',
                                  letterSpacing: '0.2em', marginTop: '0.3rem' }}>
                    {s.en}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem',
                                  marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem', color: '#2D2416', fontWeight: 500 }}>{s.age}</span>
                    <span style={{ fontSize: '0.75rem', color: '#C9A227',
                                    letterSpacing: '0.15em', marginLeft: 'auto' }}>
                      剥削 · {s.what}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.9rem',
                                lineHeight: 1.85 }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <SubH>现代人的处境</SubH>
          <Para>把四个阶段叠在一起，你会发现现代年轻人的处境是：</Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              生产资料没有，<br/>
              注意力萎缩 <strong>10 秒</strong>钟打断一次，<br/>
              欠未来的钱欠一辈子，<br/>
              每天都在焦虑怎么还钱。<br/>
              <strong>凭什么翻身呢？</strong>
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论现代年轻人
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            这一段读完会让人沉默一会儿。它不是在说"这是平台的错"——树林在这里反而非常克制。
            核心是：<strong style={{color:'#2D2416'}}>剥削的精细化是这个时代的常态。</strong>
            不是有谁在害你，是整个系统天然地、自然选择地，越来越擅长拿走你最值钱的东西——
            而你最值钱的东西，今天是<strong style={{color:'#C9A227'}}>注意力</strong>。
          </Para>

          <SubH>翻身的唯一路径</SubH>
          <Para>
            那怎么办？树林给的答案非常简单——<strong>从被剥削方变成剥削方</strong>。这不是道德问题，是结构问题。
            在一个所有人都在抢注意力的时代，你要么做"刷别人"的人，要么做"被刷"的人。
          </Para>
          <Para>
            而做"刷别人"的人最直接的方式，是<strong style={{color:'#C9A227'}}>封装内容、发出去、让陌生人看到</strong>。
            这就是为什么树林反复讲"封装能力"——不是教你做自媒体，是教你从生态链底层往上爬一层。
          </Para>

          <ChapterClose>
            历史在迭代剥削的精度。<br/>
            <span style={{color:'#C9A227'}}>你今天最值钱的资产是注意力——别人都知道，只有你不在乎。</span>
          </ChapterClose>
        </div>

        {/* CHAPTER 7 · 杠杆思维与陌生人交易 */}
        <div id="ch7-leverage" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="七" en="SEVEN" title="杠杆思维与陌生人交易"
                        lead='"你在县城洗碗 3000，杭州 7000，日本 2 万，美国 5 万——为什么？"' />

          <SubH id="ch7-network">服务社会网络的价格</SubH>
          <Para>
            同样是洗碗这个动作。在县城你赚 3000，在杭州你赚 7000，在日本你赚 2 万，在美国你赚 5 万。
            <strong style={{color:'#C9A227'}}>差别不在动作本身，在你服务的社会网络的价值。</strong>
          </Para>
          <Para>
            县城里最高工资可能也就一万出头；杭州里你可能不小心服务的就是某个 AI 公司的合伙人，
            他创造的价值是十亿百亿级的。你的"洗碗"在不同网络里被定价不同——
            因为这个网络里的人在产出多大的价值，你就分走多大价值的一小部分。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你服务<strong>越贵的社会网络</strong>，<br/>
              你的价格就越贵。<br/>
              这就是为什么很多人讨厌"找贵人"这个词——<br/>
              但客观来说就是这么回事。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论社会网络
            </p>
          </div>

          <SubH id="ch7-leverage-types">杠杆是什么 · 五代杠杆</SubH>
          <Para>这就引出了杠杆的本质——<strong style={{color:'#C9A227'}}>用一份注意力影响更多人</strong>。</Para>
          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { n:'1', age:'蒸汽机', what:'外包了人的体力', mult:'世界快了 10 倍' },
              { n:'2', age:'电气时代', what:'外包了信息传递', mult:'公司从几百人扩到几千人' },
              { n:'3', age:'信息时代', what:'外包了即时通讯', mult:'亚马逊 200 万员工属于一个人' },
              { n:'4', age:'IP 时代', what:'外包了"在场"', mult:'全国的人都能在直播间听你' },
              { n:'5', age:'AI 时代', what:'外包了"智能"', mult:'一个人指挥 10 个 agent 干 10 个人的活' },
            ].map(s => (
              <div key={s.n}
                    style={{ display: 'flex', alignItems: 'baseline', gap: '1rem',
                              padding: '0.8rem 0',
                              borderBottom: '1px solid rgba(45,36,22,0.06)' }}>
                <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.85rem', letterSpacing: '0.2em',
                                fontWeight: 600, minWidth: 28 }}>
                  0{s.n}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.8rem',
                                  flexWrap: 'wrap' }}>
                    <span style={{ color: '#2D2416', fontSize: '1rem', fontWeight: 500 }}>{s.age}</span>
                    <span style={{ color: 'rgba(45,36,22,0.65)', fontSize: '0.88rem' }}>
                      {s.what}
                    </span>
                  </div>
                  <p style={{ color: '#8B6914', fontSize: '0.78rem',
                                fontStyle: 'italic', marginTop: '0.2rem' }}>
                    → {s.mult}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              你今天如果不使用杠杆，<br/>
              你就是一个劳力赚<strong>一份钱</strong>。<br/>
              如果你使用杠杆，你就有机会赚<br/>
              <strong style={{color:'#C9A227', fontStyle:'normal'}}>一万份钱、十万份钱</strong>。
            </p>
          </div>

          <SubH id="ch7-strangers">陌生人比熟人贵</SubH>
          <Para>
            但杠杆要起效，前提是你不怕陌生人。这是大部分人卡住的地方。你不敢发朋友圈，不敢发短视频——
            本质都是<strong style={{color:'#c0392b'}}>恐惧陌生人怎么看你</strong>。但树林反向给了一个判断：
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              跟你们太熟<strong>不是好事</strong>，<br/>
              因为熟人就<strong>不好卖</strong>了。<br/>
              你能让你最好的兄弟<br/>给你花 2000 块钱吗？<br/>
              很难。熟人会伤害你们之间的感情。<br/>
              陌生人你们的关系就<strong>很纯粹</strong>——<br/>
              只有交易，1V1，买卖就买卖。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论陌生人
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            真正赚钱的关系往往不是熟人。熟人之间所有的钱都裹在情感里、人情里、不好意思里——不好变现。
            陌生人之间是最简洁的："我提供什么、你付多少钱"。
            <strong style={{color:'#C9A227'}}>朋友是用来共度的，陌生人才是用来共事的。</strong>
          </Para>

          <SubH>黑粉是最贵的注意力</SubH>
          <Para>
            更反直觉的是——树林说他爱黑粉。不是反讽。<strong>黑粉是最持续看你的人</strong>。
            粉丝看一段时间会走，黑粉每天都在看。他们投入到你身上的注意力总量，远远超过普通粉丝。
            而且黑粉一旦松动，他的反向能量会非常巨大——
            <strong style={{color:'#C9A227'}}>"嘴上骂你的人，心里全都是你。"</strong>
          </Para>

          <ChapterClose>
            赚钱的两条腿：<span style={{color:'#C9A227'}}>杠杆 + 陌生人</span>。<br/>
            没有杠杆你只是劳力；恐惧陌生人，杠杆就拉不起来。
          </ChapterClose>
        </div>

        {/* CHAPTER 8 · 营销不邪恶 */}
        <div id="ch8-marketing" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="八" en="EIGHT" title="营销不邪恶"
                        lead='"你不讨厌营销，你讨厌过度营销 + 垃圾产品。"' />

          <SubH>营销是什么</SubH>
          <Para>
            "营销"在大部分人的语境里是一个贬义词。这一章树林做了一件简单但少有人做的事——
            <strong>把"营销"这个词从道德判断里拎出来，还它一个中性的位置。</strong>
          </Para>
          <Para>
            营销不是骗人。<strong style={{color:'#C9A227'}}>营销是让有需要的人知道有这个东西。</strong>
            你出门买一桶油、一瓶水，别人卖给你你不会觉得难受——因为你需要。
            难受的是别人硬塞给你你不需要的东西，且这个东西非常垃圾。
            真正讨厌的不是"营销"，是<strong style={{color:'#c0392b'}}>过度营销 + 垃圾产品</strong>。
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              如果你对营销恐惧、讨厌、反感——<br/>
              你就对<strong>叫卖</strong>恐惧。<br/>
              这个时代是一个<strong>每天都在叫卖的时代</strong>。<br/>
              事实上你只是<strong style={{color:'#C9A227', fontStyle:'normal'}}>不允许自己活在这个时代</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论营销中性化
            </p>
          </div>

          <SubH id="ch8-cantsell">你为什么不敢卖</SubH>
          <Para>
            大部分人卖不出去东西，<strong>根因不是营销技巧，是他觉得"卖"这件事冒犯了别人</strong>。
            这种"觉得冒犯"的内心戏会反复上演：我要不要发？发了别人会怎么看？会不会觉得我功利？
            我想了一小时，最后没发——这一小时就这么没了。
          </Para>
          <Para>树林的判断很狠：</Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              当你觉得卖是一件很恶心的事情的时候，<br/>
              你会进入一种<strong>语言的想象</strong>——<br/>
              我冒犯了他们，他们会反感我。<br/>
              然后你不停的想，最后说算了，还是不卖了。<br/>
              这一刻，你<strong style={{color:'#C9A227', fontStyle:'normal'}}>高酮不够，攻击性不够</strong>，<br/>
              你就没有办法走出那一步。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论不敢卖
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            所以"不敢卖"在树林这里又被翻译成了一个物理问题——睾酮不足、攻击性不足。
            <strong style={{color:'#C9A227'}}>解药还是那两个字：深蹲、跑步。</strong>
          </Para>

          <SubH>卖课是提供确定性</SubH>
          <Para>这一章里树林最坦诚的一段，是他自己解释为什么要卖课：</Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              今天为什么你们买了我的课？<br/>
              就是我来给你<strong>提供确定性</strong>。<br/>
              我说你们进了这个群，关于 AI 的信息<br/>
              就<strong>不用再 FOMO 了</strong>，以我为准。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论卖课的本质
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            这是一个非常重要的视角——<strong style={{color:'#C9A227'}}>课程的本质是把不确定性打包成确定性</strong>。
            一个人花几千块买一个课，他买的不是知识本身（知识网上都有），他买的是"我不用再 FOMO 了"——
            一种被锚定的确定感。
          </Para>

          <ChapterClose>
            你不讨厌营销，你只是没把它和"过度营销 + 垃圾产品"分开。<br/>
            <span style={{color:'#C9A227'}}>敢卖，是攻击性的物理表现。</span>
          </ChapterClose>
        </div>

        <ActionCard
          id="ch03"
          title="本周 / 本月「敢卖」一次"
          prompts={[
            '不敢卖、不敢发、不敢报价——本质是攻击性不够。',
            '挑一件你今天 / 本周 / 本月就能"卖"出去的东西。',
          ]}
          chipsLabel="敢卖的最小动作（可多选）"
          chips={[
            '在朋友圈发一次自我推荐',
            '把作品定个价发出去',
            '主动报一次咨询',
            '把产品挂上链接',
            '群发一次小广告',
            '主动开个价',
            '给自己加薪谈一次',
            '面对陌生人卖一次',
            '把封装好的东西发出去',
            '不删 · 不修 · 直接发',
          ]}
          placeholder="或者写下你这次准备卖的东西……"
        />

        <ChapterNav current="ch03" onNav={onNav} />
      </div>
    </section>
  );
};

// ── Part IV · 终篇 · AI 时代与心力 ────────────────────────────────────────────
const Ch04Page = ({ onNav }) => {
  return (
    <section style={{ background: '#FAF8F3', minHeight: '100vh' }}>
      <PartHero partNum="肆" partRoman="IV" title="AI 时代与心力"
                subtitle="智能将平价，护城河是审美与心力"
                deco={<HeroDecoCh04 />}
                leadQuote={<>
                  当智能即将平价，护城河是什么？<br/>
                  <strong style={{ color: '#2D2416' }}>审美。心力。诚意正心。</strong>
                  <br/>
                  以及一个 28 岁的人停更大半年之后想明白的所有事。
                </>} />

      <div style={{ padding: '4rem 3rem', maxWidth: 800, margin: '0 auto' }}>

        {/* PULL QUOTE 03 · 论 AI 代差 */}
        <PullQuote num="03" label="论 A I 代 差" attr="树林">
          我使用 <strong style={{color:'#C9A227', fontStyle:'normal'}}>Claude</strong> 的第一天，<br/>
          我就觉得——<br/>
          我得考虑一下我的<strong style={{color:'#C9A227', fontStyle:'normal'}}>能力</strong>，<br/>
          如果没有了，<br/>
          该怎么办了。
        </PullQuote>

        {/* CHAPTER 9 · AI 代差与审美护城河 */}
        <div id="ch9-ai" style={{ scrollMarginTop: '40px' }}>
          <ChapterIntro num="九" en="NINE" title="AI 代差与审美护城河"
                        lead='"100 条枪打 4 亿人。马克沁机枪面前，骑兵冲锋有什么用？"' />

          <SubH>一个顶尖 IP 的投降</SubH>
          <Para>
            树林讲他第一次用 Claude 的体验，是这场直播里<strong>最刺人的一段</strong>：
          </Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              我使用 Claude 的第一天<br/>
              我就觉得——<br/>
              我得考虑一下我的能力，<br/>
              如果没有了该怎么办了。<br/><br/>
              在我跟它聊天的 10 轮对话里面，<br/>
              至少有 1 到 2 轮我会感觉<br/>
              <strong>这个人的表达能力比我更强</strong>。<br/>
              我已经是我这行业里的 1%，<br/>
              是半个天之骄子。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　第一次用 Claude
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            这种坦诚比"AI 多厉害"的鸡汤狠 100 倍——
            <strong style={{color:'#2D2416'}}>因为这是一个靠表达吃饭的人，承认机器在他最强的领域已经追上了他。</strong>
          </Para>

          <SubH id="ch9-replaced">谁会被替代</SubH>
          <Para>树林给了非常具体的判断。他的公司里：</Para>
          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { date:'2024.03', what:'GPT 出图功能上线第三天，他裁掉了一个美工。' },
              { date:'2024.07', what:'Gemini 出图（banana）的时候，剩下的设计师跟他说"我感觉我要被取代了"。' },
              { date:'2025.04', what:'GPT-4 出图能力让最后一个设计师也离职了。' },
              { date:'已发生', what:'程序员 / 前端、PPT / 文书、初级文案、客服、销售——全部都在被替代的路上。' },
            ].map((s, i) => (
              <div key={i}
                    style={{ display: 'flex', gap: '1rem', padding: '0.9rem 0',
                              borderBottom: '1px dashed rgba(192,57,43,0.2)',
                              alignItems: 'flex-start' }}>
                <span style={{ color: '#c0392b', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.78rem', fontWeight: 600,
                                letterSpacing: '0.1em', minWidth: 70 }}>
                  {s.date}
                </span>
                <p style={{ color: 'rgba(45,36,22,0.78)', fontSize: '0.92rem',
                              lineHeight: 1.85 }}>{s.what}</p>
              </div>
            ))}
          </div>
          <Para><strong style={{color:'#c0392b'}}>不是危言耸听。是已经发生。</strong></Para>

          <SubH>不用 AI 就是落后</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              AI 今天不是给老年人、中年人设计的，<br/>
              就是给<strong style={{color:'#C9A227', fontStyle:'normal'}}>年轻人</strong>。<br/>
              但只有很少的年轻人开始非常热情地、<br/>
              积极地使用 AI。<br/><br/>
              这是一个<strong>时间差</strong>——<br/>
              等到每个人都充分跟 AI 聊天了，<br/>
              这个智能的<strong>信息差就没有了</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论 AI 时间差
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            他建议的最低投入：<strong style={{color:'#C9A227'}}>每月 3000-5000 块花在 AI 上</strong>
            （不是给他，是充 GPT、Gemini、Claude 的会员，或者只充一个就 Claude）。
          </Para>

          <SubH id="ch9-taste">审美是最后的护城河</SubH>
          <Para>那当智能完全平价之后，护城河是什么？树林给的答案是：<strong style={{color:'#C9A227'}}>审美</strong>。</Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              <strong>审美能力</strong>才是这里面最重要的——<br/>
              对文字的审美，对图片的审美。<br/>
              本质上这一切就是你<br/>
              <strong style={{color:'#C9A227', fontStyle:'normal'}}>经常看到美的东西</strong>。<br/><br/>
              很多人为什么不觉得这个文字好？<br/>
              因为他<strong>看不出来</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论审美
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            AI 一句话能生成万事万物——文案、产品、图片。但
            <strong style={{color:'#2D2416'}}>判断这个生成结果是好是坏，需要审美</strong>。
            审美不是天赋，是长期高密度暴露在好东西里的结果。所以未来的核心能力，可能不是"会用 AI"——大家都会。
            而是<strong style={{color:'#C9A227'}}>"知道什么是好的"</strong>。
          </Para>

          <ChapterClose>
            AI 时代的代差比工业革命更狠。<br/>
            <span style={{color:'#C9A227'}}>最后留下来的不是会用工具的人，是知道什么是好的人。</span>
          </ChapterClose>
        </div>

        {/* CHAPTER 10 · 八步循环链 */}
        <div id="ch10-loop" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="十" en="TEN" title="世界观→结果：八步循环链"
                        lead='"你有什么世界观，就有什么思维。然后这个结果反过来塑造你的世界观。"' />

          <SubH id="ch10-eight">八步循环</SubH>
          <div style={{ background: '#fff', border: '1px solid rgba(201,162,39,0.3)',
                          padding: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1.5rem' }}>世界观 → 结果 · 八步循环链</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem',
                            alignItems: 'center' }}>
              {['世界观','思维','判断','决定','行动','习惯','结果','社会网络'].map((s, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <span style={{ fontFamily: "'Playfair Display',serif",
                                    fontSize: '0.7rem', color: '#C9A227',
                                    letterSpacing: '0.2em', minWidth: 28, textAlign: 'right' }}>
                      0{i+1}
                    </span>
                    <span style={{ color: '#2D2416', fontSize: '1.05rem',
                                    fontWeight: i === 0 || i === 7 ? 600 : 400,
                                    letterSpacing: '0.05em' }}>
                      {s}
                    </span>
                  </div>
                  {i < 7 && (
                    <span style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem' }}>↓</span>
                  )}
                </React.Fragment>
              ))}
              <span style={{ color: 'rgba(201,162,39,0.6)', fontSize: '0.7rem',
                              letterSpacing: '0.2em', marginTop: '0.6rem',
                              fontStyle: 'italic' }}>
                ↻ 闭环 · 反塑世界观
              </span>
            </div>
          </div>
          <Para>
            这个链条最可怕的不是它的存在，是<strong style={{color:'#c0392b'}}>它的自我强化</strong>。
            当你的结果不好——比如你赚不到钱，社交关系比较便宜（接触的人都比你穷）——会发生什么？
          </Para>

          <SubH>为什么你改不了</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              当你接触的人都比你菜的时候，<br/>
              你会对他们不尊重的。<br/>
              而且你会觉得你<strong>很对</strong>。<br/><br/>
              但因为你不看那些过得很好的人，<br/>
              觉得跟这些人没有关系，<br/>
              所以就<strong style={{color:'#C9A227', fontStyle:'normal'}}>滋长你的傲慢</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　论傲慢的形成
            </p>
          </div>
          <Para style={{ marginTop: '1.5rem' }}>
            傲慢一形成，你就觉得你很对。一旦你觉得你很对，你就错不了。
            一旦你错不了，你的认知和思维就会固化。固化了，你就会循环你过去的人生经历。
            <strong style={{color:'#c0392b'}}>这是一个完美的封闭循环。</strong>
          </Para>

          <SubH id="ch10-entry">入口在哪里</SubH>
          <Para>
            那怎么打破循环？树林的回答非常聪明——<strong>不要从最难的环节切入</strong>。
            "改变世界观"是最难的，因为世界观是被无数次行动结果反塑出来的。
            但是"改变行动"是最容易的——你今天可以决定深蹲十下、写一篇文章、发一条朋友圈。
            <strong style={{color:'#C9A227'}}>这些动作不需要你的世界观先变，它们本身就在改变你的世界观。</strong>
          </Para>

          <SubH id="ch10-stages">认知五阶段</SubH>
          <div style={{ marginBottom: '1.5rem' }}>
            {[
              { n:'01', label:'印象', desc:'模模糊糊有这个东西。' },
              { n:'02', label:'听过', desc:'听了七八遍，但不能复述。' },
              { n:'03', label:'了解', desc:'能清晰精准复述，能写 2000 字文章解释。' },
              { n:'04', label:'知道', desc:'已经做到了。没做到不算"知道"。' },
              { n:'05', label:'掌握', desc:'人生最差的时候、最想做糟糕决定的时候，也能执行。' },
              { n:'06', label:'大师', desc:'"我不知道"——永远可以知道得更多。大师必谦虚。' },
            ].map(s => (
              <div key={s.n}
                    style={{ display: 'flex', gap: '1rem', padding: '0.7rem 0',
                              borderBottom: '1px solid rgba(45,36,22,0.06)',
                              alignItems: 'baseline' }}>
                <span style={{ color: '#C9A227', fontFamily: "'Playfair Display',serif",
                                fontSize: '0.78rem', fontWeight: 600,
                                letterSpacing: '0.1em', minWidth: 28 }}>
                  {s.n}
                </span>
                <span style={{ color: '#2D2416', fontSize: '1rem', fontWeight: 500,
                                minWidth: 60 }}>
                  {s.label}
                </span>
                <span style={{ color: 'rgba(45,36,22,0.7)', fontSize: '0.88rem',
                                lineHeight: 1.7, flex: 1 }}>
                  {s.desc}
                </span>
              </div>
            ))}
          </div>
          <Para>
            所以"我知道很多道理但过不好这一生"——其实是一个语言陷阱。
            <strong style={{color:'#C9A227'}}>你不是知道很多道理，你只是有印象。</strong>
            真正的知道是做到。做到才能反塑你的世界观，世界观变了才能脱离原来的循环。
          </Para>

          <ChapterClose>
            八步循环锁死了大多数人。<br/>
            <span style={{color:'#C9A227'}}>打破它的入口不是"想清楚"，是动起来——动作反塑认知。</span>
          </ChapterClose>
        </div>

        {/* CHAPTER 11 · 诚意正心 */}
        <div id="ch11-confession" style={{ scrollMarginTop: '40px', marginTop: '4rem' }}>
          <ChapterIntro num="十一" en="ELEVEN" title="诚意正心：树林的回归与告白"
                        lead='"27 岁的我以为自己撑不下去了。每天 8、9 点睡，下午 3、4 点起。"' />

          <Para>
            这是整本书最不像"知识"的一章。它是一个 28 岁的人，
            <strong>在沉默大半年之后，把这段沉默换来的反思、敬畏、重生——一次性说出来。</strong>
          </Para>

          <SubH>我也是可以废掉的</SubH>
          <Para>树林讲他 2024 年下半年的状态——靠每天 1 万字的产出和 IP 影响力变现的他，突然停下来：</Para>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              那个时候每天<strong>8、9 点才睡觉</strong>，<br/>
              下午 3、4 点起床。<br/>
              起来必须要喝两杯咖啡，<br/>
              才能工作两个小时。<br/><br/>
              凌晨 10 点之后开始 <strong>EMO</strong>，<br/>
              刷短视频。<br/>
              每天就这样。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>

          <Para style={{ marginTop: '1.5rem' }}>然后是那一句：</Para>

          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              我在最痛苦的时候，<br/>
              我说<strong>我废了</strong>——<br/>
              我怎么连不刷短视频<br/>都控制不了？<br/><br/>
              我怎么变成<strong>这个样子</strong>了？
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>

          <Para style={{ marginTop: '1.5rem' }}>
            这一段读完会让人很安静。它戳的不是"任何人都会有低谷"——
            <strong>而是一个赚到钱、有过影响力、被无数人羡慕的人，照样可能在某个阶段觉得自己废了。</strong>
          </Para>

          <div style={{ padding: '1.5rem 2rem', background: 'rgba(201,162,39,0.06)',
                         borderLeft: '3px solid #C9A227', marginTop: '1.2rem',
                         marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                          color: '#2D2416', fontSize: '1.15rem', lineHeight: 1.8,
                          fontStyle: 'italic', fontWeight: 500 }}>
              "所以我也是可以废掉的。"
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.75rem',
                         letterSpacing: '0.2em', marginTop: '0.6rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>

          <SubH>钱和影响力，解决不了存在感问题</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              我没有<strong>活得很好</strong>。<br/><br/>
              我不开心。<br/>
              <strong>赚到钱了我也不开心</strong>。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林
            </p>
          </div>

          <Para style={{ marginTop: '1.5rem' }}>
            这是树林这一章最戳人的话。
          </Para>
          <Para>
            它戳的不是"赚不到钱很苦"——是反过来：
            <strong>钱已经赚到了，影响力已经有了，但他依然觉得"没有活得很好"。</strong>
          </Para>
          <Para>
            钱解决了一些事——但解决不了：
          </Para>
          <ul style={{ listStyle: 'none', paddingLeft: '1.5rem', margin: '0.8rem 0 1.5rem',
                        color: 'rgba(45,36,22,0.75)', fontSize: '1rem', lineHeight: 2.2 }}>
            <li>· <strong style={{ color: '#C9A227' }}>能量问题</strong></li>
            <li>· <strong style={{ color: '#C9A227' }}>存在感问题</strong></li>
            <li>· <strong style={{ color: '#C9A227' }}>对自己的诚意问题</strong></li>
          </ul>
          <Para>
            这就是这一章<strong>真正想说的事</strong>。
          </Para>

          <SubH>积善之家，必有余庆</SubH>
          <Para style={{ marginBottom: '1.2rem', color: 'rgba(45,36,22,0.7)', fontStyle: 'italic' }}>
            觉醒之后，他做的第一件事是把因果理顺。
          </Para>
          <div style={{ background: 'linear-gradient(135deg, #FAF8F3 0%, #F0EBE0 100%)',
                          border: '1px solid rgba(201,162,39,0.4)',
                          padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem' }}>
            <p style={{ color: '#C9A227', fontSize: '0.7rem', letterSpacing: '0.3em',
                         marginBottom: '1rem' }}>请置顶</p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#2D2416', fontSize: 'clamp(1.6rem,3vw,2.2rem)',
                         letterSpacing: '0.4em', fontStyle: 'italic',
                         lineHeight: 1.6, fontWeight: 400 }}>
              积　善　之　家<br/>必　有　余　庆
            </p>
          </div>
          <Para>
            他相信因果。"我现在连很讨厌的人我都不讲他的坏话。如果我要背后骂这个人，我就一定能当面骂他；
            如果我不敢当面骂，我一定不背后骂。"这是他从这半年沉默里学到的最重要的一件事——
            <strong style={{color:'#C9A227'}}>万事皆有因果，要有敬畏心。</strong>
          </Para>

          <SubH>结语 · 嵌入规则，改变规则</SubH>
          <div className="ra-bigquote">
            <p className="ra-bigquote-text">
              要有<strong>叙事</strong>，也要有<strong>结构</strong>。<br/>
              记住 DMN 网络，<br/>
              记住嵌入更贵的社会网络，<br/>
              记住在你能量高的时候去表达。<br/><br/>
              以世界为准。<br/>
              我们改变我们自己的思维，<br/>
              去<strong style={{color:'#C9A227', fontStyle:'normal'}}>嵌入、利用、了解、认识规则</strong>，<br/>
              最后<strong style={{color:'#C9A227', fontStyle:'normal'}}>改变规则</strong>。<br/><br/>
              不要在最开始就想改变规则——<br/>
              没有人会给没有能力和无能的人<br/>出让规则的改变权。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.8rem',
                         letterSpacing: '0.2em', marginTop: '1.5rem',
                         fontStyle: 'italic' }}>
              — 树林　直播结语
            </p>
          </div>

          <SubH>经济舱里的人上人</SubH>
          <Para>直播的最后，树林放了一首咖啡胡的《经济舱》。歌词里有一句他特别喜欢：</Para>
          <div style={{ padding: '1.5rem 2rem', background: 'rgba(201,162,39,0.05)',
                          borderLeft: '3px solid #C9A227', marginBottom: '1.5rem' }}>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                          color: '#2D2416', fontSize: '1.1rem', lineHeight: 1.9,
                          fontStyle: 'italic' }}>
              山外山，<br/>
              虽然我在经济舱，做<strong style={{color:'#C9A227'}}>人上人</strong>。<br/>
              虽然他在经济舱。
            </p>
            <p style={{ color: 'rgba(45,36,22,0.5)', fontSize: '0.75rem',
                         letterSpacing: '0.2em', marginTop: '0.8rem',
                         fontStyle: 'italic' }}>
              — 咖啡胡 · 《经济舱》
            </p>
          </div>
          <Para>
            他说："改变世界。世界不死，理想不灭，现在随便喊。哪怕一个月前我都不想喊，我觉得好尴尬。
            但今天我能喊出来了——<strong>这不是叙事，是我对我自己的提醒。</strong>"
          </Para>

          {/* 全书收束 */}
          <div style={{ marginTop: '4rem', padding: '2.5rem 2rem',
                          background: '#140E06', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: '-1rem', bottom: '-3rem',
                           fontFamily: "'Playfair Display',serif",
                           fontSize: '12rem', color: 'rgba(201,162,39,0.05)',
                           lineHeight: 1, fontWeight: 700 }}>莽</div>
            <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                         letterSpacing: '0.4em', marginBottom: '1.5rem',
                         position: 'relative', zIndex: 1 }}>
              全 书 收 束
            </p>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#FAF8F3', fontSize: 'clamp(1.4rem,2.6vw,2rem)',
                         lineHeight: 1.7, fontStyle: 'italic',
                         position: 'relative', zIndex: 1, marginBottom: '1.2rem' }}>
              我没有变。<br/>
              或者我又回来了。<br/>
              或者人生兜兜转转——<br/>
              下一场直播，我会说说<strong style={{color:'#C9A227', fontStyle:'normal'}}>为什么又回来了</strong>。
            </p>
          </div>
        </div>

        <ChapterNav current="ch04" onNav={onNav} />
      </div>
    </section>
  );
};


// ── Outro ─────────────────────────────────────────────────────────────────────
const OutroPage = ({ onNav }) => {
  // 60 条原话按 7 主题分组
  const quoteGroups = [
    { theme: '关于复利与注意力', color: '#C9A227', quotes: [
      '你的所有最厉害的东西都在你的脑子里面，世界没有看到，世界就不能给你定价。',
      '急切就是不复利。',
      '瘾的本质是不可撤销的注意力。',
      '我用一份时间换了你们四千份的注意力，那我就会越来越有钱。',
      '你的复利系数取决于你的注意力产出能被多少人接收、能持续多久。',
    ]},
    { theme: '关于劫持与压强', color: '#B8860B', quotes: [
      '如果从今天开始，我一分钟打断你一次——你这辈子还能有什么出息？',
      '短视频不是 1 分钟打断你一次，是 10 秒打断你一次。',
      '虐恋三要素：高性吸引 + 高情绪波动 + 高需求感。',
      '好的爱情会让你打开和开放，坏的爱情让你的思维收缩、行动收缩、情绪收缩。',
      'P = F / S。注意力的产出 = 注意力总量 ÷ 聚焦面积。',
      '你做不了高考，那就做语文；做不了语文，那就做开头两句话——这种总能做了吧？',
      '我快凉了。（论焦虑时身体的反应）',
      '慢即是快——把同样的注意力压在更小的面积上。',
    ]},
    { theme: '关于身体与能量', color: '#8B6914', quotes: [
      '人的本质是烧炭的机器。',
      '有钱人就是中基因彩票了——他们的 ATP 先天就比更多人更多。',
      '性能量不只是性欲——它驱动性欲、探索欲、攻击性、表达欲、食欲。',
      '血糖一波动，前额叶就下线；前额叶一死，杏仁核就上线。',
      '饿、性欲、焦虑——这三件事是一体的。',
      '你不是因为想清楚了才去运动，是因为你运动了才想得清楚。',
      '60 分以下的人内耗，60 分以上的人外耗，90 分的人疯狂外耗。',
      '能量低的人是审判席思维，能量高的人是游乐场思维。',
      '不敢卖东西？兄弟，你需要深蹲。',
    ]},
    { theme: '关于 DMN 与深夜 EMO', color: '#6B4F12', quotes: [
      '晚上的 EMO 是这样：白天能量耗尽，注意力没地方去，DMN 启动开始自我攻击。',
      '我 DMN 一启动就开始写东西；你 DMN 一启动开始骂自己——4 小时光在骂你自己。',
      '你多想都没用——只有行动才能阻断。站起来做个深蹲。',
      '反思自己时不批判自己——这是一个人在自己面前的尊严。',
    ]},
    { theme: '关于商业与剥削', color: '#5a4020', quotes: [
      '资本的四阶段：粮食剩余 → 劳动剩余 → 注意力 → 未来现金流。',
      '你欠未来的钱，每天都在焦虑怎么还钱——你拿什么翻身？',
      '洗碗在县城 3000，杭州 7000，日本 2 万，美国 5 万——服务网络决定你的价格。',
      '你今天如果不使用杠杆，你就是一个劳力赚一份钱。',
      '跟你们太熟不是好事——熟人就不好卖了。',
      '嘴上骂你的人，心里全都是你。',
      '你不讨厌营销，你讨厌的是过度营销 + 垃圾产品。',
      '课程的本质是把不确定性打包成确定性。',
    ]},
    { theme: '关于 AI 时代', color: '#4A3A0A', quotes: [
      '我使用 Claude 的第一天就觉得，我得考虑一下我的能力如果没有了该怎么办。',
      'AI 是这个时代的马克沁机枪——100 条枪打 4 亿人。',
      '2024 年 3 月 GPT 出图第三天我裁掉了一个美工。',
      'AI 今天不是给老年人、中年人设计的——就是给年轻人。',
      '等到所有人都用 AI 之后，智能的信息差就没有了。',
      '未来的核心能力不是会用 AI——是知道什么是好的。审美是最后的护城河。',
    ]},
    { theme: '关于世界观与改变', color: '#3a2e0e', quotes: [
      '世界观→思维→判断→决定→行动→习惯→结果→社会网络→反塑世界观。',
      '认知五阶段：印象 / 听过 / 了解 / 知道 / 掌握 / 大师。',
      '所谓"知道"是已经做到了——没做到就不要讲知道。',
      '你接触比你菜的人，会滋长你的傲慢。傲慢让你认为你很对，对就错不了，错不了就固化。',
      '"我知道很多道理但过不好这一生"——你不是知道，你只是有印象。',
      '大师必谦虚——"我不知道"的意思是我永远可以知道得更多。',
    ]},
    { theme: '关于心力与告白', color: '#2D2416', quotes: [
      '27 岁我以为自己撑不下去了——下午 3 点起床，喝两杯咖啡才能工作两小时。',
      '赚到钱了我也不开心，我就成为钱的奴隶了，成为影响力的奴隶了。',
      '我冒犯了我自己的灵魂——这个事是我的一意孤行。',
      '我答应了，我就要给。哪怕服务不用继续，钱照样要赔完。',
      '积善之家，必有余庆。',
      '愧疚是最差的情绪——它会剥夺你最后的存在感。',
      '万事皆有因果，要有敬畏心。',
      '改变世界。世界不死，理想不灭，现在随便喊。',
      '不要在最开始就想改变规则——先嵌入规则，了解规则，最后改变规则。',
      '如果你希望这个世界更好一点，那你就需要成为一个更有能量的人。',
    ]},
  ];

  const totalQuotes = quoteGroups.reduce((s, g) => s + g.quotes.length, 0);

  // 用户在四张行动卡上的痕迹
  const [traces, setTraces] = useState([]);
  useEffect(() => {
    const found = [];
    ['ch01','ch02','ch03','ch04'].forEach(id => {
      try {
        const raw = localStorage.getItem(`ra-action-${id}`);
        if (raw) {
          const data = JSON.parse(raw);
          if (data.value && data.value.trim()) {
            found.push({ id, ...data });
          }
        }
      } catch (e) {}
    });
    setTraces(found);
  }, []);

  const chapterTitleMap = {
    ch01: '上篇 · 你今天的最小动作',
    ch02: '中篇 · 让你能量上来的那件事',
    ch03: '下篇 · 你这次敢卖的那件东西',
    ch04: '终篇 · 你那句最值钱的话',
  };

  return (
    <section style={{ minHeight: '100vh', background: '#140E06', color: '#FAF8F3',
                       position: 'relative', overflow: 'hidden' }}>
      {/* Big atmospheric glow */}
      <div style={{ position: 'absolute', inset: 0,
                     background: 'radial-gradient(ellipse at 50% 20%,rgba(201,162,39,0.12) 0%,transparent 50%)',
                     pointerEvents: 'none' }} />
      {/* Decorative giant glyph */}
      <div style={{ position: 'absolute', right: '-3rem', bottom: '-5rem',
                     fontFamily: "'Playfair Display','Noto Serif SC',serif",
                     fontSize: 'clamp(20rem,40vw,40rem)',
                     color: 'rgba(201,162,39,0.04)', lineHeight: 1, fontWeight: 700,
                     pointerEvents: 'none', userSelect: 'none' }}>
        莽
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1,
                     padding: '6rem 3rem 6rem' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.5em', marginBottom: '2rem' }}>
            — APPENDIX · 附录 —
          </p>
          <h2 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(2.2rem,5vw,3.6rem)', color: '#FAF8F3',
                        fontWeight: 400, marginBottom: '1rem', lineHeight: 1.3 }}>
            金句索引 · 后记
          </h2>
          <p style={{ color: 'rgba(201,162,39,0.7)', fontSize: 'clamp(0.95rem,1.5vw,1.1rem)',
                       letterSpacing: '0.15em', fontStyle: 'italic' }}>
            {totalQuotes} 条原话 · 8 个主题 · 给那些只想翻金句的人
          </p>
        </div>

        {/* THE CORE SENTENCE */}
        <div style={{ borderTop: '1px solid rgba(201,162,39,0.2)',
                       borderBottom: '1px solid rgba(201,162,39,0.2)',
                       padding: '4rem 0', marginBottom: '5rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '2.5rem' }}>
            THE CORE SENTENCE
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                       lineHeight: 1.7, fontWeight: 400, marginBottom: '0.6rem' }}>
            如果你希望这个世界
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                       lineHeight: 1.7, fontWeight: 400, marginBottom: '0.6rem' }}>
            <strong style={{color:'#C9A227'}}>更好一点、更美一点</strong>，
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#FAF8F3', fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                       lineHeight: 1.7, fontWeight: 400, marginBottom: '0.6rem' }}>
            那你就需要成为
          </p>
          <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                       color: '#C9A227', fontSize: 'clamp(1.4rem,3.2vw,2.4rem)',
                       lineHeight: 1.7, fontWeight: 400, fontStyle: 'italic' }}>
            一个更有能量的人。
          </p>
        </div>

        {/* QUOTE INDEX — grouped by theme */}
        <div style={{ marginBottom: '5rem' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '2rem', textAlign: 'center' }}>
            QUOTE INDEX · 60 条原话
          </p>
          {quoteGroups.map((group, gi) => (
            <div key={gi} style={{ marginBottom: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem',
                              marginBottom: '1.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px',
                                background: '#C9A227', borderRadius: '50%',
                                boxShadow: '0 0 8px rgba(201,162,39,0.6)' }} />
                <h3 style={{ color: '#C9A227', fontSize: '0.95rem',
                              letterSpacing: '0.2em', fontWeight: 500 }}>
                  ❶ · {group.theme}
                </h3>
                <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.7rem',
                                letterSpacing: '0.15em', marginLeft: 'auto' }}>
                  {group.quotes.length} 条
                </span>
              </div>
              {group.quotes.map((q, qi) => (
                <div key={qi}
                      style={{ display: 'flex', gap: '1rem', padding: '0.8rem 0',
                                borderBottom: '1px solid rgba(201,162,39,0.06)',
                                alignItems: 'flex-start' }}>
                  <span style={{ color: 'rgba(201,162,39,0.4)', fontSize: '0.7rem',
                                  fontFamily: "'Playfair Display',serif",
                                  marginTop: '0.3rem', flexShrink: 0, minWidth: 28 }}>
                    /
                  </span>
                  <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                                lineHeight: 1.9, flex: 1 }}>
                    {q}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* YOUR TRACES */}
        <div style={{ marginBottom: '5rem', padding: '3rem 2rem',
                       border: '1px solid rgba(201,162,39,0.2)',
                       background: 'rgba(201,162,39,0.03)' }}>
          <p style={{ color: 'rgba(201,162,39,0.6)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '0.5rem', textAlign: 'center' }}>
            YOUR TRACES · 你的痕迹
          </p>
          <h3 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)', textAlign: 'center',
                        color: '#FAF8F3', fontWeight: 400, marginBottom: '0.5rem' }}>
            你在这本书里写下的东西
          </h3>
          <p style={{ textAlign: 'center', color: 'rgba(250,248,243,0.5)',
                       fontSize: '0.85rem', marginBottom: '2.5rem',
                       fontStyle: 'italic' }}>
            一段关系过去了、一个项目失败了、一次对话结束了——<br />
            真正可惜的，是结束以后什么都没有留下。
          </p>

          {traces.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.9rem',
                           lineHeight: 1.9, marginBottom: '1.5rem' }}>
                你还没有在任何一张行动卡上写下东西。<br />
                这本书的真正价值，发生在你动手写下来的瞬间。
              </p>
              <button onClick={() => onNav('ch01')}
                      style={{ background: 'transparent', border: '1px solid rgba(201,162,39,0.5)',
                                color: '#C9A227', padding: '0.7rem 2rem', cursor: 'pointer',
                                fontFamily: 'inherit', fontSize: '0.85rem', letterSpacing: '0.2em' }}>
                回到上篇 · 写下第一件最小动作
              </button>
            </div>
          ) : (
            <>
              {traces.map(t => (
                <div key={t.id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem',
                                            borderBottom: '1px dashed rgba(201,162,39,0.15)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                                 alignItems: 'baseline', marginBottom: '0.6rem' }}>
                    <span style={{ color: '#C9A227', fontSize: '0.75rem',
                                     letterSpacing: '0.15em' }}>
                      {chapterTitleMap[t.id]}
                    </span>
                    <span style={{ color: 'rgba(250,248,243,0.3)', fontSize: '0.65rem' }}>
                      {t.savedAt}
                    </span>
                  </div>
                  <p style={{ color: 'rgba(250,248,243,0.85)', fontSize: '0.95rem',
                               lineHeight: 1.9, whiteSpace: 'pre-wrap',
                               fontFamily: "'Noto Serif SC',serif" }}>
                    {t.value}
                  </p>
                </div>
              ))}
              <p style={{ textAlign: 'center', color: 'rgba(201,162,39,0.5)',
                           fontSize: '0.75rem', letterSpacing: '0.2em',
                           marginTop: '2rem', fontStyle: 'italic' }}>
                — 这些是你的不归零 —
              </p>
            </>
          )}
        </div>

        <CommitmentCard />

        {/* EDITOR'S POSTSCRIPT */}
        <div style={{ marginTop: '5rem', padding: '3rem 2rem',
                        borderTop: '1px solid rgba(201,162,39,0.2)' }}>
          <p style={{ color: 'rgba(201,162,39,0.5)', fontSize: '0.7rem',
                       letterSpacing: '0.4em', marginBottom: '1.5rem', textAlign: 'center' }}>
            EDITOR'S POSTSCRIPT · 编 者 后 记
          </p>
          <h3 style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                        fontSize: 'clamp(1.3rem,2.4vw,1.6rem)', textAlign: 'center',
                        color: '#FAF8F3', fontWeight: 400, marginBottom: '2.5rem' }}>
            关于这场直播，<br/>我最想留给你的一句话。
          </h3>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            整理这份文档大约花了一整天的时间。22 万字逐字稿读了三遍，
            一遍找主线，一遍找戳人时刻，一遍找原话精华。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            整理完之后我想说一件事——这场直播的真正价值，不是它讲了多少"对的道理"。讲对的道理的人很多。
            它的价值在于：<strong style={{color:'#C9A227'}}>这是一个曾经赚到钱、有过影响力、被无数人羡慕的 28 岁的人，
            停下来沉默了大半年，然后回来对所有人说"我前面那一段做错了"的告白。</strong>
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            这种告白本身比任何理论都珍贵。因为它意味着一个人愿意在自己已经"成功"的前提下，
            承认自己失败、承认自己迷茫、承认自己变成了自己讨厌的样子——并且决定重新开始。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '2.5rem' }}>
            所以如果你只从这本书里拿走一件事，我希望它不是 P=F/S 公式，也不是 DMN 的运行机制，
            也不是注意力的三重劫持。<strong>我希望是这一句</strong>——
          </p>
          <div style={{ padding: '2rem', background: 'rgba(201,162,39,0.05)',
                          borderLeft: '3px solid #C9A227', marginBottom: '2rem' }}>
            <p style={{ fontFamily: "'Playfair Display','Noto Serif SC',serif",
                         color: '#FAF8F3', fontSize: 'clamp(1.2rem,2.4vw,1.6rem)',
                         lineHeight: 1.8, fontStyle: 'italic' }}>
              如果你希望这个世界更好一点、更美一点，<br/>
              那你就需要成为一个<strong style={{color:'#C9A227', fontStyle:'normal'}}>更有能量的人</strong>。
            </p>
          </div>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, marginBottom: '1.4rem' }}>
            这句话之所以重要，是因为它把"改变世界"这种听起来空洞的宏大命题，
            翻译成了一个极其具体的、可操作的、个人尺度的事情——
            <strong style={{color:'#C9A227'}}>把你自己的能量先升上来</strong>。
            所有其他的命题——复利、注意力、心力、心智、商业、AI——都是在为这件事服务的。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.78)', fontSize: '0.95rem',
                       lineHeight: 2, fontStyle: 'italic', textAlign: 'center',
                       marginTop: '2.5rem' }}>
            愿这本书的读者，<br/>
            每一个都能成为更有能量的人。
          </p>
          <p style={{ color: 'rgba(250,248,243,0.4)', fontSize: '0.75rem',
                       letterSpacing: '0.3em', textAlign: 'center', marginTop: '2rem' }}>
            —— 整 理 者 · 2026
          </p>
        </div>

        {/* Restart button */}
        <div style={{ textAlign: 'center', margin: '4rem 0' }}>
          <button onClick={() => onNav('preface')}
                  className="ra-btn"
                  style={{ background: 'transparent', border: '1px solid rgba(201,162,39,0.5)',
                            color: '#C9A227', padding: '1rem 3rem',
                            fontFamily: "'Noto Serif SC',serif",
                            fontSize: '0.95rem', letterSpacing: '0.25em', cursor: 'pointer' }}>
            <RotateCcw size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.6rem' }} />
            再读一遍
          </button>
          <p style={{ color: 'rgba(250,248,243,0.3)', fontSize: '0.75rem',
                       letterSpacing: '0.15em', marginTop: '1.5rem', fontStyle: 'italic' }}>
            年轻人，就是要莽 · 第二次读会有第一次没看见的东西
          </p>
        </div>

        {/* Signature */}
        <div style={{ textAlign: 'center', paddingTop: '3rem',
                       borderTop: '1px solid rgba(201,162,39,0.1)' }}>
          <p style={{ color: 'rgba(250,248,243,0.25)', fontSize: '0.7rem',
                       letterSpacing: '0.3em', marginBottom: '0.5rem' }}>
            COMPOUND · ATTENTION · SOUL
          </p>
          <p style={{ color: 'rgba(250,248,243,0.2)', fontSize: '0.65rem',
                       letterSpacing: '0.2em' }}>
            HOPER 希望者文库 · Vol.001 · 2025.05.05
          </p>
        </div>
      </div>
    </section>
  );
};

// ── App (root) ────────────────────────────────────────────────────────────────
export default function App() {
  const [entered, setEntered] = useState(false);
  const [activePage, setActivePage] = useState('preface');
  const [scrollPct, setScrollPct] = useState(0);
  const [navKey, setNavKey] = useState(0);   // increments on each nav, triggers entrance animation
  const mainRef = useRef(null);

  const handleNav = (id) => {
    setActivePage(id);
    setNavKey(k => k + 1);
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dynamic browser tab title — follow current chapter
  useEffect(() => {
    const SITE = '年轻人，就是要莽！';
    const titleMap = {
      preface:    '编者按',
      directory:  '目录',
      part1:      '上篇 · 注意力如何被分配',
      ch01:       '01-02 · 复利与压强',
      part2:      '中篇 · 身体的物理学',
      ch02:       '03-05 · 烧炭、高酮、DMN',
      part3:      '下篇 · 商业世界的真相',
      ch03:       '06-08 · 资本、杠杆、营销',
      part4:      '终篇 · AI 时代与心力',
      ch04:       '09-11 · AI、八步循环、诚意正心',
      outro:      '附录 · 金句索引 + 编者后记',
    };
    const sub = titleMap[activePage];
    document.title = sub ? `${sub} · ${SITE}` : SITE;
  }, [activePage]);

  // Anchors per chapter
  const anchorsByPage = {
    ch01: [
      { id: 'ch1-compound',  label: '01 · 复利的本质' },
      { id: 'ch2-attention', label: '02 · 三重劫持' },
      { id: 'ch2-pressure',  label: '02 · 压强公式' },
      { id: 'ch2-anxiety',   label: '02 · 焦虑与最小动作' },
    ],
    ch02: [
      { id: 'ch3-burning',    label: '03 · 烧炭的机器' },
      { id: 'ch3-lottery',    label: '03 · 基因彩票' },
      { id: 'ch3-bloodsugar', label: '03 · 血糖与前额叶' },
      { id: 'ch4-androgen',   label: '04 · 高酮与攻击性' },
      { id: 'ch4-60line',     label: '04 · 60 分这条线' },
      { id: 'ch4-five',       label: '04 · 五种在线' },
      { id: 'ch5-dmn',        label: '05 · DMN 默认网络' },
      { id: 'ch5-block',      label: '05 · 阻断 DMN' },
    ],
    ch03: [
      { id: 'ch6-capital',         label: '06 · 资本演进史' },
      { id: 'ch6-stages',          label: '06 · 四个阶段' },
      { id: 'ch7-leverage',        label: '07 · 杠杆思维' },
      { id: 'ch7-network',         label: '07 · 服务网络' },
      { id: 'ch7-leverage-types',  label: '07 · 五代杠杆' },
      { id: 'ch7-strangers',       label: '07 · 陌生人' },
      { id: 'ch8-marketing',       label: '08 · 营销不邪恶' },
      { id: 'ch8-cantsell',        label: '08 · 你为什么不敢卖' },
    ],
    ch04: [
      { id: 'ch9-ai',          label: '09 · AI 代差' },
      { id: 'ch9-replaced',    label: '09 · 谁会被替代' },
      { id: 'ch9-taste',       label: '09 · 审美护城河' },
      { id: 'ch10-loop',       label: '10 · 八步循环' },
      { id: 'ch10-eight',      label: '10 · 循环图' },
      { id: 'ch10-entry',      label: '10 · 入口在哪' },
      { id: 'ch10-stages',     label: '10 · 认知五阶段' },
      { id: 'ch11-confession', label: '11 · 诚意正心' },
    ],
  };
  const currentAnchors = anchorsByPage[activePage];

  // Track scroll progress within current page
  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, [entered, activePage]);

  // Keyboard navigation: ← → to switch chapters, Esc to top
  useEffect(() => {
    if (!entered) return;
    const onKey = (e) => {
      // Skip if user is typing in an input/textarea
      if (['INPUT','TEXTAREA'].includes(e.target.tagName)) return;
      const idx = PAGE_ORDER.indexOf(activePage);
      if (e.key === 'ArrowRight' && idx < PAGE_ORDER.length - 1) {
        handleNav(PAGE_ORDER[idx + 1]);
      } else if (e.key === 'ArrowLeft' && idx > 0) {
        handleNav(PAGE_ORDER[idx - 1]);
      } else if (e.key === 'Escape') {
        mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [entered, activePage]);

  const renderPage = () => {
    switch (activePage) {
      case 'preface':   return <PrefacePage onNav={handleNav} />;
      case 'directory': return <DirectoryPage onNav={handleNav} />;
      case 'ch01':      return <Ch01Page onNav={handleNav} />;
      case 'ch02':      return <Ch02Page onNav={handleNav} />;
      case 'ch03':      return <Ch03Page onNav={handleNav} />;
      case 'ch04':      return <Ch04Page onNav={handleNav} />;
      case 'outro':     return <OutroPage onNav={handleNav} />;
      default:          return <PrefacePage onNav={handleNav} />;
    }
  };

  return (
    <>
      {/* GlobalStyles is always mounted — CSS never disappears */}
      <GlobalStyles />

      {!entered ? (
        <LandingPage onEnter={() => setEntered(true)} />
      ) : (
        <div className="ra-app">
          <Sidebar active={activePage} onNav={handleNav} />
          {/* Scroll progress bar */}
          <div className="ra-progress">
            <div className="ra-progress-fill" style={{ width: `${scrollPct}%` }} />
          </div>
          <main ref={mainRef} className="ra-main">
            {/* key triggers fade-in on chapter switch */}
            <div key={activePage} className="ra-page">
              {renderPage()}
            </div>
          </main>
          {/* Floating UI overlays */}
          <MouseGlow />
          {currentAnchors && (
            <AnchorNav scrollEl={mainRef} items={currentAnchors} key={`anchor-${activePage}`} />
          )}
          <BackToTop scrollEl={mainRef} />
          {/* Full-screen ceremony overlay on chapter change */}
          <ChapterEntrance pageId={activePage} navKey={navKey} />
        </div>
      )}
    </>
  );
}
