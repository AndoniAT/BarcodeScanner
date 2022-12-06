# Server

## Travail à réaliser

Vous devez réaliser une application de paiement à l'aide de Stripe.

Elle doit comprendre les pages/fonctionnalités suivantes :

- Scan de codes-barres
    - Accès au panier
    - Si l'appareil photo n'est pas disponible, il faut pouvoir ajouter les articles manuellement
    - Une vérification via l'API est nécessaire afin de savoir si l'article existe
- Un panier
    - Contient l'ensemble des articles scannés
    - Accessible depuis la page de scan des articles
    - Possibilité de retirer du panier un article scanné
    - Lorsque qu'un article est ajouté plusieurs fois, afficher un indicateur précisant le nombre du même article
    - Possibilité d'augmenter la quantité d'un article déjà scanné
    - Possibilité de payer les articles sélectionnés
- Un historique des articles payés

Je vous conseille d'utiliser les technologies ci-dessous :
- Expo BarCode - Pour lire les codes-barres
- Expo SecureStore - Pour stocker des informations si besoin
- React Navigation - Pour la navigation 

Une API est à votre disposition pour utiliser Stripe mais vous pouvez faire votre propre implémentation. Si vous décidez de d'implémenter votre propre API, merci de la joindre à votre projet avec des instructions d'installation.

## Configuration de l'API

Ajouter les variables d'environnement suivantes dans un fichier .env à la racine du projet :

```shell
FASTAPI_PORT=8000
STRIPE_SK=sk_test_XXXX
STRIPE_PK=pk_test_XXXX
```

Pour lancer le serveur :

```shell
docker compose up --build
```
