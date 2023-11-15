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

== Veuillez d'ajouter votre user id dans la variable "userId" dans le fichier variables_config.tsx ==


=== BARRE CODES ===
Les codes Qr et codes de barres se trouvent dans le dossier SCAN_CODES
avec 7 elements d'exemple.

=== HISTORIQUE ====
Ajout d'une nouvelle route côté serveur pour retourner un historique uniquement des elements qui sont déjà validés
'/checked/{customer_id}' en ordre desc par date

=== THEME JOUR / NUIT ====
Dans le menu principal veuillez de cliquer sur le cercle blanc/noir pour changer le thème de l'application

==== SCANNER ====
Au moment de scanner, veuillez de posser la camera directement devant le code de barres ou code QR, l'item
sera ajouté automatiquement et vous serez renvoyé à votre panier

=== NOUVEAU ====
Saisir l'id de l'item que vou souhaitez rajouter, au moment de valider vous serez renvoyé à la page du panier

=== AJOUTER / RETIRER des elements ====
Dans le panier, faire glisser un item une fois et vous allez voir deux boutons:
	- Ajouter (+)
	- Retirer (-)
L'elemnt sera supprimé si la quantité arrive à 0

==== SUPPRIMER des elements ====
Si vous souhaitez supprimer directement l'element dans devoir cliquer sur "-" plusieurs fois, vous pouvez faire gliser l'element deux fois
et l'élément sera supprimé de votre panier.


=== PAYER TEST ====
Pour le mode de payment vous pouvez tester avec une carte fausse ex: 42424242...




