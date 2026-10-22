/* ===== 効果音（ブルーアーカイブ風：水晶のようなベル＋上昇アルペジオ＋空間の響き） =====
   進捗に応じて、音の層が厚くなる。全部完了（all）が最大。
     step  … 連結の途中のステップ（ベル1音）
     clear … 1件完了。進捗 p が高いほど、重なる音・きらめきが増える
     all   … 全部完了。最大
     badge … 日中の金・銀に上がったとき
     undo  … 完了を戻したとき                                            */
const SFX = {ctx:null, bus:null, noise:null};
const SC = [392, 440, 523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51, 1567.98];  // ペンタトニック

function sfxLive(){
  const c = AL.ctx || ac || (ac = new (window.AudioContext || window.webkitAudioContext)());
  if (c.state === 'suspended') c.resume();
  return c;
}
function sfxBus(ctx){
  if (SFX.ctx === ctx && SFX.bus) return SFX.bus;
  const input = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();       // 重なっても割れないよう軽く圧縮する
  comp.threshold.value = -14; comp.knee.value = 18; comp.ratio.value = 5;
  comp.attack.value = .003; comp.release.value = .2;
  const master = ctx.createGain(); master.gain.value = .9;
  const conv = ctx.createConvolver();                 // 空間の響き
  const sr = ctx.sampleRate, len = Math.floor(sr * 1.6), ir = ctx.createBuffer(2, len, sr);
  for (let c = 0; c < 2; c++){
    const d = ir.getChannelData(c);
    for (let i = 0; i < len; i++){ const k = i / len; d[i] = (Math.random() * 2 - 1) * Math.pow(1 - k, 2.6) * (k < .02 ? k / .02 : 1); }
  }
  conv.buffer = ir;
  const wet = ctx.createGain(); wet.gain.value = .32;
  input.connect(comp); input.connect(conv); conv.connect(wet); wet.connect(comp);
  comp.connect(master); master.connect(ctx.destination);
  SFX.ctx = ctx; SFX.bus = input; SFX.noise = null;
  return input;
}
function sfxNoise(ctx){
  if (SFX.noise && SFX.noise.ctx === ctx) return SFX.noise.buf;
  const b = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate), d = b.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  SFX.noise = {ctx, buf:b};
  return b;
}
// 金属的な倍音を重ねたベル。高い倍音ほど早く消える（水晶のような音）
const BELL = [[1, 1, 1], [2.01, .5, .8], [2.76, .36, .6], [4.07, .2, .45], [5.43, .12, .35]];
function bellAt(ctx, out, f, t, dur, vol, bright = 1){
  BELL.forEach(([m, a, d]) => {
    const fr = f * m; if (fr > 11000) return;
    const o = ctx.createOscillator(), g = ctx.createGain(), end = t + dur * d;
    o.type = 'sine'; o.frequency.setValueAtTime(fr, t);
    g.gain.setValueAtTime(.0001, t);
    g.gain.linearRampToValueAtTime(vol * a * (m > 1 ? bright : 1), t + .004);
    g.gain.exponentialRampToValueAtTime(.0001, end);
    o.connect(g); g.connect(out); o.start(t); o.stop(end + .02);
  });
}
function clickAt(ctx, out, t, vol = .1){                // 触った瞬間の小さな「コツ」
  const s = ctx.createBufferSource(), hp = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = sfxNoise(ctx); hp.type = 'highpass'; hp.frequency.value = 2500;
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .03);
  s.connect(hp); hp.connect(g); g.connect(out); s.start(t, 0, .04);
}
function sweepAt(ctx, out, t, dur, vol){                // 上昇する「シュッ」
  const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
  s.buffer = sfxNoise(ctx); bp.type = 'bandpass'; bp.Q.value = 1.2;
  bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(7000, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * .85); g.gain.linearRampToValueAtTime(.0001, t + dur);
  s.connect(bp); bp.connect(g); g.connect(out); s.start(t, 0, dur + .05);
}
function glideAt(ctx, out, t, f0, f1, dur, vol){        // 音程が駆け上がる
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
  g.gain.setValueAtTime(.0001, t); g.gain.linearRampToValueAtTime(vol, t + dur * .8); g.gain.exponentialRampToValueAtTime(.0001, t + dur + .05);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .1);
}
function thumpAt(ctx, out, t, vol){                     // 低いインパクト
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(42, t + .24);
  g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + .3);
  o.connect(g); g.connect(out); o.start(t); o.stop(t + .32);
}
const SPARK = [2093, 2349, 2637, 3136, 3520, 4186];

