// English version of the game content — same structure as zones.js (ids,
// emoji, scale, anim, badge, sequence all unchanged, since the engine and
// artwork key off them), only display text (names, dialogue, reward words)
// translated to English. See zones.js for the full data-model docs.

export const ZONES = {
  fruktejo: {
    id: "fruktejo",
    name: "Orchard",
    mapEmoji: "🍎",
    map: { x: 22, y: 74 },
    npc: {
      id: "vulpo",
      emoji: "🦊",
      name: "Fox",
      greeting: "Hi! I'm Fox! Let's play together!",
      voice: { rate: 1.05, pitch: 1.4 },
    },
    story: [
      "I want to make a basket of fruit for my friends.",
      "Will you help me find some fruit?",
    ],
    winText: "Thank you! Now my basket is full of fruit!",
    skill: {
      word: "water",
      emoji: "🪣",
      before: "🌱",
      after: "🌳",
      line: "You know the word water! Water the little tree!",
      praise: "Look! The little tree grew!",
      lockedLine: "Shh... that's a secret. Learn more words!",
      reward: { word: "tree", emoji: "🌳" },
    },
    retryPhrases: [
      "Hmm... try again!",
      "Not quite! Try once more!",
      "Almost! Look closely!",
    ],
    successPhrases: ["Great job!", "Very good!", "Perfect!", "Hooray!"],
    tasks: [
      {
        instruction: "Find the apple!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "pomo",
        reward: { word: "apple", emoji: "🍎" },
      },
      {
        instruction: "Find the banana!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "banano",
        reward: { word: "banana", emoji: "🍌" },
      },
      {
        instruction: "Find the pear!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "piro",
        reward: { word: "pear", emoji: "🍐" },
      },
      {
        instruction: "Touch the red fruit!",
        objects: [
          { id: "banano", emoji: "🍌" },
          { id: "pomo", emoji: "🍎" },
          { id: "piro", emoji: "🍐" },
        ],
        correct: "pomo",
        reward: { word: "red", emoji: "🔴" },
      },
      {
        instruction: "Touch the yellow fruit!",
        objects: [
          { id: "piro", emoji: "🍐" },
          { id: "banano", emoji: "🍌" },
          { id: "pomo", emoji: "🍎" },
        ],
        correct: "banano",
        reward: { word: "yellow", emoji: "🟡" },
      },
      {
        instruction: "Touch the green fruit!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "piro", emoji: "🍐" },
          { id: "banano", emoji: "🍌" },
        ],
        correct: "piro",
        reward: { word: "green", emoji: "🟢" },
      },
      {
        type: "sequence",
        instruction: "First touch the apple, then the banana!",
        objects: [
          { id: "pomo", emoji: "🍎" },
          { id: "banano", emoji: "🍌" },
          { id: "piro", emoji: "🍐" },
        ],
        sequence: ["pomo", "banano"],
        reward: { word: "basket", emoji: "🧺" },
      },
    ],
  },

  vilago: {
    id: "vilago",
    name: "Village",
    mapEmoji: "🏡",
    map: { x: 48, y: 50 },
    npc: {
      id: "urso",
      emoji: "🐻",
      name: "Bear",
      greeting: "Hello, dear friend... I'm Bear. Welcome.",
      voice: { rate: 0.68, pitch: 0.6 },
    },
    story: [
      "I'm looking for food for my home...",
      "Will you help me find it in the village?",
    ],
    winText: "Thank you, dear! Now I have everything I needed!",
    skill: {
      word: "red",
      emoji: "🚪",
      before: "🚪",
      after: "🎁",
      line: "You know the word red! Open the red door!",
      praise: "The door opened! Here's a gift for you!",
      lockedLine: "Hmm... the door is locked, dear. Learn more words.",
      reward: { word: "gift", emoji: "🎁" },
    },
    retryPhrases: [
      "Hmm... try again, dear.",
      "Not quite... take it easy, try again!",
      "Almost, friend... look closely!",
    ],
    successPhrases: ["Very good, dear!", "Great job!", "Mmm... perfect!", "Well done, friend!"],
    tasks: [
      {
        instruction: "Find the house!",
        objects: [
          { id: "domo", emoji: "🏠" },
          { id: "arbo", emoji: "🌳" },
          { id: "floro", emoji: "🌻" },
        ],
        correct: "domo",
        reward: { word: "house", emoji: "🏠" },
      },
      {
        instruction: "Find the door!",
        objects: [
          { id: "domo", emoji: "🏠" },
          { id: "pordo", emoji: "🚪" },
          { id: "fenestro", emoji: "🪟" },
        ],
        correct: "pordo",
        reward: { word: "door", emoji: "🚪" },
      },
      {
        instruction: "Find the window!",
        objects: [
          { id: "pordo", emoji: "🚪" },
          { id: "fenestro", emoji: "🪟" },
          { id: "domo", emoji: "🏠" },
        ],
        correct: "fenestro",
        reward: { word: "window", emoji: "🪟" },
      },
      {
        instruction: "Find the bread!",
        objects: [
          { id: "pano", emoji: "🍞" },
          { id: "lakto", emoji: "🥛" },
          { id: "kuko", emoji: "🍰" },
        ],
        correct: "pano",
        reward: { word: "bread", emoji: "🍞" },
      },
      {
        instruction: "Find the milk!",
        objects: [
          { id: "kuko", emoji: "🍰" },
          { id: "pano", emoji: "🍞" },
          { id: "lakto", emoji: "🥛" },
        ],
        correct: "lakto",
        reward: { word: "milk", emoji: "🥛" },
      },
      {
        instruction: "Find the cake!",
        objects: [
          { id: "lakto", emoji: "🥛" },
          { id: "kuko", emoji: "🍰" },
          { id: "pano", emoji: "🍞" },
        ],
        correct: "kuko",
        reward: { word: "cake", emoji: "🍰" },
      },
      {
        instruction: "Touch the big house!",
        objects: [
          { id: "granda-domo", emoji: "🏠", scale: 1.35 },
          { id: "eta-domo", emoji: "🏠", scale: 0.6 },
        ],
        correct: "granda-domo",
        reward: { word: "big", emoji: "🐘" },
      },
      {
        instruction: "Touch the small bread!",
        objects: [
          { id: "granda-pano", emoji: "🍞", scale: 1.35 },
          { id: "eta-pano", emoji: "🍞", scale: 0.6 },
        ],
        correct: "eta-pano",
        reward: { word: "small", emoji: "🐭" },
      },
      {
        type: "drag",
        instruction: "Give the bread to Bear!",
        objects: [
          { id: "pano", emoji: "🍞" },
          { id: "floro", emoji: "🌻" },
          { id: "lakto", emoji: "🥛" },
        ],
        correct: "pano",
        reward: { word: "to give", emoji: "🤲" },
      },
    ],
  },

  arbaro: {
    id: "arbaro",
    name: "Forest",
    mapEmoji: "🌳",
    map: { x: 75, y: 26 },
    npc: {
      id: "papago",
      emoji: "🦜",
      name: "Parrot",
      greeting: "Hello! Hello! I'm Parrot! Parrot!",
      voice: { rate: 1.15, pitch: 1.8 },
    },
    story: [
      "The animals hid in the forest! Hid!",
      "Let's find them together! Together!",
    ],
    winText: "We found them all! Thank you! Thank you!",
    skill: {
      word: "bread",
      emoji: "🍞",
      before: "🐦",
      after: "🐦🐤🐥",
      line: "You know the word bread! Give bread to the birds! Birds!",
      praise: "The birds are singing for you! Singing!",
      lockedLine: "The birds are hungry... Learn more words! More words!",
      reward: { word: "to sing", emoji: "🎶" },
    },
    retryPhrases: [
      "Try again! Try again!",
      "No, no! Again! Again!",
      "Look! Look closely!",
    ],
    successPhrases: ["Well done! Well done!", "Great! Great!", "Hooray! Hooray!", "Perfect! Perfect!"],
    tasks: [
      {
        instruction: "Find the rabbit!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "birdo", emoji: "🐦" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "kuniklo",
        reward: { word: "rabbit", emoji: "🐰" },
      },
      {
        instruction: "Find the bird!",
        objects: [
          { id: "rano", emoji: "🐸" },
          { id: "birdo", emoji: "🐦" },
          { id: "kuniklo", emoji: "🐰" },
        ],
        correct: "birdo",
        reward: { word: "bird", emoji: "🐦" },
      },
      {
        instruction: "Find the frog!",
        objects: [
          { id: "birdo", emoji: "🐦" },
          { id: "kuniklo", emoji: "🐰" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "rano",
        reward: { word: "frog", emoji: "🐸" },
      },
      {
        instruction: "Find the squirrel!",
        objects: [
          { id: "sciuro", emoji: "🐿️" },
          { id: "papilio", emoji: "🦋" },
          { id: "kuniklo", emoji: "🐰" },
        ],
        correct: "sciuro",
        reward: { word: "squirrel", emoji: "🐿️" },
      },
      {
        instruction: "Find the butterfly!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "sciuro", emoji: "🐿️" },
          { id: "papilio", emoji: "🦋" },
        ],
        correct: "papilio",
        reward: { word: "butterfly", emoji: "🦋" },
      },
      {
        instruction: "Touch the jumping animal!",
        objects: [
          { id: "saltanta", emoji: "🐰", anim: "jump" },
          { id: "birdo", emoji: "🐦" },
          { id: "sciuro", emoji: "🐿️" },
        ],
        correct: "saltanta",
        reward: { word: "to jump", emoji: "🦘" },
      },
      {
        instruction: "Touch the flying animal!",
        objects: [
          { id: "kuniklo", emoji: "🐰" },
          { id: "fluganta", emoji: "🐦", anim: "fly" },
          { id: "rano", emoji: "🐸" },
        ],
        correct: "fluganta",
        reward: { word: "to fly", emoji: "🕊️" },
      },
      {
        instruction: "Touch the sleeping animal!",
        objects: [
          { id: "saltanta", emoji: "🐰", anim: "jump" },
          { id: "dormanta", emoji: "🐿️", badge: "💤" },
          { id: "fluganta", emoji: "🐦", anim: "fly" },
        ],
        correct: "dormanta",
        reward: { word: "to sleep", emoji: "😴" },
      },
    ],
  },

  monto: {
    id: "monto",
    name: "Mountain",
    mapEmoji: "🏔️",
    map: { x: 40, y: 30 },
    npc: {
      id: "strigo",
      emoji: "🦉",
      name: "Owl",
      greeting: "Hoo-hoo! I'm Owl, the wise bird of the mountain.",
      voice: { rate: 0.85, pitch: 0.9 },
    },
    story: [
      "Night is falling on the mountain, and I love riddles.",
      "Do you like riddles? Let's play, hoo-hoo!",
    ],
    winText: "Hoo-hoo! You solved all my riddles! You are very wise!",
    retryPhrases: [
      "Hoo... think some more!",
      "Not quite... look closely, hoo-hoo!",
      "Almost! The wise one tries again!",
    ],
    successPhrases: ["Wise!", "Hoo-hoo! Great job!", "Very wise!", "Perfect, hoo-hoo!"],
    skill: {
      word: "to fly",
      emoji: "🪶",
      before: "🦉",
      after: "🌙🦉⭐",
      line: "You know the word to fly! Let's fly through the night sky, hoo-hoo!",
      praise: "Hoo-hoo! We're flying among the stars!",
      lockedLine: "Hoo... to fly with me, learn more words.",
      reward: { word: "sky", emoji: "🌌" },
    },
    tasks: [
      {
        instruction: "Find the moon!",
        objects: [
          { id: "luno", emoji: "🌙" },
          { id: "suno", emoji: "☀️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "luno",
        reward: { word: "moon", emoji: "🌙" },
      },
      {
        instruction: "Find the sun!",
        objects: [
          { id: "stelo", emoji: "⭐" },
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "suno",
        reward: { word: "sun", emoji: "☀️" },
      },
      {
        instruction: "Find the star!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "nubo", emoji: "☁️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "stelo",
        reward: { word: "star", emoji: "⭐" },
      },
      {
        instruction: "Find the water!",
        objects: [
          { id: "akvo", emoji: "💧" },
          { id: "fajro", emoji: "🔥" },
          { id: "monto", emoji: "⛰️" },
        ],
        correct: "akvo",
        reward: { word: "water", emoji: "💧" },
      },
      {
        instruction: "Riddle! It is big and tall. Find it!",
        objects: [
          { id: "monto", emoji: "⛰️" },
          { id: "floro", emoji: "🌸" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "monto",
        reward: { word: "mountain", emoji: "⛰️" },
      },
      {
        type: "drag",
        instruction: "Give the water to Owl!",
        objects: [
          { id: "akvo", emoji: "💧" },
          { id: "fajro", emoji: "🔥" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "akvo",
        reward: { word: "to drink", emoji: "🥤" },
      },
      {
        type: "sequence",
        instruction: "First touch the sun, then the moon!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        sequence: ["suno", "luno"],
        reward: { word: "night", emoji: "🌃" },
      },
      {
        instruction: "Riddle! It flies at night and says hoo-hoo. Find it!",
        objects: [
          { id: "strigo", emoji: "🦉" },
          { id: "kuniklo", emoji: "🐰" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "strigo",
        reward: { word: "owl", emoji: "🦉" },
      },
    ],
  },

  marbordo: {
    id: "marbordo",
    name: "Seaside",
    mapEmoji: "🏖️",
    map: { x: 84, y: 66 },
    npc: {
      id: "kankro",
      emoji: "🦀",
      name: "Crab",
      greeting: "Click-click! I'm Crab! Welcome to the seaside!",
      voice: { rate: 0.95, pitch: 1.3 },
    },
    story: [
      "The weather here changes every day — and I feel it all!",
      "Will you help me understand the weather and my feelings?",
    ],
    winText: "Click-click! Thank you! Now I understand all the weather... and myself!",
    retryPhrases: [
      "Click... try again!",
      "Not quite... try again, friend!",
      "Almost! Look closely!",
    ],
    successPhrases: ["Click-click! Great job!", "Perfect!", "Hooray, you did it!", "Very good, friend!"],
    skill: {
      word: "night",
      emoji: "🔭",
      before: "🏖️",
      after: "🌌✨",
      line: "You know the word night! Look at the sky over the sea!",
      praise: "Click-click! So many stars over the sea!",
      lockedLine: "Click... that's a secret for later. Learn more words!",
      reward: { word: "sea", emoji: "🌊" },
    },
    tasks: [
      {
        instruction: "Find the rain!",
        objects: [
          { id: "pluvo", emoji: "🌧️" },
          { id: "suno", emoji: "☀️" },
          { id: "nubo", emoji: "☁️" },
        ],
        correct: "pluvo",
        reward: { word: "rain", emoji: "🌧️" },
      },
      {
        instruction: "Find the wind!",
        objects: [
          { id: "vento", emoji: "💨" },
          { id: "nubo", emoji: "☁️" },
          { id: "pluvo", emoji: "🌧️" },
        ],
        correct: "vento",
        reward: { word: "wind", emoji: "💨" },
      },
      {
        instruction: "Find the cloud!",
        objects: [
          { id: "nubo", emoji: "☁️" },
          { id: "vento", emoji: "💨" },
          { id: "suno", emoji: "☀️" },
        ],
        correct: "nubo",
        reward: { word: "cloud", emoji: "☁️" },
      },
      {
        instruction: "Find the rainbow!",
        objects: [
          { id: "cielarko", emoji: "🌈" },
          { id: "nubo", emoji: "☁️" },
          { id: "pluvo", emoji: "🌧️" },
        ],
        correct: "cielarko",
        reward: { word: "rainbow", emoji: "🌈" },
      },
      {
        instruction: "Touch the happy face!",
        objects: [
          { id: "felica", emoji: "😊" },
          { id: "trista", emoji: "😢" },
          { id: "timigita", emoji: "😱" },
        ],
        correct: "felica",
        reward: { word: "happy", emoji: "😊" },
      },
      {
        instruction: "Touch the sad face!",
        objects: [
          { id: "timigita", emoji: "😱" },
          { id: "felica", emoji: "😊" },
          { id: "trista", emoji: "😢" },
        ],
        correct: "trista",
        reward: { word: "sad", emoji: "😢" },
      },
      {
        type: "drag",
        instruction: "Give the rainbow to Crab!",
        objects: [
          { id: "cielarko", emoji: "🌈" },
          { id: "nubo", emoji: "☁️" },
          { id: "vento", emoji: "💨" },
        ],
        correct: "cielarko",
        reward: { word: "to help", emoji: "🤝" },
      },
      {
        type: "sequence",
        instruction: "First touch the sun, then the rain!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "pluvo", emoji: "🌧️" },
          { id: "vento", emoji: "💨" },
        ],
        sequence: ["suno", "pluvo"],
        reward: { word: "weather", emoji: "🌤️" },
      },
    ],
  },

  kastelo: {
    id: "kastelo",
    name: "Castle",
    mapEmoji: "🏰",
    map: { x: 25, y: 45 },
    npc: {
      id: "drako",
      emoji: "🐉",
      name: "Dragon",
      greeting: "Haaa! I'm Dragon, guardian of the castle!",
      voice: { rate: 0.75, pitch: 0.55 },
    },
    story: [
      "I have guarded this castle for so very long...",
      "Are you brave enough to help me?",
    ],
    winText: "Ha! You are truly brave! The castle is now your friend!",
    retryPhrases: [
      "Ha... try again!",
      "Not quite, brave one! Try again!",
      "Almost! Look closely!",
    ],
    successPhrases: ["Ha! Great job!", "Truly brave!", "Perfect, friend!", "Well done!"],
    skill: {
      word: "to help",
      emoji: "🗝️",
      before: "🏯",
      after: "✨🏯",
      line: "You know the word to help! Help me open the secret chamber!",
      praise: "Ha! Thank you for your help, brave friend!",
      lockedLine: "Ha... that's a secret. Learn more words first!",
      reward: { word: "treasure", emoji: "💰" },
    },
    tasks: [
      {
        instruction: "Find the tower!",
        objects: [
          { id: "turo", emoji: "🗼" },
          { id: "slosilo", emoji: "🔑" },
          { id: "krono", emoji: "👑" },
        ],
        correct: "turo",
        reward: { word: "tower", emoji: "🗼" },
      },
      {
        instruction: "Find the key!",
        objects: [
          { id: "krono", emoji: "👑" },
          { id: "slosilo", emoji: "🔑" },
          { id: "glavo", emoji: "⚔️" },
        ],
        correct: "slosilo",
        reward: { word: "key", emoji: "🔑" },
      },
      {
        instruction: "Find the crown!",
        objects: [
          { id: "glavo", emoji: "⚔️" },
          { id: "turo", emoji: "🗼" },
          { id: "krono", emoji: "👑" },
        ],
        correct: "krono",
        reward: { word: "crown", emoji: "👑" },
      },
      {
        instruction: "Find the sword!",
        objects: [
          { id: "sildo", emoji: "🛡️" },
          { id: "glavo", emoji: "⚔️" },
          { id: "slosilo", emoji: "🔑" },
        ],
        correct: "glavo",
        reward: { word: "sword", emoji: "⚔️" },
      },
      {
        instruction: "Find the shield!",
        objects: [
          { id: "sildo", emoji: "🛡️" },
          { id: "krono", emoji: "👑" },
          { id: "turo", emoji: "🗼" },
        ],
        correct: "sildo",
        reward: { word: "shield", emoji: "🛡️" },
      },
      {
        instruction: "Touch the tall tower!",
        objects: [
          { id: "alta-turo", emoji: "🗼", scale: 1.35 },
          { id: "malalta-turo", emoji: "🗼", scale: 0.6 },
        ],
        correct: "alta-turo",
        reward: { word: "tall", emoji: "📏" },
      },
      {
        instruction: "Touch the short tower!",
        objects: [
          { id: "alta-turo2", emoji: "🗼", scale: 1.35 },
          { id: "malalta-turo2", emoji: "🗼", scale: 0.6 },
        ],
        correct: "malalta-turo2",
        reward: { word: "short", emoji: "🔻" },
      },
      {
        type: "drag",
        instruction: "Give the key to Dragon!",
        objects: [
          { id: "slosilo", emoji: "🔑" },
          { id: "krono", emoji: "👑" },
          { id: "glavo", emoji: "⚔️" },
        ],
        correct: "slosilo",
        reward: { word: "to open", emoji: "🔓" },
      },
      {
        type: "sequence",
        instruction: "First touch the key, then the door, finally the crown!",
        objects: [
          { id: "slosilo", emoji: "🔑" },
          { id: "pordo", emoji: "🚪" },
          { id: "krono", emoji: "👑" },
          { id: "glavo", emoji: "⚔️" },
        ],
        sequence: ["slosilo", "pordo", "krono"],
        reward: { word: "kingdom", emoji: "🏯" },
      },
    ],
  },

  cielo: {
    id: "cielo",
    name: "Sky",
    mapEmoji: "☁️",
    map: { x: 60, y: 18 },
    npc: {
      id: "nubeto",
      emoji: "☁️",
      name: "Cloudy",
      greeting: "Hello... I'm Cloudy, the little cloud! Puff-puff!",
      voice: { rate: 0.8, pitch: 1.65 },
    },
    story: [
      "High in the sky I play hide-and-seek with my friends...",
      "Do you want to play with us? Watch out — it will be hard!",
    ],
    winText: "Puff-puff! You found everything among the clouds! The whole sky thanks you!",
    skill: {
      word: "treasure",
      emoji: "🌈",
      before: "☁️",
      after: "🌈✨",
      line: "You know the word treasure! Find the treasure hidden in the cloud!",
      praise: "Oh! A rainbow! Here is the treasure of the sky!",
      lockedLine: "Shh... the cloud is hiding something... Learn more words!",
      reward: { word: "friend", emoji: "🤗" },
    },
    retryPhrases: [
      "Puff... try again!",
      "Oh, not quite... try again, dear!",
      "Almost! Think hard!",
    ],
    successPhrases: ["Puff-puff! Great job!", "Wonderful!", "Perfect, dear!", "Hooray! You're flying high!"],
    tasks: [
      {
        instruction: "Find the kite!",
        objects: [
          { id: "kajto", emoji: "🪁" },
          { id: "balono", emoji: "🎈" },
          { id: "nubo", emoji: "☁️" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "kajto",
        reward: { word: "kite", emoji: "🪁" },
      },
      {
        instruction: "Find the balloon!",
        objects: [
          { id: "balono", emoji: "🎈" },
          { id: "kajto", emoji: "🪁" },
          { id: "aviadilo", emoji: "✈️" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "balono",
        reward: { word: "balloon", emoji: "🎈" },
      },
      {
        instruction: "Find the airplane!",
        objects: [
          { id: "birdo", emoji: "🐦" },
          { id: "aviadilo", emoji: "✈️" },
          { id: "kajto", emoji: "🪁" },
          { id: "balono", emoji: "🎈" },
        ],
        correct: "aviadilo",
        reward: { word: "airplane", emoji: "✈️" },
      },
      {
        instruction: "Find the lightning!",
        objects: [
          { id: "fulmo", emoji: "⚡" },
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "fulmo",
        reward: { word: "lightning", emoji: "⚡" },
      },
      {
        type: "memory",
        instruction: "Remember where the sun is!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        correct: "suno",
        reward: { word: "to hide", emoji: "🙈" },
      },
      {
        type: "memory",
        instruction: "Remember where the kite is!",
        objects: [
          { id: "kajto", emoji: "🪁" },
          { id: "balono", emoji: "🎈" },
          { id: "aviadilo", emoji: "✈️" },
          { id: "birdo", emoji: "🐦" },
        ],
        correct: "kajto",
        reward: { word: "to find", emoji: "🔍" },
      },
      {
        type: "drag",
        instruction: "Give the star to Cloudy!",
        objects: [
          { id: "stelo", emoji: "⭐" },
          { id: "luno", emoji: "🌙" },
          { id: "fulmo", emoji: "⚡" },
        ],
        correct: "stelo",
        reward: { word: "to shine", emoji: "✨" },
      },
      {
        type: "sequence",
        instruction: "First touch the sun, then the lightning, finally the moon!",
        objects: [
          { id: "suno", emoji: "☀️" },
          { id: "fulmo", emoji: "⚡" },
          { id: "luno", emoji: "🌙" },
          { id: "stelo", emoji: "⭐" },
        ],
        sequence: ["suno", "fulmo", "luno"],
        reward: { word: "day", emoji: "🌅" },
      },
      {
        type: "memory",
        instruction: "Remember where the lightning is!",
        objects: [
          { id: "fulmo", emoji: "⚡" },
          { id: "suno", emoji: "☀️" },
          { id: "stelo", emoji: "⭐" },
          { id: "luno", emoji: "🌙" },
        ],
        correct: "fulmo",
        reward: { word: "dream", emoji: "💭" },
      },
    ],
  },
};

export const ZONE_ORDER = ["fruktejo", "vilago", "arbaro", "monto", "marbordo", "kastelo", "cielo"];
