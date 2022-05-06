const sdk = require("node-appwrite");
const { Axios } = require("axios");


/*
  'req' variable has:
    'headers' - object with request headers
    'payload' - object with request body data
    'env' - object with environment variables

  'res' variable has:
    'send(text, status)' - function to return text response. Status code defaults to 200
    'json(obj, status)' - function to return JSON response. Status code defaults to 200

  If an error is thrown, a response with code 500 will be returned.
*/

module.exports = async function (req, res) {
  const client = new sdk.Client();

  // You can remove services you don't use
  let account = new sdk.Account(client);
  let avatars = new sdk.Avatars(client);
  let database = new sdk.Database(client);
  let functions = new sdk.Functions(client);
  let health = new sdk.Health(client);
  let locale = new sdk.Locale(client);
  let storage = new sdk.Storage(client);
  let teams = new sdk.Teams(client);
  let users = new sdk.Users(client);

  if (
    !req.env['APPWRITE_FUNCTION_ENDPOINT'] ||
    !req.env['APPWRITE_FUNCTION_API_KEY']
  ) {
    console.warn("Environment variables are not set. Function cannot use Appwrite SDK.");
  } else {
    client
      .setEndpoint(req.env['APPWRITE_FUNCTION_ENDPOINT'])
      .setProject(req.env['APPWRITE_FUNCTION_PROJECT_ID'])
      .setKey(req.env['APPWRITE_FUNCTION_API_KEY'])
      .setSelfSigned(true);
  }

  // const url = "https://api.coingecko.com/api/v3/coins/list";
  const axios = new Axios({
    baseURL: "https://api.coingecko.com/api/v3",
  });
  var urlPath = "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=9250&page=1&sparkline=false";
   //urlPath =  "/v3/ping";

  try {
    const response = await axios.get(urlPath);
    var rs = JSON.parse(response.data);

    for (i=0; i< rs.length; i++){
      let data = {
        "name": rs[i]['name'],
        "symbol": rs[i]['symbol'], 
        "server_id": rs[i]['id'],
        "image": rs[i]['image'],
        "current_price": parseFloat(rs[i]['current_price']).toString(),
        "market_cap": parseFloat(rs[i]['market_cap']).toString(),
        "market_cap_rank": parseFloat(rs[i]['market_cap_rank']).toString(),
        "fully_diluted_valuation": parseFloat(rs[i]['fully_diluted_valuation']).toString(),
        "total_volume": parseFloat(rs[i]['total_volume']).toString(),
        "high_24h": parseFloat(rs[i]['high_24h']).toString(),
        "low_24h": parseFloat(rs[i]['low_24h']).toString(),
        "price_change_24h": parseFloat(rs[i]['price_change_24h']).toString(),
        "price_change_percentage_24h": parseFloat(rs[i]['price_change_percentage_24h']).toString(),
        "market_cap_change_24h": parseFloat(rs[i]['market_cap_change_24h']).toString(),
        "market_cap_change_percentage_24h": parseFloat(rs[i]['market_cap_change_percentage_24h']).toString(),
        "circulating_supply": parseFloat(rs[i]['circulating_supply']).toString(),
        "total_supply": parseFloat(rs[i]['total_supply']).toString(),
        "max_supply": parseFloat(rs[i]['max_supply']).toString(),
        "ath": parseFloat(rs[i]['ath']).toString(),
        "ath_change_percentage": parseFloat(rs[i]['ath_change_percentage']).toString(),
        "ath_date": rs[i]['ath_date'],
        "atl": parseFloat(rs[i]['atl']).toString(),
        "atl_change_percentage": parseFloat(rs[i]['atl_change_percentage']).toString(),
        "atl_date": rs[i]['atl_date"'],
        "roi": parseFloat(rs[i]['roi']).toString(),
        "last_updated": rs[i]['last_updated']

      }

      let promise = database.createDocument('626404fbd4a313275970', rs[i]['id'], data);
      promise.then(function (response) {
        
        res.json({
          response,
        });
    }, function (error) {
        console.error(error)
        var rr = error;
        res.json({
         "error": "No "+rr
        });
    });

  }
     
    } catch (error) {
    throw new Error(error);
    res.json({
      "error": "No 4"+error
     });
  }
};
