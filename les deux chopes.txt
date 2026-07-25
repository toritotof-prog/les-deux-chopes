import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Coins, 
  Flame, 
  Wine, 
  Cake, 
  X, 
  UtensilsCrossed, 
  Beer, 
  BookOpen, 
  Receipt, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  Check,
  Scroll
} from "lucide-react";

// ===========================================================================
// DONNÉES DU JEU (AVEC FORMULES ET MENUS CORRIGÉS)
// ===========================================================================

const TIERS_PLATS = {
  apprenti: { label: "Apprenti", order: 1, accent: "#7a9b5e", accentSoft: "rgba(122,155,94,0.14)", seal: "I" },
  compagnon: { label: "Compagnon", order: 2, accent: "#c9a15a", accentSoft: "rgba(201,161,90,0.14)", seal: "II" },
  maitre: { label: "Maître", order: 3, accent: "#a5453f", accentSoft: "rgba(165,69,63,0.16)", seal: "III" },
};

const INITIAL_DISHES = [
  // NIVEAU 1 : APPRENTI
  { id: "boeuf-cuit", category: "Mets", tier: "apprenti", name: "Bœuf cuit (Cooked Beef)", ingredients: ["Tas de sel (Salt Pile)", "Bœuf cru (Raw Beef)"], effect: "Restaure 10 pts de Santé.", rp: "Un morceau roboratif.", price: 8 },
  { id: "cuisse-lapin", category: "Mets", tier: "apprenti", name: "Cuisse de lapin (Cooked Rabbit Leg)", ingredients: ["Tas de sel (Salt Pile)", "Patte de lapin crue (Raw Rabbit Leg)"], effect: "Restaure 5 pts de Santé.", rp: "Petit gibier tendre.", price: 4 },
  { id: "cuissot-cheval", category: "Mets", tier: "apprenti", name: "Cuissot de cheval (Horse Haunch)", ingredients: ["Tas de sel (Salt Pile)", "Viande de cheval (Horse Meat)"], effect: "Restaure 10 pts de Santé.", rp: "Viande ferme et musclée.", price: 7 },
  { id: "cotelette-venaison", category: "Mets", tier: "apprenti", name: "Côtelette de venaison (Venison Chop)", ingredients: ["Tas de sel (Salt Pile)", "Venaison (Venison)"], effect: "Restaure 5 pts de Santé.", rp: "Chassée dans les forêts de Bordeciel.", price: 6 },
  { id: "filet-saumon", category: "Mets", tier: "apprenti", name: "Filet de saumon (Salmon Steak)", ingredients: ["Tas de sel (Salt Pile)", "Chair de saumon (Salmon Meat)"], effect: "Restaure 5 pts de Santé.", rp: "Pêché dans les rivières froides.", price: 5 },
  { id: "gigot-chevre", category: "Mets", tier: "apprenti", name: "Gigot de chèvre grillé (Roasted Goat Leg)", ingredients: ["Tas de sel (Salt Pile)", "Gigot de chèvre (Goat Leg)"], effect: "Restaure 10 pts de Santé.", rp: "Un plat rustique et montagnard.", price: 8 },
  { id: "poulet-grille", category: "Mets", tier: "apprenti", name: "Poulet grillé (Grilled Chicken Breast)", ingredients: ["Tas de sel (Salt Pile)", "Blanc de poulet (Chicken Breast)"], effect: "Restaure 5 pts de Santé.", rp: "Une volaille classique des auberges.", price: 5 },
  { id: "roti-faisan", category: "Mets", tier: "apprenti", name: "Rôti de faisan (Pheasant Roast)", ingredients: ["Poitrine de faisan (Pheasant Breast)", "Tas de sel (Salt Pile)"], effect: "Restaure 5 pts de Santé.", rp: "Cuit à la broche au-dessus du foyer.", price: 6 },
  { id: "pattes-vasard", category: "Mets", tier: "apprenti", name: "Pattes de vasard à la vapeur (Steamed Mudcrab)", ingredients: ["Pattes de vasard (Mudcrab Chitin)", "Beurre (Butter)"], effect: "Restaure 12 pts de Santé.", rp: "La chair de vasard est étonnamment douce.", price: 12 },
  { id: "pain", category: "Mets", tier: "apprenti", name: "Pain (Bread)", ingredients: ["Tas de sel (Salt Pile)", "Pot de lait (Jug of Milk)", "Sac de farine (Bag of Flour)", "Œuf de poule (Chicken's Egg)"], effect: "Restaure 2 pts de Santé.", rp: "Une miche tout juste sortie du four.", price: 2 },
  { id: "pain-pdt", category: "Mets", tier: "apprenti", name: "Pain aux pommes de terre (Potato Bread)", ingredients: ["Tas de sel", "Pot de lait", "Sac de farine", "Pomme de terre (Potato)", "Œuf de poule"], effect: "Restaure 3 pts de Santé.", rp: "Mie dense et paysanne.", price: 3 },
  { id: "pain-tresse", category: "Mets", tier: "apprenti", name: "Pain tressé (Braided Bread)", ingredients: ["Tas de sel", "Sac de farine"], effect: "Restaure 2 pts Santé, Capacité port +5 (30s).", rp: "La croûte est saupoudrée de sel.", price: 4 },
  
  // NIVEAU 2 : COMPAGNON
  { id: "ragout-chou", category: "Mets", tier: "compagnon", name: "Ragoût de chou (Cabbage Stew)", ingredients: ["Tas de sel", "Pomme rouge (Red Apple)", "Chou (Cabbage)"], effect: "Restaure 15 pts Vigueur, 10 pts Santé.", rp: "Légèrement sucré-salé.", price: 14 },
  { id: "soupe-choux-pdt", category: "Mets", tier: "compagnon", name: "Soupe choux & pommes de terre (Cabbage & Potato Soup)", ingredients: ["Pomme de terre", "Tas de sel", "Poireau (Leek)", "Chou"], effect: "Restaure 10 pts Vigueur et Santé.", rp: "Le brouet paysan traditionnel.", price: 12 },
  { id: "soupe-palourdes", category: "Mets", tier: "compagnon", name: "Soupe aux palourdes (Clam Chowder)", ingredients: ["Chair de palourde (Clam Meat)", "Pomme de terre", "Pot de lait", "Beurre"], effect: "Restaure 10 pts Vigueur et Santé.", rp: "Un velouté crémeux du littoral.", price: 16 },
  { id: "soupe-pdt", category: "Mets", tier: "compagnon", name: "Soupe de pommes de terre (Potato Soup)", ingredients: ["Pomme de terre", "Tas de sel"], effect: "Restaure 10 pts Vigueur et Santé.", rp: "Simple, chaud et réconfortant.", price: 10 },
  { id: "soupe-tomate", category: "Mets", tier: "compagnon", name: "Soupe de tomate (Tomato Soup)", ingredients: ["Tomate (Tomato)", "Tas de sel", "Ail (Garlic)", "Poireau"], effect: "Restaure 10 pts Vigueur et Santé.", rp: "Idéale avec un morceau de pain à l'ail.", price: 12 },
  { id: "tourte-horqueur", category: "Mets", tier: "compagnon", name: "Tourte de horqueur (Horker Pie)", ingredients: ["Tas de sel", "Viande de horqueur (Horker Meat)"], effect: "Restaure 10 pts de Santé.", rp: "Sous la pâte croquante, une viande grasse.", price: 15 },
  { id: "chausson-poulet", category: "Mets", tier: "compagnon", name: "Chausson au poulet (Chicken Dumpling)", ingredients: ["Tas de sel", "Sac de farine", "Blanc de poulet", "Ail", "Poireau"], effect: "Santé +15, Régén. Santé 1pt/s (120s).", rp: "Une friandise salée très parfumée.", price: 18 },
  { id: "pain-ail", category: "Mets", tier: "compagnon", name: "Pain à l'ail (Garlic Bread)", ingredients: ["Ail", "Beurre", "Pain"], effect: "Restaure 1 pt Santé, Soigne toutes les maladies.", rp: "Le remède de grand-mère par excellence.", price: 30 },

  // NIVEAU 3 : MAÎTRE
  { id: "fondue-elsweyr", category: "Mets", tier: "maitre", name: "Fondue d'Elsweyr (Elsweyr Fondue)", ingredients: ["Meule d'Eidar (Eidar Cheese Wheel)", "Sucrelune (Moon Sugar)", "Bière (Ale)"], effect: "Magie +100, Régén. Magie 25% (12 min).", rp: "Préparation khajiit sirupeuse.", price: 45 },
  { id: "ragout-boeuf", category: "Mets", tier: "maitre", name: "Ragoût de bœuf (Beef Stew)", ingredients: ["Bœuf cru", "Carotte (Carrot)", "Tas de sel", "Ail"], effect: "Vigueur +25 (12 min), Régén. Vigueur 2pts/s (12 min).", rp: "Le secret de l'endurance des guerriers.", price: 38 },
  { id: "ragout-horqueur", category: "Mets", tier: "maitre", name: "Ragoût de horqueur (Horker & Lavender Stew)", ingredients: ["Lavande (Lavender)", "Tomate", "Ail", "Viande de horqueur"], effect: "Vigueur/Santé +15, Régén. Santé 1pt/s (12 min).", rp: "Un plat qui tient au corps pendant des heures.", price: 35 },
  { id: "ragout-venaison", category: "Mets", tier: "maitre", name: "Ragoût de venaison (Venison Stew)", ingredients: ["Venaison", "Tas de sel", "Pomme de terre", "Poireau"], effect: "Vigueur +15, Régén. Vigueur 1pt/s (12 min).", rp: "Le repas parfait avant un long voyage.", price: 35 },
  { id: "soupe-legume", category: "Mets", tier: "maitre", name: "Soupe de légumes (Vegetable Soup)", ingredients: ["Chou", "Pomme de terre", "Poireau", "Tomate"], effect: "Régén. Vigueur et Santé 1pt/s (12 min).", rp: "Étrangement miraculeuse pour la vitalité.", price: 40 },
  { id: "steak-mammouth", category: "Mets", tier: "maitre", name: "Steak de mammouth (Mammoth Steak)", ingredients: ["Tas de sel", "Viande de mammouth (Mammoth Meat)"], effect: "Restaure 10 pts de Santé.", rp: "Une pièce de viande d'une taille déraisonnable.", price: 50 },
];

