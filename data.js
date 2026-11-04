// Données publiques du site. Tout ce qui est vide n'est pas affiché.
// Pour publier une information, on la renseigne ici : le site se met à jour tout seul.
window.LER = {
  // Numéro RCS, dès que l'immatriculation est validée. Exemple : "F12345"
  rcs: "",

  // Adresse du compteur automatique (relais Cloudflare). Vide = aucun montant affiché.
  // Exemple : "https://compteur-ler.NOM.workers.dev"
  apiCollecte: "",

  // Campagnes ouvertes aux dons. Tant que la liste est vide, aucun bouton de don n'est affiché.
  // Exemple d'entrée :
  // { nom: "Urgence X", objectif: "10 000 €", objectifEur: 10000, periode: "du 1er au 30 novembre", lien: "https://buy.stripe.com/..." }
  // L'ONG bénéficiaire est facultative : tant qu'elle n'est pas choisie, le site écrit « choisie à la clôture ».
  // Le lien doit être celui du lien de paiement Stripe : c'est lui qui sert à retrouver le total.
  campagnes: [],

  // ONG qui ont reçu des fonds. Exemple :
  // { nom: "Nom de l'ONG", campagne: "Urgence X", zone: "Pays", site: "https://..." }
  ong: [],

  // Transferts effectués. Exemple :
  // { date: "2026-12-15", campagne: "Urgence X", ong: "Nom de l'ONG", montant: "5 000 €", justificatif: "https://...", attestation: "https://..." }
  transferts: [],

  // Lien vers le rapport financier annuel, une fois publié.
  rapportAnnuel: ""
};
