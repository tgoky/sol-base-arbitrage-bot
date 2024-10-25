// src/basePrice.ts

import { Fetcher, Route, Token } from '@uniswap/sdk';
import { ethers } from 'ethers';

// Base (Ethereum L2) connection setup
const baseProvider = new ethers.providers.JsonRpcProvider('https://rpc.base.org');

// USDC and WETH Token on Base (replace with correct addresses)
const USDC = new Token(1, 'USDC_CONTRACT_ADDRESS', 6);
const WETH = new Token(1, 'WETH_CONTRACT_ADDRESS', 18);

// Function to fetch price on Uniswap for Base
export async function getBasePrice() {
    const pair = await Fetcher.fetchPairData(USDC, WETH, baseProvider);
    const route = new Route([pair], WETH);
    return route.midPrice.toSignificant(6);
}
