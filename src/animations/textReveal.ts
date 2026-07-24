import gsap from "gsap";
import SplitType from "split-type";

interface TextRevealOptions {
  stagger?: number;
  delay?: number;
  y?: number;
  blur?: number;
  duration?: number;
}

export function revealTextLines(
  elements: HTMLElement[],
  options: TextRevealOptions = {},
): gsap.core.Timeline {
  const {
    stagger = 0.15,
    delay = 0,
    y = 60,
    blur = 12,
    duration = 1.1,
  } = options;

  const timeline = gsap.timeline({ delay });

  elements.forEach((element, index) => {
    timeline.fromTo(
      element,
      {
        opacity: 0,
        y,
        filter: `blur(${blur}px)`,
      },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        ease: "power3.out",
      },
      index * stagger,
    );
  });

  return timeline;
}

export function revealSplitChars(
  element: HTMLElement,
  options: TextRevealOptions = {},
): gsap.core.Timeline {
  const { stagger = 0.03, delay = 0, duration = 0.8 } = options;

  const split = new SplitType(element, { types: "chars" });
  const chars = split.chars;

  if (!chars) {
    return gsap.timeline();
  }

  return gsap.timeline({ delay }).from(chars, {
    opacity: 0,
    y: 40,
    rotateX: -90,
    filter: "blur(8px)",
    stagger,
    duration,
    ease: "power4.out",
  });
}

export function revealScale(
  element: HTMLElement,
  delay = 0,
): gsap.core.Tween {
  return gsap.fromTo(
    element,
    { scale: 0.8, opacity: 0, filter: "blur(10px)" },
    {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.2,
      delay,
      ease: "power3.out",
    },
  );
}
