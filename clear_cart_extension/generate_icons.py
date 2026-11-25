import zlib
import struct
import math


def create_png(width, height, draw_func):
    def make_chunk(chunk_type, data):
        return (
            struct.pack('>I', len(data))
            + chunk_type
            + data
            + struct.pack('>I', zlib.crc32(chunk_type + data) & 0xffffffff)
        )

    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)
        for x in range(width):
            r, g, b, a = draw_func(x, y, width, height)
            raw_data.extend([int(r), int(g), int(b), int(a)])

    compressed = zlib.compress(bytes(raw_data), 9)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    return (
        b'\x89PNG\r\n\x1a\n'
        + make_chunk(b'IHDR', ihdr_data)
        + make_chunk(b'IDAT', compressed)
        + make_chunk(b'IEND', b'')
    )


def dist_to_segment(px, py, x1, y1, x2, y2):
    dx, dy = x2 - x1, y2 - y1
    l2 = dx * dx + dy * dy
    if l2 == 0:
        return math.hypot(px - x1, py - y1)
    t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / l2))
    proj_x = x1 + t * dx
    proj_y = y1 + t * dy
    return math.hypot(px - proj_x, py - proj_y)


def clearcart_icon_pixel(x, y, w, h):
    nx = (x / (w - 1)) * 2 - 1
    ny = (y / (h - 1)) * 2 - 1

    # Rounded square (squircle) SDF
    box = 0.66
    radius = 0.28
    qx = abs(nx) - box
    qy = abs(ny) - box
    sdf = math.hypot(max(qx, 0.0), max(qy, 0.0)) + min(max(qx, qy), 0.0) - radius

    if sdf > 0.05:
        return (0, 0, 0, 0)

    # Fresh light teal (#14B8A6) -> sky blue (#0EA5E9) diagonal gradient
    t = max(0.0, min(1.0, (nx + ny + 2.0) / 4.0))
    bg_r = int(20 * (1 - t) + 14 * t)
    bg_g = int(184 * (1 - t) + 165 * t)
    bg_b = int(166 * (1 - t) + 233 * t)

    # Crisp white shopping cart + checkmark stroke
    stroke = 0.075
    on_cart = False

    # Cart handle & left stem: (-0.52, -0.38) -> (-0.34, -0.38) -> (-0.18, 0.18)
    if dist_to_segment(nx, ny, -0.52, -0.38, -0.34, -0.38) < stroke:
        on_cart = True
    if dist_to_segment(nx, ny, -0.34, -0.38, -0.18, 0.18) < stroke:
        on_cart = True
    # Cart bottom & right wall: (-0.18, 0.18) -> (0.38, 0.18) -> (0.48, -0.18)
    if dist_to_segment(nx, ny, -0.18, 0.18, 0.38, 0.18) < stroke:
        on_cart = True
    if dist_to_segment(nx, ny, 0.38, 0.18, 0.48, -0.18) < stroke:
        on_cart = True
    # Cart top rim: (-0.28, -0.18) -> (0.48, -0.18)
    if dist_to_segment(nx, ny, -0.28, -0.18, 0.48, -0.18) < stroke:
        on_cart = True

    # Two cart wheels
    if math.hypot(nx - (-0.14), ny - 0.38) < 0.095:
        on_cart = True
    if math.hypot(nx - 0.32, ny - 0.38) < 0.095:
        on_cart = True

    # Clear checkmark inside cart basket
    on_check = (
        dist_to_segment(nx, ny, -0.02, -0.02, 0.08, 0.08) < 0.055
        or dist_to_segment(nx, ny, 0.08, 0.08, 0.28, -0.14) < 0.055
    )

    if on_cart:
        r, g, b = 255, 255, 255
    elif on_check:
        r, g, b = 254, 240, 138  # Soft warm cream-gold highlight
    else:
        r, g, b = bg_r, bg_g, bg_b

    # Smooth edge anti-aliasing
    alpha = 255
    if sdf > 0.0:
        alpha = int(max(0, min(255, (1.0 - sdf / 0.05) * 255)))

    return (r, g, b, alpha)


for size in [16, 48, 128]:
    png_bytes = create_png(size, size, clearcart_icon_pixel)
    with open(f'icons/icon{size}.png', 'wb') as f:
        f.write(png_bytes)
    print(f"Generated icons/icon{size}.png")
