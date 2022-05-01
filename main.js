const canvas_opaque = document.getElementById(`canvas1`);
const canvas_transparent = document.getElementById(`canvas2`);
const ctx_opaque = canvas_opaque.getContext(`2d`);
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
background = `#0a0a0a`;
foreground = `#aaa`;
canvas = {width: 0, height: 0, center: {x: 0, y: 0}};
draw_background = () => {
    ctx_opaque.fillStyle = background;
    ctx_opaque.fillRect(0, 0, canvas_opaque.width, canvas_opaque.height);
    draw_ground(`ff`);
    draw_global_wireframe_back();
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
    draw_background();
}
global_tick = 0;
global_scale = 12;
global_skew = 0.7;
global_height = 1;
global_gravity = 0.000001;
x_boundary = 30;
y_boundary = 20;
z_boundary = 20;
x_movement_boundary = 29.5;
y_movement_boundary = 19;
z_movement_boundary = 19.5;
fish_starvation_cap = 100000;
snail_starvation_cap = 100000;
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
    if(size > 1) {ctx_transparent.fillRect(mapped.x - (size / 2), mapped.y - (size / 2), size, size)} else ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
}
const draw_ground = (alpha) => {
    a_mapped = isometric_map(x_boundary, y_boundary, z_boundary);
    b_mapped = isometric_map(x_boundary, y_boundary, -z_boundary);
    c_mapped = isometric_map(-x_boundary, y_boundary, -z_boundary);
    d_mapped = isometric_map(-x_boundary, y_boundary, z_boundary);
    ctx_opaque.fillStyle = `#120801${alpha}`;
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(a_mapped.x, a_mapped.y);
    ctx_opaque.lineTo(b_mapped.x, b_mapped.y);
    ctx_opaque.lineTo(c_mapped.x, c_mapped.y);
    ctx_opaque.lineTo(d_mapped.x, d_mapped.y);
    ctx_opaque.lineTo(a_mapped.x, a_mapped.y);
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
    a_mapped = isometric_map(x_boundary, y_boundary, z_boundary);
    b_mapped = isometric_map(x_boundary, y_boundary, -z_boundary);
    c_mapped = isometric_map(-x_boundary, y_boundary, -z_boundary);
    e_mapped = isometric_map(x_boundary, -y_boundary, z_boundary);
    g_mapped = isometric_map(-x_boundary, -y_boundary, -z_boundary);
    h_mapped = isometric_map(-x_boundary, -y_boundary, z_boundary);
    ctx_transparent.fillStyle = `#0636ff09`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(a_mapped.x, a_mapped.y);
    ctx_transparent.lineTo(b_mapped.x, b_mapped.y);
    ctx_transparent.lineTo(c_mapped.x, c_mapped.y);
    ctx_transparent.lineTo(g_mapped.x, g_mapped.y);
    ctx_transparent.lineTo(h_mapped.x, h_mapped.y);
    ctx_transparent.lineTo(e_mapped.x, e_mapped.y);
    ctx_transparent.lineTo(a_mapped.x, a_mapped.y);
    ctx_transparent.fill();
}
food = [];
static_food = [];
const new_food = (x, z) => {
    new_food_object = {x: x, y: -y_boundary, z: z};
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
        food_moved.movement.y = 0;
        food.splice(integer, 1);
        static_food.push(food_moved);
    }
    if(food_moved.y < -y_boundary) {food_moved.y = -y_boundary; food_moved.movement.y /= 2};
}
const age_foods = () => {
    for(i = 0; i < food.length; i++) age_food(food[i], i);
}
const draw_foods = () => {
    for(i = 0; i < food.length; i++) {
        ctx_transparent.fillStyle = `#ff0`;
        mapped = isometric_map(food[i].x, food[i].y, food[i].z);
        ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
    }
}
const draw_static_foods = () => {
    for(i = 0; i < static_food.length; i++) {
        ctx_transparent.fillStyle = `#660`;
        mapped = isometric_map(static_food[i].x, y_boundary, static_food[i].z);
        ctx_transparent.fillRect(mapped.x, mapped.y, 1, 1);
    }
}
fish = [];
fish_food_requirement = 10;
fish_movement_cap = 0.03;
const new_fish = (x, y, z) => {
    movement_x = (Math.random() * 2 - 1) * 0.01;
    movement_y = (Math.random() * 2 - 1) * 0.001;
    movement_z = (Math.random() * 2 - 1) * 0.01;
    new_fish_object = {x: x, y: y, z: z, movement: {x: movement_x, y: movement_y, z: movement_z}, starvation: 0, food: 0, move_cycle: 0, flip_cycle: 0, flip: false};
    new_fish_object.starvation += Math.random() * fish_starvation_cap * 0.5;
    fish.push(new_fish_object);
}
const random_fish = (quantity) => {
    for(i = 0; i < quantity; i++) {
        x = Math.random() * x_boundary * 2 - x_boundary;
        y = Math.random() * y_boundary * 2 - y_boundary;
        z = Math.random() * z_boundary * 2 - z_boundary;
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
        fish_moved.move_cycle = Math.floor(Math.random() * -50);
        fish_moved.movement.x += (Math.random() * 2 - 1) * 0.001 * (food.length * 0.05 + 1);
        fish_moved.movement.y += (Math.random() * 2 - 1) * 0.0001 * (food.length * 0.05 + 1);
        fish_moved.movement.z += (Math.random() * 2 - 1) * 0.001 * (food.length * 0.05 + 1);
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
    fed = false;
    for(ii = 0; ii < food.length; ii++) {
        distance_from_food = Math.sqrt((Math.abs(fish_moved.x - food[ii].x) ** 2) + (Math.abs(fish_moved.y - food[ii].y) ** 2) + (Math.abs(fish_moved.z - food[ii].z) ** 2));
        if(distance_from_food <= 1) {
            food.splice(ii, 1);
            fed = true;
            ii--;
        }
    }
    if(fed) {
        fish_moved.food++;
        fish.starvation = 0;
    }
    if(fed && fish_moved.food >= fish_food_requirement) {
        fish_moved.food = 0;
        new_fish(fish_moved.x, fish_moved.y, fish_moved.z);
    }
    if(fish_moved.starvation >= fish_starvation_cap) {
        if(fish_moved.food > 0) {fish_moved.food--} else fish.splice(integer, 1);
    }
}
const age_fishes = () => {
    for(i = 0; i < fish.length; i++) age_fish(fish[i], i);
}
const draw_fish = (integer) => {
    // ctx_transparent.fillStyle = `#36f`;
    // isometric_pixel(fish[integer].x, fish[integer].y, fish[integer].z, 2);
    mapped = isometric_map(fish[integer].x, fish[integer].y, fish[integer].z);
    if(fish[i].movement.x <= 0) {
        if(fish[i].movement.z <= 0) {
            if(fish[i].movement.x / fish[i].movement.z <= 1) {
                // east
                if(fish[i].flip) {
                    fish_image = fish6flip_png;
                } else {
                    fish_image = fish6_png;
                }
            } else {
                // north east
                if(fish[i].flip) {
                    fish_image = fish4flip_png;
                } else {
                    fish_image = fish4_png;
                }
            }
        } else {
            if(fish[i].movement.x / fish[i].movement.z <= -1) {
                // north
                if(fish[i].flip) {
                    fish_image = fish8flip_png;
                } else {
                    fish_image = fish8_png;
                }
            } else {
                // north west
                if(fish[i].flip) {
                    fish_image = fish3flip_png;
                } else {
                    fish_image = fish3_png;
                }
            }
        }
    } else {
        if(fish[i].movement.z <= 0) {
            if(fish[i].movement.x / fish[i].movement.z <= -1) {
                // south
                if(fish[i].flip) {
                    fish_image = fish7flip_png;
                } else {
                    fish_image = fish7_png;
                }
            } else {
                // south east
                if(fish[i].flip) {
                    fish_image = fish2flip_png;
                } else {
                    fish_image = fish2_png;
                }
            }
        } else {
            if(fish[i].movement.x / fish[i].movement.z <= 1) {
                // west
                if(fish[i].flip) {
                    fish_image = fish5flip_png;
                } else {
                    fish_image = fish5_png;
                }
            } else {
                // south west
                if(fish[i].flip) {
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
    for(i = 0; i < fish.length; i++) draw_fish(i);
}
snail = [];
snail_food_requirement = 10;
snail_movement_cap = 0.01;
const new_snail = (x, z) => {
    movement_x = (Math.random() * 2 - 1) * 0.001;
    movement_z = (Math.random() * 2 - 1) * 0.001;
    new_snail_object = {x: x, z: z, movement: {x: movement_x, z: movement_z}, starvation: 0, food: 0, move_cycle: 0};
    new_snail_object.starvation += Math.random() * snail_starvation_cap * 0.5;
    snail.push(new_snail_object);
}
const random_snail = (quantity) => {
    for(i = 0; i < quantity; i++) {
        x = Math.random() * x_boundary * 2 - x_boundary;
        z = Math.random() * z_boundary * 2 - z_boundary;
        new_snail(x, z);
    }
}
shell = [];
const kill_snail = (integer) => {
    new_shell_object = {x: snail[integer].x, z: snail[integer].z, facing: snail[integer].movement};
    shell.push(new_shell_object);
    snail.splice(integer, 1);
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
    fed = false;
    for(ii = 0; ii < static_food.length; ii++) {
        distance_from_food = Math.sqrt((Math.abs(snail_moved.x - static_food[ii].x) ** 2) + (Math.abs(snail_moved.z - static_food[ii].z) ** 2));
        if(distance_from_food <= 0.5) {
            static_food.splice(ii, 1);
            ii--;
            fed = true;
        }
    }
    if(fed) {
        snail_moved.food++;
        snail.starvation = 0;
    }
    if(fed && snail_moved.food >= snail_food_requirement) {
        snail_moved.food = 0;
        new_snail(snail_moved.x, snail_moved.z);
    }
    if(snail_moved.starvation >= snail_starvation_cap) {
        if(snail_moved.food > 0) {snail_moved.food--} else kill_snail(integer);
    }
}
const age_snails = () => {
    for(i = 0; i < snail.length; i++) age_snail(snail[i], i);
}
const draw_snail = (integer) => {
    mapped = isometric_map(snail[integer].x, y_boundary, snail[integer].z);
    if(snail[i].movement.x <= 0) {
        if(snail[i].movement.z <= 0) {
            if(snail[i].movement.x / snail[i].movement.z <= 1) {
                // east
                snail_image = snail8_png;
            } else {
                // north east
                snail_image = snail4_png;
            }
        } else {
            if(snail[i].movement.x / snail[i].movement.z <= -1) {
                // north
                snail_image = snail7_png;
            } else {
                // north west
                snail_image = snail3_png;
            }
        }
    } else {
        if(snail[i].movement.z <= 0) {
            if(snail[i].movement.x / snail[i].movement.z <= -1) {
                // south
                snail_image = snail5_png;
            } else {
                // south east
                snail_image = snail2_png;
            }
        } else {
            if(snail[i].movement.x / snail[i].movement.z <= 1) {
                // west
                snail_image = snail6_png;
            } else {
                // south west
                snail_image = snail1_png;
            }
        }
    }
    ctx_transparent.drawImage(snail_image, mapped.x - 16, mapped.y - 25);
    ctx_opaque.fillStyle = `#100600`;
    mapped = isometric_map(snail[integer].x, y_boundary, snail[integer].z);
    ctx_opaque.fillRect(mapped.x - 1, mapped.y - 1, 2, 2);
}
const draw_snails = () => {
    for(i = 0; i < snail.length; i++) draw_snail(i);
}
const draw_shell = (integer) => {
    mapped = isometric_map(shell[integer].x, y_boundary, shell[integer].z);
    if(shell[i].facing.x <= 0) {
        if(shell[i].facing.z <= 0) {
            if(shell[i].facing.x / shell[i].facing.z <= 1) {
                // east
                shell_image = shell8_png;
            } else {
                // north east
                shell_image = shell4_png;
            }
        } else {
            if(shell[i].facing.x / shell[i].facing.z <= -1) {
                // north
                shell_image = shell7_png;
            } else {
                // north west
                shell_image = shell3_png;
            }
        }
    } else {
        if(shell[i].facing.z <= 0) {
            if(shell[i].facing.x / shell[i].facing.z <= -1) {
                // south
                shell_image = shell5_png;
            } else {
                // south east
                shell_image = shell2_png;
            }
        } else {
            if(shell[i].facing.x / shell[i].facing.z <= 1) {
                // west
                shell_image = shell6_png;
            } else {
                // south west
                shell_image = shell1_png;
            }
        }
    }
    ctx_transparent.drawImage(shell_image, mapped.x - 16, mapped.y - 25);
}
const draw_shells = () => {
    for(i = 0; i < shell.length; i++) draw_shell(i);
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
    // bottom
    a_mapped = isometric_map(x_boundary, y_boundary, z_boundary);
    b_mapped = isometric_map(x_boundary, y_boundary, -z_boundary);
    c_mapped = isometric_map(-x_boundary, y_boundary, -z_boundary);
    d_mapped = isometric_map(-x_boundary, y_boundary, z_boundary);
    ctx_opaque.strokeStyle = `#50505050`;
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
    ctx_opaque.moveTo(c_mapped.x, c_mapped.y);
    ctx_opaque.lineTo(g_mapped.x, g_mapped.y);
    ctx_opaque.stroke();
    ctx_opaque.beginPath();
    ctx_opaque.moveTo(d_mapped.x, d_mapped.y);
    ctx_opaque.lineTo(h_mapped.x, h_mapped.y);
    ctx_opaque.stroke();
    // top
    ctx_opaque.beginPath();
    ctx_opaque.lineTo(e_mapped.x, e_mapped.y);
    ctx_opaque.lineTo(h_mapped.x, h_mapped.y);
    ctx_opaque.lineTo(g_mapped.x, g_mapped.y);
    ctx_opaque.stroke();
}
const draw_global_wireframe_front = () => {
    // columns
    b_mapped = isometric_map(x_boundary, y_boundary, -z_boundary);
    e_mapped = isometric_map(x_boundary, -y_boundary, z_boundary);
    f_mapped = isometric_map(x_boundary, -y_boundary, -z_boundary);
    g_mapped = isometric_map(-x_boundary, -y_boundary, -z_boundary);
    h_mapped = isometric_map(-x_boundary, -y_boundary, z_boundary);
    ctx_transparent.strokeStyle = `#50505050`;
    ctx_transparent.beginPath();
    ctx_transparent.moveTo(b_mapped.x, b_mapped.y);
    ctx_transparent.lineTo(f_mapped.x, f_mapped.y);
    ctx_transparent.stroke();
    // top
    ctx_transparent.lineTo(e_mapped.x, e_mapped.y);
    ctx_transparent.lineTo(f_mapped.x, f_mapped.y);
    ctx_transparent.lineTo(g_mapped.x, g_mapped.y);
    ctx_transparent.stroke();
}
forest_drawn = false;
const sub_time = () => {
    ctx_transparent.clearRect(0, 0, canvas.width, canvas.height);
    mapped_cursor = flat_map(cursor_x, cursor_y + canvas.center.y / 2);
    if(!(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
        new_food(mapped_cursor.x, mapped_cursor.z);
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
    // draw_axis(snail[0].x, y_boundary, snail[0].z);
    age_foods();
    age_fishes();
    age_snails();
    global_tick++;
    if(global_tick >= 10000) {
        global_tick = 0;
        draw_ground(`32`);
    }
    draw_static_foods();
    draw_shells();
    draw_snails();
    draw_foods();
    draw_fishes();
    draw_water();
    draw_global_wireframe_front();
}
time_speed = 1;
const time = () => {
    window.requestAnimationFrame(time);
    // for(zips = 0; zips < time_speed; zips++) {
        sub_time();
    // }
}
cursor_x = 0;
cursor_y = 0;
canvas_transparent.addEventListener(`mousedown`, e => {
    cursor_x = e.clientX - canvas.center.x;
    cursor_y = e.clientY - canvas.center.y;
    if(e.button === 0) {
        // fish.x = flat_map(cursor_x, cursor_y + canvas.center.y / 2).x;
        // fish.y = -y_boundary;
        // fish.z = flat_map(cursor_x, cursor_y + canvas.center.y / 2).z;
        mapped_cursor = flat_map(cursor_x, cursor_y + canvas.center.y / 2);
        if(!(mapped_cursor.x < -x_boundary || mapped_cursor.x > x_boundary || mapped_cursor.z < -z_boundary || mapped_cursor.z > z_boundary)) {
            new_food(mapped_cursor.x, mapped_cursor.z);
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
random_fish(16);
random_snail(4);
time();
draw_global_wireframe_back();

// allow player to pick up shells from dead snails for points

// simulate some degree of fluid motion and allow the cursor to move stuff around in the tank

// use a similar gameplay loop to insane aquarium deluxe