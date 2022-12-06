# Client

## Configuration de l'application

Il est nécessaire de connaître l'adresse IP de votre machine sur le réseau car l'émulateur a son propre réseau donc pas le même localhost. Vous pouvez la connaître via cette commande : 

```shell
ip a
```

Installation des dépendences :

```shell
npm i
```

Lancement de l'application :

```shell
API_URL={API_URL} STRIPE_PK={STRIPE_PK} npm run android
```
