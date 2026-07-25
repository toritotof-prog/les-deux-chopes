import React, { useState, useMemo } from "react";
import { Search, Coins, Flame, ScrollText, X, UtensilsCrossed } from "lucide-react";

// ---------------------------------------------------------------------------
// Données du menu — L'Auberge du Chaudron d'Or (Keizaal Online)
// ---------------------------------------------------------------------------
const TIERS = {
  apprenti: {
    label: "Apprenti",
    order: 1,
    accent: "#7a9b5e",
    accentSoft: "rgba(122,155,94,0.14)",
    seal: "I",
  },
  compagnon: {
    label: "Compagnon",
    order: 2,
    accent: "#c9a15a",
    accentSoft: "rgba(201,161,90,0.14)",
    seal: "II",
  },
  maitre: {
    label: "Maître",
    order: 3,
    accent: "#a5453f",
    accentSoft: "rgba(165,69,63,0.16)",
    seal: "III",
  },
};

const INITIAL_DISHES = [
  {
    id: "saumon",
    tier: "apprenti",
    name: "Darne de Saumon",
    ingredients: ["Viande de saumon", "Tas de sel"],
    effect: "Restaure la santé mineure, coupe-faim.",
    rp: "Saisi rapidement sur les flammes.",
    price: 8,
  },
  {
    id: "boeuf-cuit",
    tier: "apprenti",
    name: "Bœuf cuit",
    ingredients: ["Viande de bœuf", "Tas de sel"],
    effect: "Restaure la santé.",
    rp: "Morceau roboratif.",
    price: 9,
  },
  {
    id: "pdt-cuite",
    tier: "apprenti",
    name: "Pomme de terre cuite",
    ingredients: ["Pomme de terre", "Tas de sel"],
    effect: "Soin très léger.",
    rp: "L'aliment paysan par excellence.",
    price: 4,
  },
  {
    id: "faisan",
    tier: "apprenti",
    name: "Faisan rôti",
    ingredients: ["Faisan", "Tas de sel"],
    effect: "Restaure la santé mineure.",
    rp: "Petit gibier à la broche.",
    price: 7,
  },
  {
    id: "pain-ail",
    tier: "apprenti",
    name: "Pain à l'ail",
    ingredients: ["Pain", "Ail", "Beurre"],
    effect: "Soin des maladies.",
    rp: "Tranche grillée réconfortante.",
    price: 6,
  },
  {
    id: "soupe-legumes",
    tier: "compagnon",
    name: "Soupe de Légumes",
    ingredients: ["Tomate", "Poireau", "Pomme de terre", "Chou"],
    effect: "Régénération d'endurance.",
    rp: "Le bouillon salvateur du voyageur.",
    price: 14,
  },
  {
    id: "ragout-boeuf",
    tier: "compagnon",
    name: "Ragoût de Bœuf",
    ingredients: ["Bœuf cru", "Carotte", "Ail", "Sel"],
    effect: "Augmente l'Endurance max.",
    rp: "Mijoté pendant des heures.",
    price: 18,
  },
  {
    id: "ragout-venaison",
    tier: "compagnon",
    name: "Ragoût de Venaison",
    ingredients: ["Venaison", "Poireau", "Pomme de terre", "Sel"],
    effect: "Régénération d'endurance.",
    rp: "Le favori des chasseurs.",
    price: 17,
  },
  {
    id: "pain-tresse",
    tier: "compagnon",
    name: "Pain tressé",
    ingredients: ["Sac de farine", "Tas de sel"],
    effect: "Augmente le poids portable.",
    rp: "Belle miche de pain frais.",
    price: 12,
  },
  {
    id: "fondue-elsweyr",
    tier: "maitre",
    name: "Fondue d'Elsweyr",
    ingredients: ["Sucrelune", "Ale", "Meule d'Eidar"],
    effect: "Régénération de Magie massive.",
    rp: "Préparation khajiit sirupeuse et illégale.",
    price: 35,
  },
  {
    id: "ragout-horqueur",
    tier: "maitre",
    name: "Ragoût de Horqueur",
    ingredients: ["Viande de horqueur", "Ail", "Tomate", "Lavande"],
    effect: "Santé, endurance, résistance au froid.",
    rp: "Viande grasse et difficile à préparer.",
    price: 32,
  },
  {
    id: "gateau-miel",
    tier: "maitre",
    name: "Gâteau au miel",
    ingredients: ["Lait", "Farine", "Beurre", "Œuf", "Miel"],
    effect: "Restaure la santé.",
    rp: "La fameuse pâtisserie, symbole de luxe.",
    price: 28,
  },
];

