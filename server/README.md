# Server

## Configuration de l'API

Ajouter les variables d'environnement suivantes dans un fichier .env à la racine du projet :

```shell
FASTAPI_PORT={FASTAPI_PORT}
STRIPE_SK={STRIPE_SK} # clé secrète
STRIPE_PK={STRIPE_PK} # clé publique
```

La clé publique ainsi que la privée sont disponibles depuis le dashboard de Stripe.

Lancement du serveur :

```shell
docker compose up --build
```
