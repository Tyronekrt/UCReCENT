"use client";

import Image from "next/image";
import { useState } from "react";
import { SITE } from "@/lib/site";

/**
 * Site logo with graceful fallback: if the logo file has not been saved
 * yet, render a UCReCENT monogram instead of a broken image.
 * `mono` renders the pre-built transparent grayscale emblem for dark
 * backgrounds (no CSS filters needed).
 */
export default function SiteLogo({
  size = 44,
  mono = false,
  priority = false,
}: {
  size?: number;
  mono?: boolean;
  priority?: boolean;
}) {
  const [missing, setMissing] = useState(false);

  if (missing) {
    return (
      <span
        aria-hidden="true"
        className={`flex items-center justify-center rounded-full font-extrabold ${
          mono ? "bg-white/10 text-white" : "bg-navy text-white"
        }`}
        style={{ height: size, width: size, fontSize: size * 0.45 }}
      >
        U
      </span>
    );
  }

  if (mono) {
    return (
      <span className="relative shrink-0" style={{ height: size, width: size }}>
        <Image
          src={SITE.logoMono}
          alt="UCReCENT logo"
          fill
          sizes={`${size}px`}
          className="object-contain"
          priority={priority}
          onError={() => setMissing(true)}
        />
      </span>
    );
  }

  return (
    <span
      className="relative shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-slate-200"
      style={{ height: size, width: size }}
    >
      <Image
        src={SITE.logo}
        alt="UCReCENT logo"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={priority}
        onError={() => setMissing(true)}
      />
    </span>
  );
}
