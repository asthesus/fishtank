const canvas_opaque = document.getElementById(`canvas1`);
const canvas_static_transparent = document.getElementById(`canvas2`);
const canvas_transparent = document.getElementById(`canvas3`);
const ctx_opaque = canvas_opaque.getContext(`2d`);
const ctx_static_transparent = canvas_static_transparent.getContext(`2d`);
const ctx_transparent = canvas_transparent.getContext(`2d`);
let snail_sw_png = document.getElementById(`snail1_png`);
let snail_se_png = document.getElementById(`snail2_png`);
let snail_nw_png = document.getElementById(`snail3_png`);
let snail_ne_png = document.getElementById(`snail4_png`);
let snail_s_png = document.getElementById(`snail5_png`);
let snail_w_png = document.getElementById(`snail6_png`);
let snail_n_png = document.getElementById(`snail7_png`);
let snail_e_png = document.getElementById(`snail8_png`);
let shell_sw_png = document.getElementById(`shell1_png`);
let shell_se_png = document.getElementById(`shell2_png`);
let shell_nw_png = document.getElementById(`shell3_png`);
let shell_ne_png = document.getElementById(`shell4_png`);
let shell_s_png = document.getElementById(`shell5_png`);
let shell_w_png = document.getElementById(`shell6_png`);
let shell_n_png = document.getElementById(`shell7_png`);
let shell_e_png = document.getElementById(`shell8_png`);
let fish_sw_png = document.getElementById(`fish1_png`);
let fish_se_png = document.getElementById(`fish2_png`);
let fish_nw_png = document.getElementById(`fish3_png`);
let fish_ne_png = document.getElementById(`fish4_png`);
let fish_w_png = document.getElementById(`fish5_png`);
let fish_e_png = document.getElementById(`fish6_png`);
let fish_s_png = document.getElementById(`fish7_png`);
let fish_n_png = document.getElementById(`fish8_png`);
let fish_sw_flip_png = document.getElementById(`fish1flip_png`);
let fish_se_flip_png = document.getElementById(`fish2flip_png`);
let fish_nw_flip_png = document.getElementById(`fish3flip_png`);
let fish_ne_flip_png = document.getElementById(`fish4flip_png`);
let fish_w_flip_png = document.getElementById(`fish5flip_png`);
let fish_e_flip_png = document.getElementById(`fish6flip_png`);
let fish_s_flip_png = document.getElementById(`fish7flip_png`);
let fish_n_flip_png = document.getElementById(`fish8flip_png`);
//
ctx_opaque.translate(0.5, 0.5);
ctx_opaque.lineWidth = 1;
ctx_transparent.translate(0.5, 0.5);
ctx_transparent.lineWidth = 1;
// global variables
let global_tick = 0;
let global_scale = 12;
let global_angle = 0.7;
let global_height = 1;
let global_gravity = 0.000001;
let global_midnight = 10000;
let global_time_speed = 1;
let x_boundary = 30;
let y_boundary = 20;
let z_boundary = 20;
const boundary_map = {};
// const water_top_map = {};
let x_movement_boundary = 29.5;
let y_movement_boundary = 19;
let z_movement_boundary = 19.5;
let fish_starvation_cap = 2000000;
let snail_starvation_cap = 2000000;
let monster_starvation_cap = 20000;
const tentacle_monster = [];
let monster_movement_cap = 0.04;
const bubble = [];
let bubble_movement_cap = 0.025;
const food = [];
const static_food = [];
let food_cap = 2000;
const fish = [];
let fish_food_requirement = 10;
let fish_movement_cap = 0.03;
let fish_cap = 500;
const snail = [];
let snail_food_requirement = 30;
let snail_movement_cap = 0.01;
let snail_cap = 500;
const shell = [];
let cursor_selection = {};
let cursor_x = Infinity;
let cursor_y = Infinity;
let cursor_over_top = false;
const left_click = {x: 0, y: 0, held: false, vertical: 0};
const right_click = {x: 0, y: 0, held: false};
let background = `#0a0a0a`;
let foreground = `#aaa`;
//
const canvas = {width: 0, height: 0, center: {x: 0, y: 0}};
const draw_background = () => {
    ctx_opaque.fillStyle = background;
    ctx_opaque.fillRect(0, 0, canvas_opaque.width, canvas_opaque.height);
    draw_water();
    if(global_angle > 0) draw_ground(`ff`);
    draw_global_wireframe_back();
    draw_static_transparent();
}
const draw_static_transparent = () => {
    ctx_static_transparent.clearRect(0, 0, canvas.width, canvas.height);
    draw_static_foods();
    draw_shells();
}
const fit_canvas = () => {
    canvas_opaque.width = window.innerWidth;
    canvas_opaque.height = window.innerHeight;
    canvas_static_transparent.width = window.innerWidth;
    canvas_static_transparent.height = window.innerHeight;
    canvas_transparent.width = window.innerWidth;
    canvas_transparent.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.center.x = canvas_opaque.width / 2;
    canvas.center.y = canvas_opaque.height / 2;
    find_boundary_coordinates();
    draw_background();
}
const reskew = (value) => {
    global_angle = value;
    if(global_angle > 0) {
        fish_sw_png = document.getElementById(`fish1_png`);
        fish_se_png = document.getElementById(`fish2_png`);
        fish_nw_png = document.getElementById(`fish3_png`);
        fish_ne_png = document.getElementById(`fish4_png`);
        fish_sw_flip_png = document.getElementById(`fish1flip_png`);
        fish_se_flip_png = document.getElementById(`fish2flip_png`);
        fish_nw_flip_png = document.getElementById(`fish3flip_png`);
        fish_ne_flip_png = document.getElementById(`fish4flip_png`);
        fish_s_png = document.getElementById(`fish7_png`);
        fish_n_png = document.getElementById(`fish8_png`);
        fish_s_flip_png = document.getElementById(`fish7flip_png`);
        fish_n_flip_png = document.getElementById(`fish8flip_png`);
    } else {
        fish_nw_png = document.getElementById(`fish1_png`);
        fish_ne_png = document.getElementById(`fish2_png`);
        fish_sw_png = document.getElementById(`fish3_png`);
        fish_se_png = document.getElementById(`fish4_png`);
        fish_nw_flip_png = document.getElementById(`fish1flip_png`);
        fish_ne_flip_png = document.getElementById(`fish2flip_png`);
        fish_sw_flip_png = document.getElementById(`fish3flip_png`);
        fish_se_flip_png = document.getElementById(`fish4flip_png`);
        fish_n_png = document.getElementById(`fish7_png`);
        fish_s_png = document.getElementById(`fish8_png`);
        fish_n_flip_png = document.getElementById(`fish7flip_png`);
        fish_s_flip_png = document.getElementById(`fish8flip_png`);
    }
    find_boundary_coordinates();
    draw_background();
}
const isometric_to_screen = (x, y, z) => {
    let mapped = {};
    mapped.x = (z * -global_scale) + (x * -global_scale);
    mapped.y = (z * -global_scale * global_angle / 2) + (x * global_scale * global_angle / 2) + (y * global_scale * global_height);
    mapped.x += canvas.center.x;
    mapped.y += canvas.center.y;
    return mapped;
}
const screen_to_isometric = (x, y, elevation) => {
    y = (y - elevation * global_scale * global_height) / global_angle * 2;
    x /= global_scale;
    y /= global_scale;
    let mapped = {};
    mapped.x = (y - x) / 2;
    mapped.y = elevation;
    mapped.z = (-y - x) / 2;
    return mapped;
}
const isometric_distance = (x1, y1, z1, x2, y2, z2) => {
    return Math.sqrt(Math.abs((x1 - x2) ** 2) + Math.abs((y1 - y2) ** 2) + Math.abs((z1 - z2) ** 2));
}
const isometric_pixel = (x, y, z, size) => {
    let mapped = isometric_to_screen(x, y, z);
    if(size > 1) {ctx_transparent.fillRect(mapped.x - (size / 2), mapped.y - (size / 2), size, size)} else ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
}
const find_boundary_coordinates = () => {
    //     h
    //     .
    // g.     .e
    //     .f
    //     
    //     .d
    // c.     .a
    //     .
    //     b
    boundary_map.a = isometric_to_screen(x_boundary, y_boundary, z_boundary);
    boundary_map.b = isometric_to_screen(x_boundary, y_boundary, -z_boundary);
    boundary_map.c = isometric_to_screen(-x_boundary, y_boundary, -z_boundary);
    boundary_map.d = isometric_to_screen(-x_boundary, y_boundary, z_boundary);
    boundary_map.e = isometric_to_screen(x_boundary, -y_boundary, z_boundary);
    boundary_map.f = isometric_to_screen(x_boundary, -y_boundary, -z_boundary);
    boundary_map.g = isometric_to_screen(-x_boundary, -y_boundary, -z_boundary);
    boundary_map.h = isometric_to_screen(-x_boundary, -y_boundary, z_boundary);
}
const draw_ground = (alpha) => {
    ctx_opaque.fillStyle = `#362403${alpha}`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.lineTo(boundary_map.b.x, boundary_map.b.y);
    ctx_opaque.lineTo(boundary_map.c.x, boundary_map.c.y);
    ctx_opaque.lineTo(boundary_map.d.x, boundary_map.d.y);
    ctx_opaque.lineTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.fill();
}
const draw_water = () => {
    //     h
    //     .
    // g.     .e
    //     .f
    //     
    //     .d
    // c.     .a
    //     .
    //     b
    ctx_opaque.fillStyle = `#0070ff28`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.lineTo(boundary_map.d.x, boundary_map.d.y);
    ctx_opaque.lineTo(boundary_map.c.x, boundary_map.c.y);
    ctx_opaque.lineTo(boundary_map.g.x, boundary_map.g.y);
    if(global_angle > 0) {
        ctx_opaque.lineTo(boundary_map.h.x, boundary_map.h.y);
    } else {
        ctx_opaque.lineTo(boundary_map.f.x, boundary_map.f.y);
    }
    ctx_opaque.lineTo(boundary_map.e.x, boundary_map.e.y);
    ctx_opaque.lineTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.fill();
}
const draw_tentacle_monster = (integer) => {
    let mapped = isometric_to_screen(tentacle_monster[integer].x, tentacle_monster[integer].y, tentacle_monster[integer].z);
    ctx_transparent.lineWidth = 2;
    ctx_transparent.strokeStyle = `#f8a`;
    ctx_transparent.fillStyle = `#ff90b0e0`;
    for(let i = 0; i < 7; i++) {
        let mapped_tentacle = isometric_to_screen(tentacle_monster[integer].x + tentacle_monster[integer].tentacle[i].x, tentacle_monster[integer].y + tentacle_monster[integer].tentacle[i].y, tentacle_monster[integer].z + tentacle_monster[integer].tentacle[i].z);
        ctx_transparent.beginPath();
        ctx_transparent.moveTo(mapped.x, mapped.y);
        ctx_transparent.bezierCurveTo(mapped.x, mapped.y, (mapped.x + mapped_tentacle.x) / 2, (mapped.y + mapped_tentacle.y) / 2 - 30 * (2 - Math.abs(global_angle)) / 2, mapped_tentacle.x, mapped_tentacle.y);
        ctx_transparent.stroke();
    }
    ctx_transparent.beginPath();
    ctx_transparent.arc(mapped.x, mapped.y - tentacle_monster[integer].radius * (2 - Math.abs(global_angle)) / 2, tentacle_monster[integer].radius, 0, Math.PI * 2);
    ctx_transparent.fill();
    ctx_transparent.stroke();
    ctx_transparent.lineWidth = 1;
}
// const draw_tentacle_monsters = () => {
//     for(let i = 0; i < tentacle_monster.length; i++) {
//         draw_tentacle_monster(i);
//     }
// }
const age_tentacle_monster = (monster_moved, integer) => {
    // make tentacle positions relative to tentacle monster, rather than being relative to world
    monster_moved.starvation++;
    monster_moved.move_cycle++;
    if(monster_moved.move_cycle >= 200) {
        monster_moved.move_cycle = Math.floor(Math.random() * -50);
        monster_moved.movement.x += (Math.random() * 2 - 1) * 0.1;
        monster_moved.movement.y += (Math.random() * 2 - 1) * 0.01;
        monster_moved.movement.z += (Math.random() * 2 - 1) * 0.1;
        for(let i = 0; i < 7; i++) {
            monster_moved.tentacle[i].movement.x += (Math.random() * 2 - 1) * 0.05;
            monster_moved.tentacle[i].movement.y += (Math.random() * 2 - 1) * 0.05;
            monster_moved.tentacle[i].movement.z += (Math.random() * 2 - 1) * 0.05;
        }
    }
    monster_moved.x += monster_moved.movement.x;
    monster_moved.y += monster_moved.movement.y;
    monster_moved.z += monster_moved.movement.z;
    if(monster_moved.x + monster_moved.radius / global_scale > x_boundary) {monster_moved.x = x_boundary - monster_moved.radius / global_scale; monster_moved.movement.x *= 0.5};
    if(monster_moved.x - monster_moved.radius / global_scale < -x_boundary) {monster_moved.x = -x_boundary + monster_moved.radius / global_scale; monster_moved.movement.x *= 0.5};
    if(monster_moved.y + monster_moved.radius / global_scale * 2 > y_boundary) {monster_moved.y = y_boundary - monster_moved.radius / global_scale * 2; monster_moved.movement.y *= 0.5};
    if(monster_moved.y - monster_moved.radius / global_scale * 2 < -y_boundary) {monster_moved.y = -y_boundary + monster_moved.radius / global_scale * 2; monster_moved.movement.y *= 0.5};
    if(monster_moved.z + monster_moved.radius / global_scale > z_boundary) {monster_moved.z = z_boundary - monster_moved.radius / global_scale; monster_moved.movement.z *= 0.5};
    if(monster_moved.z - monster_moved.radius / global_scale < -z_boundary) {monster_moved.z = -z_boundary + monster_moved.radius / global_scale; monster_moved.movement.z *= 0.5};
    if(monster_moved.movement.x > monster_movement_cap) monster_moved.movement.x = monster_movement_cap;
    if(monster_moved.movement.x < -monster_movement_cap) monster_moved.movement.x = -monster_movement_cap;
    if(monster_moved.movement.y > monster_movement_cap) monster_moved.movement.y = monster_movement_cap;
    if(monster_moved.movement.y < -monster_movement_cap) monster_moved.movement.y = -monster_movement_cap;
    if(monster_moved.movement.z > monster_movement_cap) monster_moved.movement.z = monster_movement_cap;
    if(monster_moved.movement.z < -monster_movement_cap) monster_moved.movement.z = -monster_movement_cap;
    for(let i = 0; i < 7; i++) {
        let distance_from_tentacle_center = isometric_distance(monster_moved.tentacle[i].x + monster_moved.x, monster_moved.tentacle[i].y + monster_moved.y, monster_moved.tentacle[i].z + monster_moved.z, monster_moved.x, monster_moved.y + 4.5, monster_moved.z);
        if(distance_from_tentacle_center > 3.5) {
            monster_moved.tentacle[i].movement.x *= 0.9;
            monster_moved.tentacle[i].movement.y *= 0.9;
            monster_moved.tentacle[i].movement.z *= 0.9;
            if(Math.abs(monster_moved.tentacle[i].x) > 0.15) monster_moved.tentacle[i].x -= Math.sign(monster_moved.tentacle[i].x) * 0.01;
            if(Math.abs(monster_moved.tentacle[i].y - 3.5) > 0.15) monster_moved.tentacle[i].y -= Math.sign(monster_moved.tentacle[i].y - 3.5) * 0.01;
            if(Math.abs(monster_moved.tentacle[i].z) > 0.15) monster_moved.tentacle[i].z -= Math.sign(monster_moved.tentacle[i].z) * 0.01;
        }
        let tentacle_position = {
            x: monster_moved.tentacle[i].x + monster_moved.x,
            y: monster_moved.tentacle[i].y + monster_moved.y,
            z: monster_moved.tentacle[i].z + monster_moved.z
        }
        monster_moved.tentacle[i].x += monster_moved.tentacle[i].movement.x;
        monster_moved.tentacle[i].y += monster_moved.tentacle[i].movement.y;
        monster_moved.tentacle[i].z += monster_moved.tentacle[i].movement.z;
        if(tentacle_position.x > x_movement_boundary) {monster_moved.tentacle[i].x -= 0.1; monster_moved.tentacle[i].movement.x *= 0.5};
        if(tentacle_position.x < -x_movement_boundary) {monster_moved.tentacle[i].x += 0.1; monster_moved.tentacle[i].movement.x *= 0.5};
        if(tentacle_position.y > y_movement_boundary) {monster_moved.tentacle[i].y -= 0.1; monster_moved.tentacle[i].movement.y *= 0.5};
        if(tentacle_position.y < -y_movement_boundary) {monster_moved.tentacle[i].y += 0.1; monster_moved.tentacle[i].movement.y *= 0.5};
        if(tentacle_position.z > z_movement_boundary) {monster_moved.tentacle[i].z -= 0.1; monster_moved.tentacle[i].movement.z *= 0.5};
        if(tentacle_position.z < -z_movement_boundary) {monster_moved.tentacle[i].z += 0.1; monster_moved.tentacle[i].movement.z *= 0.5};
        if(monster_moved.tentacle[i].movement.x > monster_movement_cap) monster_moved.tentacle[i].movement.x = monster_movement_cap;
        if(monster_moved.tentacle[i].movement.x < -monster_movement_cap) monster_moved.tentacle[i].movement.x = -monster_movement_cap;
        if(monster_moved.tentacle[i].movement.y > monster_movement_cap) monster_moved.tentacle[i].movement.y = monster_movement_cap;
        if(monster_moved.tentacle[i].movement.y < -monster_movement_cap) monster_moved.tentacle[i].movement.y = -monster_movement_cap;
        if(monster_moved.tentacle[i].movement.z > monster_movement_cap) monster_moved.tentacle[i].movement.z = monster_movement_cap;
        if(monster_moved.tentacle[i].movement.z < -monster_movement_cap) monster_moved.tentacle[i].movement.z = -monster_movement_cap;
        if(monster_moved.tentacle[i].prey_held) {
            monster_moved.tentacle[i].prey.move_cycle = 0;
            monster_moved.tentacle[i].prey.x = (monster_moved.tentacle[i].x + monster_moved.x);
            monster_moved.tentacle[i].prey.y = (monster_moved.tentacle[i].y + monster_moved.y);
            monster_moved.tentacle[i].prey.z = (monster_moved.tentacle[i].z + monster_moved.z);
        }
    }
    // eat
    for(let i = 0; i < 7; i++) {
        let tentacle_position = {
            x: monster_moved.tentacle[i].x + monster_moved.x,
            y: monster_moved.tentacle[i].y + monster_moved.y,
            z: monster_moved.tentacle[i].z + monster_moved.z
        }
        if(!monster_moved.tentacle[i].prey_held) {
            for(let ii = 0; ii < fish.length; ii++) {
                let prey_already_held = false;
                for(let iii = 0; iii < 7; iii++) {if(monster_moved.tentacle[iii].prey_id === fish[ii].id) prey_already_held = true};
                if(!prey_already_held && Math.abs(tentacle_position.x - fish[ii].x) <= 1 && Math.abs(tentacle_position.y - fish[ii].y) <= 1 && Math.abs(tentacle_position.z - fish[ii].z) <= 1) {
                    let distance_from_fish = isometric_distance(tentacle_position.x, tentacle_position.y, tentacle_position.z, fish[ii].x, fish[ii].y, fish[ii].z);
                    if(distance_from_fish <= 1) {
                        monster_moved.tentacle[i].prey = fish[ii];
                        monster_moved.tentacle[i].prey_id = fish[ii].id;
                        monster_moved.tentacle[i].prey_held = true;
                        i = 7;
                        ii = fish.length;
                    }
                }
            }
        } else {
            monster_moved.tentacle[i].movement.x *= 0.5;
            monster_moved.tentacle[i].movement.y *= 0.5;
            monster_moved.tentacle[i].movement.z *= 0.5;
            if(Math.abs(monster_moved.tentacle[i].x) > 0.06) monster_moved.tentacle[i].x -= Math.sign(monster_moved.tentacle[i].x) * 0.05;
            if(Math.abs(monster_moved.tentacle[i].y) > 0.06) monster_moved.tentacle[i].y -= Math.sign(monster_moved.tentacle[i].y) * 0.05;
            if(Math.abs(monster_moved.tentacle[i].z) > 0.06) monster_moved.tentacle[i].z -= Math.sign(monster_moved.tentacle[i].z) * 0.05;
            let distance_from_fish = isometric_distance(monster_moved.x, monster_moved.y, monster_moved.z, tentacle_position.x, tentacle_position.y, tentacle_position.z);
            if(distance_from_fish <= 1) {
                monster_moved.tentacle[i].prey = {};
                monster_moved.tentacle[i].prey_held = false;
                for(ii = 0; ii < fish.length; ii++) {
                    if(fish[ii].id === monster_moved.tentacle[i].prey_id) {fish.splice(ii, 1); ii = fish.length};
                }
                monster_moved.starvation = 0;
                monster_moved.food++;
            }
        }
    }
    if(monster_moved.starvation >= monster_starvation_cap) {
        if(monster_moved.food > 0) {monster_moved.food--} else tentacle_monster.splice(integer, 1);
    }
}
const age_tentacle_monsters = () => {
    for(i = 0; i < tentacle_monster.length; i++) {
        age_tentacle_monster(tentacle_monster[i], i);
    }
}
const new_bubbles = (x, y, z, number) => {
    for(let i = 0; i < number; i++) {
        let new_bubble_object = {x: x, y: y, z: z, maximum: Math.ceil(Math.random() * 20), size: 2};
        new_bubble_object.movement = {x: (Math.random() * 2 - 1) * 0.01, y: (Math.random() * 2 - 1) * 0.01, z: (Math.random() * 2 - 1) * 0.01};
        bubble.push(new_bubble_object);
    }
}
const age_bubbles = () => {
    for(i = 0; i < bubble.length; i++) {
        bubble_moved = bubble[i];
        if(bubble_moved.size < bubble_moved.maximum) bubble_moved.size += bubble_moved.size ** 2 * Math.random() * 0.001;
        bubble_moved.movement.x += (Math.random() * 2 - 1) * 0.005;
        bubble_moved.movement.y -= 0.0001 * bubble_moved.size;
        bubble_moved.movement.z += (Math.random() * 2 - 1) * 0.005;
        bubble_moved.x += bubble_moved.movement.x;
        bubble_moved.y += bubble_moved.movement.y;
        bubble_moved.z += bubble_moved.movement.z;
        if(bubble_moved.x > x_boundary) {bubble_moved.x = x_boundary; bubble_moved.movement.x *= 0.5};
        if(bubble_moved.x < -x_boundary) {bubble_moved.x = -x_boundary; bubble_moved.movement.x *= 0.5};
        if(bubble_moved.z > z_boundary) {bubble_moved.z = z_boundary; bubble_moved.movement.z *= 0.5};
        if(bubble_moved.z < -z_boundary) {bubble_moved.z = -z_boundary; bubble_moved.movement.z *= 0.5};
        if(bubble_moved.movement.x > bubble_movement_cap) bubble_moved.movement.x = bubble_movement_cap;
        if(bubble_moved.movement.x < -bubble_movement_cap) bubble_moved.movement.x = -bubble_movement_cap;
        if(bubble_moved.movement.z > bubble_movement_cap) bubble_moved.movement.z = bubble_movement_cap;
        if(bubble_moved.movement.z < -bubble_movement_cap) bubble_moved.movement.z = -bubble_movement_cap;
        if(bubble_moved.y > y_boundary) {bubble_moved.y = y_boundary; bubble_moved.movement.y *= 0.5};
        if(bubble_moved.y < -y_boundary) {bubble.splice(i, 1); i--};
    }
}
const draw_bubbles = () => {
    for(let i = 0; i < bubble.length; i++) {
        ctx_transparent.strokeStyle = `#70ffff70`;
        let mapped = isometric_to_screen(bubble[i].x, bubble[i].y, bubble[i].z);
        ctx_transparent.beginPath();
        ctx_transparent.arc(mapped.x, mapped.y, bubble[i].size / 2, 0, Math.PI * 2);
        ctx_transparent.stroke();
    }
}
const new_food = (x, y, z) => {
    let new_food_object = {x: x, y: y, z: z};
    new_food_object.movement = {x: (Math.random() * 2 - 1) * 0.01, y: (Math.random() * 2 - 1) * 0.01, z: (Math.random() * 2 - 1) * 0.01};
    food.push(new_food_object);
}
const age_food = (food_moved, integer) => {
    food_moved.movement.x += (Math.random() * 2 - 1) * 0.00005;
    food_moved.movement.y += (Math.random() * 2 - 1) * 0.00005 + global_gravity;
    food_moved.movement.z += (Math.random() * 2 - 1) * 0.00005;
    food_moved.x += food_moved.movement.x;
    food_moved.y += food_moved.movement.y;
    food_moved.z += food_moved.movement.z;
    if(food_moved.x > x_boundary) {food_moved.x = x_boundary; food_moved.movement.x *= 0.5};
    if(food_moved.x < -x_boundary) {food_moved.x = -x_boundary; food_moved.movement.x *= 0.5};
    if(food_moved.z > z_boundary) {food_moved.z = z_boundary; food_moved.movement.z *= 0.5};
    if(food_moved.z < -z_boundary) {food_moved.z = -z_boundary; food_moved.movement.z *= 0.5};
    if(food_moved.y < -y_boundary) {food_moved.y = -y_boundary; food_moved.movement.y *= 0.5};
    if(food_moved.y > y_boundary) {
        food_moved.y = y_boundary;
        delete food_moved.movement;
        food_moved.x = Math.ceil(food_moved.x * 8) / 8;
        food_moved.z = Math.floor(food_moved.z * 8) / 8;
        food.splice(integer, 1);
        static_food.push(food_moved);
        draw_static_food(static_food.length - 1);
    }
}
const age_foods = () => {
    for(let i = 0; i < food.length; i++) age_food(food[i], i);
}
// const draw_food = () => {
//     for(let i = 0; i < food.length; i++) {
//         ctx_transparent.fillStyle = `#ff0`;
//         let mapped = isometric_to_screen(food[i].x, food[i].y, food[i].z);
//         ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
//     }
// }
const draw_static_food = (integer) => {
    ctx_static_transparent.fillStyle = `#660`;
    let mapped = isometric_to_screen(static_food[integer].x, y_boundary, static_food[integer].z);
    ctx_static_transparent.fillRect(mapped.x, mapped.y, 1, 1);
}
const draw_static_foods = () => {for(let i = 0; i < static_food.length; i++) draw_static_food(i)};
const age_fish = (fish_moved, integer) => {
    fish_moved.starvation++;
    fish_moved.flip_cycle++;
    fish_moved.move_cycle++;
    if(fish_moved.flip_cycle >= 100) {
        fish_moved.flip_cycle = Math.floor(Math.random() * 75);
        fish_moved.flip = !fish_moved.flip;
    }
    if(fish_moved.move_cycle >= 200) {
        let food_boost = food.length;
        if(food_boost > 500) food_boost = 500;
        fish_moved.move_cycle = Math.floor(Math.random() * -50) + Math.floor(food_boost * 0.3);
        fish_moved.movement.x += (Math.random() * 2 - 1) * 0.001 * (food_boost * 0.3 + 1);
        fish_moved.movement.y += (Math.random() * 2 - 1) * 0.0001 * (food_boost * 0.3 + 1);
        fish_moved.movement.z += (Math.random() * 2 - 1) * 0.001 * (food_boost * 0.3 + 1);
    }
    fish_moved.x += fish_moved.movement.x;
    fish_moved.y += fish_moved.movement.y;
    fish_moved.z += fish_moved.movement.z;
    ctx_opaque.fillStyle = `#44f`;
    if(fish_moved.x > x_movement_boundary) {fish_moved.x = x_movement_boundary; fish_moved.movement.x *= 0.5};
    if(fish_moved.x < -x_movement_boundary) {fish_moved.x = -x_movement_boundary; fish_moved.movement.x *= 0.5};
    if(fish_moved.y > y_movement_boundary) {fish_moved.y = y_movement_boundary; fish_moved.movement.y *= 0.5};
    if(fish_moved.y < -y_movement_boundary) {fish_moved.y = -y_movement_boundary; fish_moved.movement.y *= 0.5};
    if(fish_moved.z > z_movement_boundary) {fish_moved.z = z_movement_boundary; fish_moved.movement.z *= 0.5};
    if(fish_moved.z < -z_movement_boundary) {fish_moved.z = -z_movement_boundary; fish_moved.movement.z *= 0.5};
    if(fish_moved.movement.x > fish_movement_cap) fish_moved.movement.x = fish_movement_cap;
    if(fish_moved.movement.x < -fish_movement_cap) fish_moved.movement.x = -fish_movement_cap;
    if(fish_moved.movement.y > fish_movement_cap) fish_moved.movement.y = fish_movement_cap;
    if(fish_moved.movement.y < -fish_movement_cap) fish_moved.movement.y = -fish_movement_cap;
    if(fish_moved.movement.z > fish_movement_cap) fish_moved.movement.z = fish_movement_cap;
    if(fish_moved.movement.z < -fish_movement_cap) fish_moved.movement.z = -fish_movement_cap;
    // eat
    let fed = false;
    for(let ii = 0; ii < food.length; ii++) {
        if(Math.abs(fish_moved.x - food[ii].x) <= 1 && Math.abs(fish_moved.y - food[ii].y) <= 1 && Math.abs(fish_moved.z - food[ii].z) <= 1) {
            distance_from_food = Math.sqrt((Math.abs(fish_moved.x - food[ii].x) ** 2) + (Math.abs(fish_moved.y - food[ii].y) ** 2) + (Math.abs(fish_moved.z - food[ii].z) ** 2));
            if(distance_from_food <= 1) {
                food.splice(ii, 1);
                fed = true;
                ii--;
            }
        }
    }
    if(fed) {
        fish_moved.food++;
        fish_moved.starvation = 0;
    }
    if(fed && fish_moved.food >= fish_food_requirement && fish.length < fish_cap) {
        fish_moved.food = 0;
        new_creature(fish, 1, false, fish_moved.x, fish_moved.y, fish_moved.z);
    }
    if(fish_moved.starvation >= fish_starvation_cap) {
        if(fish_moved.food > 0) {fish_moved.food--} else fish.splice(integer, 1);
    }
}
const age_fishes = () => {
    for(let i = 0; i < fish.length; i++) age_fish(fish[i], i);
}
const draw_fish = (integer) => {
    let mapped = isometric_to_screen(fish[integer].x, fish[integer].y, fish[integer].z);
    let fish_image;
    if(fish[integer].movement.x <= 0) {
        if(fish[integer].movement.z <= 0) {
            if(fish[integer].movement.x / fish[integer].movement.z <= 1) {
                // east
                if(fish[integer].flip) {
                    fish_image = fish_e_flip_png;
                } else {
                    fish_image = fish_e_png;
                }
            } else {
                // north east
                if(fish[integer].flip) {
                    fish_image = fish_ne_flip_png;
                } else {
                    fish_image = fish_ne_png;
                }
            }
        } else {
            if(fish[integer].movement.x / fish[integer].movement.z <= -1) {
                // north
                if(fish[integer].flip) {
                    fish_image = fish_n_flip_png;
                } else {
                    fish_image = fish_n_png;
                }
            } else {
                // north west
                if(fish[integer].flip) {
                    fish_image = fish_nw_flip_png;
                } else {
                    fish_image = fish_nw_png;
                }
            }
        }
    } else {
        if(fish[integer].movement.z <= 0) {
            if(fish[integer].movement.x / fish[integer].movement.z <= -1) {
                // south
                if(fish[integer].flip) {
                    fish_image = fish_s_flip_png;
                } else {
                    fish_image = fish_s_png;
                }
            } else {
                // south east
                if(fish[integer].flip) {
                    fish_image = fish_se_flip_png;
                } else {
                    fish_image = fish_se_png;
                }
            }
        } else {
            if(fish[integer].movement.x / fish[integer].movement.z <= 1) {
                // west
                if(fish[integer].flip) {
                    fish_image = fish_w_flip_png;
                } else {
                    fish_image = fish_w_png;
                }
            } else {
                // south west
                if(fish[integer].flip) {
                    fish_image = fish_sw_flip_png;
                } else {
                    fish_image = fish_sw_png;
                }
            }
        }
    }
    ctx_transparent.drawImage(fish_image, mapped.x - 16, mapped.y - 16);
}
const draw_water_objects = () => {
    let proximity_list = [];
    let draw_list = [];
    for(let i = 0; i < food.length; i++) {
        proximity_list[i] = Math.sqrt(Math.abs(food[i].x - x_boundary) ** 2 + Math.abs(food[i].z - -z_boundary) ** 2);
    }
    for(let i = food.length; i < food.length + fish.length; i++) {
        proximity_list[i] = Math.sqrt(Math.abs(fish[i - food.length].x - x_boundary) ** 2 + Math.abs(fish[i - food.length].z - -z_boundary) ** 2);
    }
    for(let i = food.length + fish.length; i < food.length + fish.length + tentacle_monster.length; i++) {
        proximity_list[i] = Math.sqrt(Math.abs(tentacle_monster[i - food.length - fish.length].x - x_boundary) ** 2 + Math.abs(tentacle_monster[i - food.length - fish.length].z - -z_boundary) ** 2);
    }
    while(draw_list.length < food.length + fish.length + tentacle_monster.length) {
        let closest = 0;
        let closest_creature = 0;
        for(let i = 0; i < proximity_list.length; i++) {
            if(proximity_list[i] > closest) {
                closest = proximity_list[i];
                closest_creature = i;
            }
        }
        draw_list.push(closest_creature);
        proximity_list[closest_creature] = 0;
    }
    for(let i = 0; i < draw_list.length; i++) {
        let integer = draw_list[i];
        if(integer < food.length) {
            ctx_transparent.fillStyle = `#ff0`;
            let mapped = isometric_to_screen(food[integer].x, food[integer].y, food[integer].z);
            ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
        } else if(integer < food.length + fish.length) {
            draw_fish(integer - food.length);
        } else {
            draw_tentacle_monster(integer - food.length - fish.length);
        }
    }
}
random_isometric = (boundary) => {return Math.random() * boundary * 2 - boundary};
const new_creature = (array, quantity, random, x, y, z) => {
    for(let i = 0; i < quantity; i++) {
        if(array === fish) {
            let movement_x = (Math.random() * 2 - 1) * 0.01;
            let movement_y = (Math.random() * 2 - 1) * 0.001;
            let movement_z = (Math.random() * 2 - 1) * 0.01;
            let new_creature_object = {x: x, y: y, z: z, movement: {x: movement_x, y: movement_y, z: movement_z}, starvation: 0, food: 0, move_cycle: 0, flip_cycle: 0, flip: false, id: Symbol()};
            if(random) {
                new_creature_object.x = random_isometric(x_boundary);
                new_creature_object.y = random_isometric(y_boundary);
                new_creature_object.z = random_isometric(z_boundary);
            }
            new_creature_object.move_cycle -= Math.floor(Math.random() * -50);
            new_creature_object.starvation += Math.floor(Math.random() * fish_starvation_cap * 0.5);
            fish.push(new_creature_object);
        }
        if(array === snail) {
            let movement_x = (Math.random() * 2 - 1) * 0.001;
            let movement_z = (Math.random() * 2 - 1) * 0.001;
            let new_creature_object = {x: x, y: y, z: z, movement: {x: movement_x, y: 0, z: movement_z}, starvation: 0, food: 0, move_cycle: 0};
            if(random) {
                new_creature_object.x = random_isometric(x_boundary);
                new_creature_object.y = y_boundary;
                new_creature_object.z = random_isometric(z_boundary);
            }
            new_creature_object.move_cycle -= Math.floor(Math.random() * -50);
            new_creature_object.starvation += Math.floor(Math.random() * snail_starvation_cap * 0.5);
            snail.push(new_creature_object);
        }
        if(array === tentacle_monster) {
            let movement_x = (Math.random() * 2 - 1) * 0.01;
            let movement_y = (Math.random() * 2 - 1) * 0.001;
            let movement_z = (Math.random() * 2 - 1) * 0.01;
            let new_creature_object = {x: x, y: y, z: z, movement: {x: movement_x, y: movement_y, z: movement_z}, starvation: 0, food: 0, move_cycle: 0, radius: 16};
            if(random) {
                new_creature_object.x = random_isometric(x_boundary);
                new_creature_object.y = random_isometric(y_boundary);
                new_creature_object.z = random_isometric(z_boundary);
            }
            new_creature_object.tentacle = [];
            for(let i = 0; i < 7; i++) {
                new_creature_object.tentacle[i] = {x, y, z, movement: {x: 0, y: 0, z: 0}, prey_held: false, prey: {}, prey_id: 0};
                new_creature_object.tentacle[i].x = (Math.random() * 7) - 3.5;
                new_creature_object.tentacle[i].y = (Math.random() * 7);
                new_creature_object.tentacle[i].z = (Math.random() * 7) - 3.5;
            }
            new_creature_object.move_cycle -= Math.floor(Math.random() * -50);
            new_creature_object.starvation += Math.floor(Math.random() * monster_starvation_cap * 0.5);
            tentacle_monster.push(new_creature_object);
        }
    }
}
const kill_snail = (integer) => {
    let new_shell_object = {x: snail[integer].x, y: y_boundary, z: snail[integer].z, facing: snail[integer].movement};
    new_bubbles(snail[integer].x, y_boundary, snail[integer].z, Math.floor(Math.random() * 3) + 2);
    shell.push(new_shell_object);
    snail.splice(integer, 1);
    draw_shell(shell.length - 1);
}
const age_snail = (snail_moved, integer) => {
    snail_moved.starvation++;
    snail_moved.move_cycle++;
    if(snail_moved.move_cycle >= 400) {
        snail_moved.move_cycle = Math.floor(Math.random() * -100);
        snail_moved.movement.x += (Math.random() * 2 - 1) * 0.001;
        snail_moved.movement.z += (Math.random() * 2 - 1) * 0.001;
    }
    snail_moved.x += snail_moved.movement.x;
    snail_moved.z += snail_moved.movement.z;
    ctx_opaque.fillStyle = `#44f`;
    if(snail_moved.x > x_movement_boundary) {snail_moved.x = x_movement_boundary; snail_moved.movement.x *= 0.5};
    if(snail_moved.x < -x_movement_boundary) {snail_moved.x = -x_movement_boundary; snail_moved.movement.x *= 0.5};
    if(snail_moved.z > z_movement_boundary) {snail_moved.z = z_movement_boundary; snail_moved.movement.z *= 0.5};
    if(snail_moved.z < -z_movement_boundary) {snail_moved.z = -z_movement_boundary; snail_moved.movement.z *= 0.5};
    if(snail_moved.movement.x > snail_movement_cap) snail_moved.movement.x = snail_movement_cap;
    if(snail_moved.movement.x < -snail_movement_cap) snail_moved.movement.x = -snail_movement_cap;
    if(snail_moved.movement.z > snail_movement_cap) snail_moved.movement.z = snail_movement_cap;
    if(snail_moved.movement.z < -snail_movement_cap) snail_moved.movement.z = -snail_movement_cap;
    // eat
    let fed = false;
    for(let ii = 0; ii < static_food.length; ii++) {
        if(Math.abs(snail_moved.x - static_food[ii].x) <= 0.5 && Math.abs(snail_moved.z - static_food[ii].z) <= 0.5) {
            distance_from_food = Math.sqrt((Math.abs(snail_moved.x - static_food[ii].x) ** 2) + (Math.abs(snail_moved.z - static_food[ii].z) ** 2));
            if(distance_from_food <= 0.5) {
                static_food.splice(ii, 1);
                ii--;
                fed = true;
                draw_static_transparent();
            }
        }
    }
    if(fed) {
        snail_moved.food++;
        snail.starvation = 0;
    }
    if(fed && snail_moved.food >= snail_food_requirement && snail.length < snail_cap) {
        snail_moved.food = 0;
        new_creature(snail, 1, false, snail_moved.x, y_boundary, snail_moved.z);
    }
    if(snail_moved.starvation >= snail_starvation_cap) {
        if(snail_moved.food > 0) {snail_moved.food--} else kill_snail(integer);
    }
}
const age_snails = () => {
    for(let i = 0; i < snail.length; i++) age_snail(snail[i], i);
}
const draw_snail = (integer) => {
    let mapped = isometric_to_screen(snail[integer].x, y_boundary, snail[integer].z);
    let snail_image;
    if(snail[integer].movement.x <= 0) {
        if(snail[integer].movement.z <= 0) {
            if(snail[integer].movement.x / snail[integer].movement.z <= 1) {
                // east
                snail_image = snail_e_png;
            } else {
                // north east
                snail_image = snail_ne_png;
            }
        } else {
            if(snail[integer].movement.x / snail[integer].movement.z <= -1) {
                // north
                snail_image = snail_n_png;
            } else {
                // north west
                snail_image = snail_ne_png;
            }
        }
    } else {
        if(snail[integer].movement.z <= 0) {
            if(snail[integer].movement.x / snail[integer].movement.z <= -1) {
                // south
                snail_image = snail_s_png;
            } else {
                // south east
                snail_image = snail_se_png;
            }
        } else {
            if(snail[integer].movement.x / snail[integer].movement.z <= 1) {
                // west
                snail_image = snail_w_png;
            } else {
                // south west
                snail_image = snail_sw_png;
            }
        }
    }
    ctx_transparent.drawImage(snail_image, mapped.x - 16, mapped.y - 25);
    ctx_opaque.fillStyle = `#262402`;
    mapped = isometric_to_screen(snail[integer].x, y_boundary, snail[integer].z);
    ctx_opaque.fillRect(mapped.x - 1, mapped.y - 1, 2, 2);
}
const draw_snails = () => {
    let proximity_list = [];
    let draw_list = [];
    for(let i = 0; i < snail.length; i++) {
        let mapped = isometric_to_screen(snail[i].x, snail[i].y, snail[i].z);
        proximity_list[i] = mapped.y;
    }
    while(draw_list.length < snail.length) {
        let highest = Infinity;
        let highest_snail = 0;
        for(let i = 0; i < proximity_list.length; i++) {
            if(proximity_list[i] < highest) {
                highest = proximity_list[i];
                highest_snail = i;
            }
        }
        draw_list.push(highest_snail);
        proximity_list[highest_snail] = Infinity;
    }
    for(let i = 0; i < draw_list.length; i++) {
        let integer = draw_list[i];
        draw_snail(integer);
    }
}
const draw_shell = (integer) => {
    let mapped = isometric_to_screen(shell[integer].x, y_boundary, shell[integer].z);
    let shell_image;
    if(shell[integer].facing.x <= 0) {
        if(shell[integer].facing.z <= 0) {
            if(shell[integer].facing.x / shell[integer].facing.z <= 1) {
                // east
                shell_image = shell_e_png;
            } else {
                // north east
                shell_image = shell_ne_png;
            }
        } else {
            if(shell[integer].facing.x / shell[integer].facing.z <= -1) {
                // north
                shell_image = shell_n_png;
            } else {
                // north west
                shell_image = shell_nw_png;
            }
        }
    } else {
        if(shell[integer].facing.z <= 0) {
            if(shell[integer].facing.x / shell[integer].facing.z <= -1) {
                // south
                shell_image = shell_s_png;
            } else {
                // south east
                shell_image = shell_se_png;
            }
        } else {
            if(shell[integer].facing.x / shell[integer].facing.z <= 1) {
                // west
                shell_image = shell_w_png;
            } else {
                // south west
                shell_image = shell_sw_png;
            }
        }
    }
    ctx_static_transparent.drawImage(shell_image, mapped.x - 16, mapped.y - 25);
}
const draw_shells = () => {
    for(let i = 0; i < shell.length; i++) draw_shell(i);
}
const draw_vector = (x1, y1, z1, x2, y2, z2) => {
    let mapped1 = isometric_to_screen(x1, y1, z1);
    let mapped2 = isometric_to_screen(x1 + x2 * 500, y1 + y2 * 500, z1 + z2 * 500);
    ctx_transparent.strokeStyle = `#ffffff80`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(mapped1.x, mapped1.y);
    ctx_transparent.lineTo(mapped2.x, mapped2.y);
    ctx_transparent.stroke();
}
const draw_axis = (x, y, z) => {
    let x_axis_start = isometric_to_screen(-x_boundary, y, z);
    let x_axis_end = isometric_to_screen(x_boundary, y, z);
    let y_axis_start = isometric_to_screen(x, -y_boundary, z);
    let y_axis_end = isometric_to_screen(x, y_boundary, z);
    let z_axis_start = isometric_to_screen(x, y, -z_boundary);
    let z_axis_end = isometric_to_screen(x, y, z_boundary);
    ctx_transparent.strokeStyle = `#ff000080`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(x_axis_start.x, x_axis_start.y);
    ctx_transparent.lineTo(x_axis_end.x, x_axis_end.y);
    ctx_transparent.stroke();
    ctx_transparent.strokeStyle = `#00ff0080`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(y_axis_start.x, y_axis_start.y);
    ctx_transparent.lineTo(y_axis_end.x, y_axis_end.y);
    ctx_transparent.stroke();
    ctx_transparent.strokeStyle = `#0000ff80`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(z_axis_start.x, z_axis_start.y);
    ctx_transparent.lineTo(z_axis_end.x, z_axis_end.y);
    ctx_transparent.stroke();
    // selection circle
    // mapped = isometric_to_screen(x, y, z);
    // ctx_transparent.strokeStyle = `#ffffff80`
    // ctx_transparent.beginPath();
    // ctx_transparent.arc(mapped.x, mapped.y, 16, 0, Math.PI * 2);
    // ctx_transparent.stroke();
}
const draw_global_wireframe_back = () => {
    //     h
    //     .
    // g.     .e
    //     .f
    //     
    //     .d
    // c.     .a
    //     .
    //     b
    ctx_opaque.strokeStyle = `#50505050`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.lineTo(boundary_map.b.x, boundary_map.b.y);
    ctx_opaque.lineTo(boundary_map.c.x, boundary_map.c.y);
    ctx_opaque.lineTo(boundary_map.d.x, boundary_map.d.y);
    ctx_opaque.lineTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.stroke();
    // columns
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_map.a.x, boundary_map.a.y);
    ctx_opaque.lineTo(boundary_map.e.x, boundary_map.e.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_map.c.x, boundary_map.c.y);
    ctx_opaque.lineTo(boundary_map.g.x, boundary_map.g.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_map.d.x, boundary_map.d.y);
    ctx_opaque.lineTo(boundary_map.h.x, boundary_map.h.y);
    ctx_opaque.stroke();
    // top
    ctx_opaque.beginPath();
    ctx_opaque.lineTo(boundary_map.e.x, boundary_map.e.y);
    ctx_opaque.lineTo(boundary_map.h.x, boundary_map.h.y);
    ctx_opaque.lineTo(boundary_map.g.x, boundary_map.g.y);
    ctx_opaque.stroke();
}
const draw_global_wireframe_front = () => {
    if(global_angle < 0) {
        ctx_transparent.fillStyle = `#302000`;
        ctx_transparent.beginPath();
        ctx_transparent.moveTo(boundary_map.a.x, boundary_map.a.y);
        ctx_transparent.lineTo(boundary_map.b.x, boundary_map.b.y);
        ctx_transparent.lineTo(boundary_map.c.x, boundary_map.c.y);
        ctx_transparent.lineTo(boundary_map.d.x, boundary_map.d.y);
        ctx_transparent.lineTo(boundary_map.a.x, boundary_map.a.y);
        ctx_transparent.fill();
    }
    // column
    ctx_transparent.strokeStyle = `#50505050`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(boundary_map.b.x, boundary_map.b.y);
    ctx_transparent.lineTo(boundary_map.f.x, boundary_map.f.y);
    ctx_transparent.stroke();
    // top
    ctx_transparent.lineTo(boundary_map.e.x, boundary_map.e.y);
    ctx_transparent.lineTo(boundary_map.f.x, boundary_map.f.y);
    ctx_transparent.lineTo(boundary_map.g.x, boundary_map.g.y);
    ctx_transparent.stroke();
}
const cursor_select = () => {
    let selected_object = 0;
    let selected_array = [];
    let shortest_distance = Infinity;
    for(let i = 0; i < fish.length; i++) {
        let position = isometric_to_screen(fish[i].x, fish[i].y, fish[i].z);
        position.x -= canvas.center.x;
        position.y -= canvas.center.y;
        let fish_distance = Math.sqrt(Math.abs(position.x - cursor_x) ** 2 + Math.abs(position.y - cursor_y) ** 2);
        if(fish_distance < shortest_distance) {
            selected_array = fish;
            shortest_distance = fish_distance;
            selected_object = i;
        }
    }
    for(let i = 0; i < snail.length; i++) {
        let position = isometric_to_screen(snail[i].x, y_boundary, snail[i].z);
        position.x -= canvas.center.x;
        position.y -= canvas.center.y;
        let snail_distance = Math.sqrt(Math.abs(position.x - cursor_x) ** 2 + Math.abs(position.y - cursor_y) ** 2);
        if(snail_distance < shortest_distance) {
            selected_array = snail;
            shortest_distance = snail_distance;
            selected_object = i;
        }
    }
    if(shortest_distance < 16) {cursor_selection = selected_array[selected_object]};
}
const sub_time = () => {
    ctx_transparent.clearRect(0, 0, canvas.width, canvas.height);
    let mapped_cursor = screen_to_isometric(cursor_x, cursor_y, -y_boundary);
    cursor_over_top = false;
    if(global_angle > 0 && !left_click.held && food.length < food_cap && !(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
        cursor_over_top = true;
        new_food(mapped_cursor.x, mapped_cursor.y, mapped_cursor.z);
    }
    for(let zips = 0; zips < global_time_speed; zips++) {
        age_foods();
        age_tentacle_monsters();
        age_fishes();
        age_snails();
        age_bubbles();
        global_tick++;
        if(global_tick >= global_midnight) {
            global_tick = 0;
            draw_ground(`32`);
        }
    }
    if(cursor_selection.x !== undefined) {
        draw_vector(cursor_selection.x, cursor_selection.y, cursor_selection.z, cursor_selection.movement.x, cursor_selection.movement.y, cursor_selection.movement.z);
        draw_axis(cursor_selection.x, cursor_selection.y, cursor_selection.z);
    }
    draw_snails();
    // draw_food();
    draw_water_objects();
    // draw_tentacle_monsters();
    draw_bubbles();
    draw_global_wireframe_front();
}
const time = () => {
    window.requestAnimationFrame(time);
    sub_time();
}
canvas_transparent.addEventListener(`mousedown`, e => {
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    if(e.button === 0) {
        left_click.held = true;
        left_click.x = cursor_x;
        left_click.y = cursor_y;
        cursor_select();
    } else if(e.button === 2) {
        right_click.held = true;
        right_click.x = cursor_x;
        right_click.y = cursor_y;
    }
})
canvas_transparent.addEventListener(`mouseup`, e => {
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    if(e.button === 0) {
        left_click.held = false;
    } else if(e.button === 2) {
        right_click.held = false;
    }
})
canvas_transparent.addEventListener(`mousemove`, e => {
    // let saved_x = cursor_x;
    let saved_y = cursor_y;
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    vertical = Math.sign(saved_y - cursor_y);
    if(vertical !== left_click.vertical) {left_click.y = cursor_y; left_click.vertical = vertical};
    if(left_click.held) {
        if(global_height < 1) {
            if(global_angle > 0) {
                global_height = global_height + (left_click.y - cursor_y) * 0.0004;
            } else {
                global_height = global_height - (left_click.y - cursor_y) * 0.0004;
            }
            global_angle = global_angle - (left_click.y - cursor_y) * 0.0004;
        } else {
            global_angle = global_angle - (left_click.y - cursor_y) * 0.0008;
            if(global_angle > 1) {
                global_height = global_height + (left_click.y - cursor_y) * 0.0008;
            } else if(global_angle < -1) {
                global_height = global_height - (left_click.y - cursor_y) * 0.0008;
            } else {
                global_height = 1;
            }
        }
        if(global_angle < -2) global_angle = -2;
        if(global_angle > 2) global_angle = 2;
        if(global_height < 0) global_height = 0;
        if(global_height > 1) global_height = 1;
        reskew(global_angle);
    }
})
const keyDown = (e) => {
    if(e.key === `Escape`) {
        global_height = 1;
        if(global_angle !== -0.7) reskew(0.7);
        cursor_selection = {};
    }
}
document.addEventListener(`keydown`, keyDown);
window.addEventListener(`resize`, fit_canvas, false);
fit_canvas();
new_creature(fish, 64, true);
new_creature(snail, 4, true);
new_creature(tentacle_monster, 3, true);
time();
draw_global_wireframe_back();

// make a random portal appear, with a tentacle that comes out of the portal, grabs a fish, and pulls it back through

// allow player to pick up shells from dead snails for points

// use a similar gameplay loop to insane aquarium deluxe