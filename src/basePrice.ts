// src/basePrice.ts

import { Fetcher, Route, Token } from '@uniswap/sdk';
import { JsonRpcProvider } from '@ethersproject/providers';

// Extend ChainId locally for Base support
enum CustomChainId {
    MAINNET = 1,
    BASE = 8453,
}

// Base connection setup using @ethersproject provider
const baseProvider = new JsonRpcProvider('https://mainnet.base.org');

// USDC and WETH Token on Base (using casting to match expected type)
const USDC = new Token(CustomChainId.BASE as unknown as number, '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', 6);
const WETH = new Token(CustomChainId.BASE as unknown as number, '0x4200000000000000000000000000000000000006', 18);

// Function to fetch the WETH price in terms of USDC on Base
export async function getBasePrice() {
    const pair = await Fetcher.fetchPairData(USDC, WETH, baseProvider);
    const route = new Route([pair], WETH);
    return route.midPrice.toSignificant(6); // WETH price in USDC (Base)
}
