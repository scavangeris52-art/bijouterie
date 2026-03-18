import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div>
        <div className="font-luxury text-8xl font-light text-rose-200 mb-4">404</div>
        <h1 className="font-luxury text-3xl font-light text-gray-800 mb-4">Page introuvable</h1>
        <p className="text-gray-500 mb-8">La page que vous cherchez n'existe pas ou a été déplacée.</p>
        <Link href="/fr"
          className="inline-flex items-center gap-2 bg-gradient-rose text-white px-8 py-3 rounded-xl font-semibold text-sm shadow-rose hover:shadow-luxury transition-all">
          ← Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
