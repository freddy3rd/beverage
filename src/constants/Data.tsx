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

const BEVERAGE_CONFIG: BeverageConfig[] = [
  {
    img: images.sprite,
    color: "#00ab41",
    gradient: "bg-[radial-gradient(circle,_#0d5c2a_0%,_#052c12_100%)]",
    hexPreview: "#003419",
    bgImage: cans_image.sprite_bg,
    headling: 'SPRITE',
    quote: "Obey Your Thirst.",
    description: "It starts with the sharp crack of the tab—a sudden, cool mist that promises relief. Then comes the rush of lemon-lime, a crisp, electric currents that cuts through the heat of the day, leaving nothing behind but a clean, cold clarity.",
    carbonation: { label: "Carbonation", intensity: "Crisp Intensity" },
    thermal: { label: "Thermal Optimal", temp: "2°C - 3°C", description: "Lower temperatures enhance the biting lime extracts." },
    sensory: {
      title: "Sensory Data",
      label: "Flavor Profile",
      description: "A sharp, dual-citrus collision that cleanses the palette.",
      tags: ["Key Lime", "Lemon Essence", "Clean Finish", "Zero Caffeine"]
    },
    ritual: {
      title: "The Ritual",
      description: "Served in a chilled glass with a fresh mint sprig and lime wedge.",
      image: images.ritual_sprite
    }
  },
  {
    img: images.coke,
    color: "#f40009",
    gradient: "bg-[radial-gradient(circle,_#310404_0%,_#0a0101_100%)]",
    hexPreview: "#2D1510",
    bgImage: cans_image.coke_bg,
    headling: 'COKE',
    quote: "Real Magic in Every Sip.",
    description: "A century of moments bottled into one iconic experience. From the first effervescent pop to the caramel-sweet finish, it's the familiar rhythm of a classic story—bold, refreshing, and exactly where you're meant to be.",
    carbonation: { label: "Carbonation", intensity: "High Intensity" },
    thermal: { label: "Thermal Optimal", temp: "3°C - 4°C", description: "The optimal serving temperature for peak effervescence." },
    sensory: {
      title: "Sensory Data",
      label: "Flavor Profile",
      description: "A complex symphony of natural extracts and essential oils.",
      tags: ["Vanilla", "Nutmeg", "Cinnamon", "Citrus Oils"]
    },
    ritual: {
      title: "The Ritual",
      description: "Glass with ice, finished with a fresh slice of lemon or lime.",
      image: images.ritual_coke
    }
  },
  {
    img: images.fanta,
    color: "#0047bb",
    gradient: "bg-[radial-gradient(circle,_#ff9d00_0%,_#d65108_100%)]",
    hexPreview: "#F7941E",
    bgImage: cans_image.fanta_bg,
    headling: 'FANTA',
    quote: "Boldly Fruity, Unapologetically Bright.",
    description: "Dive into a sun-drenched explosion of color. This is the sound of laughter and the feeling of endless summer, captured in a vibrant orange glow that dances on the tongue and turns a mundane moment into a celebration.",
    carbonation: { label: "Carbonation", intensity: "Medium-High Intensity" },
    thermal: { label: "Thermal Optimal", temp: "4°C - 5°C", description: "Best served chilled to unlock the full citrus oils." },
    sensory: {
      title: "Sensory Data",
      label: "Flavor Profile",
      description: "A bright, playful arrangement of tangy zest and sweet juice notes.",
      tags: ["Orange Zest", "Natural Sweetener", "Citric Acid", "Fruit Oils"]
    },
    ritual: {
      title: "The Ritual",
      description: "Poured over crushed ice with an orange wheel for zesty top notes.",
      image: images.ritual_fanta
    }
  },
];


export {OVERLAY_STAGES, BEVERAGE_CONFIG}