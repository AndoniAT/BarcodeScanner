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

=== MENU ET THEME JOUR / NUIT ====

Dans le menu principal veuillez de cliquer sur le cercle blanc/noir pour changer le thème de l'application

Jour

![Day mode](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/1_day_mode_main.webp)

NUIT

![Night mode](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/1_dark_mode_main.webp)


=== HISTORIQUE ====

Ajout d'une nouvelle route côté serveur pour retourner un historique uniquement des elements qui sont déjà validés
'/checked/{customer_id}' en ordre desc par date

![history](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/3_history.webp)

==== SCANNER ====

Au moment de scanner, veuillez de posser la camera directement devant le code de barres ou code QR, l'item
sera ajouté automatiquement et vous serez renvoyé à votre panier

![scan](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/2_scan.webp)

=== NOUVEAU ====

Saisir l'id de l'item que vou souhaitez rajouter, au moment de valider vous serez renvoyé à la page du panier


![add item](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/4_add_item.webp)

=== AJOUTER / RETIRER des elements ====

Dans le panier, faire glisser un item une fois et vous allez voir deux boutons:
	- Ajouter (+)
	- Retirer (-)
L'elemnt sera supprimé si la quantité arrive à 0

==== SUPPRIMER des elements ====

Si vous souhaitez supprimer directement l'element dans devoir cliquer sur "-" plusieurs fois, vous pouvez faire gliser l'element deux fois
et l'élément sera supprimé de votre panier.

![add remove](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/6_remove_add_item_main.webp)

=== PAYER TEST ====

Pour le mode de payment vous pouvez tester avec une carte fausse ex: 42424242...

![pay](https://www-apps.univ-lehavre.fr/forge/aa204303/barcode-scanner/-/raw/main/imagesProject/5_pay.webp)







