export default function PolitiqueConfidentialitePage() {
  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-luxury mb-8">Politique de Confidentialité</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">1. Introduction</h2>
        <p className="text-gray-600 mb-4">
          Bijouterie Nador ("nous", "notre" ou "le Site") s'engage à protéger vos données personnelles
          et votre vie privée. Cette politique de confidentialité explique comment nous collectons,
          utilisez et protégeons vos informations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">2. Données collectées</h2>
        <p className="text-gray-600 mb-4 font-semibold">Lors de l'utilisation de notre site, nous collectons :</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li><strong>Informations personnelles :</strong> nom, prénom, adresse email, numéro de téléphone, adresse de livraison</li>
          <li><strong>Informations de paiement :</strong> numéro de carte (traité de façon sécurisée par Stripe, nous ne le stockons pas)</li>
          <li><strong>Informations de navigation :</strong> pages visitées, temps passé, navigateur utilisé (via Google Analytics)</li>
          <li><strong>Messages de contact :</strong> contenu des messages envoyés via le formulaire de contact</li>
          <li><strong>Avis et témoignages :</strong> les avis laissés sur les produits</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">3. Utilisation des données</h2>
        <p className="text-gray-600 mb-4">Nous utilisons vos données pour :</p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Traiter vos commandes et livraisons</li>
          <li>Envoyer des confirmations de commande et des mises à jour</li>
          <li>Répondre à vos demandes de contact</li>
          <li>Améliorer notre site et nos services</li>
          <li>Vous envoyer la newsletter (avec votre consentement)</li>
          <li>Respecter nos obligations légales</li>
          <li>Analyser l'utilisation du site (Google Analytics)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">4. Base légale du traitement</h2>
        <p className="text-gray-600 mb-4">
          Le traitement de vos données est justifié par :
          <ul className="list-disc list-inside mt-2 ml-4">
            <li>L'exécution du contrat d'achat</li>
            <li>Votre consentement explicite (newsletter, cookies)</li>
            <li>Nos intérêts légitimes (amélioration du service, sécurité)</li>
            <li>Le respect de nos obligations légales</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">5. Partage des données</h2>
        <p className="text-gray-600 mb-4">
          Vos données ne sont pas vendues à des tiers. Cependant, nous pouvons les partager avec :
          <ul className="list-disc list-inside mt-2 ml-4">
            <li><strong>Stripe :</strong> pour le traitement des paiements</li>
            <li><strong>Prestataires logistiques :</strong> pour la livraison (adresse, nom, téléphone)</li>
            <li><strong>Google Analytics :</strong> pour l'analyse du trafic (données anonymisées)</li>
            <li><strong>Autorités légales :</strong> si requis par la loi</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">6. Sécurité des données</h2>
        <p className="text-gray-600 mb-4">
          Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos données :
          <ul className="list-disc list-inside mt-2 ml-4">
            <li>Connexion HTTPS sécurisée</li>
            <li>Pas de stockage des numéros de cartes</li>
            <li>Protection des serveurs</li>
            <li>Accès limité aux données personnelles</li>
          </ul>
        </p>
        <p className="text-gray-600 mb-4">
          Cependant, aucun système n'est totalement sécurisé. Nous encourageons les utilisateurs à
          maintenir la confidentialité de leurs identifiants de connexion.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">7. Cookies</h2>
        <p className="text-gray-600 mb-4">
          Notre site utilise des cookies pour :
          <ul className="list-disc list-inside mt-2 ml-4">
            <li><strong>Fonctionnels :</strong> maintenir votre session, panier</li>
            <li><strong>Analytiques :</strong> Google Analytics (anonymisé)</li>
            <li><strong>De préférence :</strong> langue, thème</li>
          </ul>
        </p>
        <p className="text-gray-600 mb-4">
          Vous pouvez gérer les cookies dans les paramètres de votre navigateur.
          La désactivation de certains cookies peut affecter le fonctionnement du site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">8. Durée de conservation</h2>
        <p className="text-gray-600 mb-4">
          <ul className="list-disc list-inside mt-2 ml-4">
            <li><strong>Données de commande :</strong> 5 ans (obligation légale)</li>
            <li><strong>Données de contact :</strong> 1 an après le dernier contact</li>
            <li><strong>Abonnés newsletter :</strong> jusqu'à désinscription</li>
            <li><strong>Cookies :</strong> selon la politique de votre navigateur</li>
          </ul>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">9. Vos droits</h2>
        <p className="text-gray-600 mb-4">
          Conformément à la loi marocaine, vous avez le droit de :
          <ul className="list-disc list-inside mt-2 ml-4">
            <li><strong>Accéder</strong> à vos données personnelles</li>
            <li><strong>Rectifier</strong> les informations inexactes</li>
            <li><strong>Supprimer</strong> vos données</li>
            <li><strong>Vous opposer</strong> au traitement de vos données</li>
            <li><strong>Vous désabonner</strong> de la newsletter</li>
            <li><strong>Demander la portabilité</strong> de vos données</li>
          </ul>
        </p>
        <p className="text-gray-600 mb-4">
          Pour exercer ces droits, contactez-nous à contact@bijouterie-nador.com
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">10. Modifications de la politique</h2>
        <p className="text-gray-600 mb-4">
          Cette politique de confidentialité peut être modifiée à tout moment. Les modifications
          s'appliqueront immédiatement. Vous êtes encouragé à consulter régulièrement cette page.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">11. Contact</h2>
        <p className="text-gray-600 mb-4">
          Si vous avez des questions concernant cette politique de confidentialité ou sur le traitement
          de vos données, veuillez nous contacter :
        </p>
        <p className="text-gray-600 mb-2"><strong>Email :</strong> contact@bijouterie-nador.com</p>
        <p className="text-gray-600 mb-2"><strong>Adresse :</strong> Nador, Maroc</p>
      </section>

      <div className="border-t pt-8 mt-8 text-sm text-gray-500">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
    </div>
  );
}
