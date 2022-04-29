const canvas_opaque = document.getElementById(`canvas1`);
const canvas_transparent = document.getElementById(`canvas2`);
const ctx_opaque = canvas_opaque.getContext(`2d`);
const ctx_transparent = canvas_transparent.getContext(`2d`);
ctx_opaque.translate(0.5, 0.5);
ctx_opaque.lineWidth = 1;
ctx_transparent.translate(0.5, 0.5);
ctx_transparent.lineWidth = 1;
background = `#0a0a0a`;
foreground = `#aaa`;
canvas = {width: 0, height: 0, center: {x: 0, y: 0}};
canvas_opaque.background = () => {
    ctx_opaque.fillStyle = background;
    ctx_opaque.fillRect(0, 0, canvas_opaque.width, canvas_opaque.height);
}
fit_canvas = () => {
    canvas_opaque.width = window.innerWidth;
    canvas_opaque.height = window.innerHeight;
    canvas_transparent.width = window.innerWidth;
    canvas_transparent.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.center.x = canvas_opaque.width / 2;
    canvas.center.y = canvas_opaque.height / 2;
    canvas_opaque.background();
    draw_global_wireframe();
}
global_scale = 12;
global_skew = 0.7;
global_height = 1;
x_boundary = 20;
y_boundary = 20;
z_boundary = 20;
const isometric_map = (x, y, z) => {
    mapped = {};
    mapped.x = (z * -global_scale) + (x * -global_scale);
    mapped.y = (z * -global_scale * global_skew / 2) + (x * global_scale * global_skew / 2) + (y * global_scale * global_height);
    mapped.x += canvas.center.x;
    mapped.y += canvas.center.y;
    return mapped;
}
const isometric_pixel = (x, y, z, size) => {
    mapped = isometric_map(x, y, z);
    if(size > 1) {ctx_opaque.fillRect(mapped.x - (size / 2), mapped.y - (size / 2), size, size)} else ctx_opaque.fillRect(mapped.x, mapped.y, 1, 1)
}
const isometric_cube_wireframe = (x, y, z, size) => {
    //     a
    //     .
    // d.     .b
    //     .c
    //     
    //     .e
    // h.     .f
    //     .
    //     g
    ctx_opaque.fillStyle = `#500`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(a_mapped.x, a_mapped.y);
    ctx_opaque.lineTo(b_mapped.x, b_mapped.y);
    ctx_opaque.lineTo(c_mapped.x, c_mapped.y);
    ctx_opaque.lineTo(d_mapped.x, d_mapped.y);
    ctx_opaque.lineTo(a_mapped.x, a_mapped.y);
    ctx_opaque.fill();
}
const draw_floor = () => {
    for(i = -x_boundary; i < x_boundary; i++) {
        for(ii = -z_boundary; ii < z_boundary; ii++) {
            ctx_opaque.fillStyle = foreground;
            isometric_pixel(i, y_boundary, ii, 1);
        }
    }
}
const draw_ceiling = () => {
    for(i = -x_boundary; i < x_boundary; i++) {
        for(ii = -z_boundary; ii < z_boundary; ii++) {
            ctx_opaque.fillStyle = foreground;
            isometric_pixel(i, -y_boundary, ii, 1);
        }
    }
}
pix = {x: 0, y: 0, z: 0};
pix.movement = {x: 0, y: 0, z: 0};
pix_movement_cap = 1;
const move_pix = () => {
    pix.movement.x += (Math.random() * 2 - 1) * 0.01;
    pix.movement.y += (Math.random() * 2 - 1) * 0.01;
    pix.movement.z += (Math.random() * 2 - 1) * 0.01;
    pix.x += pix.movement.x;
    pix.y += pix.movement.y;
    pix.z += pix.movement.z;
    ctx_opaque.fillStyle = `#44f`;
    if(pix.x > x_boundary) {pix.x = x_boundary; pix.movement.x /= 2; isometric_pixel(pix.x, pix.y, pix.z, 10)};
    if(pix.x < -x_boundary) {pix.x = -x_boundary; pix.movement.x /= 2; isometric_pixel(pix.x, pix.y, pix.z, 10)};
    if(pix.y > y_boundary) {pix.y = y_boundary; pix.movement.y /= 2; isometric_pixel(pix.x, pix.y, pix.z, 10)};
    if(pix.y < -y_boundary) {pix.y = -y_boundary; pix.movement.y /= 2; isometric_pixel(pix.x, pix.y, pix.z, 10)};
    if(pix.z > z_boundary) {pix.z = z_boundary; pix.movement.z /= 2; isometric_pixel(pix.x, pix.y, pix.z, 10)};
    if(pix.z < -z_boundary) {pix.z = -z_boundary; pix.movement.z /= 2; isometric_pixel(pix.x, pix.y, pix.z, 10)};
    if(pix.movement.x > pix_movement_cap) pix.movement.x = pix_movement_cap;
    if(pix.movement.x < -pix_movement_cap) pix.movement.x = -pix_movement_cap;
    if(pix.movement.y > pix_movement_cap) pix.movement.y = pix_movement_cap;
    if(pix.movement.y < -pix_movement_cap) pix.movement.y = -pix_movement_cap;
    if(pix.movement.z > pix_movement_cap) pix.movement.z = pix_movement_cap;
    if(pix.movement.z < -pix_movement_cap) pix.movement.z = -pix_movement_cap;
}
const draw_pix = () => {
    ctx_opaque.fillStyle = `#f68`;
    isometric_pixel(pix.x, pix.y, pix.z, 1);
}
const draw_axis = (x, y, z) => {
    x_axis_start = isometric_map(-x_boundary, y, z);
    x_axis_end = isometric_map(x_boundary - 1, y, z);
    y_axis_start = isometric_map(x, -y_boundary, z);
    y_axis_end = isometric_map(x, y_boundary, z);
    z_axis_start = isometric_map(x, y, -z_boundary);
    z_axis_end = isometric_map(x, y, z_boundary - 1);
    ctx_transparent.strokeStyle = `#f00`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(x_axis_start.x, x_axis_start.y);
    ctx_transparent.lineTo(x_axis_end.x, x_axis_end.y);
    ctx_transparent.stroke();
    ctx_transparent.strokeStyle = `#0f0`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(y_axis_start.x, y_axis_start.y);
    ctx_transparent.lineTo(y_axis_end.x, y_axis_end.y);
    ctx_transparent.stroke();
    ctx_transparent.strokeStyle = `#00f`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(z_axis_start.x, z_axis_start.y);
    ctx_transparent.lineTo(z_axis_end.x, z_axis_end.y);
    ctx_transparent.stroke();
}
const draw_global_wireframe = () => {
    //     h
    //     .
    // g.     .e
    //     .f
    //     
    //     .d
    // c.     .a
    //     .
    //     b
    // bottom
    a_mapped = isometric_map(x_boundary, y_boundary, z_boundary);
    b_mapped = isometric_map(x_boundary, y_boundary, -z_boundary);
    c_mapped = isometric_map(-x_boundary, y_boundary, -z_boundary);
    d_mapped = isometric_map(-x_boundary, y_boundary, z_boundary);
    ctx_opaque.strokeStyle = `#555`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(a_mapped.x, a_mapped.y);
    ctx_opaque.lineTo(b_mapped.x, b_mapped.y);
    ctx_opaque.lineTo(c_mapped.x, c_mapped.y);
    ctx_opaque.lineTo(d_mapped.x, d_mapped.y);
    ctx_opaque.lineTo(a_mapped.x, a_mapped.y);
    ctx_opaque.stroke();
    // columns
    e_mapped = isometric_map(x_boundary, -y_boundary, z_boundary);
    f_mapped = isometric_map(x_boundary, -y_boundary, -z_boundary);
    g_mapped = isometric_map(-x_boundary, -y_boundary, -z_boundary);
    h_mapped = isometric_map(-x_boundary, -y_boundary, z_boundary);
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(b_mapped.x, b_mapped.y);
    ctx_opaque.lineTo(h_mapped.x, h_mapped.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(c_mapped.x, c_mapped.y);
    ctx_opaque.lineTo(g_mapped.x, g_mapped.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(a_mapped.x, a_mapped.y);
    ctx_opaque.lineTo(e_mapped.x, e_mapped.y);
    ctx_opaque.stroke();
    // top
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(e_mapped.x, e_mapped.y);
    ctx_opaque.lineTo(f_mapped.x, f_mapped.y);
    ctx_opaque.lineTo(g_mapped.x, g_mapped.y);
    ctx_opaque.lineTo(h_mapped.x, h_mapped.y);
    ctx_opaque.lineTo(e_mapped.x, e_mapped.y);
    ctx_opaque.stroke();
}
const sub_time = () => {
    ctx_transparent.clearRect(0, 0, canvas.width, canvas.height);
    move_pix();
    draw_pix();
    draw_axis(pix.x, pix.y, pix.z);
    draw_global_wireframe();
}
const time = () => {
    window.requestAnimationFrame(time);
    sub_time();
}
window.addEventListener(`resize`, fit_canvas, false);
fit_canvas();
time();
draw_global_wireframe();