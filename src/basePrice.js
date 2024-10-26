"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBasePrice = getBasePrice;
const sdk_1 = require("@uniswap/sdk");
const providers_1 = require("@ethersproject/providers");
// Extend ChainId locally for Base support
var CustomChainId;
(function (CustomChainId) {
    CustomChainId[CustomChainId["BASE"] = 8453] = "BASE";
})(CustomChainId || (CustomChainId = {}));
// Base connection setup using @ethersproject provider
const baseProvider = new providers_1.JsonRpcProvider('https://mainnet.base.org');
// Function to fetch the price of a specific token in terms of WETH
function getBasePrice(tokenAddress, decimals) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Create token instance for the specified token
            const token = new sdk_1.Token(CustomChainId.BASE, tokenAddress, decimals);
            // Create a WETH token instance for the Base chain
            const WETH = new sdk_1.Token(CustomChainId.BASE, '0x4200000000000000000000000000000000000006', 18); // Update the WETH address if necessary
            // Fetch pair data for the token and WETH
            const pair = yield sdk_1.Fetcher.fetchPairData(token, WETH, baseProvider);
            // Create a route for the trade
            const route = new sdk_1.Route([pair], token);
            // Return the price of the token in terms of WETH
            return route.midPrice.toSignificant(6); // Adjust precision as needed
        }
        catch (error) {
            console.error("Error fetching token price:", error);
            throw new Error("Could not fetch token price. Check token address or liquidity.");
        }
    });
}
// Example usage
getBasePrice('0x4200000000000000000000000000000000000006', 6)
    .then(price => console.log("Price in WETH:", price))
    .catch(err => console.error(err));
