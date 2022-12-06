# Barcode Scanner

|   Nom   | Prénom |
|---------|--------|
|   Doe   |  Jane  |

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

Le projet est composé des choses suivantes :
- Server : Une API afin d'utiliser Stripe. Vous pouvez implémenter la votre
- Client : Une application React Native de départ, c'est ici que vous allez développer l'application

Aucune bibliothèque n'est imposée.

## Configuration de Stripe

Pour réaliser l'application vous allez avoir besoin de créer un compte [Stripe](https://stripe.com/fr "Stripe").
