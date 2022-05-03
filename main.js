const canvas_opaque = document.getElementById(`canvas1`);
const canvas_static_transparent = document.getElementById(`canvas2`);
const canvas_transparent = document.getElementById(`canvas3`);
const ctx_opaque = canvas_opaque.getContext(`2d`);
const ctx_static_transparent = canvas_static_transparent.getContext(`2d`);
const ctx_transparent = canvas_transparent.getContext(`2d`);
const snail1_png = document.getElementById(`snail1_png`);
const snail2_png = document.getElementById(`snail2_png`);
const snail3_png = document.getElementById(`snail3_png`);
const snail4_png = document.getElementById(`snail4_png`);
const snail5_png = document.getElementById(`snail5_png`);
const snail6_png = document.getElementById(`snail6_png`);
const snail7_png = document.getElementById(`snail7_png`);
const snail8_png = document.getElementById(`snail8_png`);
const shell1_png = document.getElementById(`shell1_png`);
const shell2_png = document.getElementById(`shell2_png`);
const shell3_png = document.getElementById(`shell3_png`);
const shell4_png = document.getElementById(`shell4_png`);
const shell5_png = document.getElementById(`shell5_png`);
const shell6_png = document.getElementById(`shell6_png`);
const shell7_png = document.getElementById(`shell7_png`);
const shell8_png = document.getElementById(`shell8_png`);
const fish1_png = document.getElementById(`fish1_png`);
const fish2_png = document.getElementById(`fish2_png`);
const fish3_png = document.getElementById(`fish3_png`);
const fish4_png = document.getElementById(`fish4_png`);
const fish5_png = document.getElementById(`fish5_png`);
const fish6_png = document.getElementById(`fish6_png`);
const fish7_png = document.getElementById(`fish7_png`);
const fish8_png = document.getElementById(`fish8_png`);
const fish1flip_png = document.getElementById(`fish1flip_png`);
const fish2flip_png = document.getElementById(`fish2flip_png`);
const fish3flip_png = document.getElementById(`fish3flip_png`);
const fish4flip_png = document.getElementById(`fish4flip_png`);
const fish5flip_png = document.getElementById(`fish5flip_png`);
const fish6flip_png = document.getElementById(`fish6flip_png`);
const fish7flip_png = document.getElementById(`fish7flip_png`);
const fish8flip_png = document.getElementById(`fish8flip_png`);
ctx_opaque.translate(0.5, 0.5);
ctx_opaque.lineWidth = 1;
ctx_transparent.translate(0.5, 0.5);
ctx_transparent.lineWidth = 1;
// global variables
spawned_food_y = 0;
//
global_tick = 0;
global_scale = 12;
global_skew = 0.7;
global_height = 1;
global_gravity = 0.000001;
global_midnight = 10000;
global_time_speed = 1;
global_midnight = 10000;
x_boundary = 30;
y_boundary = 20;
z_boundary = 20;
boundary_mapped = {};
x_movement_boundary = 29.5;
y_movement_boundary = 19;
z_movement_boundary = 19.5;
fish_starvation_cap = 1000000;
snail_starvation_cap = 1000000;
bubble = [];
bubble_movement_cap = 0.025;
food = [];
static_food = [];
food_cap = 2000;
fish = [];
fish_food_requirement = 10;
fish_movement_cap = 0.03;
fish_cap = 500;
snail = [];
snail_food_requirement = 30;
snail_movement_cap = 0.01;
snail_cap = 500;
shell = [];
cursor_selection = {};
cursor_x = Infinity;
cursor_y = Infinity;
cursor_over_top = false;
left_click = {x: 0, y: 0, held: false, vertical: 0};
right_click = {x: 0, y: 0, held: false};
background = `#0a0a0a`;
foreground = `#aaa`;
//
const canvas = {width: 0, height: 0, center: {x: 0, y: 0}};
const draw_background = () => {
    ctx_opaque.fillStyle = background;
    ctx_opaque.fillRect(0, 0, canvas_opaque.width, canvas_opaque.height);
    draw_water();
    draw_ground(`ff`);
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
    global_skew = value;
    find_boundary_coordinates();
    draw_background();
}
const isometric_map = (x, y, z) => {
    let mapped = {};
    mapped.x = (z * -global_scale) + (x * -global_scale);
    mapped.y = (z * -global_scale * global_skew / 2) + (x * global_scale * global_skew / 2) + (y * global_scale * global_height);
    mapped.x += canvas.center.x;
    mapped.y += canvas.center.y;
    return mapped;
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
    boundary_mapped.a = isometric_map(x_boundary, y_boundary, z_boundary);
    boundary_mapped.b = isometric_map(x_boundary, y_boundary, -z_boundary);
    boundary_mapped.c = isometric_map(-x_boundary, y_boundary, -z_boundary);
    boundary_mapped.d = isometric_map(-x_boundary, y_boundary, z_boundary);
    boundary_mapped.e = isometric_map(x_boundary, -y_boundary, z_boundary);
    boundary_mapped.f = isometric_map(x_boundary, -y_boundary, -z_boundary);
    boundary_mapped.g = isometric_map(-x_boundary, -y_boundary, -z_boundary);
    boundary_mapped.h = isometric_map(-x_boundary, -y_boundary, z_boundary);
}
const flat_map = (x, y) => {
    // distance_from_food = y - spawned_food_y + canvas.center.y;
    
    let top = isometric_map(0, -y_boundary, 0);
    let distance_from_top = y - top.y + canvas.center.y;

    // console.log(distance_from_food / distance_from_top);

    y += y_boundary * global_scale * global_height;
    y += distance_from_top * global_height;
    if(global_height === 1) {
        y *= (1 / global_skew);
    } else {
        if(global_height !== 0) y *= 8 / 9;
        // now, just to fix when global_height is below 1...
    }
    x /= global_scale;
    y /= global_scale;
    let mapped = {};
    mapped.x = 0.5 * (  y - x);
    mapped.z = 0.5 * (- y - x);
    return mapped;
}
const isometric_pixel = (x, y, z, size) => {
    let mapped = isometric_map(x, y, z);
    if(size > 1) {ctx_transparent.fillRect(mapped.x - (size / 2), mapped.y - (size / 2), size, size)} else ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
}
const draw_ground = (alpha) => {
    ctx_opaque.fillStyle = `#362403${alpha}`;
    // ctx_opaque.fillStyle = `#120801${alpha}`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.lineTo(boundary_mapped.b.x, boundary_mapped.b.y);
    ctx_opaque.lineTo(boundary_mapped.c.x, boundary_mapped.c.y);
    ctx_opaque.lineTo(boundary_mapped.d.x, boundary_mapped.d.y);
    ctx_opaque.lineTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.fill();
}
const draw_water = () => {
    ctx_opaque.fillStyle = `#0070ff28`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.lineTo(boundary_mapped.d.x, boundary_mapped.d.y);
    ctx_opaque.lineTo(boundary_mapped.c.x, boundary_mapped.c.y);
    ctx_opaque.lineTo(boundary_mapped.g.x, boundary_mapped.g.y);
    ctx_opaque.lineTo(boundary_mapped.h.x, boundary_mapped.h.y);
    ctx_opaque.lineTo(boundary_mapped.e.x, boundary_mapped.e.y);
    ctx_opaque.lineTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.fill();
}
const new_bubble = (x, y, z) => {
    let new_bubble_object = {x: x, y: y, z: z, maximum: Math.ceil(Math.random() * 20), size: 2};
    new_bubble_object.movement = {x: (Math.random() * 2 - 1) * 0.01, y: (Math.random() * 2 - 1) * 0.01, z: (Math.random() * 2 - 1) * 0.01};
    bubble.push(new_bubble_object);
}
const bubble_burst = (x, y, z, number) => {for(let i = 0; i < number; i++) new_bubble(x, y, z)};
const age_bubble = (bubble_moved, integer) => {
    if(bubble_moved.size < bubble_moved.maximum) bubble_moved.size += bubble_moved.size ** 2 * Math.random() * 0.001;
    bubble_moved.movement.x += (Math.random() * 2 - 1) * 0.005;
    bubble_moved.movement.y -= 0.0001 * bubble_moved.size;
    bubble_moved.movement.z += (Math.random() * 2 - 1) * 0.005;
    bubble_moved.x += bubble_moved.movement.x;
    bubble_moved.y += bubble_moved.movement.y;
    bubble_moved.z += bubble_moved.movement.z;
    if(bubble_moved.x > x_boundary) {bubble_moved.x = x_boundary; bubble_moved.movement.x /= 2};
    if(bubble_moved.x < -x_boundary) {bubble_moved.x = -x_boundary; bubble_moved.movement.x /= 2};
    if(bubble_moved.y > y_boundary) {bubble_moved.y = y_boundary; bubble_moved.movement.y /= 2};
    if(bubble_moved.y < -y_boundary) {bubble.splice(integer, 1)};
    if(bubble_moved.z > z_boundary) {bubble_moved.z = z_boundary; bubble_moved.movement.z /= 2};
    if(bubble_moved.z < -z_boundary) {bubble_moved.z = -z_boundary; bubble_moved.movement.z /= 2};
    if(bubble_moved.movement.x > bubble_movement_cap) bubble_moved.movement.x = bubble_movement_cap;
    if(bubble_moved.movement.x < -bubble_movement_cap) bubble_moved.movement.x = -bubble_movement_cap;
    if(bubble_moved.movement.z > bubble_movement_cap) bubble_moved.movement.z = bubble_movement_cap;
    if(bubble_moved.movement.z < -bubble_movement_cap) bubble_moved.movement.z = -bubble_movement_cap;
}
const age_bubbles = () => {
    for(let i = 0; i < bubble.length; i++) {
        age_bubble(bubble[i], i);
    }
}
const draw_bubbles = () => {
    for(let i = 0; i < bubble.length; i++) {
        ctx_transparent.strokeStyle = `#70ffff70`;
        let mapped = isometric_map(bubble[i].x, bubble[i].y, bubble[i].z);
        ctx_transparent.beginPath();
        ctx_transparent.arc(mapped.x, mapped.y, bubble[i].size / 2, 0, Math.PI * 2);
        ctx_transparent.stroke();
    }
}
const new_food = (x, z) => {
    let new_food_object = {x: x, y: -y_boundary, z: z};
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
    if(food_moved.x > x_boundary) {food_moved.x = x_boundary; food_moved.movement.x /= 2};
    if(food_moved.x < -x_boundary) {food_moved.x = -x_boundary; food_moved.movement.x /= 2};
    if(food_moved.z > z_boundary) {food_moved.z = z_boundary; food_moved.movement.z /= 2};
    if(food_moved.z < -z_boundary) {food_moved.z = -z_boundary; food_moved.movement.z /= 2};
    if(food_moved.y > y_boundary) {
        food_moved.y = y_boundary;
        delete food_moved.movement;
        food_moved.x = Math.ceil(food_moved.x * 8) / 8;
        food_moved.z = Math.floor(food_moved.z * 8) / 8;
        food.splice(integer, 1);
        static_food.push(food_moved);
        draw_static_food(static_food.length - 1);
    }
    if(food_moved.y < -y_boundary) {food_moved.y = -y_boundary; food_moved.movement.y /= 2};
}
const age_foods = () => {
    for(let i = 0; i < food.length; i++) age_food(food[i], i);
}
const draw_foods = () => {
    for(let i = 0; i < food.length; i++) {
        ctx_transparent.fillStyle = `#ff0`;
        let mapped = isometric_map(food[i].x, food[i].y, food[i].z);
        ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
    }
}
const draw_static_food = (integer) => {
    ctx_static_transparent.fillStyle = `#660`;
    let mapped = isometric_map(static_food[integer].x, y_boundary, static_food[integer].z);
    ctx_static_transparent.fillRect(mapped.x, mapped.y, 1, 1);
}
const draw_static_foods = () => {for(let i = 0; i < static_food.length; i++) draw_static_food(i)};
const new_fish = (x, y, z) => {
    let movement_x = (Math.random() * 2 - 1) * 0.01;
    let movement_y = (Math.random() * 2 - 1) * 0.001;
    let movement_z = (Math.random() * 2 - 1) * 0.01;
    let new_fish_object = {x: x, y: y, z: z, movement: {x: movement_x, y: movement_y, z: movement_z}, starvation: 0, food: 0, move_cycle: 0, flip_cycle: 0, flip: false};
    new_fish_object.move_cycle -= Math.floor(Math.random() * -50);
    new_fish_object.starvation += Math.floor(Math.random() * fish_starvation_cap * 0.5);
    fish.push(new_fish_object);
}
const random_fish = (quantity) => {
    for(let i = 0; i < quantity; i++) {
        let x = Math.random() * x_boundary * 2 - x_boundary;
        let y = Math.random() * y_boundary * 2 - y_boundary;
        let z = Math.random() * z_boundary * 2 - z_boundary;
        new_fish(x, y, z);
    }
}
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
    if(fish_moved.x > x_movement_boundary) {fish_moved.x = x_movement_boundary; fish_moved.movement.x /= 2};
    if(fish_moved.x < -x_movement_boundary) {fish_moved.x = -x_movement_boundary; fish_moved.movement.x /= 2};
    if(fish_moved.y > y_movement_boundary) {fish_moved.y = y_movement_boundary; fish_moved.movement.y /= 2};
    if(fish_moved.y < -y_movement_boundary) {fish_moved.y = -y_movement_boundary; fish_moved.movement.y /= 2};
    if(fish_moved.z > z_movement_boundary) {fish_moved.z = z_movement_boundary; fish_moved.movement.z /= 2};
    if(fish_moved.z < -z_movement_boundary) {fish_moved.z = -z_movement_boundary; fish_moved.movement.z /= 2};
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
    // for(let ii = 0; ii < static_food.length; ii++) {
    //     distance_from_food = Math.sqrt((Math.abs(fish_moved.x - static_food[ii].x) ** 2) + (Math.abs(fish_moved.y - static_food[ii].y) ** 2) + (Math.abs(fish_moved.z - static_food[ii].z) ** 2));
    //     if(distance_from_food <= 1) {
    //         static_food.splice(ii, 1);
    //         fed = true;
    //         ii--;
    //     }
    // }
    if(fed) {
        fish_moved.food++;
        fish_moved.starvation = 0;
    }
    if(fed && fish_moved.food >= fish_food_requirement && fish.length < fish_cap) {
        fish_moved.food = 0;
        new_fish(fish_moved.x, fish_moved.y, fish_moved.z);
    }
    if(fish_moved.starvation >= fish_starvation_cap) {
        if(fish_moved.food > 0) {fish_moved.food--} else fish.splice(integer, 1);
    }
}
const age_fishes = () => {
    for(let i = 0; i < fish.length; i++) age_fish(fish[i], i);
}
const draw_fish = (integer) => {
    // ctx_transparent.fillStyle = `#36f`;
    // isometric_pixel(fish[integer].x, fish[integer].y, fish[integer].z, 2);
    let mapped = isometric_map(fish[integer].x, fish[integer].y, fish[integer].z);
    let fish_image;
    if(fish[integer].movement.x <= 0) {
        if(fish[integer].movement.z <= 0) {
            if(fish[integer].movement.x / fish[integer].movement.z <= 1) {
                // east
                if(fish[integer].flip) {
                    fish_image = fish6flip_png;
                } else {
                    fish_image = fish6_png;
                }
            } else {
                // north east
                if(fish[integer].flip) {
                    fish_image = fish4flip_png;
                } else {
                    fish_image = fish4_png;
                }
            }
        } else {
            if(fish[integer].movement.x / fish[integer].movement.z <= -1) {
                // north
                if(fish[integer].flip) {
                    fish_image = fish8flip_png;
                } else {
                    fish_image = fish8_png;
                }
            } else {
                // north west
                if(fish[integer].flip) {
                    fish_image = fish3flip_png;
                } else {
                    fish_image = fish3_png;
                }
            }
        }
    } else {
        if(fish[integer].movement.z <= 0) {
            if(fish[integer].movement.x / fish[integer].movement.z <= -1) {
                // south
                if(fish[integer].flip) {
                    fish_image = fish7flip_png;
                } else {
                    fish_image = fish7_png;
                }
            } else {
                // south east
                if(fish[integer].flip) {
                    fish_image = fish2flip_png;
                } else {
                    fish_image = fish2_png;
                }
            }
        } else {
            if(fish[integer].movement.x / fish[integer].movement.z <= 1) {
                // west
                if(fish[integer].flip) {
                    fish_image = fish5flip_png;
                } else {
                    fish_image = fish5_png;
                }
            } else {
                // south west
                if(fish[integer].flip) {
                    fish_image = fish1flip_png;
                } else {
                    fish_image = fish1_png;
                }
            }
        }
    }
    ctx_transparent.drawImage(fish_image, mapped.x - 16, mapped.y - 16);
}
const draw_fishes = () => {
    let proximity_list = [];
    let draw_list = [];
    for(let i = 0; i < fish.length; i++) {
        proximity_list[i] = Math.sqrt(Math.abs(fish[i].x - x_boundary) ** 2 + Math.abs(fish[i].z - -z_boundary) ** 2);
    }
    while(draw_list.length < fish.length) {
        let closest = 0;
        let closest_fish = 0;
        for(let i = 0; i < proximity_list.length; i++) {
            if(proximity_list[i] > closest) {
                closest = proximity_list[i];
                closest_fish = i;
            }
        }
        draw_list.push(closest_fish);
        proximity_list[closest_fish] = 0;
    }
    for(let i = 0; i < draw_list.length; i++) {
        let integer = draw_list[i];
        draw_fish(integer);
    }
    // do a 2d distance check for each fish for its distance from the closest edge of the tank to the screen, not factoring in height
    // x_boundary, __, -z_boundary
    // for(let i = 0; i < fish.length; i++) draw_fish(i);
}
const new_snail = (x, z) => {
    let movement_x = (Math.random() * 2 - 1) * 0.001;
    let movement_z = (Math.random() * 2 - 1) * 0.001;
    let new_snail_object = {x: x, y: y_boundary, z: z, movement: {x: movement_x, y: 0, z: movement_z}, starvation: 0, food: 0, move_cycle: 0};
    new_snail_object.move_cycle -= Math.floor(Math.random() * -50);
    new_snail_object.starvation += Math.floor(Math.random() * snail_starvation_cap * 0.5);
    snail.push(new_snail_object);
}
const random_snail = (quantity) => {
    for(let i = 0; i < quantity; i++) {
        let x = Math.random() * x_boundary * 2 - x_boundary;
        let z = Math.random() * z_boundary * 2 - z_boundary;
        new_snail(x, z);
    }
}
const kill_snail = (integer) => {
    snail[integer].movement.x = Math.ceil(snail[integer].movement.x * 8) / 8;
    snail[integer].movement.z = Math.floor(snail[integer].movement.z * 8) / 8;
    let new_shell_object = {x: snail[integer].x, y: y_boundary, z: snail[integer].z, facing: snail[integer].movement};
    bubble_burst(snail[integer].x, y_boundary, snail[integer].z, Math.floor(Math.random() * 3) + 2);
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
    if(snail_moved.x > x_movement_boundary) {snail_moved.x = x_movement_boundary; snail_moved.movement.x /= 2};
    if(snail_moved.x < -x_movement_boundary) {snail_moved.x = -x_movement_boundary; snail_moved.movement.x /= 2};
    if(snail_moved.z > z_movement_boundary) {snail_moved.z = z_movement_boundary; snail_moved.movement.z /= 2};
    if(snail_moved.z < -z_movement_boundary) {snail_moved.z = -z_movement_boundary; snail_moved.movement.z /= 2};
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
        new_snail(snail_moved.x, snail_moved.z);
    }
    if(snail_moved.starvation >= snail_starvation_cap) {
        if(snail_moved.food > 0) {snail_moved.food--} else kill_snail(integer);
    }
}
const age_snails = () => {
    for(let i = 0; i < snail.length; i++) age_snail(snail[i], i);
}
const draw_snail = (integer) => {
    let mapped = isometric_map(snail[integer].x, y_boundary, snail[integer].z);
    let snail_image;
    if(snail[integer].movement.x <= 0) {
        if(snail[integer].movement.z <= 0) {
            if(snail[integer].movement.x / snail[integer].movement.z <= 1) {
                // east
                snail_image = snail8_png;
            } else {
                // north east
                snail_image = snail4_png;
            }
        } else {
            if(snail[integer].movement.x / snail[integer].movement.z <= -1) {
                // north
                snail_image = snail7_png;
            } else {
                // north west
                snail_image = snail3_png;
            }
        }
    } else {
        if(snail[integer].movement.z <= 0) {
            if(snail[integer].movement.x / snail[integer].movement.z <= -1) {
                // south
                snail_image = snail5_png;
            } else {
                // south east
                snail_image = snail2_png;
            }
        } else {
            if(snail[integer].movement.x / snail[integer].movement.z <= 1) {
                // west
                snail_image = snail6_png;
            } else {
                // south west
                snail_image = snail1_png;
            }
        }
    }
    ctx_transparent.drawImage(snail_image, mapped.x - 16, mapped.y - 25);
    ctx_opaque.fillStyle = `#262402`;
    // ctx_opaque.fillStyle = `#100600`;
    mapped = isometric_map(snail[integer].x, y_boundary, snail[integer].z);
    ctx_opaque.fillRect(mapped.x - 1, mapped.y - 1, 2, 2);
}
const draw_snails = () => {
    let proximity_list = [];
    let draw_list = [];
    for(let i = 0; i < snail.length; i++) {
        let mapped = isometric_map(snail[i].x, snail[i].y, snail[i].z);
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
    // for(let i = 0; i < snail.length; i++) draw_snail(i);
}
const draw_shell = (integer) => {
    let mapped = isometric_map(shell[integer].x, y_boundary, shell[integer].z);
    let shell_image;
    if(shell[integer].facing.x <= 0) {
        if(shell[integer].facing.z <= 0) {
            if(shell[integer].facing.x / shell[integer].facing.z <= 1) {
                // east
                shell_image = shell8_png;
            } else {
                // north east
                shell_image = shell4_png;
            }
        } else {
            if(shell[integer].facing.x / shell[integer].facing.z <= -1) {
                // north
                shell_image = shell7_png;
            } else {
                // north west
                shell_image = shell3_png;
            }
        }
    } else {
        if(shell[integer].facing.z <= 0) {
            if(shell[integer].facing.x / shell[integer].facing.z <= -1) {
                // south
                shell_image = shell5_png;
            } else {
                // south east
                shell_image = shell2_png;
            }
        } else {
            if(shell[integer].facing.x / shell[integer].facing.z <= 1) {
                // west
                shell_image = shell6_png;
            } else {
                // south west
                shell_image = shell1_png;
            }
        }
    }
    ctx_static_transparent.drawImage(shell_image, mapped.x - 16, mapped.y - 25);
}
const draw_shells = () => {
    for(let i = 0; i < shell.length; i++) draw_shell(i);
}
const draw_vector = (x1, y1, z1, x2, y2, z2) => {
    let mapped1 = isometric_map(x1, y1, z1);
    let mapped2 = isometric_map(x1 + x2 * 500, y1 + y2 * 500, z1 + z2 * 500);
    ctx_transparent.strokeStyle = `#ffffff80`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(mapped1.x, mapped1.y);
    ctx_transparent.lineTo(mapped2.x, mapped2.y);
    ctx_transparent.stroke();
}
const draw_axis = (x, y, z) => {
    let x_axis_start = isometric_map(-x_boundary, y, z);
    let x_axis_end = isometric_map(x_boundary, y, z);
    let y_axis_start = isometric_map(x, -y_boundary, z);
    let y_axis_end = isometric_map(x, y_boundary, z);
    let z_axis_start = isometric_map(x, y, -z_boundary);
    let z_axis_end = isometric_map(x, y, z_boundary);
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
    // mapped = isometric_map(x, y, z);
    // ctx_transparent.strokeStyle = `#ffffff80`
    // ctx_transparent.beginPath();
    // ctx_transparent.arc(mapped.x, mapped.y, 16, 0, Math.PI * 2);
    // ctx_transparent.stroke();
}
const draw_global_wireframe_back = () => {
    ctx_opaque.strokeStyle = `#50505050`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.lineTo(boundary_mapped.b.x, boundary_mapped.b.y);
    ctx_opaque.lineTo(boundary_mapped.c.x, boundary_mapped.c.y);
    ctx_opaque.lineTo(boundary_mapped.d.x, boundary_mapped.d.y);
    ctx_opaque.lineTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.stroke();
    // columns
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_mapped.a.x, boundary_mapped.a.y);
    ctx_opaque.lineTo(boundary_mapped.e.x, boundary_mapped.e.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_mapped.c.x, boundary_mapped.c.y);
    ctx_opaque.lineTo(boundary_mapped.g.x, boundary_mapped.g.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(boundary_mapped.d.x, boundary_mapped.d.y);
    ctx_opaque.lineTo(boundary_mapped.h.x, boundary_mapped.h.y);
    ctx_opaque.stroke();
    // top
    ctx_opaque.beginPath();
    ctx_opaque.lineTo(boundary_mapped.e.x, boundary_mapped.e.y);
    ctx_opaque.lineTo(boundary_mapped.h.x, boundary_mapped.h.y);
    ctx_opaque.lineTo(boundary_mapped.g.x, boundary_mapped.g.y);
    ctx_opaque.stroke();
}
const draw_global_wireframe_front = () => {
    // columns
    ctx_transparent.strokeStyle = `#50505050`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(boundary_mapped.b.x, boundary_mapped.b.y);
    ctx_transparent.lineTo(boundary_mapped.f.x, boundary_mapped.f.y);
    ctx_transparent.stroke();
    // top
    ctx_transparent.lineTo(boundary_mapped.e.x, boundary_mapped.e.y);
    ctx_transparent.lineTo(boundary_mapped.f.x, boundary_mapped.f.y);
    ctx_transparent.lineTo(boundary_mapped.g.x, boundary_mapped.g.y);
    ctx_transparent.stroke();
}
const cursor_select = () => {
    let selected_object = 0;
    let selected_array = [];
    let shortest_distance = Infinity;
    for(let i = 0; i < fish.length; i++) {
        let position = isometric_map(fish[i].x, fish[i].y, fish[i].z);
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
        let position = isometric_map(snail[i].x, y_boundary, snail[i].z);
        position.x -= canvas.center.x;
        position.y -= canvas.center.y;
        let snail_distance = Math.sqrt(Math.abs(position.x - cursor_x) ** 2 + Math.abs(position.y - cursor_y) ** 2);
        if(snail_distance < shortest_distance) {
            selected_array = snail;
            shortest_distance = snail_distance;
            selected_object = i;
        }
    }
    if(shortest_distance < 16) {cursor_selection = selected_array[selected_object]} else cursor_selection = {};
}
const sub_time = () => {
    ctx_transparent.clearRect(0, 0, canvas.width, canvas.height);
    let mapped_cursor = flat_map(cursor_x, cursor_y);
    cursor_over_top = false;
    if(!left_click.held && food.length < food_cap && !(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
        cursor_over_top = true;
        new_food(mapped_cursor.x, mapped_cursor.z);

        spawned_food_y = isometric_map(mapped_cursor.x, -y_boundary, mapped_cursor.z).y;
        // new_bubble(mapped_cursor.x, y_boundary, mapped_cursor.z);
    }
    // if(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary) {
    //     if(mapped_cursor.x < -x_boundary) mapped_cursor.x = -x_boundary;
    //     if(mapped_cursor.x > x_boundary) mapped_cursor.x = x_boundary;
    //     if(mapped_cursor.z < -z_boundary) mapped_cursor.z = -z_boundary;
    //     if(mapped_cursor.z > z_boundary) mapped_cursor.z = z_boundary;
    //     mapped_cursor = isometric_map(mapped_cursor.x, -y_boundary, mapped_cursor.z);
    //     ctx_transparent.strokeStyle = `#5af`;
    //     ctx_transparent.beginPath();
    //     // ctx_transparent.moveTo(mapped_food.x, mapped_food.y);
    //     ctx_transparent.moveTo(mapped_cursor.x, mapped_cursor.y);
    //     ctx_transparent.lineTo(canvas.center.x + cursor_x, canvas.center.y + cursor_y);
    //     ctx_transparent.stroke();
    // } else {
    //     new_food(mapped_cursor.x, mapped_cursor.z);
    // }
    if(cursor_selection.x !== undefined) {
        draw_vector(cursor_selection.x, cursor_selection.y, cursor_selection.z, cursor_selection.movement.x, cursor_selection.movement.y, cursor_selection.movement.z);
        draw_axis(cursor_selection.x, cursor_selection.y, cursor_selection.z);
    }
    for(let zips = 0; zips < global_time_speed; zips++) {
        age_foods();
        age_fishes();
        age_snails();
        age_bubbles();
        global_tick++;
        if(global_tick >= global_midnight) {
            global_tick = 0;
            draw_ground(`32`);
        }
    }
    draw_snails();
    draw_foods();
    draw_fishes();
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
        // fish.x = flat_map(cursor_x, cursor_y + canvas.center.y / 2).x;
        // fish.y = -y_boundary;
        // fish.z = flat_map(cursor_x, cursor_y + canvas.center.y / 2).z;
        // mapped_cursor = flat_map(cursor_x, cursor_y + canvas.center.y / 2);
        // if(!(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
        //     new_food(mapped_cursor.x, mapped_cursor.z);
        // }
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
    let saved_x = cursor_x;
    let saved_y = cursor_y;
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    vertical = Math.sign(saved_y - cursor_y);
    if(vertical !== left_click.vertical) {left_click.y = cursor_y; left_click.vertical = vertical};
    if(left_click.held) {
        if(global_height < 1) {
            global_height = global_height + (left_click.y - cursor_y) * 0.0004;
            global_skew = global_skew - (left_click.y - cursor_y) * 0.0004;
        } else {
            global_skew = global_skew - (left_click.y - cursor_y) * 0.0008;
            if(global_skew > 1) {
                global_height = global_height + (left_click.y - cursor_y) * 0.0008;
            } else {
                global_height = 1;
            }
        }
        if(global_skew < 0) global_skew = 0;
        if(global_skew > 2) global_skew = 2;
        if(global_height < 0) global_height = 0;
        if(global_height > 1) global_height = 1;
        reskew(global_skew);
    }
})
window.addEventListener(`resize`, fit_canvas, false);
fit_canvas();
random_fish(16);
random_snail(4);
time();
draw_global_wireframe_back();

// for clicking on fish: map each fish to its 2d position, then check the distances between those positions and the cursor. shortest distance under a certain distance is selected fish

// allow player to pick up shells from dead snails for points

// simulate some degree of fluid motion and allow the cursor to move stuff around in the tank

// use a similar gameplay loop to insane aquarium deluxe


// global_height = 0.5;
// reskew(1.5);