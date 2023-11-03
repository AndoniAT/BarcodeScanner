# Client

## Configuration de l'application

Il est nécessaire de connaître l'adresse IP de votre machine sur le réseau car l'émulateur a son propre réseau donc pas le même localhost. Vous pouvez la connaître via cette commande : 

```shell
ip a # ou ipconfig ou ifconfig
I -hostname
```

Installation des dépendences :

```shell
npm i
```

Lancement de l'application :

```shell
API_URL={API_URL} STRIPE_PK={STRIPE_PK} npm run android
```

La clé publique `STRIPE_PK` est disponible depuis le dashboard de Stripe.

== Veuillez d'ajouter votre user id dans le fichier variables_config.tsx ==


=== BARRE CODES ===
Les codes Qr et codes de barres se trouvent dans le dossier SCAN_CODES
avec 7 elements d'exemple.
