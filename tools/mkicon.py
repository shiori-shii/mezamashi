# アプリアイコン生成（PIL不要・zlibで直接PNGを書き出す）
import zlib, struct, math, sys, os

OUT = sys.argv[1]

HOLO = [(0xff,0x9a,0xd5), (0x9a,0xd7,0xff), (0x9b,0xff,0xc6),
        (0xff,0xf5,0x9a), (0xd7,0xa5,0xff)]

def holo(a):            # a: 0..1 の角度 -> ホログラム色
    n = len(HOLO)
    x = (a % 1.0) * n
    i = int(x); f = x - i
    c0, c1 = HOLO[i % n], HOLO[(i + 1) % n]
    return tuple(c0[k] + (c1[k] - c0[k]) * f for k in range(3))

def render(size, ss=3):
    S = size * ss
    px = bytearray(S * S * 4)
    cx = cy = S / 2.0
    r_out = S * 0.40
    r_in  = S * 0.27
    for y in range(S):
        for x in range(S):
            dx, dy = x - cx + .5, y - cy + .5
            d = math.hypot(dx, dy)
            # 背景：中心が明るい紺のグラデーション
            t = min(1.0, d / (S * .72))
            r = 0x1d + (0x0b - 0x1d) * t
            g = 0x25 + (0x0f - 0x25) * t
            b = 0x50 + (0x1e - 0x50) * t
            if r_in <= d <= r_out:                      # ホログラムのリング
                a = (math.atan2(dy, dx) / (2 * math.pi)) + .5
                hr, hg, hb = holo(a * 1.0 + .08)
                # リングの縁をなめらかに
                edge = min(d - r_in, r_out - d) / (S * .03)
                k = max(0.0, min(1.0, edge))
                r = r + (hr - r) * k
                g = g + (hg - g) * k
                b = b + (hb - b) * k
            if d < S * 0.085:                           # 中央の光点
                k = 1.0 - d / (S * 0.085)
                r = r + (255 - r) * k
                g = g + (255 - g) * k
                b = b + (255 - b) * k
            o = (y * S + x) * 4
            px[o] = int(r); px[o+1] = int(g); px[o+2] = int(b); px[o+3] = 255
    # ss倍からダウンサンプル（アンチエイリアス）
    out = bytearray(size * size * 4)
    for y in range(size):
        for x in range(size):
            acc = [0, 0, 0, 0]
            for j in range(ss):
                for i in range(ss):
                    o = (((y * ss + j) * S) + (x * ss + i)) * 4
                    for k in range(4): acc[k] += px[o + k]
            o = (y * size + x) * 4
            for k in range(4): out[o + k] = acc[k] // (ss * ss)
    return bytes(out)

def png(path, size):
    raw = render(size)
    lines = b''.join(b'\x00' + raw[y*size*4:(y+1)*size*4] for y in range(size))
    def chunk(tag, data):
        return (struct.pack('>I', len(data)) + tag + data
                + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff))
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    with open(path, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n')
        f.write(chunk(b'IHDR', ihdr))
        f.write(chunk(b'IDAT', zlib.compress(lines, 9)))
        f.write(chunk(b'IEND', b''))
    print(path, size, os.path.getsize(path), 'bytes')

for s in (512, 192, 180, 32):
    png(os.path.join(OUT, 'icon-%d.png' % s), s)
