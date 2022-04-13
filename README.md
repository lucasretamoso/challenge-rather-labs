
  [![powered by Gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square)](https://gitmoji.dev)
  [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# Challenge: Rather Labs

## Description

This project is a challenge from Rather Labs. The goal is generate two endpoints with websocket which are:
1. One that receives a pair name, and retrieves the tips of the orderbook (i.e. the better prices for bid-ask). Both the total amount and prices.
2. One that is called with the pair name, the operation type (buy/sell) and the amount to be traded. Should return the effective price that will result if the order is executed (i.e. evaluate Market Depth).

## Structure

### Market Tips

This endpoint gets the tips summary from **Bitfinex** with the best bid-ask. It uses the following endpoint and body:

- Endpoint: /market-ticker
- Body:
```json
{
    "type": "market:ticker:ob:return", // Event from websocket: 
    "data": {
        "symbol": string
    }
}
```


### Market OrderBook

This endpoint will create a new local orderbook from **Bitfinex**. It will be used by the endpoint to get the effective price sending the pair name, operation (buy or sell) and the amount. It uses the following endpoint and body:

- Endpoint: /market-effective-price
- Body:
```json
{
    "type": "ob:effective:price", // Event from websocket: 
    "data": {
        "operation": string,
        "count": number,
        "limitEffectivePrice": number,
        "symbol": string
    }
}
```

Additionally, you can put a limit effective price to get the count needed or the max amount which you can buy.

## Pre-requirements

1. [NodeJS](https://nodejs.org/en/)
2. [Typescript](https://www.typescriptlang.org/)
3. [Postman](https://www.postman.com/) (optional)

## Testing

The tests are hosted in the `test` folder using Jest framework. 

### Run the test

To test the project you need to run the following command:
``` bash
npm run test
```

This command run the test.

## Test the application

To test the application, you need to follow the next steps:

- Install dependecies with `npm i`.
- Copy the file `.env.example` to root folder with the name `.env`.
- Run nodemon with the command `npm run dev`. If you see the script, you can check that the linter is running with nodemon.
- Go to browser and go to the page `localhost:3000`.
    - You can use Postman if you want.

## Contact

If you have problems or issues, you can write me in the email lucasretamoso@gmail.com or via [LinkedIn](https://www.linkedin.com/in/ing-llrg/).