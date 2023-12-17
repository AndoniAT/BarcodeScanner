# Server

Un backend développé à l'aide du framework Python, FastAPI.

## Structure de l'API

| Router   | Path                | Method  | Description                                                        |
|----------|---------------------|---------|--------------------------------------------------------------------|
| Client   | /                   | GET     | Returns the list of users                                          |
|          | /                   | POST    | Add a user                                                         |
|          | /{customer_id}      | GET     | Returns a user's information                                       |
| Items    | /                   | GET     | Returns the list of objects                                        |
|          | /                   | POST    | Add an object                                                      |
|          | /                   | DELETE  | Delete an object                                                   |
|          | /{item_id}          | GET     | Returns information about an object                                |
| Payment  | /                   | GET     | Returns the list of payments                                       |
|          | /                   | POST    | Create a payment                                                   |
|          | /{customer_id}      | GET     | Returns payments linked to a user                                  |
|          | /check/{payment_id} | POST    | Validates the payment if made and returns the list of paid items   |
|          | /checked/{customer_id} | GET  | Returns checked payments linked to user ordered descending by date |

## API configuration

Add the environment variables using the `.env.example` file in a file named `.env`.

The public key as well as the private key are available from the Stripe dashboard.

Launching the server:

```shell
docker compose up --build
```

Once launched, access the API documentation at this address: `http://localhost:{FASTAPI_PORT}/docs`.

To stop and delete the server:

```shell
docker compose down
```

## Before using client

For the client example to work correctly, please see [Exemples](./client/SCAN_CODES/README.md) 
and add the exemple items

The expected answer when an item is added is (for exemple with a 'banane'):

```json
{
  "name": "banane", // Product name
  "price": 199, // The price
  "id": 1 // The id
}
```

- As well as a `customer`. The generated unique identifier of the `customer` corresponds to the customer's Stripe identifier:

```curl
curl -X 'POST' \
  'http://localhost:8000/customers/' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "email": "example@example.xyz"
}'
```

La réponse attendue est :
```json
{
  "id": "cus_OmpJZapHkM2keT",
  "email": "example@example.xyz"
}
```