const INITIAL_DESSERTS = [
  { id: "petit-pain", category: "Douceurs", tier: "apprenti", name: "Petit pain (Sweetroll)", ingredients: ["Tas de sel", "Pot de lait", "Sac de farine", "Beurre", "Œuf de poule"], effect: "Restaure 5 pts de Santé.", rp: "Laissez-moi deviner... on vous l'a volé ?", price: 5 },
  { id: "chausson-pommes", category: "Douceurs", tier: "compagnon", name: "Chausson aux pommes (Apple Pie)", ingredients: ["Sac de farine", "Pomme verte (Green Apple)", "Pomme rouge"], effect: "Santé +5, Dégâts arcs +5% (60s).", rp: "Curieusement prisé par les archers.", price: 20 },
  { id: "chausson-lavande", category: "Douceurs", tier: "compagnon", name: "Chausson à la lavande (Lavender Dumpling)", ingredients: ["Sucrelune", "Sac de farine", "2 Givreboises (Frost Mirriam)", "Lavande"], effect: "Santé +5, Magie +10, Résistance Magie 10% (60s).", rp: "Pâtisserie aux notes magiques.", price: 25 },
  { id: "tarte-jazbay", category: "Douceurs", tier: "compagnon", name: "Tarte au jazbay (Jazbay Crostata)", ingredients: ["Beurre", "2 Raisins jazbay (Jazbay Grapes)", "Sac de farine"], effect: "Santé +10, Magie +4 (60s).", rp: "Le goût acide du raisin volcanique.", price: 22 },
  { id: "tarte-genievres", category: "Douceurs", tier: "compagnon", name: "Tarte aux genièvres (Juniper Berry Tart)", ingredients: ["Beurre", "3 Genièvres (Juniper Berries)", "Sac de farine"], effect: "Santé +4, Régén. Santé 2pts/s (60s).", rp: "Un dessert aux herbes de la Crevasse.", price: 22 },
  { id: "tarte-givreboises", category: "Douceurs", tier: "compagnon", name: "Tarte aux givreboises (Frost Mirriam Tart)", ingredients: ["Beurre", "2 Givreboises", "Sac de farine"], effect: "Santé +10, Résistance Feu 4% (60s).", rp: "Froide sur la langue, idéale contre les mages.", price: 24 },
  { id: "tarte-pommes", category: "Douceurs", tier: "compagnon", name: "Tarte aux pommes (Apple Cabbage Tart)", ingredients: ["Tas de sel", "Sac de farine", "Beurre", "Œuf de poule", "2 Pommes vertes", "2 Pommes rouges"], effect: "Restaure 10 pts de Santé.", rp: "La reine des desserts d'auberge.", price: 18 },
];

