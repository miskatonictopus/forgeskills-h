"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;              // ms entre letras
  duration?: number;           // s por letra
  ease?: string | ((t: number) => number);
  splitType?: "chars" | "words" | "lines" | "words, chars";
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;          // sólo en modo 'scroll'
  rootMargin?: string;         // sólo en modo 'scroll'
  tag?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  textAlign?: React.CSSProperties["textAlign"];
  onLetterAnimationComplete?: () => void;
  mode?: "mount" | "scroll";   // <<< NUEVO (por defecto 'mount')
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 100,
  duration = 0.4,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "center",
  tag = "p",
  onLetterAnimationComplete,
  mode = "mount",
}) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (document.fonts?.status === "loaded") setFontsLoaded(true);
    else document.fonts?.ready.then(() => setFontsLoaded(true));
  }, []);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;

      const el = ref.current as HTMLElement & { _rbsplitInstance?: GSAPSplitText };
      if (el._rbsplitInstance) {
        try { el._rbsplitInstance.revert(); } catch {}
        el._rbsplitInstance = undefined;
      }

      let targets: Element[] = [];
      const splitInstance = new GSAPSplitText(el, {
        type: splitType,
        smartWrap: true,
        autoSplit: splitType === "lines",
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
        reduceWhiteSpace: false,
      });
      el._rbsplitInstance = splitInstance;

      const pickTargets = () => {
        if (splitType.includes("chars") && splitInstance.chars.length) targets = splitInstance.chars;
        if (!targets.length && splitType.includes("words") && splitInstance.words.length) targets = splitInstance.words;
        if (!targets.length && splitType.includes("lines") && splitInstance.lines.length) targets = splitInstance.lines;
        if (!targets.length) targets = splitInstance.chars || splitInstance.words || splitInstance.lines;
      };
      pickTargets();

      const tweenBase: gsap.TweenVars = {
        ...to,
        duration,
        ease,
        stagger: delay / 1000,
        willChange: "transform, opacity",
        force3D: true,
        onComplete: onLetterAnimationComplete,
      };

      if (mode === "mount") {
        gsap.fromTo(targets, { ...from }, tweenBase);
      } else {
        // 🧷 Animación al entrar en viewport con ScrollTrigger (por si la necesitas)
        const startPct = (1 - threshold) * 100;
        const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
        const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
        const marginUnit = marginMatch ? marginMatch[2] || "px" : "px";
        const sign =
          marginValue === 0 ? "" : marginValue < 0 ? `-=${Math.abs(marginValue)}${marginUnit}` : `+=${marginValue}${marginUnit}`;
        const start = `top ${startPct}%${sign}`;

        gsap.fromTo(targets, { ...from }, {
          ...tweenBase,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
            fastScrollEnd: true,
            anticipatePin: 0.4,
          },
        });
      }

      return () => {
        if (mode === "scroll") {
          ScrollTrigger.getAll().forEach((st) => {
            if (st.trigger === el) st.kill();
          });
        }
        try { splitInstance.revert(); } catch {}
        el._rbsplitInstance = undefined;
      };
    },
    {
      dependencies: [
        text, delay, duration, ease, splitType,
        JSON.stringify(from), JSON.stringify(to),
        threshold, rootMargin, fontsLoaded, mode,
      ],
      scope: ref,
    }
  );

  const style: React.CSSProperties = {
    textAlign,
    overflow: "hidden",         
    display: "inline-block",
    whiteSpace: "normal",
    wordWrap: "break-word",
    willChange: "transform, opacity",
    margin: 0, 
  };
  const classes = `split-parent ${className}`;

  const Tag = tag as any;
  return (
    <Tag ref={ref} style={style} className={classes}>
      {text}
    </Tag>
  );
};

export default SplitText;
