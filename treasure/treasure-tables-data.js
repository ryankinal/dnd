var treasureTableNames = [
  "Individual Treasure: Challenge 0-4",
  "Individual Treasure: Challenge 5-10",
  "Individual Treasure: Challenge 11-16",
  "Individual Treasure: Challenge 17+",
  "Treasure Hoard: Challenge 0-4",
  "Treasure Hoard: Challenge 5-10",
  "Treasure Hoard: Challenge 11-16",
  "Treasure Hoard: Challenge 17+",
  "10 gp gems",
  "50 gp gems",
  "100 gp gems",
  "500 gp gems",
  "1,000 gp gems",
  "5,000 gp gems",
  "25 gp Art Objects",
  "250 gp Art Objects",
  "750 gp Art Objects",
  "2,500 gp Art Objects",
  "7,500 gp Art Objects",
  "Magic Item Rarity",
  "Potion Miscibility",
  "Scroll Mishap",
  "Who Created It or Was Intended to Use It?",
  "What Is a Detail from Its History?",
  "What Minor Property Does It Have?",
  "What Quirk Does It Have?",
  "Magic Item Table A",
  "Magic Item Table B",
  "Magic Item Table C",
  "Magic Item Table D",
  "Magic Item Table E",
  "Magic Item Table F",
  "Magic Item Table G",
  "Magic Item Table H",
  "Magic Item Table I",
  "Magic Armor"
];

var treasureClasses = {
  "individual treasure: challenge 0-4": "treasure individual-treasure",
  "individual treasure: challenge 5-10": "treasure individual-treasure",
  "individual treasure: challenge 11-16": "treasure individual-treasure",
  "individual treasure: challenge 17+": "treasure individual-treasure",
  "treasure hoard: challenge 0-4": "treasure hoard-treasure",
  "treasure hoard: challenge 5-10": "treasure hoard-treasure",
  "treasure hoard: challenge 11-16": "treasure hoard-treasure",
  "treasure hoard: challenge 17+": "treasure hoard-treasure",
  "10 gp gems": "gems",
  "50 gp gems": "gems",
  "100 gp gems": "gems",
  "500 gp gems": "gems",
  "1,000 gp gems": "gems",
  "5,000 gp gems": "gems",
  "25 gp art objects": "art-objects",
  "250 gp art objects": "art-objects",
  "750 gp art objects": "art-objects",
  "2,500 gp art objects": "art-objects",
  "7,500 gp art objects": "art-objects",
  "potion miscibility": "misc potion-miscibility",
  "scroll mishap": "misc scroll-mishap",
  "who created it or was intended to use it?": "details creator",
  "what is a detail from its history?": "details history",
  "what minor property does it have?": "details minor-property",
  "what quirk does it have?": "details quirk",
  "magic item table a": "magic-items",
  "magic item table b": "magic-items",
  "magic item table c": "magic-items",
  "magic item table d": "magic-items",
  "magic item table e": "magic-items",
  "magic item table f": "magic-items",
  "magic item table g": "magic-items",
  "magic item table h": "magic-items",
  "magic item table i": "magic-items",
  "magic armor": "magic-items"
}

