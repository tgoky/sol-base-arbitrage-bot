import { Fetcher, Route, Token } from '@uniswap/sdk';
import { JsonRpcProvider } from '@ethersproject/providers';

// Extend ChainId locally for Base support
enum CustomChainId {
    BASE = 8453,
}

// Base connection setup using @ethersproject provider
const baseProvider = new JsonRpcProvider('https://mainnet.base.org');

// Function to fetch the price of a specific token in terms of WETH
export async function getBasePrice(tokenAddress: string, decimals: number) {
    try {
        // Create token instance for the specified token
        const token = new Token(CustomChainId.BASE as unknown as number, tokenAddress, decimals);
        
        // Create a WETH token instance for the Base chain
        const WETH = new Token(CustomChainId.BASE as unknown as number, '0x4200000000000000000000000000000000000006', 18); // Update the WETH address if necessary
        
        // Fetch pair data for the token and WETH
        const pair = await Fetcher.fetchPairData(token, WETH, baseProvider);
        
        // Create a route for the trade
        const route = new Route([pair], token);
        
        // Return the price of the token in terms of WETH
        return route.midPrice.toSignificant(6); // Adjust precision as needed

    } catch (error) {
        console.error("Error fetching token price:", error);
        throw new Error("Could not fetch token price. Check token address or liquidity.");
    }
}

// Example usage
getBasePrice('0x4200000000000000000000000000000000000006', 6)
    .then(price => console.log("Price in WETH:", price))
    .catch(err => console.error(err));
