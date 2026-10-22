import type { Language } from "./translations";
const pages: Record<string, {en: string[]; de: string[]}> = {
  "/": {
    "en": [
      "Overview",
      "Your Wien Energie home energy overview, optimised charging plans and local solar forecasts."
    ],
    "de": [
      "Übersicht",
      "Deine Wien Energie Übersicht mit optimierten Ladeplänen und lokalen Solarprognosen."
    ]
  },
  "/appliances": {
    "en": [
      "Appliances",
      "Manage connected appliances, charging targets, deadlines and provisional energy schedules."
    ],
    "de": [
      "Geräte",
      "Verwalte Geräte, Ladeziele, Termine und vorläufige Ladepläne."
    ]
  },
  "/community": {
    "en": [
      "Energy Community",
      "Explore neighbourhood solar surplus and your Vienna energy community."
    ],
    "de": [
      "Energiegemeinschaft",
      "Entdecke lokale Solarüberschüsse und deine Wiener Energiegemeinschaft."
    ]
  },
  "/savings": {
    "en": [
      "Savings & Credits",
      "Track optimised energy savings and redeemable monthly energy credits."
    ],
    "de": [
      "Ersparnis & Gutschriften",
      "Verfolge deine Energieersparnis und einlösbare monatliche Gutschriften."
    ]
  },
  "/about": {
    "en": [
      "About Smart Energy",
      "How smart charging works and how customers benefit."
    ],
    "de": [
      "Über Smart Energy",
      "Wie intelligentes Laden funktioniert und wie Kunden davon profitieren."
    ]
  },
  "/settings": {
    "en": [
      "Settings",
      "Manage your household preferences, tariff and community energy optimisation."
    ],
    "de": [
      "Einstellungen",
      "Verwalte deinen Haushalt, Tarif und die Optimierung mit Gemeinschaftsenergie."
    ]
  },
  "/info": {
    "en": [
      "Help & Information",
      "Answers about smart charging, energy communities and tariff benefits."
    ],
    "de": [
      "Hilfe & Informationen",
      "Antworten zu intelligentem Laden, Energiegemeinschaften und Tarifvorteilen."
    ]
  }
};
export function pageMetadata(path: string, language: Language = "en") {
 const [name, description] = (pages[path] ?? pages["/"])?.[language] ?? ["Wien Energie", "Smart Energy"];
 const title = `${name} | Wien Energie Smart Energy`;
 return {meta:[{title},{name:"description",content:description},{property:"og:title",content:title},{property:"og:description",content:description},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"}]};
}