const INITIAL_DRINKS = [
  { id: "ale", category: "Cave", tier: "apprenti", name: "Ale (Ale)", ingredients: ["Blé (Wheat)", "Eau de source (Spring Water)", "Levure (Yeast)"], effect: "Restaure 5 pts de Vigueur.", rp: "L'ale classique servie dans toutes les tavernes de Bordeciel.", price: 4 },
  { id: "vin-commun", category: "Cave", tier: "apprenti", name: "Vin (Wine)", ingredients: ["Raisins écrasés (Crushed Grapes)", "Sucre (Sugar)"], effect: "Restaure 5 pts de Magie.", rp: "Une bouteille de vin standard que l'on trouve partout.", price: 7 },
  { id: "hydromel-base", category: "Cave", tier: "apprenti", name: "Hydromel simple (Nord Mead)", ingredients: ["Miel sauvage (Wild Honey)", "Eau de source"], effect: "Restaure 10 pts de Santé et de Vigueur.", rp: "La boisson de base des Nordiques.", price: 5 },

  { id: "vin-epice", category: "Cave", tier: "compagnon", name: "Vin épicé de Bashks (Bashks's mulled wine)", ingredients: ["Vin (Wine)", "Givreboise (Frost Mirriam)", "Épices (Spices)", "Miel (Honey)"], effect: "Réchauffe le corps, Résistance au froid +10% (60s).", rp: "Un vin chaud aux épices réconfortant.", price: 22 },
  { id: "hydromel-hydrhonning", category: "Cave", tier: "compagnon", name: "Hydromel d'Hydrhonning (Honningbrew Mead)", ingredients: ["Miel clair (Clear Honey)", "Pomme rouge", "Lavande"], effect: "Restaure 20 pts de Santé et Vigueur.", rp: "Doux, floral et très populaire.", price: 20 },
  { id: "vin-sang-argonien", category: "Cave", tier: "compagnon", name: "Vin de sang argonien (Argonian Bloodwine)", ingredients: ["Chair de hurluberlu (Spadefish/Meat)", "Raisins d'Alto (Alto Wine)", "Épices sombres (Dark Spices)"], effect: "Magie +15, Permet de respirer sous l'eau (30s).", rp: "Un vin rare et mystérieux aux reflets pourpres.", price: 35 },

  { id: "reserve-roncenoir", category: "Cave", tier: "maitre", name: "Cuvée spéciale de Roncenoir (Black-Briar Reserve)", ingredients: ["Miel vieilli (Aged Honey)", "Épices rares (Rare Spices)", "Givreboise", "Sucrelune (Moon Sugar)"], effect: "Endurance massive +50, Régén. Vigueur 3pts/s (12 min).", rp: "Conservée des années dans les caves secrètes de Maven.", price: 60 },
  { id: "brandy-cyrodiil", category: "Cave", tier: "maitre", name: "Brandy de Cyrodiil (Colovian Brandy)", ingredients: ["Raisins coloviens (Colovian Grapes)", "Fût de chêne (Oak Barrel)"], effect: "Améliore l'éloquence de 10% et la Magie (12 min).", rp: "Spiritueux raffiné et corsé importé de la Cité Impériale.", price: 65 },
  { id: "vin-feu", category: "Cave", tier: "maitre", name: "Vin de feu (Firebrand Wine)", ingredients: ["Raisins volcaniques (Volcanic Grapes)", "Piments (Chili/Peppers)", "Sel de feu (Fire Salt)"], effect: "Résistance totale au froid, Dégâts de feu accrus (12 min).", rp: "Une boisson ardente qui enflamme la gorge.", price: 55 }
];

