export const recipes = {
  "GENOVESA": [
    { item: "Harina", amount: 150, unit: "gr" },
    { item: "Azucar", amount: 150, unit: "gr" },
    { item: "Huevo", amount: 5, unit: "und" },
    { item: "Fecula", amount: 20, unit: "gr" },
    { item: "Escencia de vainilla", amount: 5, unit: "ml" },
    { item: "Chantilly", amount: 200, unit: "ml" },
    { item: "3 leches", amount: 300, unit: "ml" }
  ],
  "CHOCOLATE": [
    { item: "Cafe", amount: 10, unit: "gr" },
    { item: "Cocoa", amount: 30, unit: "gr" },
    { item: "Huevo", amount: 3, unit: "und" },
    { item: "Aceite", amount: 50, unit: "ml" },
    { item: "Azucar", amount: 120, unit: "gr" },
    { item: "Harina", amount: 150, unit: "gr" },
    { item: "Polvo hornear", amount: 5, unit: "gr" },
    { item: "Sal", amount: 2, unit: "gr" }
  ],
  "PANDEYUCAS": [
    { item: "Queso criollo", amount: 250, unit: "gr" },
    { item: "Harina pandeyuca", amount: 250, unit: "gr" },
    { item: "Huevo", amount: 2, unit: "und" }
  ],
  "COMBO_DESAYUNO": [
    { item: "Sandwich", amount: 1, unit: "und" },
    { item: "Parfait", amount: 1, unit: "und" }
  ],
  "MEDIA_ZANAHORIA_PINA": [
    { item: "Harina", amount: 250, unit: "gr" },
    { item: "Piña en cubitos", amount: 100, unit: "gr" },
    { item: "Azucar", amount: 150, unit: "gr" },
    { item: "Polvo hornear", amount: 30, unit: "gr" },
    { item: "Huevo", amount: 5, unit: "und" },
    { item: "Zanahoria", amount: 1, unit: "lb" },
    { item: "Aceite", amount: 250, unit: "ml" }
  ]
};

// Mapeo de nombres de productos a recetas
export const productToRecipe = {
  "Box madera (Red Velvet)": "CHOCOLATE", // Asumiendo que es chocolate/red velvet
  "Box madera (Frutos secos)": "GENOVESA", // Asumiendo base genovesa
  "Genovesa": "GENOVESA",
  "Tarta Chocolate": "CHOCOLATE",
  "Pandeyucas": "PANDEYUCAS",
  "Desayuno": "COMBO_DESAYUNO",
  "1/2 zanahoria piña": "MEDIA_ZANAHORIA_PINA",
  "1/2 Zanahoria Piña": "MEDIA_ZANAHORIA_PINA",
  "Zanahoria Piña": "MEDIA_ZANAHORIA_PINA"
};
