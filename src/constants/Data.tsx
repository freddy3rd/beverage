import {cans_image,images} from "@/constants/Image"

const OVERLAY_STAGES: ImageOverlay[] = [
  { 
    time: 0, 
    src: images.sprite, 
    title: "Sprite",
    description: {
      text: "Delivers a crisp, cooling burst that instantly refreshes and awakens your senses.",
      x: "top-20",
      y: "-left-20",
    }
  },
  { 
    time: 0, 
    src: images.coke, 
    title: "Coke",
    description: {
      text: "Gives a smooth, uplifting rush of sweetness and fizz that feels instantly satisfying.",
      x: "top-40",
      y: "-left-20",
    }
  },
  { 
    time: 0, 
    src: images.fanta, 
    title: "Fanta",
    description: {
      text: "Brings a playful, energizing splash of sweetness that brightens your mood.",
      x: "bottom-10",
      y: "-left-20",
    }
  },
  { 
    time: 0, 
    src: images.pepsi, 
    title: "Pepsi",
    description: {
      text: "Hits with a bold, refreshing kick that leaves you feeling recharged and satisfied.",
      x: "top-10",
      y: "-left-20",
    }
  },
];

const BEVERAGE_CONFIG: CanConfig[] = [
  {
    img: images.sprite,
    color: "sprite",
    bgImage: cans_image.sprite_bg,
    headling: 'SPRITE',
    quote: "Obey Your Thirst.",
    description: "It starts with the sharp crack of the tab—a sudden, cool mist that promises relief. Then comes the rush of lemon-lime, a crisp, electric currents that cuts through the heat of the day, leaving nothing behind but a clean, cold clarity."
  },
  {
    img: images.coke,
    color: "coke",
    bgImage: cans_image.coke_bg,
    headling: 'COKE',
    quote: "Real Magic in Every Sip.",
    description: "A century of moments bottled into one iconic experience. From the first effervescent pop to the caramel-sweet finish, it's the familiar rhythm of a classic story—bold, refreshing, and exactly where you're meant to be."
  },
  {
    img: images.fanta,
    color: "fanta",
    bgImage: cans_image.fanta_bg,
    headling: 'FANTA',
    quote: "Boldly Fruity, Unapologetically Bright.",
    description: "Dive into a sun-drenched explosion of color. This is the sound of laughter and the feeling of endless summer, captured in a vibrant orange glow that dances on the tongue and turns a mundane moment into a celebration."
  },
];

export {OVERLAY_STAGES, BEVERAGE_CONFIG}