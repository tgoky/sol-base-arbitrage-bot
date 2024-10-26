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
exports.checkForCrossChainArbitrage = checkForCrossChainArbitrage;
const solanaPrice_1 = require("./solanaPrice");
const basePrice_1 = require("./basePrice");
const bridge_1 = require("./bridge");
// Function to check for cross-chain arbitrage opportunities
function checkForCrossChainArbitrage() {
    return __awaiter(this, void 0, void 0, function* () {
        // Define input/output mint addresses and amount for the Solana price query
        const inputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // Replace with actual token mint address
        const outputMint = 'So11111111111111111111111111111111111111112'; // Replace with actual token mint address
        const amount = 100; // Set the amount you want to query, e.g., 100 tokens
        let solPriceNumber, basePriceNumber;
        // Fetch Solana price from Jupiter
        try {
            const solPrice = yield (0, solanaPrice_1.getSolanaPrice)(inputMint, outputMint, amount);
            solPriceNumber = Number(solPrice.price);
            console.log('1 token gives you :', solPriceNumber, 'solana');
        }
        catch (error) {
            console.error("Error fetching Solana price:", error);
            return; // Exit if there’s an error with Solana pricing
        }
        // Fetch Base price from Uniswap or similar DEX
        try {
            const tokenAddress = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'; // Replace with your desired token address
            const decimals = 6; // Replace with the appropriate decimals for the token
            const basePrice = yield (0, basePrice_1.getBasePrice)(tokenAddress, decimals);
            basePriceNumber = Number(basePrice);
            console.log('Base Price:', basePriceNumber);
        }
        catch (error) {
            console.error("Error fetching Base price:", error);
            return; // Exit if there’s an error with Base pricing
        }
        // Arbitrage logic: Buy low on one network, sell high on the other
        if (solPriceNumber < basePriceNumber) {
            console.log('Arbitrage opportunity: Buy on Solana, sell on Base');
            try {
                // Bridge tokens from Solana to Base
                yield (0, bridge_1.bridgeTokens)(100, 'solana', 'base');
                // Execute buy trade on Base
                yield executeTradeOnBase('buy', 100);
            }
            catch (error) {
                console.error("Error during Solana to Base arbitrage:", error);
            }
        }
        else if (basePriceNumber < solPriceNumber) {
            console.log('Arbitrage opportunity: Buy on Base, sell on Solana');
            try {
                // Bridge tokens from Base to Solana
                yield (0, bridge_1.bridgeTokens)(100, 'base', 'solana');
                // Execute sell trade on Solana
                yield executeTradeOnSolana('sell', 100);
            }
            catch (error) {
                console.error("Error during Base to Solana arbitrage:", error);
            }
        }
        else {
            console.log('No arbitrage opportunity found.');
        }
    });
}
// Example functions for executing trades (adjust based on exchange SDKs)
function executeTradeOnBase(tradeType, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${tradeType}ing ${amount} tokens on Base network`);
        // Add your trade execution logic here (e.g., Uniswap SDK)
    });
}
function executeTradeOnSolana(tradeType, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`${tradeType}ing ${amount} tokens on Solana network`);
        // Add your trade execution logic here (e.g., Jupiter SDK)
    });
}
