# Bijouterie Nador - Guide d'Installation

## Vue d'ensemble
Bijouterie Nador est une application e-commerce Next.js 14 pour la vente de bijoux artisanaux avec :
- Interface multilingue (Français, English, العربية, Español)
- Système de paiement Stripe
- Gestion admin avec authentification
- Stockage d'images avec Cloudinary
- Service d'email pour notifications
- Panier et checkout

## Prérequis
- Node.js 18.17.0 ou supérieur
- npm ou yarn
- Une base de données PostgreSQL (Supabase, Railway, Vercel Postgres, etc.)

## Installation locale

### 1. Cloner et installer les dépendances
```bash
git clone <repo-url>
cd bijouterie-nador
npm install
```

### 2. Configuration des variables d'environnement

#### Copier le fichier d'exemple
```bash
cp .env.example .env.local
```

#### Configurer chaque service

**Base de données (REQUIS)**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**NextAuth (REQUIS pour production)**
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"  # Générer une clé secrète forte
```

Pour générer une clé secrète :
```bash
openssl rand -base64 32
```

**Stripe (Pour les paiements)**
1. Aller sur https://dashboard.stripe.com/apikeys
2. Copier les clés de test
3. Configurer :
```env
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

**Webhook Stripe (Pour confirmer les paiements)**
1. Aller sur https://dashboard.stripe.com/webhooks
2. Ajouter un endpoint pointant vers : `https://votre-domaine.com/api/stripe/webhook`
3. Sélectionner les événements :
   - checkout.session.completed
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - charge.refunded
4. Copier le "Signing secret"

**Email (Optionnel)**
Pour Gmail :
1. Activer 2FA sur votre compte Google
2. Générer un "App Password" : https://myaccount.google.com/apppasswords
3. Configurer :
```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="votre-email@gmail.com"
SMTP_PASS="votre-mot-de-passe-application"
EMAIL_FROM="Bijouterie Nador <noreply@bijouterie-nador.com>"
```

Alternatif : Utiliser Resend (https://resend.com)
```env
RESEND_API_KEY="re_..."
```

**Cloudinary (Pour les images)**
1. Créer un compte sur https://cloudinary.com
2. Aller dans le Dashboard
3. Copier :
```env
CLOUDINARY_CLOUD_NAME="votre_cloud_name"
CLOUDINARY_API_KEY="votre_api_key"
CLOUDINARY_API_SECRET="votre_api_secret"
```

**Google Maps (Optionnel)**
```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY="AIza..."
```

**WhatsApp (Optionnel)**
```env
NEXT_PUBLIC_WHATSAPP_NUMBER="212600000000"
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer les tables
npm run db:push

# (Optionnel) Avec migrations
npm run db:migrate

# Remplir la base avec les données d'exemple
npm run db:seed
```

Les données d'exemple incluent :
- 4 catégories (Bagues, Colliers, Bracelets, Boucles d'oreilles)
- 6 produits d'exemple
- Admin : email: `admin@nador.ma` / password: `admin123`

### 4. Démarrer le serveur de développement

```bash
npm run dev
```

Ouvrir http://localhost:3000

## Authentification Admin

- URL : http://localhost:3000/admin
- Email : `admin@nador.ma`
- Mot de passe : `admin123`

⚠️ **IMPORTANT POUR PRODUCTION** :
1. Changer le mot de passe admin
2. Utiliser une adresse email sécurisée
3. Configurer un NEXTAUTH_SECRET fort

Pour créer un nouvel admin, utiliser la console Prisma :
```bash
npm run db:studio
```

## Déploiement sur Vercel

### 1. Configurer les variables d'environnement sur Vercel

Aller dans Settings > Environment Variables et ajouter :
- DATABASE_URL
- NEXTAUTH_URL
- NEXTAUTH_SECRET
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- SMTP_* (si utilisé)
- CLOUDINARY_*
- Autres (optionnel)

### 2. Déployer

```bash
vercel
```

Ou connecter votre repo GitHub directement sur vercel.com

### 3. Configurer le webhook Stripe en production

1. Aller sur https://dashboard.stripe.com/webhooks
2. Ajouter un endpoint : `https://votre-domaine-vercel.com/api/stripe/webhook`
3. Copier le secret et l'ajouter à Vercel

## Fonctionnalités

### Pour les clients
- Navigation multilingue
- Recherche et filtrage par catégorie
- Panier persistant
- Paiement sécurisé avec Stripe
- Avis sur produits
- Newsletter
- Formulaire de contact

### Pour l'administrateur
- Dashboard avec statistiques
- Gestion des produits (créer, modifier, supprimer)
- Gestion des commandes
- Gestion des avis
- Gestion du blog
- Modération du contenu

## Sécurité

✅ Routes admin protégées par authentification NextAuth
✅ Données de paiement traitées par Stripe (PCI compliant)
✅ Validation des entrées avec Zod
✅ HTTPS sur production
✅ CORS configuré
✅ Stockage sécurisé des mots de passe avec bcrypt

## Structure du projet

```
src/
├── app/                 # Pages Next.js
│   ├── api/            # Endpoints API
│   ├── [locale]/       # Pages publiques
│   └── admin/          # Pages administrateur
├── components/         # Composants React
├── lib/               # Utilitaires et services
├── store/             # Zustand store (panier)
├── types/             # Types TypeScript
└── messages/          # Traductions i18n

prisma/
├── schema.prisma      # Schéma de base de données
└── seed.ts           # Données d'exemple
```

## Dépannage

**Les images ne s'affichent pas**
- Vérifier CLOUDINARY_CLOUD_NAME dans .env.local
- Vérifier les autorisations d'accès Cloudinary

**Paiement Stripe échoue**
- Utiliser les clés de test de Stripe
- Vérifier que STRIPE_SECRET_KEY est configuré
- Numéro de test : 4242 4242 4242 4242

**Email non reçu**
- Vérifier les variables SMTP
- Vérifier les logs Vercel/serveur
- Activer le mode "less secure" pour Gmail (non recommandé)
- Utiliser plutôt un app password Gmail

**Admin panel inaccessible**
- Vérifier NEXTAUTH_SECRET n'est pas vide
- Nettoyer les cookies du navigateur
- Vérifier la base de données avec `npm run db:studio`

## Maintenance

### Mettre à jour les données
```bash
npm run db:studio  # Interface visuelle Prisma
```

### Backup de base de données
Selon votre provider :
- Supabase : https://supabase.com/docs/guides/database/backups
- Railway : https://docs.railway.app/databases/postgresql
- Vercel Postgres : https://vercel.com/docs/storage/postgres

### Monitoring
- Vérifier les logs Vercel
- Surveiller les erreurs Stripe
- Monitorer les emails (maillog)

## Support et documentation

- Next.js : https://nextjs.org
- Prisma : https://www.prisma.io
- NextAuth.js : https://next-auth.js.org
- Stripe : https://stripe.com/docs
- Cloudinary : https://cloudinary.com/documentation

## Licence

Propriétaire - Bijouterie Nador

---
Dernière mise à jour : March 2026