var treasureTables = {
  "individual treasure: challenge 0-4": [
    [
      [
        "d100",
        "CP",
        "SP",
        "EP",
        "GP",
        "PP"
      ],
      [
        "01-30",
        "5d6 (17)",
        "-",
        "-",
        "-",
        "-"
      ],
      [
        "31-60",
        "-",
        "4d6 (14)",
        "-",
        "-",
        "-"
      ],
      [
        "61-70",
        "-",
        "-",
        "3d6 (10)",
        "-",
        "-"
      ],
      [
        "71-95",
        "-",
        "-",
        "-",
        "3d6 (10)",
        "-"
      ],
      [
        "96-00",
        "-",
        "-",
        "-",
        "-",
        "1d6 (3)"
      ]
    ]
  ],
  "individual treasure: challenge 5-10": [
    [
      [
        "d100",
        "CP",
        "SP",
        "EP",
        "GP",
        "PP"
      ],
      [
        "01-30",
        "4d6 x 100 (1,400)",
        "-",
        "1d6 x 10 (35)",
        "-",
        "-"
      ],
      [
        "31-60",
        "-",
        "6d6 x 10 (210)",
        "-",
        "2d6 x 10 (70)",
        "-"
      ],
      [
        "61-70",
        "-",
        "-",
        "3d6 x 10 (105)",
        "2d6 x 10 (70)",
        "-"
      ],
      [
        "71-95",
        "-",
        "-",
        "-",
        "4d6 x 10 (140)",
        "-"
      ],
      [
        "96-00",
        "-",
        "-",
        "-",
        "2d6 x 10 (70)",
        "3d6 (10)"
      ]
    ]
  ],
  "individual treasure: challenge 11-16": [
    [
      [
        "d100",
        "SP",
        "EP",
        "GP",
        "PP"
      ],
      [
        "01-20",
        "4d6 x 100 (1,400)",
        "-",
        "1d6 x 100 (350)",
        "-"
      ],
      [
        "21-35",
        "-",
        "1d6 x 100 (350)",
        "1d6 x 100 (350)",
        "-"
      ],
      [
        "36-75",
        "-",
        "-",
        "2d6 x 100 (700)",
        "1d6 x 10 (35)"
      ],
      [
        "76-00",
        "-",
        "-",
        "2d6 x 100 (700)",
        "2d6 x 10 (70)"
      ]
    ]
  ],
  "individual treasure: challenge 17+": [
    [
      [
        "d100",
        "EP",
        "GP",
        "PP"
      ],
      [
        "01-15",
        "2d6 x 1,000 (7,000)",
        "8d6 x 100 (2,800)",
        "-"
      ],
      [
        "16-55",
        "-",
        "1d6 x 1,000 (3,500)",
        "1d6 x 100 (350)"
      ],
      [
        "56-00",
        "-",
        "1d6 x 1,000 (3,500)",
        "2d6 x 100 (700)"
      ]
    ]
  ],
  "treasure hoard: challenge 0-4": [
    [
      [
        "",
        "CP",
        "SP",
        "GP",
      ],
      [
        "Coins",
        "6d6 x 100 (2,100)",
        "3d6 x 100 (1,050)",
        "2d6 x 10 (70)",
      ]
    ],
    [
      [
        "d100",
        "Gems or Art Objects",
        "Magic Items"
      ],
      [
        "01-06",
        "-",
        "-"
      ],
      [
        "07-16",
        "2d6 (7) 10 gp gems",
        "-"
      ],
      [
        "17-26",
        "2d4 (5) 25 gp art objects",
        "-"
      ],
      [
        "27-36",
        "2d6 (7) 50 gp gems",
        "-"
      ],
      [
        "37-44",
        "2d6 (7) 10 gp gems",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "45-52",
        "2d4 (5) 25 gp art objects",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "53-60",
        "2d6 (7) 50 gp gems",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "61-65",
        "2d6 (7) 10 gp gems",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "66-70",
        "2d4 (5) 25 gp art objects",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "71-75",
        "2d6 (7) 50 gp gems",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "76-78",
        "2d6 (7) 10 gp gems",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "79-80",
        "2d4 (5) 25 gp art objects",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "81-85",
        "2d6 (7) 50 gp gems",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "86-92",
        "2d4 (5) 25 gp art objects",
        "Roll 1d4 times on Magic Item Table F."
      ],
      [
        "93-97",
        "2d6 (7) 50 gp gems",
        "Roll 1d4 times on Magic Item Table F."
      ],
      [
        "98-99",
        "2d4 (5) 25 gp art objects",
        "Roll once on Magic Item Table G."
      ],
      [
        "00",
        "2d6 (7) 50 gp gems",
        "Roll once on Magic Item Table G."
      ]
    ]
  ],
  "treasure hoard: challenge 5-10": [
    [
      [
        "",
        "CP",
        "SP",
        "GP",
        "PP"
      ],
      [
        "Coins",
        "2d6 x 100 (700)",
        "2d6 x 1,000 (7,000)",
        "6d6 x 100 (2,100)",
        "3d6 x 10 (105)"
      ]
    ],
    [
      [
        "d100",
        "Gems or Art Objects",
        "Magic Items"
      ],
      [
        "01-04",
        "-",
        "-"
      ],
      [
        "05-10",
        "2d4 (5) 25 gp art objects",
        "-"
      ],
      [
        "11-16",
        "3d6 (10) 50 gp gems",
        "-"
      ],
      [
        "17-22",
        "3d6 (10) 100 gp gems",
        "-"
      ],
      [
        "23-28",
        "2d4 (5) 250 gp art objects",
        "-"
      ],
      [
        "29-32",
        "2d4 (5) 25 gp art objects",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "33-36",
        "3d6 (10) 50 gp gems",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "37-40",
        "3d6 (10) 100 gp gems",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "41-44",
        "2d4 (5) 250 gp art objects",
        "Roll 1d6 times on Magic Item Table A."
      ],
      [
        "45-49",
        "2d4 (5) 25 gp art objects",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "50-54",
        "3d6 (10) 50 gp gems",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "55-59",
        "3d6 (10) 100 gp gems",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "60-63",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table B."
      ],
      [
        "64-66",
        "2d4 (5) 25 gp art objects",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "67-69",
        "3d6 (10) 50 gp gems",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "70-72",
        "3d6 (10) 100 gp gems",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "73-74",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table C."
      ],
      [
        "75-76",
        "2d4 (5) 25 gp art objects",
        "Roll once on Magic Item Table D."
      ],
      [
        "77-78",
        "3d6 (10) 50 gp gems",
        "Roll once on Magic Item Table D."
      ],
      [
        "79",
        "3d6 (10) 100 gp gems",
        "Roll once on Magic Item Table D."
      ],
      [
        "80",
        "2d4 (5) 250 gp art objects",
        "Roll once on Magic Item Table D."
      ],
      [
        "81-84",
        "2d4 (5) 25 gp art objects",
        "Roll 1d4 times on Magic Item Table F."
      ],
      [
        "85-88",
        "3d6 (10) 50 gp gems",
        "Roll 1d4 times on Magic Item Table F."
      ],
      [
        "89-91",
        "3d6 (10) 100 gp gems",
        "Roll 1d4 times on Magic Item Table F."
      ],
      [
        "92-94",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table F."
      ],
      [
        "95-96",
        "3d6 (10) 100 gp gems",
        "Roll 1d4 times on Magic Item Table G."
      ],
      [
        "97-98",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table G."
      ],
      [
        "99",
        "3d6 (10) 100 gp gems",
        "Roll once on Magic Item Table H."
      ],
      [
        "00",
        "2d4 (5) 250 gp art objects",
        "Roll once on Magic Item Table H."
      ]
    ]
  ],
  "treasure hoard: challenge 11-16": [
    [
      [
        "",
        "GP",
        "PP"
      ],
      [
        "Coins",
        "4d6 x 1,000 (14,000)",
        "5d6 x 100 (1,750)"
      ]
    ],
    [
      [
        "d100",
        "Gems or Art Objects",
        "Magic Items"
      ],
      [
        "01-03",
        "-",
        "-"
      ],
      [
        "04-06",
        "2d4 (5) 250 gp art objects",
        "-"
      ],
      [
        "07-09",
        "2d4 (5) 750 gp art objects",
        "-"
      ],
      [
        "10-12",
        "3d6 (10) 500 gp gems",
        "-"
      ],
      [
        "13-15",
        "3d6 (10) 1,000 gp gems",
        "-"
      ],
      [
        "16-19",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B."
      ],
      [
        "20-23",
        "2d4 (5) 750 gp art objects",
        "Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B."
      ],
      [
        "24-26",
        "3d6 (10) 500 gp gems",
        "Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B."
      ],
      [
        "27-29",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d4 times on Magic Item Table A and 1d6 times on Magic Item Table B."
      ],
      [
        "30-35",
        "2d4 (5) 250 gp art objects",
        "Roll 1d6 times on Magic Item Table C."
      ],
      [
        "36-40",
        "2d4 (5) 750 gp art objects",
        "Roll 1d6 times on Magic Item Table C."
      ],
      [
        "41-45",
        "3d6 (10) 500 gp gems",
        "Roll 1d6 times on Magic Item Table C."
      ],
      [
        "46-50",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d6 times on Magic Item Table C."
      ],
      [
        "51-54",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table D."
      ],
      [
        "55-58",
        "2d4 (5) 750 gp art objects",
        "Roll 1d4 times on Magic Item Table D."
      ],
      [
        "59-62",
        "3d6 (10) 500 gp gems",
        "Roll 1d4 times on Magic Item Table D."
      ],
      [
        "63-66",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d4 times on Magic Item Table D."
      ],
      [
        "67-68",
        "2d4 (5) 250 gp art objects",
        "Roll once on Magic Item Table E."
      ],
      [
        "69-70",
        "2d4 (5) 750 gp art objects",
        "Roll once on Magic Item Table E."
      ],
      [
        "71-72",
        "3d6 (10) 500 gp gems",
        "Roll once on Magic Item Table E."
      ],
      [
        "73-74",
        "3d6 (10) 1,000 gp gems",
        "Roll once on Magic Item Table E."
      ],
      [
        "75-76",
        "2d4 (5) 250 gp art objects",
        "Roll once on Magic Item Table F and 1d4 times on Magic Item Table G."
      ],
      [
        "77-78",
        "2d4 (5) 750 gp art objects",
        "Roll once on Magic Item Table F and 1d4 times on Magic Item Table G."
      ],
      [
        "79-80",
        "3d6 (10) 500 gp gems",
        "Roll once on Magic Item Table F and 1d4 times on Magic Item Table G."
      ],
      [
        "81-82",
        "3d6 (10) 1,000 gp gems",
        "Roll once on Magic Item Table F and 1d4 times on Magic Item Table G."
      ],
      [
        "83-85",
        "2d4 (5) 250 gp art objects",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "86-88",
        "2d4 (5) 750 gp art objects",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "89-90",
        "3d6 (10) 500 gp gems",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "91-92",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "93-94",
        "2d4 (5) 250 gp art objects",
        "Roll once on Magic Item Table I."
      ],
      [
        "95-96",
        "2d4 (5) 750 gp art objects",
        "Roll once on Magic Item Table I."
      ],
      [
        "97-98",
        "3d6 (10) 500 gp gems",
        "Roll once on Magic Item Table I."
      ],
      [
        "99-00",
        "3d6 (10) 1,000 gp gems",
        "Roll once on Magic Item Table I."
      ]
    ]
  ],
  "treasure hoard: challenge 17+": [
    [
      [
        "",
        "GP",
        "PP"
      ],
      [
        "Coins",
        "12d6 x 1,000 (42,000)",
        "8d6 x 1,000 (28,000)"
      ]
    ],
    [
      [
        "d100",
        "Gems or Art Objects",
        "Magic Items"
      ],
      [
        "01-02",
        "-",
        "-"
      ],
      [
        "03-05",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d8 times on Magic Item Table C."
      ],
      [
        "06-08",
        "1d10 (5) 2,500 gp art objects",
        "Roll 1d8 times on Magic Item Table C."
      ],
      [
        "09-11",
        "1d4 (2) 7,500 gp art objects",
        "Roll 1d8 times on Magic Item Table C."
      ],
      [
        "12-14",
        "1d8 (4) 5,000 gp gems",
        "Roll 1d8 times on Magic Item Table C."
      ],
      [
        "15-22",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d6 times on Magic Item Table D."
      ],
      [
        "23-30",
        "1d10 (5) 2,500 gp art objects",
        "Roll 1d6 times on Magic Item Table D."
      ],
      [
        "31-38",
        "1d4 (2) 7,500 gp art objects",
        "Roll 1d6 times on Magic Item Table D."
      ],
      [
        "39-46",
        "1d8 (4) 5,000 gp gems",
        "Roll 1d6 times on Magic Item Table D."
      ],
      [
        "47-52",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d6 times on Magic Item Table E."
      ],
      [
        "53-58",
        "1d10 (5) 2,500 gp art objects",
        "Roll 1d6 times on Magic Item Table E."
      ],
      [
        "59-63",
        "1d4 (2) 7,500 gp art objects",
        "Roll 1d6 times on Magic Item Table E."
      ],
      [
        "64-68",
        "1d8 (4) 5,000 gp gems",
        "Roll 1d6 times on Magic Item Table E."
      ],
      [
        "69",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d4 times on Magic Item Table G."
      ],
      [
        "70",
        "1d10 (5) 2,500 gp art objects",
        "Roll 1d4 times on Magic Item Table G."
      ],
      [
        "71",
        "1d4 (2) 7,500 gp art objects",
        "Roll 1d4 times on Magic Item Table G."
      ],
      [
        "72",
        "1d8 (4) 5,000 gp gems",
        "Roll 1d4 times on Magic Item Table G."
      ],
      [
        "73-74",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "75-76",
        "1d10 (5) 2,500 gp art objects",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "77-78",
        "1d4 (2) 7,500 gp art objects",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "79-80",
        "1d8 (4) 5,000 gp gems",
        "Roll 1d4 times on Magic Item Table H."
      ],
      [
        "81-85",
        "3d6 (10) 1,000 gp gems",
        "Roll 1d4 times on Magic Item Table I."
      ],
      [
        "86-90",
        "1d10 (5) 2,500 gp art objects",
        "Roll 1d4 times on Magic Item Table I."
      ],
      [
        "91-95",
        "1d4 (2) 7,500 gp art objects",
        "Roll 1d4 times on Magic Item Table I."
      ],
      [
        "96-00",
        "1d8 (4) 5,000 gp gems",
        "Roll 1d4 times on Magic Item Table I."
      ]
    ]
  ],
  "10 gp gems": [
    [
      [
        "d12",
        "Stone Description"
      ],
      [
        "1",
        "Azurite (opaque mottled deep blue)"
      ],
      [
        "2",
        "Banded agate (translucent striped brown, blue, white, or red)"
      ],
      [
        "3",
        "Blue quartz (transparent pale blue)"
      ],
      [
        "4",
        "Eye agate (translucent circles of gray, white, brown, blue, or green)"
      ],
      [
        "5",
        "Hematite (opaque gray-black)"
      ],
      [
        "6",
        "Lapis lazuli (opaque light and dark blue with yellow flecks)"
      ],
      [
        "7",
        "Malachite (opaque striated light and dark green)"
      ],
      [
        "8",
        "Moss agate (translucent pink or yellow-white with mossy gray or green markings)"
      ],
      [
        "9",
        "Obsidian (opaque black)"
      ],
      [
        "10",
        "Rhodochrosite (opaque light pink)"
      ],
      [
        "11",
        "Tiger eye (translucent brown with golden center)"
      ],
      [
        "12",
        "Turquoise (opaque light blue-green)"
      ]
    ]
  ],
  "50 gp gems": [
    [
      [
        "d12",
        "Stone Description"
      ],
      [
        "1",
        "Bloodstone (opaque dark gray with red flecks)"
      ],
      [
        "2",
        "Carnelian (opaque orange to red-brown)"
      ],
      [
        "3",
        "Chalcedony (opaque white)"
      ],
      [
        "4",
        "Chrysoprase (translucent green)"
      ],
      [
        "5",
        "Citrine (transparent pale yellow-brown)"
      ],
      [
        "6",
        "Jasper (opaque blue, black, or brown)"
      ],
      [
        "7",
        "Moonstone (translucent white with pale blue glow)"
      ],
      [
        "8",
        "Onyx (opaque bands of black and white, or pure black or white)"
      ],
      [
        "9",
        "Quartz (transparent white, smoky gray, or yellow)"
      ],
      [
        "10",
        "Sardonyx (opaque bands of red and white)"
      ],
      [
        "11",
        "Star rose quartz (translucent rosy stone with white star-shaped center)"
      ],
      [
        "12",
        "Zircon (transparent pale blue-green)"
      ]
    ]
  ],
  "100 gp gems": [
    [
      [
        "d10",
        "Stone Description"
      ],
      [
        "1",
        "Amber (transparent watery gold to rich gold)"
      ],
      [
        "2",
        "Amethyst (transparent deep purple)"
      ],
      [
        "3",
        "Chrysoberyl (transparent yellow-green to pale green)"
      ],
      [
        "4",
        "Coral (opaque crimson)"
      ],
      [
        "5",
        "Garnet (transparent red, brown-green, or violet)"
      ],
      [
        "6",
        "Jade (translucent light green, deep green, or white)"
      ],
      [
        "7",
        "Jet (opaque deep black)"
      ],
      [
        "8",
        "Pearl (opaque lustrous white, yellow, or pink)"
      ],
      [
        "9",
        "Spinel (transparent red, red-brown, or deep green)"
      ],
      [
        "10",
        "Tourmaline (transparent pale green, blue, brown, or red)"
      ]
    ]
  ],
  "500 gp gems": [
    [
      [
        "d6",
        "Stone Description"
      ],
      [
        "1",
        "Alexandrite (transparent dark green)"
      ],
      [
        "2",
        "Aquamarine (transparent pale blue-green)"
      ],
      [
        "3",
        "Black pearl (opaque pure black)"
      ],
      [
        "4",
        "Blue spinel (transparent deep blue)"
      ],
      [
        "5",
        "Peridot (transparent rich olive green)"
      ],
      [
        "6",
        "Topaz (transparent golden yellow)"
      ]
    ]
  ],
  "1,000 gp gems": [
    [
      [
        "d8",
        "Stone Description"
      ],
      [
        "1",
        "Black opal (translucent dark green with black mottling and golden flecks)"
      ],
      [
        "2",
        "Blue sapphire (transparent blue-white to medium blue)"
      ],
      [
        "3",
        "Emerald (transparent deep bright green)"
      ],
      [
        "4",
        "Fire opal (translucent fiery red)"
      ],
      [
        "5",
        "Opal (translucent pale blue with green and golden mottling)"
      ],
      [
        "6",
        "Star ruby (translucent ruby with white star-shaped center)"
      ],
      [
        "7",
        "Star sapphire (translucent blue sapphire with white star-shaped center)"
      ],
      [
        "8",
        "Yellow sapphire (transparent fiery yellow or yellow-green)"
      ]
    ]
  ],
  "5,000 gp gems": [
    [
      [
        "d4",
        "Stone Description"
      ],
      [
        "1",
        "Black sapphire (translucent lustrous black with glowing highlights)"
      ],
      [
        "2",
        "Diamond (transparent blue-white, canary, pink, brown, or blue)"
      ],
      [
        "3",
        "Jacinth (transparent fiery orange)"
      ],
      [
        "4",
        "Ruby (transparent clear red to deep crimson)"
      ]
    ]
  ],
  "25 gp art objects": [
    [
      [
        "d10",
        "Object"
      ],
      [
        "1",
        "Silver ewer"
      ],
      [
        "2",
        "Carved bone statuette"
      ],
      [
        "3",
        "Small gold bracelet"
      ],
      [
        "4",
        "Cloth-of-gold vestments"
      ],
      [
        "5",
        "Black velvet mask stitched with silver thread"
      ],
      [
        "6",
        "Copper chalice with silver filigree"
      ],
      [
        "7",
        "Pair of engraved bone dice"
      ],
      [
        "8",
        "Small mirror set in a painted wooden frame"
      ],
      [
        "9",
        "Embroidered silk handkerchief"
      ],
      [
        "10",
        "Gold locket with a painted portrait inside"
      ]
    ]
  ],
  "250 gp art objects": [
    [
      [
        "d10",
        "Object"
      ],
      [
        "1",
        "Gold ring set with bloodstones"
      ],
      [
        "2",
        "Carved ivory statuette"
      ],
      [
        "3",
        "Large gold bracelet"
      ],
      [
        "4",
        "Silver necklace with a gemstone pendant"
      ],
      [
        "5",
        "Bronze crown"
      ],
      [
        "6",
        "Silk robe with gold embroidery"
      ],
      [
        "7",
        "Large well-made tapestry"
      ],
      [
        "8",
        "Brass mug with jade inlay"
      ],
      [
        "9",
        "Box of turquoise animal figurines"
      ],
      [
        "10",
        "Gold bird cage with electrum filigree"
      ]
    ]
  ],
  "750 gp art objects": [
    [
      [
        "d10",
        "Object"
      ],
      [
        "1",
        "Silver chalice set with moonstones"
      ],
      [
        "2",
        "Silver-plated steel longsword with jet set in hilt"
      ],
      [
        "3",
        "Carved harp of exotic wood with ivory inlay and zircon gems"
      ],
      [
        "4",
        "Small gold idol"
      ],
      [
        "5",
        "Gold dragon comb set with red garnets as eyes"
      ],
      [
        "6",
        "Bottle stopper cork embossed with gold leaf and set with amethysts"
      ],
      [
        "7",
        "Ceremonial electrum dagger with a black pearl in the pommel"
      ],
      [
        "8",
        "Silver and gold brooch"
      ],
      [
        "9",
        "Obsidian statuette with gold fittings and inlay"
      ],
      [
        "10",
        "Painted gold war mask"
      ]
    ]
  ],
  "2,500 gp art objects": [
    [
      [
        "d10",
        "Object"
      ],
      [
        "1",
        "Fine gold chain set with a fire opal"
      ],
      [
        "2",
        "Old masterpiece painting"
      ],
      [
        "3",
        "Embroidered silk and velvet mantle set with numerous moonstones"
      ],
      [
        "4",
        "Platinum bracelet set with a sapphire"
      ],
      [
        "5",
        "Embroidered glove set with jewel chips"
      ],
      [
        "6",
        "Jeweled anklet"
      ],
      [
        "7",
        "Gold music box"
      ],
      [
        "8",
        "Gold circlet set with four aquamarines"
      ],
      [
        "9",
        "Eye patch with a mock eye set in blue sapphire and moonstone"
      ],
      [
        "10",
        "A necklace string of small pink pearls"
      ]
    ]
  ],
  "7,500 gp art objects": [
    [
      [
        "d8",
        "Object"
      ],
      [
        "1",
        "Jeweled gold crown"
      ],
      [
        "2",
        "Jeweled platinum ring"
      ],
      [
        "3",
        "Small gold statuette set with rubies"
      ],
      [
        "4",
        "Gold cup set with emeralds"
      ],
      [
        "5",
        "Gold jewelry box with platinum filigree"
      ],
      [
        "6",
        "Painted gold child's sarcophagus"
      ],
      [
        "7",
        "Jade game board with solid gold playing pieces"
      ],
      [
        "8",
        "Bejeweled ivory drinking horn with gold filigree"
      ]
    ]
  ],
  "magic item rarity": [
    [
      [
        "Rarity",
        "Character Level",
        "Value"
      ],
      [
        "Common",
        "1st or higher",
        "50-100 gp"
      ],
      [
        "Uncommon",
        "1st or higher",
        "101-500 gp"
      ],
      [
        "Rare",
        "5th or higher",
        "501-5,000 gp"
      ],
      [
        "Very rare",
        "11th or higher",
        "5,001-50,000 gp"
      ],
      [
        "Legendary",
        "17th or higher",
        "50,001+ gp"
      ]
    ]
  ],
  "potion miscibility": [
    [
      [
        "d100",
        "Result"
      ],
      [
        "01",
        "The mixture creates a magical explosion, dealing 6d10 force damage to the mixer and 1d10 force damage to each creature within 5 feet of the mixer."
      ],
      [
        "02-08",
        "The mixture becomes an ingested poison of the DM's choice."
      ],
      [
        "09-15",
        "Both potions lose their effects."
      ],
      [
        "16-25",
        "One potion loses its effect."
      ],
      [
        "26-35",
        "Both potions work, but with their numerical effects and durations halved. A potion has no effect if it can't be halved in this way."
      ],
      [
        "36-90",
        "Both potions work normally."
      ],
      [
        "91-99",
        "The numerical effects and duration of one potion are doubled. If neither potion has anything to double in this way, they work normally."
      ],
      [
        "00",
        "Only one potion works, but its effect is permanent. Choose the simplest effect to make permanent, or the one that seems the most fun. For example, a potion of healing might increase the drinker's hit point maximum by 4, or oil of etherealness might permanently trap the user in the Ethereal Plane. At your discretion, an appropriate spell, such as dispel magic or remove curse, might end this lasting effect."
      ]
    ]
  ],
  "scroll mishap": [
    [
      [
        "d6",
        "Result"
      ],
      [
        "1",
        "A surge of magical energy deals the caster 1d6 force damage per level of the spell."
      ],
      [
        "2",
        "The spell affects the caster or an ally (determined randomly) instead of the intended target, or it affects a random target nearby if the caster was the intended target."
      ],
      [
        "3",
        "The spell affects a random location within the spell's range."
      ],
      [
        "4",
        "The spell's effect is contrary to its normal one, but neither harmful nor beneficial. For instance, a fireball might produce an area of harmless cold."
      ],
      [
        "5",
        "The caster suffers a minor but bizarre effect related to the spell. Such effects last only as long as the original spell's duration, or 1d10 minutes for spells that take effect instantaneously. For example, a fireball might cause smoke to billow from the caster's ears for 1d10 minutes."
      ],
      [
        "6",
        "The spell activates after 1d12 hours. If the caster was the intended target, the spell takes effect normally. If the caster was not the intended target, the spell goes off in the general direction of the intended target, up to the spell's maximum range, if the target has moved away."
      ]
    ]
  ],
  "who created it or was intended to use it?": [
    [
      [
        "d20",
        "Creator or Intended User"
      ],
      [
        "1",
        "Aberration. The item was created by aberrations in ancient times, possibly for the use of favored humanoid thralls. When seen from the corner of the eye, the item seems to be moving."
      ],
      [
        "2-4",
        "Human. The item was created during the heyday of a fallen human kingdom, or it is tied to a human of legend. It might hold writing in a forgotten tongue or symbols whose significance is lost to the ages."
      ],
      [
        "5",
        "Celestial. The weapon is half the normal weight and inscribed with feathered wings, suns, and other symbols of good. Fiends find the item's presence repulsive."
      ],
      [
        "6",
        "Dragon. This item is made from scales and talons shed by a dragon. Perhaps it incorporates precious metals and gems from the dragon's hoard. It grows slightly warm when within 120 feet of a dragon."
      ],
      [
        "7",
        "Drow. The item is half the normal weight. It is black and inscribed with spiders and webs in honor of Lolth. It might function poorly, or disintegrate, if exposed to sunlight for 1 minute or more."
      ],
      [
        "8-9",
        "Dwarf. The item is durable and has Dwarven runes worked into its design. It might be associated with a clan that would like to see it returned to their ancestral halls."
      ],
      [
        "10",
        "Elemental Air. The item is half the normal weight and feels hollow. If it's made of fabric, it is diaphanous."
      ],
      [
        "11",
        "Elemental Earth. This item might be crafted from stone. Any cloth or leather elements are studded with finely polished rock."
      ],
      [
        "12",
        "Elemental Fire. This item is warm to the touch, and any metal parts are crafted from black iron. Sigils of flames cover its surface. Shades of red and orange are the prominent colors."
      ],
      [
        "13",
        "Elemental Water. Lustrous fish scales replace leather or cloth on this item, and metal portions are instead crafted from seashells and worked coral as hard as any metal."
      ],
      [
        "14-15",
        "Elf. The item is half the normal weight. It is adorned with symbols of nature: leaves, vines, stars, and the like."
      ],
      [
        "16",
        "Fey. The item is exquisitely crafted from the finest materials and glows with a pale radiance in moonlight, shedding dim light in a 5-foot radius. Any metal in the item is silver or mithral, rather than iron or steel."
      ],
      [
        "17",
        "Fiend. The item is made of black iron or horn inscribed with runes, and any cloth or leather components are crafted from the hide of fiends. It is warm to the touch and features leering faces or vile runes engraved on its surface. Celestials find the item's presence repulsive."
      ],
      [
        "18",
        "Giant. The item is larger than normal and was crafted by giants for use by their smaller allies."
      ],
      [
        "19",
        "Gnome. The item is crafted to appear ordinary, and it might look worn. It could also incorporate gears and mechanical components, even if these aren't essential to the item's function."
      ],
      [
        "20",
        "Undead. The item incorporates imagery of death, such as bones and skulls, and it might be crafted from parts of corpses. It feels cold to the touch."
      ]
    ]
  ],
  "what is a detail from its history?": [
    [
      [
        "d8",
        "History"
      ],
      [
        "1",
        "Arcane. This item was created for an ancient order of spellcasters and bears the order's symbol."
      ],
      [
        "2",
        "Bane. This item was created by the foes of a particular culture or kind of creature. If the culture or creatures are still around, they might recognize the item and single out the bearer as an enemy."
      ],
      [
        "3",
        "Heroic. A great hero once wielded this item. Anyone who's familiar with the item's history expects great deeds from the new owner."
      ],
      [
        "4",
        "Ornament. The item was created to honor a special occasion. Inset gems, gold or platinum inlays, and gold or silver filigree adorn its surface."
      ],
      [
        "5",
        "Prophecy. The item features in a prophecy: its bearer is destined to play a key role in future events. Someone else who wants to play that role might try to steal the item, or someone who wants to prevent the prophecy from being fulfilled might try to kill the item's bearer."
      ],
      [
        "6",
        "Religious. This item was used in religious ceremonies dedicated to a particular deity. It has holy symbols worked into it. The god's followers might try to persuade its owner to donate it to a temple, steal the item for themselves, or celebrate its use by a cleric or paladin of the same deity."
      ],
      [
        "7",
        "Sinister. This item is linked to a deed of great evil, such as a massacre or an assassination. It might have a name or be closely associated with a villain who used it. Anyone familiar with the item's history is likely to treat it and its owner with suspicion."
      ],
      [
        "8",
        "Symbol of Power. This item was once used as part of royal regalia or as a badge of high office. Its former owner or that person's descendants might desire it, or someone might mistakenly assume its new owner is the item's legitimate inheritor."
      ]
    ]
  ],
  "what minor property does it have?": [
    [
      [
        "d20",
        "Minor Property"
      ],
      [
        "1",
        "Beacon. The bearer can use a bonus action to cause the item to shed bright light in a 10-foot radius and dim light for an additional 10 feet, or to extinguish the light."
      ],
      [
        "2",
        "Compass. The wielder can use an action to learn which way is north."
      ],
      [
        "3",
        "Conscientious. When the bearer of this item contemplates or undertakes a malevolent act, the item enhances pangs of conscience."
      ],
      [
        "4",
        "Delver. While underground, the bearer of this item always knows the item's depth below the surface and the direction to the nearest staircase, ramp, or other path leading upward."
      ],
      [
        "5",
        "Gleaming. This item never gets dirty."
      ],
      [
        "6",
        "Guardian. The item whispers warnings to its bearer, granting a +2 bonus to initiative if the bearer isn't incapacitated."
      ],
      [
        "7",
        "Harmonious. Attuning to this item takes only 1 minute."
      ],
      [
        "8",
        "Hidden Message. A message is hidden somewhere on the item. It might be visible only at a certain time of the year, under the light of one phase of the moon, or in a specific location."
      ],
      [
        "9",
        "Key. The item is used to unlock a container, chamber, vault, or other entryway."
      ],
      [
        "10",
        "Language. The bearer can speak and understand a language of the DM's choice while the item is on the bearer's person."
      ],
      [
        "11",
        "Sentinel. Choose a kind of creature that is an enemy of the item's creator. This item glows faintly when such creatures are within 120 feet of it."
      ],
      [
        "12",
        "Song Craft. Whenever this item is struck or is used to strike a foe, its bearer hears a fragment of an ancient song."
      ],
      [
        "13",
        "Strange Material. The item was created from a material that is bizarre given its purpose. Its durability is unaffected."
      ],
      [
        "14",
        "Temperate. The bearer suffers no harm in temperatures as cold as -20 degrees Fahrenheit or as warm as 120 degrees Fahrenheit."
      ],
      [
        "15",
        "Unbreakable. The item can't be broken. Special means must be used to destroy it."
      ],
      [
        "16",
        "War Leader. The bearer can use an action to cause his or her voice to carry clearly for up to 300 feet until the end of the bearer's next turn."
      ],
      [
        "17",
        "Waterborne. This item floats on water and other liquids. Its bearer has advantage on Strength (Athletics) checks to swim."
      ],
      [
        "18",
        "Wicked. When the bearer is presented with an opportunity to act in a selfish or malevolent way, the item heightens the bearer's urge to do so."
      ],
      [
        "19",
        "Illusion. The item is imbued with illusion magic, allowing its bearer to alter the item's appearance in minor ways. Such alterations don't change how the item is worn, carried, or wielded, and they have no effect on its other magical properties. For example, the wearer could make a red robe appear blue, or make a gold ring look like it's made of ivory. The item reverts to its true appearance when no one is carrying or wearing it."
      ],
      [
        "20",
        "Roll twice, rerolling any additional 20s."
      ]
    ]
  ],
  "what quirk does it have?": [
    [
      [
        "d12",
        "Quirk"
      ],
      [
        "1",
        "Blissful. While in possession of the item, the bearer feels fortunate and optimistic about what the future holds. Butterflies and other harmless creatures might frolic in the item's presence."
      ],
      [
        "2",
        "Confident. The item helps its bearer feel self-assured."
      ],
      [
        "3",
        "Covetous. The item's bearer becomes obsessed with material wealth."
      ],
      [
        "4",
        "Frail. The item crumbles, frays, chips, or cracks slightly when wielded, worn, or activated. This quirk has no effect on its properties, but if the item has seen much use, it looks decrepit."
      ],
      [
        "5",
        "Hungry. This item's magical properties function only if fresh blood from a humanoid has been applied to it within the past 24 hours. It needs only a drop to activate."
      ],
      [
        "6",
        "Loud. The item makes a loud noise-such as a clang, a shout, or a resonating gong-when used."
      ],
      [
        "7",
        "Metamorphic. The item periodically and randomly alters its appearance in slight ways. The bearer has no control over these minor alterations, which have no effect on the item's use."
      ],
      [
        "8",
        "Muttering. The item grumbles and mutters. A creature who listens carefully to the item might learn something useful."
      ],
      [
        "9",
        "Painful. The bearer experiences a harmless flash of pain when using the item."
      ],
      [
        "10",
        "Possessive. The item demands attunement when first wielded or worn, and it doesn't allow its bearer to attune to other items. (Other items already attuned to the bearer remain so until their attunement ends.)"
      ],
      [
        "11",
        "Repulsive. The bearer feels a sense of distaste when in contact with the item, and continues to sense discomfort while bearing it."
      ],
      [
        "12",
        "Slothful. The bearer of this item feels slothful and lethargic. While attuned to the item, the bearer requires 10 hours to finish a long rest."
      ]
    ]
  ],
  "magic item table a": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-50",
        "Potion of healing"
      ],
      [
        "51-60",
        "Spell scroll (cantrip)"
      ],
      [
        "61-70",
        "Potion of climbing"
      ],
      [
        "71-90",
        "Spell scroll (1st level)"
      ],
      [
        "91-94",
        "Spell scroll (2nd level)"
      ],
      [
        "95-98",
        "Potion of healing (greater)"
      ],
      [
        "99",
        "Bag of holding"
      ],
      [
        "00",
        "Driftglobe"
      ]
    ]
  ],
  "magic item table b": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-15",
        "Potion of healing (greater)"
      ],
      [
        "16-22",
        "Potion of fire breath"
      ],
      [
        "23-29",
        "Potion of resistance"
      ],
      [
        "30-34",
        "Ammunition, +1"
      ],
      [
        "35-39",
        "Potion of animal friendship"
      ],
      [
        "40-44",
        "Potion of hill giant strength"
      ],
      [
        "45-49",
        "Potion of growth"
      ],
      [
        "50-54",
        "Potion of water breathing"
      ],
      [
        "55-59",
        "Spell scroll (2nd level)"
      ],
      [
        "60-64",
        "Spell scroll (3rd level)"
      ],
      [
        "65-67",
        "Bag of holding"
      ],
      [
        "68-70",
        "Keoghtom's ointment"
      ],
      [
        "71-73",
        "Oil of slipperiness"
      ],
      [
        "74-75",
        "Dust of disappearance"
      ],
      [
        "76-77",
        "Dust of dryness"
      ],
      [
        "78-79",
        "Dust of sneezing and choking"
      ],
      [
        "80-81",
        "Elemental gem"
      ],
      [
        "82-83",
        "Philter of love"
      ],
      [
        "84",
        "Alchemy jug"
      ],
      [
        "85",
        "Cap of water breathing"
      ],
      [
        "86",
        "Cloak of the manta ray"
      ],
      [
        "87",
        "Driftglobe"
      ],
      [
        "88",
        "Goggles of night"
      ],
      [
        "89",
        "Helm of comprehending languages"
      ],
      [
        "90",
        "Immovable rod"
      ],
      [
        "91",
        "Lantern of revealing"
      ],
      [
        "92",
        "Mariner's armor"
      ],
      [
        "93",
        "Mithral armor"
      ],
      [
        "94",
        "Potion of poison"
      ],
      [
        "95",
        "Ring of swimming"
      ],
      [
        "96",
        "Robe of useful items"
      ],
      [
        "97",
        "Rope of climbing"
      ],
      [
        "98",
        "Saddle of the cavalier"
      ],
      [
        "99",
        "Wand of magic detection"
      ],
      [
        "00",
        "Wand of secrets"
      ]
    ]
  ],
  "magic item table c": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-15",
        "Potion of healing (superior)"
      ],
      [
        "16-22",
        "Spell scroll (4th level)"
      ],
      [
        "23-27",
        "Ammunition, +2"
      ],
      [
        "28-32",
        "Potion of clairvoyance"
      ],
      [
        "33-37",
        "Potion of diminution"
      ],
      [
        "38-42",
        "Potion of gaseous form"
      ],
      [
        "43-47",
        "Potion of frost giant strength"
      ],
      [
        "48-52",
        "Potion of stone giant strength"
      ],
      [
        "53-57",
        "Potion of heroism"
      ],
      [
        "58-62",
        "Potion of invulnerability"
      ],
      [
        "63-67",
        "Potion of mind reading"
      ],
      [
        "68-72",
        "Spell scroll (5th level)"
      ],
      [
        "73-75",
        "Elixir of health"
      ],
      [
        "76-78",
        "Oil of etherealness"
      ],
      [
        "79-81",
        "Potion of fire giant strength"
      ],
      [
        "82-84",
        "Quaal's feather token"
      ],
      [
        "85-87",
        "Scroll of protection"
      ],
      [
        "88-89",
        "Bag of beans"
      ],
      [
        "90-91",
        "Bead of force"
      ],
      [
        "92",
        "Chime of opening"
      ],
      [
        "93",
        "Decanter of endless water"
      ],
      [
        "94",
        "Eyes of minute seeing"
      ],
      [
        "95",
        "Folding boat"
      ],
      [
        "96",
        "Heward's handy haversack"
      ],
      [
        "97",
        "Horseshoes of speed"
      ],
      [
        "98",
        "Necklace of fireballs"
      ],
      [
        "99",
        "Periapt of health"
      ],
      [
        "00",
        "Sending stones"
      ]
    ]
  ],
  "magic item table d": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-20",
        "Potion of healing (supreme)"
      ],
      [
        "21-30",
        "Potion of invisibility"
      ],
      [
        "31-40",
        "Potion of speed"
      ],
      [
        "41-50",
        "Spell scroll (6th level)"
      ],
      [
        "51-57",
        "Spell scroll (7th level)"
      ],
      [
        "58-62",
        "Ammunition, +3"
      ],
      [
        "63-67",
        "Oil of sharpness"
      ],
      [
        "68-72",
        "Potion of flying"
      ],
      [
        "73-77",
        "Potion of cloud giant strength"
      ],
      [
        "78-82",
        "Potion of longevity"
      ],
      [
        "83-87",
        "Potion of vitality"
      ],
      [
        "88-92",
        "Spell scroll (8th level)"
      ],
      [
        "93-95",
        "Horseshoes of a zephyr"
      ],
      [
        "96-98",
        "Nolzur's marvelous pigments"
      ],
      [
        "99",
        "Bag of devouring"
      ],
      [
        "00",
        "Portable hole"
      ]
    ]
  ],
  "magic item table e": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-30",
        "Spell scroll (8th level)"
      ],
      [
        "31-55",
        "Potion of storm giant strength"
      ],
      [
        "56-70",
        "Potion of healing (supreme)"
      ],
      [
        "71-85",
        "Spell scroll (9th level)"
      ],
      [
        "86-93",
        "Universal solvent"
      ],
      [
        "94-98",
        "Arrow of slaying"
      ],
      [
        "99-00",
        "Sovereign glue"
      ]
    ]
  ],
  "magic item table f": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-15",
        "Weapon, +1"
      ],
      [
        "16-18",
        "Shield, +1"
      ],
      [
        "19-21",
        "Sentinel shield"
      ],
      [
        "22-23",
        "Amulet of proof against detection and location"
      ],
      [
        "24-25",
        "Boots of elvenkind"
      ],
      [
        "26-27",
        "Boots of striding and springing"
      ],
      [
        "28-29",
        "Bracers of archery"
      ],
      [
        "30-31",
        "Brooch of shielding"
      ],
      [
        "32-33",
        "Broom of flying"
      ],
      [
        "34-35",
        "Cloak of elvenkind"
      ],
      [
        "36-37",
        "Cloak of protection"
      ],
      [
        "38-39",
        "Gauntlets of ogre power"
      ],
      [
        "40-41",
        "Hat of disguise"
      ],
      [
        "42-43",
        "Javelin of lightning"
      ],
      [
        "44-45",
        "Pearl of power"
      ],
      [
        "46-47",
        "Rod of the pact keeper, +1"
      ],
      [
        "48-49",
        "Slippers of spider climbing"
      ],
      [
        "50-51",
        "Staff of the adder"
      ],
      [
        "52-53",
        "Staff of the python"
      ],
      [
        "54-55",
        "Sword of vengeance"
      ],
      [
        "56-57",
        "Trident of fish command"
      ],
      [
        "58-59",
        "Wand of magic missiles"
      ],
      [
        "60-61",
        "Wand of the war mage, +1"
      ],
      [
        "62-63",
        "Wand of web"
      ],
      [
        "64-65",
        "Weapon of warning"
      ],
      [
        "66",
        "Adamantine armor (chain mail)"
      ],
      [
        "67",
        "Adamantine armor (chain shirt)"
      ],
      [
        "68",
        "Adamantine armor (scale mail)"
      ],
      [
        "69",
        "Bag of tricks (gray)"
      ],
      [
        "70",
        "Bag of tricks (rust)"
      ],
      [
        "71",
        "Bag of tricks (tan)"
      ],
      [
        "72",
        "Boots of the winterlands"
      ],
      [
        "73",
        "Circlet of blasting"
      ],
      [
        "74",
        "Deck of illusions"
      ],
      [
        "75",
        "Eversmoking bottle"
      ],
      [
        "76",
        "Eyes of charming"
      ],
      [
        "77",
        "Eyes of the eagle"
      ],
      [
        "78",
        "Figurine of wondrous power (silver raven)"
      ],
      [
        "79",
        "Gem of brightness"
      ],
      [
        "80",
        "Gloves of missile snaring"
      ],
      [
        "81",
        "Gloves of swimming and climbing"
      ],
      [
        "82",
        "Gloves of thievery"
      ],
      [
        "83",
        "Headband of intellect"
      ],
      [
        "84",
        "Helm of telepathy"
      ],
      [
        "85",
        "Instrument of the bards (Doss lute)"
      ],
      [
        "86",
        "Instrument of the bards (Fochlucan bandore)"
      ],
      [
        "87",
        "Instrument of the bards (Mac-Fuimidh cittern)"
      ],
      [
        "88",
        "Medallion of thoughts"
      ],
      [
        "89",
        "Necklace of adaptation"
      ],
      [
        "90",
        "Periapt of wound closure"
      ],
      [
        "91",
        "Pipes of haunting"
      ],
      [
        "92",
        "Pipes of the sewers"
      ],
      [
        "93",
        "Ring of jumping"
      ],
      [
        "94",
        "Ring of mind shielding"
      ],
      [
        "95",
        "Ring of warmth"
      ],
      [
        "96",
        "Ring of water walking"
      ],
      [
        "97",
        "Quiver of Ehlonna"
      ],
      [
        "98",
        "Stone of good luck (luckstone)"
      ],
      [
        "99",
        "Wind fan"
      ],
      [
        "00",
        "Winged boots"
      ]
    ]
  ],
  "magic item table g": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-11",
        "Weapon, +2"
      ],
      [
        "12-14",
        "Roll once on figurine of wondrous power"
      ],
      [
        "15",
        "Adamantine armor (breastplate)"
      ],
      [
        "16",
        "Adamantine armor (splint)"
      ],
      [
        "17",
        "Amulet of health"
      ],
      [
        "18",
        "Armor of vulnerability"
      ],
      [
        "19",
        "Arrow-catching shield"
      ],
      [
        "20",
        "Belt of dwarvenkind"
      ],
      [
        "21",
        "Belt of hill giant strength"
      ],
      [
        "22",
        "Berserker axe"
      ],
      [
        "23",
        "Boots of levitation"
      ],
      [
        "24",
        "Boots of speed"
      ],
      [
        "25",
        "Bowl of commanding water elementals"
      ],
      [
        "26",
        "Bracers of defense"
      ],
      [
        "27",
        "Brazier of commanding fire elementals"
      ],
      [
        "28",
        "Cape of the mountebank"
      ],
      [
        "29",
        "Censer of controlling air elementals"
      ],
      [
        "30",
        "Armor, +1 chain mail"
      ],
      [
        "31",
        "Armor of resistance (chain mail)"
      ],
      [
        "32",
        "Armor, +1 chain shirt"
      ],
      [
        "33",
        "Armor of resistance (chain shirt)"
      ],
      [
        "34",
        "Cloak of displacement"
      ],
      [
        "35",
        "Cloak of the bat"
      ],
      [
        "36",
        "Cube of force"
      ],
      [
        "37",
        "Daern's instant fortress"
      ],
      [
        "38",
        "Dagger of venom"
      ],
      [
        "39",
        "Dimensional shackles"
      ],
      [
        "40",
        "Dragon slayer"
      ],
      [
        "41",
        "Elven chain"
      ],
      [
        "42",
        "Flame tongue"
      ],
      [
        "43",
        "Gem of seeing"
      ],
      [
        "44",
        "Giant slayer"
      ],
      [
        "45",
        "Glamoured studded leather"
      ],
      [
        "46",
        "Helm of teleportation"
      ],
      [
        "47",
        "Horn of blasting"
      ],
      [
        "48",
        "Horn of Valhalla (silver or brass)"
      ],
      [
        "49",
        "Instrument of the bards (Canaith mandolin)"
      ],
      [
        "50",
        "Instrument of the bards (Cli lyre)"
      ],
      [
        "51",
        "Ioun stone (awareness)"
      ],
      [
        "52",
        "Ioun stone (protection)"
      ],
      [
        "53",
        "Ioun stone (reserve)"
      ],
      [
        "54",
        "Ioun stone (sustenance)"
      ],
      [
        "55",
        "Iron bands of Bilarro"
      ],
      [
        "56",
        "Armor, +1 leather"
      ],
      [
        "57",
        "Armor of resistance (leather)"
      ],
      [
        "58",
        "Mace of disruption"
      ],
      [
        "59",
        "Mace of smiting"
      ],
      [
        "60",
        "Mace of terror"
      ],
      [
        "61",
        "Mantle of spell resistance"
      ],
      [
        "62",
        "Necklace of prayer beads"
      ],
      [
        "63",
        "Periapt of proof against poison"
      ],
      [
        "64",
        "Ring of animal influence"
      ],
      [
        "65",
        "Ring of evasion"
      ],
      [
        "66",
        "Ring of feather falling"
      ],
      [
        "67",
        "Ring of free action"
      ],
      [
        "68",
        "Ring of protection"
      ],
      [
        "69",
        "Ring of resistance"
      ],
      [
        "70",
        "Ring of spell storing"
      ],
      [
        "71",
        "Ring of the ram"
      ],
      [
        "72",
        "Ring of X-ray vision"
      ],
      [
        "73",
        "Robe of eyes"
      ],
      [
        "74",
        "Rod of rulership"
      ],
      [
        "75",
        "Rod of the pact keeper, +2"
      ],
      [
        "76",
        "Rope of entanglement"
      ],
      [
        "77",
        "Armor, +1 scale mail"
      ],
      [
        "78",
        "Armor of resistance (scale mail)"
      ],
      [
        "79",
        "Shield, +2"
      ],
      [
        "80",
        "Shield of missile attraction"
      ],
      [
        "81",
        "Staff of charming"
      ],
      [
        "82",
        "Staff of healing"
      ],
      [
        "83",
        "Staff of swarming insects"
      ],
      [
        "84",
        "Staff of the woodlands"
      ],
      [
        "85",
        "Staff of withering"
      ],
      [
        "86",
        "Stone of controlling earth elementals"
      ],
      [
        "87",
        "Sun blade"
      ],
      [
        "88",
        "Sword of life stealing"
      ],
      [
        "89",
        "Sword of wounding"
      ],
      [
        "90",
        "Tentacle rod"
      ],
      [
        "91",
        "Vicious weapon"
      ],
      [
        "92",
        "Wand of binding"
      ],
      [
        "93",
        "Wand of enemy detection"
      ],
      [
        "94",
        "Wand of fear"
      ],
      [
        "95",
        "Wand of fireballs"
      ],
      [
        "96",
        "Wand of lightning bolts"
      ],
      [
        "97",
        "Wand of paralysis"
      ],
      [
        "98",
        "Wand of the war mage, +2"
      ],
      [
        "99",
        "Wand of wonder"
      ],
      [
        "00",
        "Wings of flying"
      ]
    ]
  ],
  "magic item table h": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-10",
        "Weapon, +3"
      ],
      [
        "11-12",
        "Amulet of the planes"
      ],
      [
        "13-14",
        "Carpet of flying"
      ],
      [
        "15-16",
        "Crystal ball (very rare version)"
      ],
      [
        "17-18",
        "Ring of regeneration"
      ],
      [
        "19-20",
        "Ring of shooting stars"
      ],
      [
        "21-22",
        "Ring of telekinesis"
      ],
      [
        "23-24",
        "Robe of scintillating colors"
      ],
      [
        "25-26",
        "Robe of stars"
      ],
      [
        "27-28",
        "Rod of absorption"
      ],
      [
        "29-30",
        "Rod of alertness"
      ],
      [
        "31-32",
        "Rod of security"
      ],
      [
        "33-34",
        "Rod of the pact keeper, +3"
      ],
      [
        "35-36",
        "Scimitar of speed"
      ],
      [
        "37-38",
        "Shield, +3"
      ],
      [
        "39-40",
        "Staff of fire"
      ],
      [
        "41-42",
        "Staff of frost"
      ],
      [
        "43-44",
        "Staff of power"
      ],
      [
        "45-46",
        "Staff of striking"
      ],
      [
        "47-48",
        "Staff of thunder and lightning"
      ],
      [
        "49-50",
        "Sword of sharpness"
      ],
      [
        "51-52",
        "Wand of polymorph"
      ],
      [
        "53-54",
        "Wand of the war mage, +3"
      ],
      [
        "55",
        "Adamantine armor (half plate)"
      ],
      [
        "56",
        "Adamantine armor (plate)"
      ],
      [
        "57",
        "Animated shield"
      ],
      [
        "58",
        "Belt of fire giant strength"
      ],
      [
        "59",
        "Belt of frost giant strength (or stone)"
      ],
      [
        "60",
        "Armor, +1 breastplate"
      ],
      [
        "61",
        "Armor of resistance (breastplate)"
      ],
      [
        "62",
        "Candle of invocation"
      ],
      [
        "63",
        "Armor, +2 chain mail"
      ],
      [
        "64",
        "Armor, +2 chain shirt"
      ],
      [
        "65",
        "Cloak of arachnida"
      ],
      [
        "66",
        "Dancing sword"
      ],
      [
        "67",
        "Demon armor"
      ],
      [
        "68",
        "Dragon scale mail"
      ],
      [
        "69",
        "Dwarven plate"
      ],
      [
        "70",
        "Dwarven thrower"
      ],
      [
        "71",
        "Efreeti bottle"
      ],
      [
        "72",
        "Figurine of wondrous power (obsidian steed)"
      ],
      [
        "73",
        "Frost brand"
      ],
      [
        "74",
        "Helm of brilliance"
      ],
      [
        "75",
        "Horn of Valhalla (bronze)"
      ],
      [
        "76",
        "Instrument of the bards (Anstruth harp)"
      ],
      [
        "77",
        "Ioun stone (absorption)"
      ],
      [
        "78",
        "Ioun stone (agility)"
      ],
      [
        "79",
        "Ioun stone (fortitude)"
      ],
      [
        "80",
        "Ioun stone (insight)"
      ],
      [
        "81",
        "Ioun stone (intellect)"
      ],
      [
        "82",
        "Ioun stone (leadership)"
      ],
      [
        "83",
        "Ioun stone (strength)"
      ],
      [
        "84",
        "Armor, +2 leather"
      ],
      [
        "85",
        "Manual of bodily health"
      ],
      [
        "86",
        "Manual of gainful exercise"
      ],
      [
        "87",
        "Manual of golems"
      ],
      [
        "88",
        "Manual of quickness of action"
      ],
      [
        "89",
        "Mirror of life trapping"
      ],
      [
        "90",
        "Nine lives stealer"
      ],
      [
        "91",
        "Oathbow"
      ],
      [
        "92",
        "Armor, +2 scale mail"
      ],
      [
        "93",
        "Spellguard shield"
      ],
      [
        "94",
        "Armor, +1 splint"
      ],
      [
        "95",
        "Armor of resistance (splint)"
      ],
      [
        "96",
        "Armor, +1 studded leather"
      ],
      [
        "97",
        "Armor of resistance (studded leather)"
      ],
      [
        "98",
        "Tome of clear thought"
      ],
      [
        "99",
        "Tome of leadership and influence"
      ],
      [
        "00",
        "Tome of understanding"
      ]
    ]
  ],
  "magic item table i": [
    [
      [
        "d100",
        "Magic Item"
      ],
      [
        "01-05",
        "Defender"
      ],
      [
        "06-10",
        "Hammer of thunderbolts"
      ],
      [
        "11-15",
        "Luck blade"
      ],
      [
        "16-20",
        "Sword of answering"
      ],
      [
        "21-23",
        "Holy avenger"
      ],
      [
        "24-26",
        "Ring of djinni summoning"
      ],
      [
        "27-29",
        "Ring of invisibility"
      ],
      [
        "30-32",
        "Ring of spell turning"
      ],
      [
        "33-35",
        "Rod of lordly might"
      ],
      [
        "36-38",
        "Staff of the magi"
      ],
      [
        "39-41",
        "Vorpal sword"
      ],
      [
        "42-43",
        "Belt of cloud giant strength"
      ],
      [
        "44-45",
        "Armor, +2 breastplate"
      ],
      [
        "46-47",
        "Armor, +3 chain mail"
      ],
      [
        "48-49",
        "Armor, +3 chain shirt"
      ],
      [
        "50-51",
        "Cloak of invisibility"
      ],
      [
        "52-53",
        "Crystal ball (legendary version)"
      ],
      [
        "54-55",
        "Armor, +1 half plate"
      ],
      [
        "56-57",
        "Iron flask"
      ],
      [
        "58-59",
        "Armor, +3 leather"
      ],
      [
        "60-61",
        "Armor, +1 plate"
      ],
      [
        "62-63",
        "Robe of the archmagi"
      ],
      [
        "64-65",
        "Rod of resurrection"
      ],
      [
        "66-67",
        "Armor, +1 scale mail"
      ],
      [
        "68-69",
        "Scarab of protection"
      ],
      [
        "70-71",
        "Armor, +2 splint"
      ],
      [
        "72-73",
        "Armor, +2 studded leather"
      ],
      [
        "74-75",
        "Well of many worlds"
      ],
      [
        "76",
        "Roll once on Magic Armor"
      ],
      [
        "77",
        "Apparatus of Kwalish"
      ],
      [
        "78",
        "Armor of invulnerability"
      ],
      [
        "79",
        "Belt of storm giant strength"
      ],
      [
        "80",
        "Cubic gate"
      ],
      [
        "81",
        "Deck of many things"
      ],
      [
        "82",
        "Efreeti chain"
      ],
      [
        "83",
        "Armor of resistance (half plate)"
      ],
      [
        "84",
        "Horn of Valhalla (iron)"
      ],
      [
        "85",
        "Instrument of the bards (Ollamh harp)"
      ],
      [
        "86",
        "Ioun stone (greater absorption)"
      ],
      [
        "87",
        "Ioun stone (mastery)"
      ],
      [
        "88",
        "Ioun stone (regeneration)"
      ],
      [
        "89",
        "Plate armor of etherealness"
      ],
      [
        "90",
        "Armor of resistance (plate)"
      ],
      [
        "91",
        "Ring of air elemental command"
      ],
      [
        "92",
        "Ring of earth elemental command"
      ],
      [
        "93",
        "Ring of fire elemental command"
      ],
      [
        "94",
        "Ring of three wishes"
      ],
      [
        "95",
        "Ring of water elemental command"
      ],
      [
        "96",
        "Sphere of annihilation"
      ],
      [
        "97",
        "Talisman of pure good"
      ],
      [
        "98",
        "Talisman of the sphere"
      ],
      [
        "99",
        "Talisman of ultimate evil"
      ],
      [
        "00",
        "Tome of the stilled tongue"
      ]
    ]
  ],
  "magic armor": [
    [
      [
        "d12",
        "Armor"
      ],
      [
        "1-2",
        "+2 half plate"
      ],
      [
        "3-4",
        "+2 plate"
      ],
      [
        "5-6",
        "+3 studded leather"
      ],
      [
        "7-8",
        "+3 breastplate"
      ],
      [
        "9-10",
        "+3 splint"
      ],
      [
        "11",
        "+3 half plate"
      ],
      [
        "12",
        "+3 plate"
      ],
    ]
  ],
  "figurine of wondrous power": [
    [
      [
        "d8",
        "Figurine"
      ],
      [
        "1",
        "Figurine of wondrous power (Bronze griffon)"
      ],
      [
        "2",
        "Figurine of wondrous power (Ebony fly)"
      ],
      [
        "3",
        "Figurine of wondrous power (Golden lions)"
      ],
      [
        "4",
        "Figurine of wondrous power (Ivory goats)"
      ],
      [
        "5",
        "Figurine of wondrous power (Marble elephant)"
      ],
      [
        "6-7",
        "Figurine of wondrous power (Onyx dog)"
      ],
      [
        "8",
        "Figurine of wondrous power (Serpentine owl)"
      ]
    ]
  ]
};