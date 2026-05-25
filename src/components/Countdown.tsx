'use client';

import { useEffect, useState } from 'react';

function diff(target: Date) {
  const ms = target.getTime() - new Date().getTime();
  if (ms <= 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(ms / 86400000),
    h: Math.floor((ms / 3600000) % 24),
    m: Math.floor((ms / 60000) % 60),
    s: Math.floor((ms / 1000) % 60)
  };
}

export function Countdown({ iso }: { iso: string }) {
  const target = new Date(iso);
  const [t, setT] = useState(diff(target));

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [iso]);

  const Item = ({ n, l }: { n: number; l: string }) => (
    <div className="flex flex-1 flex-col items-center rounded-lg border border-zinc-800 bg-cgc-carbon px-3 py-4">
      <div className="font-display text-3xl text-cgc-orange sm:text-4xl">
        {n.toString().padStart(2, '0')}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-widest text-zinc-500">{l}</div>
    </div>
  );

  return (
    <div className="flex gap-2 sm:gap-3">
      <Item n={t.d} l="días" />
      <Item n={t.h} l="hs" />
      <Item n={t.m} l="min" />
      <Item n={t.s} l="seg" />
    </div>
  );
}
