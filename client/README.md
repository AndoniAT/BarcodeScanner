# Client

## Application config

It is necessary to know the IP address of your machine on the network because the emulator has its own network and therefore not the same localhost. You can find it via this command:

```shell
ip a # ou ipconfig ou ifconfig
```
or 
```shell
hostname -I
```

Installation dependencies:

```shell
npm i
```

== Please add your user id in the "userId" variable in the variables_config.tsx file ==

Lancement de l'application :

```shell
npm i
API_URL={API_URL} STRIPE_PK={STRIPE_PK} npm run android
```
for the apiurl please use http://ip_address:port

replace STRIPE_PK with your stripe public key

You can scan the QR code showed in terminal to run the app in your phone, for that you must to download fist 'expo' on your phone.

The public key `STRIPE_PK` is available from the Stripe dashboard.






