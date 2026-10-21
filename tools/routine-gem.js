// ルーティン用バッジ：六角形の結晶＋円の紋章＋8方向の星。段階ごとに色だけを変える。
const PAL = {
  holo:   {body:['#ffc2ea','#a9dcff','#b9ffd9','#fff4ad','#dcb8ff'], rim:['#c690e0','#7fb0e0']},
  gold:   {body:['#fff0b8','#f3c04a','#d99a1c'],                     rim:['#c58a12','#9a6608']},
  silver: {body:['#fbfcff','#c3cde0','#98a4bd'],                     rim:['#8793ad','#5f6b85']},
  bronze: {body:['#f9d7b4','#cf8f4c','#a8672c'],                     rim:['#8f5a26','#68401a']},
};
const stops = a => a.map((c, i) => `<stop offset="${(i / (a.length - 1) * 100).toFixed(0)}%" stop-color="${c}"/>`).join('');
const grads = Object.entries(PAL).map(([k, p]) =>
  `<linearGradient id="gb-${k}" gradientUnits="userSpaceOnUse" x1="6" y1="6" x2="42" y2="42">${stops(p.body)}</linearGradient>` +
  `<linearGradient id="gr-${k}" gradientUnits="userSpaceOnUse" x1="4" y1="4" x2="44" y2="44">${stops(p.rim)}</linearGradient>`).join('');
// 色の定義だけを入れた、画面には出ないSVG（各バッジがここを参照する）
const DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${grads}</defs></svg>`;

const hex = (r, cx = 24, cy = 24) => Array.from({length: 6}, (_, k) => {
  const a = (-90 + 60 * k) * Math.PI / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
});
const pts = a => a.map(p => p[0].toFixed(2) + ',' + p[1].toFixed(2)).join(' ');
const star = (R, r, n = 8) => Array.from({length: n * 2}, (_, k) => {
  const a = (-90 + 180 / n * k) * Math.PI / 180, d = k % 2 ? r : R;
  return [24 + d * Math.cos(a), 24 + d * Math.sin(a)];
});
const O = hex(21.5), I = hex(18.2), C = [24, 24];
const body = `<g transform="rotate(-12 24 24)">
  <polygon points="${pts(O)}" fill="url(#gr-RANK)"/>
  <polygon points="${pts(I)}" fill="url(#gb-RANK)"/>
  <polygon points="${pts([I[5], I[0], I[1], C])}" fill="#fff" fill-opacity=".34"/>
  <polygon points="${pts([I[2], I[3], I[4], C])}" fill="#000" fill-opacity=".13"/>
  <path d="${O.map((p, k) => `M${p[0].toFixed(2)} ${p[1].toFixed(2)}L${I[k][0].toFixed(2)} ${I[k][1].toFixed(2)}`).join('')}" stroke="#fff" stroke-opacity=".5" stroke-width=".7" fill="none"/>
  <polygon points="${pts(I)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width=".8"/>
</g>
<circle cx="24" cy="24" r="9.6" fill="#fff" fill-opacity=".18" stroke="#fff" stroke-width="1.7"/>
<polygon points="${pts(star(7.6, 2.6))}" fill="#fff"/>`;

// size を渡すと大きさを固定、渡さなければ CSS で決める
const rgem = (rank, size) => `<svg class="rgem ${rank}" viewBox="0 0 48 48"${size ? ` style="width:${size}px;height:${size}px"` : ''} aria-hidden="true">${body.replace(/RANK/g, rank)}</svg>`;
module.exports = {DEFS, rgem, body};
