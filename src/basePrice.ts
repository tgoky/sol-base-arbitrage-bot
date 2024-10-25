import { Fetcher, Route, Token } from '@uniswap/sdk';
import { JsonRpcProvider } from '@ethersproject/providers';

// Base (Ethereum L2) connection setup using @ethersproject provider
const baseProvider = new JsonRpcProvider('https://rpc.base.org');

// USDC and WETH Token on Base (replace with correct addresses)
const USDC = new Token(1, 'USDC_CONTRACT_ADDRESS', 6);
const WETH = new Token(1, 'WETH_CONTRACT_ADDRESS', 18);

// Function to fetch price on Uniswap for Base
export async function getBasePrice() {
    const pair = await Fetcher.fetchPairData(USDC, WETH, baseProvider);
    const route = new Route([pair], WETH);
    return route.midPrice.toSignificant(6); // Return price as a string with 6 significant figures
}
