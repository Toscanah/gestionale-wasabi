"use client";

import { useEffect, useState } from "react";
import {
  BounceLoader,
  BarLoader,
  BeatLoader,
  CircleLoader,
  ClipLoader,
  ClimbingBoxLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PacmanLoader,
  PuffLoader,
  RingLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader,
} from "react-spinners";

type SpinnerProps = {
  isLoading: boolean;
  size?: number;
  color?: string;
};

const SPINNERS = [
  BounceLoader,
  BarLoader,
  BeatLoader,
  CircleLoader,
  ClipLoader,
  // ClimbingBoxLoader,
  DotLoader,
  FadeLoader,
  GridLoader,
  HashLoader,
  MoonLoader,
  PacmanLoader,
  PuffLoader,
  RingLoader,
  RiseLoader,
  RotateLoader,
  ScaleLoader,
  SyncLoader,
];

const SUSHI_PHRASES = [
  "Affilando i coltelli… 🍣",
  "Rollando qualcosa di buono… 🌀",
  "Il riso sta cuocendo… 🍚",
  "Wasabi in arrivo! 🌶️",
  "Preparando la soia perfetta… 🥢",
  "Un maki alla volta… 🧘",
  "Sta per uscire qualcosa di freschissimo… 🐟",
  "Il maestro sta lavorando… 👨‍🍳",
  "Controllando la qualità del tonno… 🔍",
  "Calma, precisione, sushi. 🎯",
];

export default function RandomSpinner({ isLoading, size = 200, color = "#ff0000" }: SpinnerProps) {
  const [SelectedSpinner, setSelectedSpinner] = useState(
    () => SPINNERS[Math.floor(Math.random() * SPINNERS.length)]
  );
  const [phrase, setPhrase] = useState(
    () => SUSHI_PHRASES[Math.floor(Math.random() * SUSHI_PHRASES.length)]
  );

  useEffect(() => {
    if (isLoading) {
      const randomSpinner = SPINNERS[Math.floor(Math.random() * SPINNERS.length)];
      const randomPhrase = SUSHI_PHRASES[Math.floor(Math.random() * SUSHI_PHRASES.length)];
      setSelectedSpinner(() => randomSpinner);
      setPhrase(randomPhrase);
    }
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className="flex flex-col gap-8 items-center justify-center w-full h-full">
      <SelectedSpinner loading={isLoading} size={size} color={color} />
      <p className="text-muted-foreground text-lg italic">{phrase}</p>
    </div>
  );
}
