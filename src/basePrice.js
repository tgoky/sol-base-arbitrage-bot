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
// Base (Ethereum L2) connection setup using @ethersproject provider
const baseProvider = new providers_1.JsonRpcProvider('https://rpc.base.org');
// USDC and WETH Token on Base (replace with correct addresses)
const USDC = new sdk_1.Token(1, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6);
const WETH = new sdk_1.Token(1, '0x4200000000000000000000000000000000000006', 18);
// Function to fetch price on Uniswap for Base
function getBasePrice() {
    return __awaiter(this, void 0, void 0, function* () {
        const pair = yield sdk_1.Fetcher.fetchPairData(USDC, WETH, baseProvider);
        const route = new sdk_1.Route([pair], WETH);
        return route.midPrice.toSignificant(6); // Return price as a string with 6 significant figures
    });
}
