# Server

Un backend développé à l'aide du framework Python, FastAPI.

## Structure de l'API

| Routeur  | Chemin              | Méthode | Description                                                        |
|----------|---------------------|---------|--------------------------------------------------------------------|
| Customer | /                   | GET     | Renvoie la liste des utilisateurs                                  |
|          | /                   | POST    | Ajoute d'un utilisateur                                            |
|          | /{customer_id}      | GET     | Renvoie les informations d'un utilisateur                          |
| Items    | /                   | GET     | Renvoie la liste des objets                                        |
|          | /                   | POST    | Ajoute un objet                                                    |
|          | /                   | DELETE  | Supprime un objet                                                  |
|          | /{item_id}          | GET     | Renvoie les informations d'un objet                                |
| Payment  | /                   | GET     | Renvoie la liste des paiements                                     |
|          | /                   | POST    | Créée un paiement                                                  |
|          | /{customer_id}      | GET     | Renvoie les paiements liés à un utilisateur                        |
|          | /check/{payment_id} | POST    | Valide le paiement si réalisé et renvoie la liste des objets payés |

## Configuration de l'API

Ajouter les variables d'environnement en vous aidant du fichier `.env.example` dans un fichier nommé `.env`.

La clé publique ainsi que la privée sont disponibles depuis le dashboard de Stripe.

Lancement du serveur :

```shell
docker compose up --build
```

Une fois lancé, accedez à la documentation de l'API à cette adresse : `http://localhost:{FASTAPI_PORT}/docs`.

Pour arrêter et supprimer le serveur :

```shell
docker compose down
```
