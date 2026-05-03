import coke from "@/assets/subject/compressed/coke.webp"
import sprite from "@/assets/subject/compressed/sprite.webp"
import pepsi from "@/assets/subject/compressed/pepsi.webp"
import fanta from "@/assets/subject/compressed/fanta.webp"

import ice_cube_1 from "@/assets/subject/ice_cubes/ice_cube_1.webp"
import ice_cube_2 from "@/assets/subject/ice_cubes/ice_cube_2.webp"
import ice_cube_3 from "@/assets/subject/ice_cubes/ice_cube_3.webp"
import ice_cube_4 from "@/assets/subject/ice_cubes/ice_cube_4.webp"
import ice_cube_5 from "@/assets/subject/ice_cubes/ice_cube_5.webp"

import leaf_1 from "@/assets/subject/leaves/compressed/mint_1.webp"
import leaf_2 from "@/assets/subject/leaves/compressed/mint_2.webp"
import leaf_3 from "@/assets/subject/leaves/compressed/mint_3.webp"
import leaf_4 from "@/assets/subject/leaves/compressed/mint_4.webp"
import leaf_5 from "@/assets/subject/leaves/compressed/mint_5.webp"

import background from "@/assets/backgrounds/compressed/background.webp"
import ground_water from "@/assets/backgrounds/compressed/ground_water.webp"
import water_splash from "@/assets/backgrounds/compressed/water_splash.webp"

import sprite_bg from "@/assets/images/compressed/sprite_bg.webp"
import coke_bg from "@/assets/images/compressed/coke_bg.webp"
import fanta_bg from "@/assets/images/compressed/fanta_bg.webp"

import ritual_sprite from "@/assets/images/compressed/ritual_sprite.webp"
import ritual_coke from "@/assets/images/compressed/ritual_coke.webp"
import ritual_fanta from "@/assets/images/compressed/ritual_fanta.webp"

import logo_img from "@/assets/images/compressed/beverage_logo.webp"

const logo = logo_img

const cans_image = {
    sprite_bg,
    coke_bg,
    fanta_bg
} as const;

const images  = {
    coke,
    sprite,
    pepsi,
    fanta,
    ice_cube_1,
    ice_cube_2,
    ice_cube_3,
    ice_cube_4,
    ice_cube_5,
    leaf_1,
    leaf_2,
    leaf_3,
    leaf_4,
    leaf_5,
    background,
    ground_water,
    water_splash,
    
    ritual_sprite,
    ritual_coke,
    ritual_fanta,
} as const;



export { images, cans_image, logo}