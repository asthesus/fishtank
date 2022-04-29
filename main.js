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
    draw_static_stones();
    draw_global_wireframe();
}
global_scale = 12;
global_skew = 0.7;
global_height = 1;
x_boundary = 30;
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
const flat_map = (x, y) => {
    mapped = {};
    mapped.x = (y / global_scale / global_skew) + (x / -global_scale / 2);
    mapped.z = (x / -global_scale / 2) - (y / global_scale / global_skew);
    return mapped;
}
const isometric_pixel = (x, y, z, size) => {
    mapped = isometric_map(x, y, z);
    if(size > 1) {ctx_opaque.fillRect(mapped.x - (size / 2), mapped.y - (size / 2), size, size)} else ctx_opaque.fillRect(mapped.x, mapped.y, 1, 1);
}
stone = [];
static_stone = [];
const new_stone = (x, z) => {
    new_stone_object = {x: x, y: -y_boundary, z: z};
    new_stone_object.movement = {x: (Math.random() * 2 - 1) * 0.01, y: 0.1, z: (Math.random() * 2 - 1) * 0.01};
    stone.push(new_stone_object);
}
const move_stone = (stone_moved, integer) => {
    stone_moved.movement.x += (Math.random() * 2 - 1) * 0.001;
    // stone_moved.movement.y += 0.01;
    stone_moved.movement.z += (Math.random() * 2 - 1) * 0.001;
    stone_moved.x += stone_moved.movement.x;
    stone_moved.y += stone_moved.movement.y;
    stone_moved.z += stone_moved.movement.z;
    if(stone_moved.x > x_boundary) {stone_moved.x = x_boundary; stone_moved.movement.x /= 2};
    if(stone_moved.x < -x_boundary) {stone_moved.x = -x_boundary; stone_moved.movement.x /= 2};
    if(stone_moved.z > z_boundary) {stone_moved.z = z_boundary; stone_moved.movement.z /= 2};
    if(stone_moved.z < -z_boundary) {stone_moved.z = -z_boundary; stone_moved.movement.z /= 2};
    if(stone_moved.y > y_boundary) {
        stone_moved.y = y_boundary;
        stone_moved.movement.y = 0;
        stone.splice(integer, 1);
        static_stone.push(stone_moved);
        ctx_opaque.fillStyle = `#ff0`;
        mapped = isometric_map(stone_moved.x, stone_moved.y, stone_moved.z);
        ctx_opaque.fillRect(mapped.x, mapped.y, 1, 1);
    }
}
const move_stones = () => {
    for(i = 0; i < stone.length; i++) move_stone(stone[i], i);
}
const draw_stones = () => {
    for(i = 0; i < stone.length; i++) {
        ctx_transparent.fillStyle = `#ff0`;
        mapped = isometric_map(stone[i].x, stone[i].y, stone[i].z);
        ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
    }
}
const draw_static_stones = () => {
    for(i = 0; i < static_stone.length; i++) {
        ctx_opaque.fillStyle = `#ff0`;
        mapped = isometric_map(static_stone[i].x, static_stone[i].y, static_stone[i].z);
        ctx_opaque.fillRect(mapped.x, mapped.y, 1, 1);
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
    if(pix.x > x_boundary) {pix.x = x_boundary; pix.movement.x /= 2};
    if(pix.x < -x_boundary) {pix.x = -x_boundary; pix.movement.x /= 2};
    if(pix.y > y_boundary) {pix.y = y_boundary; pix.movement.y /= 2};
    if(pix.y < -y_boundary) {pix.y = -y_boundary; pix.movement.y /= 2};
    if(pix.z > z_boundary) {pix.z = z_boundary; pix.movement.z /= 2};
    if(pix.z < -z_boundary) {pix.z = -z_boundary; pix.movement.z /= 2};
    if(pix.movement.x > pix_movement_cap) pix.movement.x = pix_movement_cap;
    if(pix.movement.x < -pix_movement_cap) pix.movement.x = -pix_movement_cap;
    if(pix.movement.y > pix_movement_cap) pix.movement.y = pix_movement_cap;
    if(pix.movement.y < -pix_movement_cap) pix.movement.y = -pix_movement_cap;
    if(pix.movement.z > pix_movement_cap) pix.movement.z = pix_movement_cap;
    if(pix.movement.z < -pix_movement_cap) pix.movement.z = -pix_movement_cap;
}
const draw_pix = () => {
    ctx_opaque.fillStyle = `#f0f`;
    isometric_pixel(pix.x, pix.y, pix.z, 1);
}
const draw_axis = (x, y, z) => {
    x_axis_start = isometric_map(-x_boundary, y, z);
    x_axis_end = isometric_map(x_boundary, y, z);
    y_axis_start = isometric_map(x, -y_boundary, z);
    y_axis_end = isometric_map(x, y_boundary, z);
    z_axis_start = isometric_map(x, y, -z_boundary);
    z_axis_end = isometric_map(x, y, z_boundary);
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
    ctx_opaque.moveTo(a_mapped.x, a_mapped.y);
    ctx_opaque.lineTo(e_mapped.x, e_mapped.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(b_mapped.x, b_mapped.y);
    ctx_opaque.lineTo(f_mapped.x, f_mapped.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(c_mapped.x, c_mapped.y);
    ctx_opaque.lineTo(g_mapped.x, g_mapped.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(d_mapped.x, d_mapped.y);
    ctx_opaque.lineTo(h_mapped.x, h_mapped.y);
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
forest_drawn = false;
const sub_time = () => {
    ctx_transparent.clearRect(0, 0, canvas.width, canvas.height);
    // move_pix();
    mapped_cursor = flat_map(cursor_x, cursor_y + canvas.center.y / 2);
    if(!(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
        new_stone(mapped_cursor.x, mapped_cursor.z);
    }
    // if(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary) {
    //     if(mapped_cursor.x < -x_boundary) mapped_cursor.x = -x_boundary;
    //     if(mapped_cursor.x > x_boundary) mapped_cursor.x = x_boundary;
    //     if(mapped_cursor.z < -z_boundary) mapped_cursor.z = -z_boundary;
    //     if(mapped_cursor.z > z_boundary) mapped_cursor.z = z_boundary;
    //     mapped_cursor = isometric_map(mapped_cursor.x, -y_boundary, mapped_cursor.z);
    //     ctx_transparent.strokeStyle = `#5af`;
    //     ctx_transparent.beginPath();
    //     // ctx_transparent.moveTo(mapped_stone.x, mapped_stone.y);
    //     ctx_transparent.moveTo(mapped_cursor.x, mapped_cursor.y);
    //     ctx_transparent.lineTo(canvas.center.x + cursor_x, canvas.center.y + cursor_y);
    //     ctx_transparent.stroke();
    // } else {
    //     new_stone(mapped_cursor.x, mapped_cursor.z);
    // }
    move_stones();
    // draw_pix();
    // draw_axis(pix.x, pix.y, pix.z);
    draw_stones();
}
const time = () => {
    window.requestAnimationFrame(time);
    sub_time();
}
cursor_x = 0;
cursor_y = 0;
canvas_transparent.addEventListener(`mousedown`, e => {
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    if(e.button === 0) {
        // pix.x = flat_map(cursor_x, cursor_y + canvas.center.y / 2).x;
        // pix.y = -y_boundary;
        // pix.z = flat_map(cursor_x, cursor_y + canvas.center.y / 2).z;
        mapped_cursor = flat_map(cursor_x, cursor_y + canvas.center.y / 2);
        if(!(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
            new_stone(mapped_cursor.x, mapped_cursor.z);
        }
    } else if(e.button === 2) {
    }
})
canvas_transparent.addEventListener(`mouseup`, e => {
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    if(e.button === 0) {
    } else if(e.button === 2) {
    }
})
canvas_transparent.addEventListener(`mousemove`, e => {
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
})
window.addEventListener(`resize`, fit_canvas, false);
fit_canvas();
time();
draw_global_wireframe();