const SFXDEF = {
  // 連結の途中：ベル1音。進むほど音が高く、わずかに大きくなる
  step(ctx, out, t, a = {}){
    const p = a.p ?? .3, f = SC[Math.min((a.pos || 1) + 1, SC.length - 1)];
    clickAt(ctx, out, t, .07);
    bellAt(ctx, out, f, t, .5, .13 + p * .07);
  },
  // 1件完了：p が高いほど層が増える（1層→2層→3層）
  clear(ctx, out, t, a = {}){
    const p = Math.min(Math.max(a.p ?? .3, 0), .99);
    const layers = Math.min(3, 1 + Math.floor(p * 3));
    const f = SC[Math.min(Math.round(p * 5) + 3, SC.length - 1)], v = .95 + .25 * p;
    clickAt(ctx, out, t, .09);
    bellAt(ctx, out, f, t, .6, .24 * v);
    if (layers >= 2) bellAt(ctx, out, f * 1.5, t + .07, .75, .12 * v);                 // 5度上が重なる
    if (layers >= 3){
      glideAt(ctx, out, t, f / 2, f * 2, .16, .05);                                   // 駆け上がり
      bellAt(ctx, out, f * 2, t + .14, .95, .11 * v);                                  // オクターブ上
      [0, 1, 2].forEach(i => bellAt(ctx, out, SPARK[(i * 2 + 1) % 6], t + .22 + i * .08, .5, .05, 1.2));
    }
  },
  // 全部完了：最大
  all(ctx, out, t){
    sweepAt(ctx, out, t, .42, .16);
    glideAt(ctx, out, t, 330, 1700, .42, .07);
    [523.25, 659.25, 783.99, 987.77, 1046.5, 1318.51].forEach((f, i) => bellAt(ctx, out, f, t + i * .066, .6, .13, .9));
    const h = t + .42;
    thumpAt(ctx, out, h, .5); clickAt(ctx, out, h, .15);
    [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98, 2093].forEach((f, i) =>
      bellAt(ctx, out, f, h + i * .012, 2.2, .18 - i * .009, 1.1));                    // 大きな和音
    bellAt(ctx, out, 261.63, h, 2.4, .22, .6);
    for (let k = 0; k < 14; k++)                                                        // 長いきらめき
      bellAt(ctx, out, SPARK[k % 6] * (k > 9 ? 1.5 : 1), h + .18 + k * .1 + (k % 2) * .03, .7, .055, 1.2);
  },
  // 日中の金・銀に上がったとき
  badge(ctx, out, t){
    clickAt(ctx, out, t, .08);
    [783.99, 1046.5, 1318.51].forEach((f, i) => bellAt(ctx, out, f, t + i * .09, .8, .17));
    [0, 1, 2].forEach(i => bellAt(ctx, out, SPARK[i * 2], t + .3 + i * .08, .5, .05, 1.2));
  },
  // 戻したとき：やわらかく下がる
  undo(ctx, out, t){
    bellAt(ctx, out, 523.25, t, .28, .1, .5);
    bellAt(ctx, out, 392, t + .07, .35, .09, .5);
  },
};
function sfx(name, arg){
  try{ const c = sfxLive(); SFXDEF[name](c, sfxBus(c), c.currentTime + .01, arg); }catch(e){}
}
/* ===== /効果音 ===== */
