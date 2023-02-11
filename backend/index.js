 const Moralis = require("moralis").default;
const express = require("express");
const cors = require("cors");
const Bottleneck = require("bottleneck");
require("dotenv").config();

const app = express();
const port = 8080;

app.use(cors());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


function isAddress(address) {
  // Check if the address is a hex string of length 42
  if (typeof address !== "string" || address.length !== 42) {
    return false;
  }

  // Check if the address starts with "0x"
  if (address.slice(0, 2) !== "0x") {
    return false;
  }

  // Check if the address contains only hexadecimal characters
  for (let i = 2; i < address.length; i++) {
    const char = address[i];
    if (!(char >= "0" && char <= "9") && !(char >= "a" && char <= "f")) {
      return false;
    }
  }

  return true;
}


function getNativeCurrency(chain) {
  switch(chain) {
    case "0x1":
        return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
    case "0x89":
        return "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
    case "0xfa":
        return "0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83";
    case "0x38":
        return "0x242a1ff6ee06f2131b7924cacb74c7f9e3a5edc9";
       
    default:
        return "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
  }
}

//GET AMOUNT AND VALUE OF NATIVE TOKENS
app.get("/nativeBalances", async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }
  try {
    const { address } = req.query;
    const chains = ["0x1", "0x89", "0xfa", "0x38"];

    const nativeBalances = await Promise.all(chains.map(async (chain) => {
      const response = await Moralis.EvmApi.balance.getNativeBalance({
        address: address,
        chain: chain,
      });
      const nativeBalance = response.raw;
      const nativeCurrency = getNativeCurrency(chain);

        const nativePrice = await Moralis.EvmApi.token.getTokenPrice({
        address: nativeCurrency, //WETH Contract
        chain: chain,
      });

      const { usdPrice } = nativePrice.raw ?? {};

     

      const newBalance = Number(nativeBalance.balance) / 1e18;
      const nativeValue = newBalance * usdPrice;

      return {
        ...nativeBalance,
        balance: Number(newBalance.toFixed(3)),
        usd: Number(nativePrice.raw.usdPrice.toFixed(2)),
        nativeValue,
        chain,
        
        
      };
    }));
    res.send({ nativeBalances });
    console.log(nativeBalances)
  } catch (e) {
    console.log({e})
    console.log(e.message);
    res.send(e.message);
  }
});




const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
}

//GET AMOUNT AND VALUE OF ERC20 TOKENS

const rateLimit = require("express-rate-limit");

const tokenBalancesLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 30, // limit each IP to 20 requests per windowMs
  message: "Too many requests, please try again later"
});


app.get("/tokenBalances",tokenBalancesLimiter, async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }
  
  try {
    const { address } = req.query;
    const chains = ["0x1", "0x89", "0xfa", "0x38"];
  
    const promises = chains.map(async (chain) => {
      const response = await Moralis.EvmApi.token.getWalletTokenBalances({
        address: address,
        chain: chain,
      });

      console.log({res: response.data});
      return response.data.map((item)=>({ ...item, chain, address}));
    });
  
    const TokenPromise = await Promise.all(promises);
  
    const tokenPrices = {};
  
    const tokensWithUsdPromise = await Promise.all(
      TokenPromise.flat().map(async (token) => {
        if (!tokenPrices[token.token_address]) {
          try {
            const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
              address: token.token_address,
              chain: token.chain,
            });
            tokenPrices[token.token_address] = priceResponse.raw.usdPrice;
          } catch (error) {
            console.log("Error getting token price:", error.message);
            tokenPrices[token.token_address] = 0;
          }
        }
      
        return {
          ...token,
          chain: token.chain,
          usd: tokenPrices[token.token_address] || 0
        };
      })
    );
    const legitTokens = tokensWithUsdPromise.filter(({ usd }) => usd !== 0);
    res.send(legitTokens);

    console.log("legitTokens:", legitTokens);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

    
//GET Users NFT's
app.get("/nftBalance", async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }

  try {
    const { address, chain } = req.query;

    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      address: address,
      chain: chain,
    });

    const userNFTs = response.raw;

    res.send(userNFTs);
  } catch (e) {
    res.send(e.message);
  }
});




const tokenTransfersLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 30, // limit each IP to 100 requests per windowMs
  message: "Too many requests, please try again later"
});

//GET USERS TOKEN TRANSFERS
app.get("/tokenTransfers", tokenTransfersLimiter, async (req, res) => {
  if (!Moralis.Core.isStarted) {
    await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });
  }
  try {
    const { address } = req.query;
    const chains = ["0x1", "0x89", "0xfa", "0x38"];

    const tokenTransfers = [];

    for (const chain of chains) {
      const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
        address: address,
        chain: chain,
      });

      const userTrans = response.raw.result;
      console.log({ trans: userTrans });

      const userTransDetails = [];

      for (const transfer of userTrans) {
        try {
          const metaResponse = await Moralis.EvmApi.token.getTokenMetadata({
            addresses: [transfer.address],
            chain: chain,
          });
          if (metaResponse.raw) {
            transfer.decimals = metaResponse.raw[0].decimals;
            transfer.symbol = metaResponse.raw[0].symbol;
            userTransDetails.push(transfer);
          } else {
            console.log("no details for desired coin");
          }
        } catch (e) {
          console.log(e);
        }
      }

      tokenTransfers.push({
        userTransDetails,
        chain
      });
    }

    res.send({ tokenTransfers });
  } catch (e) {
    console.log(e.message);
    res.send(e.message);
  }
});

module.exports = app;