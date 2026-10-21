// アイコン定義 v2。面（薄い塗り）＋線＋小さな濃い塗り、の3段構成でそろえる。
module.exports = {
  // 日中：中心の円＋8本の光線。光線は上下左右を菱形、斜めを短い線にして強弱をつける
  day: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="5.2" fill="currentColor" fill-opacity=".22"/>
    <path d="M12 2l1.5 3h-3zM12 22l-1.5-3h3zM2 12l3-1.5v3zM22 12l-3 1.5v-3z" fill="currentColor" stroke="none"/>
    <path d="M5.2 5.2l1.5 1.5M17.3 17.3l1.5 1.5M5.2 18.8l1.5-1.5M17.3 6.7l1.5-1.5"/>
  </svg>`,

  // 夜：三日月＋大小の星
  night: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18.6 14.6A8.2 8.2 0 0 1 8.6 4.6a8.2 8.2 0 1 0 10 10z" fill="currentColor" fill-opacity=".22"/>
    <path d="M17.4 2l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="currentColor" stroke="none"/>
    <path d="M21.4 10.2l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor" stroke="none"/>
  </svg>`,

  // 目覚まし：時計＋ベル2つ。ベルは頭が丸い小さな面にして、輪（ヘイロー）は文字盤の外周に
  alarm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="13.4" r="7.6" fill="currentColor" fill-opacity=".22"/>
    <circle cx="12" cy="13.4" r="4.6" stroke-width="1.1" stroke-opacity=".55"/>
    <path d="M12 9.6v3.9l2.8 1.7"/>
    <path d="M2.6 8.2a4.4 4.4 0 0 1 4-4.3M21.4 8.2a4.4 4.4 0 0 0-4-4.3" stroke-width="2"/>
    <circle cx="12" cy="13.4" r="1.2" fill="currentColor" stroke="none"/>
  </svg>`,

  // カレンダー：右上を斜めに切った面＋綴じ具＋チェック
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3.6 7.2a2 2 0 0 1 2-2h11.4l3.4 3.4v10.2a2 2 0 0 1-2 2H5.6a2 2 0 0 1-2-2z" fill="currentColor" fill-opacity=".22"/>
    <path d="M3.6 10.6h16.8"/>
    <path d="M8 2.6v4.2M14 2.6v4.2"/>
    <path d="M8 16.2l2.6 2.5 5-5.2" stroke-width="2.1"/>
  </svg>`,

  // 設定：3本のスライダー。つまみは同じ形（菱形）で位置だけずらす
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M3 6.5h8M17.6 6.5H21M3 12h2.6M12.2 12H21M3 17.5h10M19.6 17.5H21"/>
    <path d="M14.3 3.7l2.8 2.8-2.8 2.8-2.8-2.8z" fill="currentColor" fill-opacity=".22"/>
    <path d="M8.9 9.2l2.8 2.8-2.8 2.8L6.1 12z" fill="currentColor" fill-opacity=".22"/>
    <path d="M16.3 14.7l2.8 2.8-2.8 2.8-2.8-2.8z" fill="currentColor" fill-opacity=".22"/>
    <circle cx="14.3" cy="6.5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="8.9" cy="12" r="1" fill="currentColor" stroke="none"/>
    <circle cx="16.3" cy="17.5" r="1" fill="currentColor" stroke="none"/>
  </svg>`,
};