const INITIAL_MENUS = [
  { id: "menu-petite-faim", category: "Formules", tier: "apprenti", name: "Menu Petite Faim", ingredients: ["1 petite viande (lapin ou saumon)", "1 soupe (choux ou pommes de terre)"], effect: "Restaure rapidement l'énergie du voyageur.", rp: "Idéal pour une halte express sur la route.", price: 4 },
  { id: "menu-petite-faim-soif", category: "Formules", tier: "apprenti", name: "Menu Petite Faim et Soif", ingredients: ["1 petite viande (lapin ou saumon)", "1 soupe (choux ou pommes de terre)", "1 boisson (bière ou vin)"], effect: "Apaise la faim et désaltère.", rp: "La formule complète du petit routard.", price: 8 },
  { id: "menu-soupeur", category: "Formules", tier: "compagnon", name: "Menu Soupeur", ingredients: ["4 soupes (choux ou pommes de terre)"], effect: "Restaure abondamment la vigueur.", rp: "Réservé aux plus grands amateurs de bouillons.", price: 7 },
  { id: "menu-lapin", category: "Formules", tier: "compagnon", name: "Menu Lapin", ingredients: ["4 petites viandes (lapin ou saumon)"], effect: "Restaure durablement la santé.", rp: "Un festin carnivore pour chasseur affamé.", price: 8 },
  { id: "menu-grande-faim", category: "Formules", tier: "compagnon", name: "Menu Grande Faim", ingredients: ["2 petites viandes (lapin ou saumon)", "1 soupe de choux et pommes de terre", "1 boisson (bière ou vin)"], effect: "Insuffle force et vitalité.", rp: "De quoi caler un estomac d'aventurier aguerri.", price: 12 },
  { id: "menu-aventurier", category: "Formules", tier: "maitre", name: "Menu Aventurier", ingredients: ["1 tourte de horqueur", "1 soupe de choux et pommes de terre", "1 boisson"], effect: "Vigueur et santé grandement accrues.", rp: "Le choix numéro un des mercenaires de passage.", price: 20 },
  { id: "menu-somptueux", category: "Formules", tier: "maitre", name: "Menu Somptueux", ingredients: ["1 meule d'Eidar", "1 soupe végétale", "1 tourte de horqueur", "1 boisson (bière ou vin)"], effect: "Puissants bonus de magie, santé et vigueur.", rp: "Un repas digne des tables de Jarl.", price: 50 },
  { id: "ration-voyage", category: "Formules", tier: "apprenti", name: "Ration de Voyage", ingredients: ["1 petite viande (saumon ou lapin)"], effect: "Restaure un minimum de santé en chemin.", rp: "À emporter dans son sac de bât (4 Septims / ration).", price: 4 }
];

