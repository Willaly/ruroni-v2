/* =========================================================
   CONFIGURATION RURONI — À renseigner avant mise en production
   ========================================================= */
window.RURONI_CONFIG = {

  /* ---------------------------------------------------------
     FILLOUT — Endpoint de réception du formulaire séance d'essai
     ---------------------------------------------------------
     Choisis UNE des 3 méthodes ci-dessous (par ordre de simplicité) :

     [A] WEBHOOK PROXY (recommandé) — Zapier, Make.com, Pipedream, n8n
         → Crée un webhook dans Zapier/Make qui prend ce POST en entrée
           et crée une submission dans Fillout (via leur action native).
         → Aucune clé API exposée côté navigateur. C'est la voie propre.
         → Colle l'URL du webhook ici.

     [B] FONCTION SERVERLESS — Vercel, Netlify, Cloudflare Workers
         → Tu déploies un endpoint qui détient la clé Fillout en variable
           d'env et qui appelle l'API Fillout pour toi.
         → Colle l'URL de ta fonction ici.

     [C] API FILLOUT DIRECTE (déconseillé — clé exposée dans le navigateur)
         → Endpoint : https://api.fillout.com/v1/api/forms/{FORM_ID}/submissions
         → Requiert un header Authorization: Bearer {API_KEY}
         → La clé sera lisible par n'importe qui via F12.
         → À utiliser SEULEMENT si la clé Fillout est scopée submission-only.
  */
  trialEndpoint: 'https://hook.example.com/REPLACE-ME-WITH-YOUR-WEBHOOK',

  // Méthode HTTP et headers (laisser tel quel pour Zapier/Make)
  trialMethod: 'POST',
  trialHeaders: { 'Content-Type': 'application/json' },

  // Si tu utilises l'API Fillout directe (méthode C), décommente :
  // trialHeaders: { 'Content-Type': 'application/json', 'Authorization': 'Bearer YOUR_FILLOUT_API_KEY' },

  // Fallback : si pas d'endpoint configuré, on log dans la console
  // et on simule l'envoi (utile en dev). Mets à false en production.
  trialAllowSimulation: true,

  /* ---------------------------------------------------------
     SHOPIFY BUY BUTTON — Boutique
     ---------------------------------------------------------
     Une fois ton compte Shopify créé :
     1. Va dans Sales channels → Buy Button → Create Buy Button
     2. Récupère ton storefront access token (Settings → Apps → Develop apps)
     3. Renseigne ci-dessous :
  */
  shopify: {
    domain: 'ruroni-crossfit.myshopify.com',      // ton sous-domaine .myshopify.com
    storefrontAccessToken: 'REPLACE-ME',          // Storefront API token
    collectionId: '',                              // ID de la collection à afficher (optionnel)
  },
};