const FILTERS = [
  { key: "tous", label: "Tous" },
  { key: "apprenti", label: "Apprenti" },
  { key: "compagnon", label: "Compagnon" },
  { key: "maitre", label: "Maître" },
];

export default function App() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("tous");
  const [prices, setPrices] = useState(() =>
    Object.fromEntries(INITIAL_DISHES.map((d) => [d.id, d.price]))
  );

  const handlePriceChange = (id, value) => {
    const num = value === "" ? "" : Math.max(0, Number(value));
    setPrices((prev) => ({ ...prev, [id]: num }));
  };

  const normalizedQuery = query.trim().toLowerCase();

  const filteredDishes = useMemo(() => {
    return INITIAL_DISHES.filter((dish) => {
      const matchesTier = activeFilter === "tous" || dish.tier === activeFilter;
      if (!matchesTier) return false;
      if (!normalizedQuery) return true;
      const haystack = [dish.name, ...dish.ingredients].join(" ").toLowerCase();
      return haystack.includes(normalizedQuery);
    });
  }, [activeFilter, normalizedQuery]);

  const grouped = useMemo(() => {
    const byTier = { apprenti: [], compagnon: [], maitre: [] };
    filteredDishes.forEach((d) => byTier[d.tier].push(d));
    return byTier;
  }, [filteredDishes]);

  const totalVisible = filteredDishes.length;

  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(ellipse at top, #241708 0%, #150d06 55%, #0d0803 100%)",
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
        .parchment-input::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        .parchment-input[type="number"] {
          -moz-appearance: textfield;
        }

        .wood-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--tier-accent) 15%, var(--tier-accent) 85%, transparent);
          opacity: 0.55;
        }

        .seal-badge {
          box-shadow: inset 0 0 0 1px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.5);
        }

        .row-hover:hover {
          background: rgba(201,161,90,0.06);
        }

        ::selection {
          background: #c9a15a;
          color: #201304;
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* ---------------------------------------------------------------- */}
        {/* Bannière                                                         */}
        {/* ---------------------------------------------------------------- */}
        <header
          className="relative rounded-lg mb-8 overflow-hidden"
          style={{
            border: "1px solid #6b4e2c",
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.4), 0 20px 40px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)",
            background:
              "linear-gradient(180deg, #2d1e10 0%, #201407 70%, #180e05 100%)",
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, #000 0px, #000 1px, transparent 1px, transparent 3px)",
            }}
          />
          <div className="relative px-6 sm:px-10 py-8 sm:py-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-3 text-[#c9a15a]">
              <div className="h-px w-10 sm:w-20 bg-[#6b4e2c]" />
              <UtensilsCrossed size={20} strokeWidth={1.5} />
              <div className="h-px w-10 sm:w-20 bg-[#6b4e2c]" />
            </div>
            <h1 className="font-display text-3xl sm:text-5xl tracking-wide text-[#f1e2ba] drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
              Le Chaudron Doré
            </h1>
            <p className="font-heading text-xs sm:text-sm tracking-[0.25em] uppercase text-[#b8a67e] mt-3">
              Registre des mets · Auberge tenue par l'aubergiste
            </p>
            <p className="italic text-[#9c8863] mt-4 max-w-xl mx-auto text-sm sm:text-base">
              « Que le voyageur s'assoie, que la faim s'apaise — voici ce que
              mes fourneaux savent préparer, du plus simple au plus
              raffiné. »
            </p>
          </div>
        </header>

        {/* ---------------------------------------------------------------- */}
        {/* Recherche + filtres                                              */}
        {/* ---------------------------------------------------------------- */}
        <div
          className="rounded-lg mb-8 p-4 sm:p-5"
          style={{
            border: "1px solid #4a3520",
            background: "rgba(35,24,12,0.6)",
          }}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative flex-1 sm:max-w-sm">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7550]"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Chercher un plat ou un ingrédient..."
                className="w-full rounded-md pl-9 pr-9 py-2.5 text-sm outline-none transition-colors"
                style={{
                  background: "#1a1108",
                  border: "1px solid #4a3520",
                  color: "#ecdfc0",
                }}
                onFocus={(e) => (e.target.style.borderColor = "#c9a15a")}
                onBlur={(e) => (e.target.style.borderColor = "#4a3520")}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  aria-label="Effacer la recherche"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8a7550] hover:text-[#ecdfc0] transition-colors"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => {
                const isActive = activeFilter === f.key;
                const tierColor =
                  f.key === "tous" ? "#c9a15a" : TIERS[f.key].accent;
                return (
                  <button
                    key={f.key}
                    onClick={() => setActiveFilter(f.key)}
                    className="font-heading text-xs sm:text-[13px] tracking-wide uppercase px-3.5 py-2 rounded-md transition-all"
                    style={
                      isActive
                        ? {
                            background: tierColor,
                            color: "#1a1108",
                            border: `1px solid ${tierColor}`,
                            fontWeight: 600,
                          }
                        : {
                            background: "transparent",
                            color: "#b8a67e",
                            border: "1px solid #4a3520",
                          }
                    }
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {(query || activeFilter !== "tous") && (
            <p className="text-xs text-[#8a7550] mt-3">
              {totalVisible} plat{totalVisible !== 1 ? "s" : ""} affiché
              {totalVisible !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Sections par niveau                                              */}
        {/* ---------------------------------------------------------------- */}
        <div className="space-y-10">
          {Object.entries(TIERS)
            .sort((a, b) => a[1].order - b[1].order)
            .map(([tierKey, tier]) => {
              const dishes = grouped[tierKey];
              if (dishes.length === 0) return null;

              return (
                <section key={tierKey} style={{ "--tier-accent": tier.accent }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="seal-badge shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-heading text-sm"
                      style={{
                        background: tier.accentSoft,
                        color: tier.accent,
                        border: `1.5px solid ${tier.accent}`,
                      }}
                    >
                      {tier.seal}
                    </div>
                    <div>
                      <h2
                        className="font-heading text-lg sm:text-xl tracking-wide uppercase"
                        style={{ color: tier.accent }}
                      >
                        Niveau {tier.order} — {tier.label}
                      </h2>
                    </div>
                    <div className="wood-divider flex-1" />
                  </div>

                  {/* --- Tableau desktop --- */}
                  <div
                    className="hidden md:block rounded-lg overflow-hidden"
                    style={{ border: "1px solid #4a3520" }}
                  >
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr
                          style={{
                            background: "#231810",
                            borderBottom: "1px solid #4a3520",
                          }}
                        >
                          <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[18%]">
                            Plat
                          </th>
                          <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[22%]">
                            Ingrédients
                          </th>
                          <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[22%]">
                            Effet
                          </th>
                          <th className="font-heading text-left text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[22%]">
                            Note du cuisinier
                          </th>
                          <th className="font-heading text-right text-xs uppercase tracking-wider text-[#b8a67e] px-4 py-3 w-[16%]">
                            Prix (Septims)
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {dishes.map((dish, i) => (
                          <tr
                            key={dish.id}
                            className="row-hover transition-colors"
                            style={{
                              background:
                                i % 2 === 0
                                  ? "rgba(255,255,255,0.012)"
                                  : "transparent",
                              borderBottom:
                                i < dishes.length - 1
                                  ? "1px solid #382712"
                                  : "none",
                            }}
                          >
                            <td className="px-4 py-3.5 align-top">
                              <span className="font-heading text-[#f1e2ba]">
                                {dish.name}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 align-top text-[#c9b98d]">
                              {dish.ingredients.join(", ")}
                            </td>
                            <td className="px-4 py-3.5 align-top text-[#c9b98d]">
                              <span className="inline-flex items-start gap-1.5">
                                <Flame
                                  size={13}
                                  className="mt-1 shrink-0"
                                  style={{ color: tier.accent }}
                                />
                                {dish.effect}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 align-top italic text-[#9c8863]">
                              {dish.rp}
                            </td>
                            <td className="px-4 py-3.5 align-top">
                              <PriceInput
                                value={prices[dish.id]}
                                onChange={(v) => handlePriceChange(dish.id, v)}
                                accent={tier.accent}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* --- Cartes mobile --- */}
                  <div className="md:hidden space-y-3">
                    {dishes.map((dish) => (
                      <div
                        key={dish.id}
                        className="rounded-lg p-4"
                        style={{
                          background: "#1e1409",
                          border: "1px solid #4a3520",
                        }}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="font-heading text-[#f1e2ba]">
                            {dish.name}
                          </h3>
                          <PriceInput
                            value={prices[dish.id]}
                            onChange={(v) => handlePriceChange(dish.id, v)}
                            accent={tier.accent}
                          />
                        </div>
                        <p className="text-xs text-[#c9b98d] mb-1.5">
                          <span className="text-[#8a7550] uppercase tracking-wide mr-1">
                            Ingr. —
                          </span>
                          {dish.ingredients.join(", ")}
                        </p>
                        <p className="text-xs text-[#c9b98d] mb-1.5 flex items-start gap-1.5">
                          <Flame
                            size={12}
                            className="mt-0.5 shrink-0"
                            style={{ color: tier.accent }}
                          />
                          {dish.effect}
                        </p>
                        <p className="text-xs italic text-[#9c8863]">
                          {dish.rp}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}

          {totalVisible === 0 && (
            <div
              className="text-center py-16 rounded-lg"
              style={{ border: "1px dashed #4a3520" }}
            >
              <ScrollText
                size={28}
                className="mx-auto mb-3 text-[#6b5535]"
                strokeWidth={1.5}
              />
              <p className="font-heading text-[#b8a67e]">
                Aucun plat ne correspond à cette recherche.
              </p>
              <p className="text-sm text-[#8a7550] mt-1">
                Essayez un autre nom, ingrédient, ou changez de filtre.
              </p>
            </div>
          )}
        </div>

        <footer className="mt-12 text-center">
          <div className="h-px w-24 mx-auto bg-[#4a3520] mb-4" />
          <p className="text-xs text-[#6b5535] font-heading tracking-widest uppercase">
            Keizaal Online · Registre tenu à jour par l'aubergiste
          </p>
        </footer>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Champ de prix éditable
// ---------------------------------------------------------------------------
function PriceInput({ value, onChange, accent }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5"
      style={{
        background: "#150d06",
        border: `1.5px solid ${accent}`,
        boxShadow: `inset 0 1px 3px rgba(0,0,0,0.5)`,
      }}
    >
      <Coins size={14} style={{ color: accent }} className="shrink-0" />
      <input
        type="number"
        min="0"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="parchment-input font-mono-ledger w-16 sm:w-14 bg-transparent outline-none text-right text-[#f1e2ba] text-sm font-semibold"
        aria-label="Prix en Septims"
      />
      <span className="font-mono-ledger text-[10px] uppercase tracking-wider text-[#8a7550] hidden sm:inline">
        Sep.
      </span>
    </div>
  );
}
