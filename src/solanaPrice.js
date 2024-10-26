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
exports.getSolanaPrice = getSolanaPrice;
const api_1 = require("@jup-ag/api");
// Initialize the Jupiter API client
const jupiterQuoteApi = (0, api_1.createJupiterApiClient)();
// Function to get price from Jupiter for a given input/output pair
function getSolanaPrice(inputMint, outputMint, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Adjust amount based on USDC's 6 decimals
            const adjustedAmount = amount * 10 ** 6;
            const quoteResponse = yield jupiterQuoteApi.quoteGet({
                inputMint,
                outputMint,
                amount: adjustedAmount, // Amount in smallest units for USDC
                slippageBps: 100, // 1% slippage
                swapMode: 'ExactIn', // Input amount is fixed, want to get the output
            });
            console.log("Quote response structure:", JSON.stringify(quoteResponse, null, 2));
            if (quoteResponse.routePlan && quoteResponse.routePlan.length > 0) {
                const bestRoute = quoteResponse.routePlan[0];
                const inAmount = parseFloat(bestRoute.swapInfo.inAmount);
                const outAmount = parseFloat(bestRoute.swapInfo.outAmount);
                // Convert to real-world units (1 USDC / SOL price)
                const price = (outAmount / (10 ** 9)) / (inAmount / (10 ** 6));
                return {
                    inAmount: inAmount / 10 ** 6, // Converted to USDC real units
                    outAmount: outAmount / 10 ** 9, // Converted to SOL real units
                    price,
                };
            }
            else {
                throw new Error('No valid routes found in the response.');
            }
        }
        catch (error) {
            console.error("Error fetching price:", error);
            throw error;
        }
    });
}
