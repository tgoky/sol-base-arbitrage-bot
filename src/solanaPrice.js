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
exports.getBirdeyePrice = getBirdeyePrice;
exports.getSolanaPrice = getSolanaPrice;
exports.getTokenPriceOnSolana = getTokenPriceOnSolana;
const web3_js_1 = require("@solana/web3.js");
// Solana connection setup
const solanaConnection = new web3_js_1.Connection('https://api.mainnet-beta.solana.com', 'confirmed');
// Function to get the price of a token pair from Birdeye
function getBirdeyePrice(inputMint, outputMint) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`https://api.birdeye.so/v1/prices?baseMint=${inputMint}&quoteMint=${outputMint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const priceData = yield response.json();
            // Log the entire response structure for debugging
            console.log(JSON.stringify(priceData, null, 2));
            // Check the structure of the price response
            if (priceData && priceData.data && priceData.data.length > 0) {
                return {
                    inAmount: priceData.data[0].inputAmount, // Example key, adjust based on actual response
                    outAmount: priceData.data[0].outputAmount, // Example key, adjust based on actual response
                    price: Number(priceData.data[0].outputAmount) / Number(priceData.data[0].inputAmount), // Adjust calculation as needed
                };
            }
            else {
                throw new Error('No prices found for the given pair.');
            }
        }
        catch (error) {
            console.error("Error fetching price:", error);
            throw error;
        }
    });
}
// Function to get Solana price
function getSolanaPrice() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputMint = 'YOUR_FHRNAL_MINT_ADDRESS'; // Replace with your actual FHRNAL mint address
        const outputMint = 'So11111111111111111111111111111111111111112'; // SOL mint address
        return yield getBirdeyePrice(inputMint, outputMint);
    });
}
// Example usage to get the price between two tokens
function getTokenPriceOnSolana(inputMint, outputMint) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield getBirdeyePrice(inputMint, outputMint);
    });
}
// Define input and output mint addresses at a broader scope
const inputMint = 'YOUR_FHRNAL_MINT_ADDRESS'; // Replace with your actual FHRNAL mint address
const outputMint = 'So11111111111111111111111111111111111111112'; // SOL mint address
// Call the function to get the price
getTokenPriceOnSolana(inputMint, outputMint)
    .then(priceInfo => {
    console.log('Price Info:', priceInfo);
})
    .catch(error => {
    console.error('Error fetching token price:', error);
});
