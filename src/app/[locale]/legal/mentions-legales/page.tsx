export default function MentionsLegalesPage() {
  return (
    <div className="py-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-4xl font-luxury mb-8">Mentions Légales</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Informations sur l'entreprise</h2>
        <p className="text-gray-600 mb-2"><strong>Nom commercial :</strong> Bijouterie Nador</p>
        <p className="text-gray-600 mb-2"><strong>Statut :</strong> Micro-entreprise</p>
        <p className="text-gray-600 mb-2"><strong>Adresse :</strong> Nador, Maroc</p>
        <p className="text-gray-600 mb-2"><strong>Téléphone :</strong> <a href="https://wa.me/212600000000" className="text-rose-500 hover:underline">Nous contacter</a></p>
        <p className="text-gray-600 mb-2"><strong>Email :</strong> contact@bijouterie-nador.com</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Hébergement</h2>
        <p className="text-gray-600 mb-2">Ce site est hébergé sur les serveurs de Vercel.</p>
        <p className="text-gray-600"><a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-rose-500 hover:underline">www.vercel.com</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Propriété intellectuelle</h2>
        <p className="text-gray-600 mb-4">
          Le contenu de ce site (textes, images, logos, marques) est la propriété exclusive de Bijouterie Nador ou de ses partenaires.
          Toute reproduction ou utilisation sans autorisation préalable est strictement interdite.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Responsabilité</h2>
        <p className="text-gray-600 mb-4">
          Bijouterie Nador met tout en œuvre pour assurer l'exactitude des informations publiées sur ce site.
          Cependant, nous ne pouvons garantir l'absence d'erreurs ou d'omissions.
        </p>
        <p className="text-gray-600 mb-4">
          Bijouterie Nador décline toute responsabilité en cas de dommages directs ou indirects résultant de l'accès
          ou de l'utilisation de ce site.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Liens externes</h2>
        <p className="text-gray-600 mb-4">
          Ce site contient des liens vers d'autres sites. Bijouterie Nador ne peut être tenue responsable du contenu
          ou de la disponibilité de ces sites externes.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Données personnelles</h2>
        <p className="text-gray-600 mb-4">
          Veuillez consulter notre <a href="/fr/legal/politique-de-confidentialite" className="text-rose-500 hover:underline">Politique de Confidentialité</a> pour
          connaître nos pratiques concernant la collecte et l'utilisation de vos données personnelles.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-luxury font-medium mb-4">Droit applicable</h2>
        <p className="text-gray-600 mb-4">
          Ce site et les conditions d'utilisation sont régis par la loi marocaine.
          Tout litige sera soumis à la juridiction des tribunaux marocains.
        </p>
      </section>

      <div className="border-t pt-8 mt-8 text-sm text-gray-500">
        <p>Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
    </div>
  );
}
