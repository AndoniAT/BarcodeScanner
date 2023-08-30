# Barcode Scanner

|   Nom   | Prénom |
|---------|--------|
|   Doe   |  Jane  |

Le TP est à réaliser individuellement.

## Compétences évaluées

| Compétence | Aptitude | Description                                                                                        | Acquis | Remarque |
|------------|----------|----------------------------------------------------------------------------------------------------|--------|----------|
| D1         | C2       | Maîtriser la gestion des variables d’environnement d’une application                               |        |          |
| D2         | C1       | Maîtriser la création d’interfaces graphiques à l’aide de React Native                             |        |          |
|            | C1       | Maîtriser l’API Stripe Javascript                                                                  |        |          |
|            | C3       | Maîtriser l’architecture logicielle d’un projet (services, composants, types, interfaces, classes) |        |          |
|            | C3       | Maîtriser l’écriture de code asynchrone                                                            |        |          |
|            | C3       | Savoir documenter son code                                                                         |        |          |
| D4         | C1       | Maîtriser git                                                                                      |        |          |
|            | C4       | Savoir respecter l’énoncé et l’échéance                                                            |        |          |

## Technologies requises

Vous allez avoir besoin des technologies suivantes :
- [Android Studio](https://developer.android.com/studio "Android Studio") ainsi que la [JDK 20+](https://www.oracle.com/fr/java/technologies/downloads "JDK")
- [Docker](https://www.docker.com "Docker") Desktop ou CLI
- [NodeJS LTS](https://nodejs.org/fr "NodeJS")
- Un compte [Stripe](https://stripe.com/fr "Stripe")

## Travail à réaliser

Vous devez réaliser une application de paiement à l'aide de Stripe.

Elle doit comprendre les pages/fonctionnalités suivantes :

- [ ] Scan de codes-barres
    - [ ] Accès au panier
    - [ ] Si l'appareil photo n'est pas disponible, il faut pouvoir ajouter les articles manuellement
    - [ ] Une vérification via l'API est nécessaire afin de savoir si l'article existe
- [ ] Un panier
    - [ ] Contient l'ensemble des articles scannés
    - [ ] Accessible depuis la page de scan des articles
    - [ ] Possibilité de retirer du panier un article scanné
    - [ ] Lorsque qu'un article est ajouté plusieurs fois, afficher un indicateur précisant le nombre du même article
    - [ ] Possibilité d'augmenter la quantité d'un article déjà scanné
    - [ ]Possibilité de payer les articles sélectionnés
- [ ] Un historique des articles payés

Le projet est composé des choses suivantes :
- Server : Une API afin d'utiliser Stripe. Vous pouvez implémenter la votre
- Client : Une application React Native de départ, c'est ici que vous allez développer l'application

Aucune bibliothèque n'est imposée.