const ALL_ITEMS = [...INITIAL_DISHES, ...INITIAL_DESSERTS, ...INITIAL_DRINKS, ...INITIAL_MENUS];
const getDefaultPrices = () => Object.fromEntries(ALL_ITEMS.map(item => [item.id, item.price]));

// ===========================================================================
// COMPOSANT PRINCIPAL
// ===========================================================================

export default function App() {
  const [activePage, setActivePage] = useState("plats");
  const [cart, setCart] = useState({}); 
  
  const [prices, setPrices] = useState(() => {
    try {
      const saved = localStorage.getItem("deux_chopes_prices");
      return saved ? JSON.parse(saved) : getDefaultPrices();
    } catch {
      return getDefaultPrices();
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("deux_chopes_prices", JSON.stringify(prices));
    } catch (e) {
      console.error("Erreur de sauvegarde LocalStorage", e);
    }
  }, [prices]);

  const updatePrice = (id, newPrice) => {
    setPrices(prev => ({
      ...prev,
      [id]: newPrice === "" ? "" : Math.max(0, Number(newPrice))
    }));
  };

  const addToCart = (id) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id) => {
    setCart(prev => {
      const copy = { ...prev };
      if (copy[id] > 1) copy[id] -= 1;
      else delete copy[id];
      return copy;
    });
  };

  const clearAllCart = () => setCart({});

  const cartTotalItems = Object.values(cart).reduce((a, b) => a + b, 0);

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background: "radial-gradient(ellipse at top, #241708 0%, #150d06 55%, #0d0803 100%)",
        fontFamily: "'EB Garamond', Georgia, serif",
        color: "#ecdfc0",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Cinzel:wght@500;600&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-display { font-family: 'Cinzel Decorative', 'Cinzel', serif; }
        .font-heading { font-family: 'Cinzel', serif; }
        .font-mono-ledger { font-family: 'JetBrains Mono', monospace; }
        
        .parchment-input::-webkit-outer-spin-button,
        .parchment-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        .parchment-input[type="number"] { -moz-appearance: textfield; }
        
        .wood-divider { height: 2px; background: linear-gradient(90deg, transparent, var(--tier-accent) 15%, var(--tier-accent) 85%, transparent); opacity: 0.55; }
        .seal-badge { box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.5); }
        .row-hover:hover { background: rgba(201,161,90,0.06); }
        ::selection { background: #c9a15a; color: #201304; }
      `}</style>

      {/* Bar de navigation principale */}
      <nav 
        className="sticky top-0 z-50 w-full border-b backdrop-blur-md"
        style={{ borderColor: "#4a3520", backgroundColor: "rgba(21, 13, 6, 0.92)", boxShadow: "0 4px 20px rgba(0,0,0,0.5)" }}
      >
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center gap-3 overflow-x-auto whitespace-nowrap">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <FilterButton 
              label="Les Mets" 
              icon={<UtensilsCrossed size={15} />} 
              isActive={activePage === "plats"} 
              color="#c9a15a" 
              onClick={() => setActivePage("plats")} 
            />
            
            {/* ONGLET FORMULES & MENUS (PLACÉ ENTRE LES METS ET LES DOUCEURS) */}
            <FilterButton 
              label="Formules & Menus" 
              icon={<Scroll size={15} />} 
              isActive={activePage === "formules"} 
              color="#c9a15a" 
              onClick={() => setActivePage("formules")} 
            />

            <FilterButton 
              label="Les Douceurs" 
              icon={<Cake size={15} />} 
              isActive={activePage === "desserts"} 
              color="#c9a15a" 
              onClick={() => setActivePage("desserts")} 
            />
            <FilterButton 
              label="La Cave" 
              icon={<Beer size={15} />} 
              isActive={activePage === "boissons"} 
              color="#c9a15a" 
              onClick={() => setActivePage("boissons")} 
            />

            {/* ONGLET ADDITION / COMMANDE */}
            <FilterButton 
              label={`Addition ${cartTotalItems > 0 ? `(${cartTotalItems})` : ""}`} 
              icon={<Receipt size={15} />} 
              isActive={activePage === "commande"} 
              color="#a5453f" 
              onClick={() => setActivePage("commande")} 
            />
          </div>
        </div>
      </nav>

      {/* Zone de contenu dynamique */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {activePage === "plats" && (
          <MenuCategoryPage 
            items={INITIAL_DISHES} 
            prices={prices} 
            onPriceChange={updatePrice} 
            iconType="food" 
            title="Les Deux Chopes" 
            subtitle="Registre des mets" 
            quote="« Que le voyageur s'assoie, que la faim s'apaise — voici ce que mes fourneaux savent préparer. »" 
            icon={<UtensilsCrossed size={22} />} 
            onAddToCart={addToCart}
          />
        )}

        {/* ONGLET : FORMULES ET MENUS */}
        {activePage === "formules" && (
          <MenuCategoryPage 
            items={INITIAL_MENUS} 
            prices={prices} 
            onPriceChange={updatePrice} 
            iconType="food" 
            title="Formules & Menus de la Taverne" 
            subtitle="Cartes spéciales et rations de voyage" 
            quote="« Pour les estomacs pressés ou les grandes tablées d'aventuriers, profitez de nos formules combinées. »" 
            icon={<Scroll size={22} />} 
            onAddToCart={addToCart}
          />
        )}

        {activePage === "desserts" && (
          <MenuCategoryPage 
            items={INITIAL_DESSERTS} 
            prices={prices} 
            onPriceChange={updatePrice} 
            iconType="dessert" 
            title="Les Douceurs" 
            subtitle="Pâtisseries & Fourneaux" 
            quote="« Un bon repas ne se termine jamais sans une touche de miel, de sucrelune ou de pommes chaudes. »" 
            icon={<Cake size={22} />} 
            onAddToCart={addToCart}
          />
        )}

        {activePage === "boissons" && (
          <MenuCategoryPage 
            items={INITIAL_DRINKS} 
            prices={prices} 
            onPriceChange={updatePrice} 
            iconType="drink" 
            title="La Cave des Deux Chopes" 
            subtitle="Registre des boissons" 
            quote="« De la cervoise paysanne au cru impérial, nos fûts ne sont jamais vides. »" 
            icon={<Beer size={22} />} 
            onAddToCart={addToCart}
          />
        )}

        {/* ONGLET : COMMANDE / ADDITION */}
        {activePage === "commande" && (
          <OrderPage 
            cart={cart} 
            prices={prices} 
            onAddToCart={addToCart} 
            onRemoveFromCart={removeFromCart} 
            onClearAll={clearAllCart}
            onGoToMenu={() => setActivePage("plats")}
          />
        )}
        
        <footer className="mt-16 text-center pb-8">
          <div className="h-px w-24 mx-auto bg-[#4a3520] mb-4" />
          <p className="text-xs text-[#6b5535] font-heading tracking-widest uppercase flex items-center justify-center gap-2">
            <BookOpen size={12} />
            Keizaal Online · Registre des Deux Chopes
          </p>
        </footer>
      </div>
    </div>
  );
}

// ===========================================================================
// PAGES ET VUES
// ===========================================================================

function MenuCategoryPage({ items, prices, onPriceChange, iconType, title, subtitle, quote, icon, onAddToCart }) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("tous");

  const filtered = useMemo(() => items.filter((d) => 
    (activeFilter === "tous" || d.tier === activeFilter) &&
    (!query || [d.name, d.effect, d.rp, ...d.ingredients].join(" ").toLowerCase().includes(query.toLowerCase()))
  ), [activeFilter, query, items]);

  const grouped = { apprenti: [], compagnon: [], maitre: [] };
  filtered.forEach(d => {
    if (grouped[d.tier]) grouped[d.tier].push(d);
  });

  return (
    <div className="animate-fade-in">
      <Header icon={icon} title={title} subtitle={subtitle} quote={quote} />
      <SearchBar query={query} setQuery={setQuery} activeFilter={activeFilter} setActiveFilter={setActiveFilter} tiers={TIERS_PLATS} />
      <TableRenderer grouped={grouped} tiers={TIERS_PLATS} prices={prices} onPriceChange={onPriceChange} iconType={iconType} onAddToCart={onAddToCart} />
    </div>
  );
}

function OrderPage({ cart, prices, onAddToCart, onRemoveFromCart, onClearAll, onGoToMenu }) {
  const [copied, setCopied] = useState(false);

  const cartEntries = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const item = ALL_ITEMS.find(i => i.id === id);
      const unitPrice = prices[id] ?? (item ? item.price : 0);
      return { item, qty, unitPrice, totalPrice: unitPrice * qty };
    }).filter(e => e.item);
  }, [cart, prices]);

  const grandTotal = cartEntries.reduce((sum, entry) => sum + entry.totalPrice, 0);

  const copyReceiptToClipboard = () => {
    if (cartEntries.length === 0) return;
    let text = "📜 --- LES DEUX CHOPES : L'ADDITION ---\n";
    cartEntries.forEach(e => {
      text += `• ${e.item.name} x${e.qty} : ${e.totalPrice} Sep.\n`;
    });
    text += `------------------------------------\n`;
    text += `TOTAL : ${grandTotal} Septims\n`;
    text += "« Merci pour votre visite et que les Neuf vous gardent ! »";

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="animate-fade-in max-w-3xl mx-auto">
      <Header 
        icon={<Receipt size={24} />} 
        title="L'Addition de la Taverne" 
        subtitle="Registre des commandes en cours" 
        quote="« Règle tes comptes avant de reprendre la route des montagnes ! »" 
      />

      {cartEntries.length === 0 ? (
        <div className="text-center py-12 rounded-lg border border-[#4a3520] bg-[#1b120a] p-8">
          <ShoppingBag size={48} className="mx-auto text-[#6b5535] mb-4 opacity-50" />
          <h3 className="font-heading text-xl text-[#f1e2ba]">Aucun plat sur la note</h3>
          <p className="text-sm text-[#9c8863] mt-2 mb-6">Parcourez les onglets pour ajouter des plats ou des formules à la commande.</p>
          <button 
            onClick={onGoToMenu}
            className="font-heading text-xs tracking-wider uppercase px-5 py-2.5 rounded bg-[#c9a15a] text-[#1a1108] font-semibold hover:bg-[#dfb56c] transition-colors"
          >
            Consulter la carte
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-[#4a3520] bg-[#1b120a] overflow-hidden shadow-2xl">
          <div className="p-4 bg-[#231810] border-b border-[#4a3520] flex justify-between items-center">
            <span className="font-heading text-sm text-[#b8a67e] uppercase tracking-wider">Détail des consommations</span>
            <button 
              onClick={onClearAll}
              className="font-heading text-[11px] tracking-wide uppercase px-3 py-1.5 rounded border border-[#4a3520] text-[#b8a67e] hover:text-[#f1e2ba] hover:border-[#c9a15a] flex items-center gap-1.5 transition-all"
              style={{ background: "transparent" }}
            >
              <Trash2 size={13} /> Vider l'addition
            </button>
          </div>

          <div className="divide-y divide-[#382712] px-4">
            {cartEntries.map(({ item, qty, unitPrice, totalPrice }) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-heading text-sm font-semibold text-[#f1e2ba]">{item.name}</h4>
                  <p className="text-xs text-[#8a7550]">{item.category} · {unitPrice} Sep. l'unité</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => onRemoveFromCart(item.id)}
                    className="font-heading text-xs px-2 py-1 rounded border border-[#4a3520] flex items-center justify-center text-[#b8a67e] hover:border-[#c9a15a] hover:text-[#f1e2ba] transition-all"
                    style={{ background: "transparent" }}
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-mono-ledger text-sm text-[#f1e2ba] w-6 text-center font-bold">{qty}</span>
                  <button 
                    onClick={() => onAddToCart(item.id)}
                    className="font-heading text-xs px-2 py-1 rounded border border-[#4a3520] flex items-center justify-center text-[#b8a67e] hover:border-[#c9a15a] hover:text-[#f1e2ba] transition-all"
                    style={{ background: "transparent" }}
                  >
                    <Plus size={12} />
                  </button>
                </div>

                <div className="text-right w-24">
                  <span className="font-mono-ledger text-sm font-bold text-[#c9a15a]">{totalPrice} Sep.</span>
                </div>
              </div>
            ))}
          </div>

          {/* TOTAL & ACTIONS */}
          <div className="p-6 bg-[#150d06] border-t border-[#4a3520] flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-xs uppercase font-heading text-[#8a7550] block">Total à régler</span>
              <span className="font-mono-ledger text-3xl font-bold text-[#f1e2ba] flex items-center gap-2">
                <Coins size={22} className="text-[#c9a15a]" />
                {grandTotal} <span className="text-sm font-normal text-[#8a7550]">Septims</span>
              </span>
            </div>

            <button
              onClick={copyReceiptToClipboard}
              className="w-full sm:w-auto font-heading text-xs tracking-wider uppercase px-6 py-3 rounded flex items-center justify-center gap-2 font-semibold transition-all"
              style={{ background: copied ? "#7a9b5e" : "#c9a15a", color: "#1a1108" }}
            >
              {copied ? <Check size={16} /> : <Receipt size={16} />}
              <span>{copied ? "Addition Copiée !" : "Copier la note RP"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ===========================================================================
// COMPOSANTS RÉUTILISABLES
// ===========================================================================

function Header({ icon, title, subtitle, quote }) {
  return (
    <header className="relative rounded-lg mb-8 overflow-hidden" style={{ border: "1px solid #6b4e2c", boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 20px 40px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)", background: "linear-gradient(180deg, #2d1e10 0%, #201407 70%, #180e05 100%)" }}>
      <div className="absolute inset-0 opacity-[0.07] pointer-events-none" style={{ backgroundImage: "repeating-linear-gradient(115deg, #000 0px, #000 1px, transparent 1px, transparent 3px)" }} />
      <div className="relative px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2 text-[#c9a15a]">
          <div className="h-px w-16 bg-[#6b4e2c]" />
          {icon}
          <div className="h-px w-16 bg-[#6b4e2c]" />
        </div>
        <h1 className="font-display text-3xl sm:text-4xl tracking-wide text-[#f1e2ba] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">{title}</h1>
        <p className="font-heading text-xs tracking-[0.25em] uppercase text-[#b8a67e] mt-2">{subtitle}</p>
        <p className="italic text-xs text-[#9c8863] mt-3 max-w-xl mx-auto">{quote}</p>
      </div>
    </header>
  );
}

function SearchBar({ query, setQuery, activeFilter, setActiveFilter, tiers }) {
  return (
    <div className="rounded-lg mb-8 p-4" style={{ border: "1px solid #4a3520", background: "rgba(35,24,12,0.6)" }}>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7550]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher nom, ingrédient, effet..."
            className="w-full rounded-md pl-9 pr-9 py-2 text-sm outline-none transition-colors"
            style={{ background: "#1a1108", border: "1px solid #4a3520", color: "#ecdfc0" }}
          />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7550] hover:text-[#ecdfc0]"><X size={15} /></button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <FilterButton label="Tous" isActive={activeFilter === "tous"} color="#c9a15a" onClick={() => setActiveFilter("tous")} />
          {Object.entries(tiers).map(([key, tier]) => (
            <FilterButton key={key} label={tier.label} isActive={activeFilter === key} color={tier.accent} onClick={() => setActiveFilter(key)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterButton({ label, icon, isActive, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-heading text-[12px] tracking-wide uppercase px-3 py-1.5 rounded transition-all flex items-center gap-1.5"
      style={isActive ? { background: color, color: "#1a1108", border: `1px solid ${color}`, fontWeight: 600 } : { background: "transparent", color: "#b8a67e", border: "1px solid #4a3520" }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function TableRenderer({ grouped, tiers, prices, onPriceChange, iconType, onAddToCart }) {
  const getIcon = (accent) => {
    if (iconType === "drink") return <Wine size={13} className="mt-1 shrink-0" style={{ color: accent }} />;
    if (iconType === "dessert") return <Cake size={13} className="mt-1 shrink-0" style={{ color: accent }} />;
    return <Flame size={13} className="mt-1 shrink-0" style={{ color: accent }} />;
  };

  return (
    <div className="space-y-8">
      {Object.entries(tiers).sort((a, b) => a[1].order - b[1].order).map(([tierKey, tier]) => {
        const items = grouped[tierKey];
        if (!items || items.length === 0) return null;

        return (
          <section key={tierKey} style={{ "--tier-accent": tier.accent }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="seal-badge shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-heading text-xs" style={{ background: tier.accentSoft, color: tier.accent, border: `1.5px solid ${tier.accent}` }}>{tier.seal}</div>
              <h3 className="font-heading text-lg tracking-wide uppercase" style={{ color: tier.accent }}>Niveau {tier.order} — {tier.label}</h3>
              <div className="wood-divider flex-1" />
            </div>

            <div className="rounded-lg overflow-x-auto" style={{ border: "1px solid #4a3520", background: "#1b120a" }}>
              <table className="w-full min-w-[720px] text-sm border-collapse">
                <thead>
                  <tr style={{ background: "#231810", borderBottom: "1px solid #4a3520" }}>
                    <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[20%]">Nom</th>
                    <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[22%]">Composition</th>
                    <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[22%]">Effet</th>
                    <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[18%]">Note RP</th>
                    <th className="font-heading text-right text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[18%]">Prix & Commande</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, i) => (
                    <tr key={item.id} className="row-hover transition-colors" style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.012)" : "transparent", borderBottom: i < items.length - 1 ? "1px solid #382712" : "none" }}>
                      <td className="px-4 py-3 align-top"><span className="font-heading text-[#f1e2ba] font-semibold">{item.name}</span></td>
                      <td className="px-4 py-3 align-top text-[#c9b98d]">{item.ingredients.join(", ")}</td>
                      <td className="px-4 py-3 align-top text-[#c9b98d]">
                        <span className="inline-flex items-start gap-1.5">{getIcon(tier.accent)}{item.effect}</span>
                      </td>
                      <td className="px-4 py-3 align-top italic text-[#9c8863]">{item.rp}</td>
                      <td className="px-4 py-3 align-top text-right">
                        <div className="flex items-center justify-end gap-2">
                          <PriceInput value={prices[item.id] ?? ""} onChange={(v) => onPriceChange(item.id, v)} accent={tier.accent} />
                          {onAddToCart && (
                            <button
                              onClick={() => onAddToCart(item.id)}
                              title="Ajouter à l'addition"
                              className="p-1.5 rounded border transition-colors flex items-center justify-center text-[#f1e2ba]"
                              style={{ background: tier.accentSoft, borderColor: tier.accent }}
                            >
                              <Plus size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PriceInput({ value, onChange, accent }) {
  return (
    <div className="inline-flex items-center gap-1 rounded px-2 py-1" style={{ background: "#150d06", border: `1.5px solid ${accent}` }}>
      <Coins size={12} style={{ color: accent }} className="shrink-0" />
      <input 
        type="number" 
        min="0" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="parchment-input font-mono-ledger w-12 bg-transparent outline-none text-right text-[#f1e2ba] text-xs font-semibold" 
        aria-label="Prix" 
      />
      <span className="font-mono-ledger text-[9px] uppercase text-[#8a7550]">Sep.</span>
    </div>
  );
}