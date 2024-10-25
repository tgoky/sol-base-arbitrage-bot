"use strict";
// src/index.ts
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
const arbitrage_1 = require("./arbitrage");
function startArbitrageBot() {
    return __awaiter(this, void 0, void 0, function* () {
        while (true) {
            try {
                yield (0, arbitrage_1.checkForCrossChainArbitrage)();
            }
            catch (error) {
                console.error('Error during arbitrage check:', error);
            }
            // Poll every minute (adjust as necessary)
            yield new Promise(resolve => setTimeout(resolve, 60000));
        }
    });
}
// Start the arbitrage bot
startArbitrageBot();
