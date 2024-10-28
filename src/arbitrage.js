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
function checkForCrossChainArbitrage() {
    return __awaiter(this, void 0, void 0, function* () {
        const inputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
        const outputMint = 'So11111111111111111111111111111111111111112';
        const amount = 100;
        let solPriceNumber, basePriceNumber;
        // Fetch Solana price from Jupiter
        try {
            const solPrice = yield (0, solanaPrice_1.getSolanaPrice)(inputMint, outputMint, amount);
            if (solPrice && solPrice.price) {
                solPriceNumber = Number(solPrice.price);
                console.log('1 USDC gives you:', solPriceNumber, 'solana');
            }
            else {
                console.error("Solana price data is undefined or incomplete.");
                return; // Exit if the Solana price data is invalid
            }
        }
        catch (error) {
            console.error("Error fetching Solana price:", error);
            return;
        }
        // Fetch Base price from Uniswap or similar DEX
        try {
            const basePrice = yield (0, basePrice_1.getBasePrice)();
            if (basePrice && basePrice.price) {
                basePriceNumber = Number(basePrice.price);
                const formattedBasePrice = basePriceNumber.toFixed(10); // Format to 10 decimal places
                console.log('Base Price:', formattedBasePrice, 'WETH'); // Display formatted base price
            }
            else {
                console.error("Base price data is undefined or incomplete.");
                return; // Exit if the Base price data is invalid
            }
        }
        catch (error) {
            console.error("Error fetching Base price:", error);
            return;
        }
        // Arbitrage logic: Buy low on one network, sell high on the other
        if (solPriceNumber < basePriceNumber) {
            console.log('Arbitrage opportunity: Buy on Solana, sell on Base');
            try {
                yield (0, bridge_1.bridgeTokens)(100, 'solana', 'base');
                yield executeTradeOnBase('buy', 100);
            }
            catch (error) {
                console.error("Error during Solana to Base arbitrage:", error);
            }
        }
        else if (basePriceNumber < solPriceNumber) {
            console.log('Arbitrage opportunity: Buy on Base, sell on Solana');
            try {
                yield (0, bridge_1.bridgeTokens)(100, 'base', 'solana');
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
