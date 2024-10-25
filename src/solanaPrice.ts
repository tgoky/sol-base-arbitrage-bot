import { Connection, PublicKey } from '@solana/web3.js';
import { Jupiter, TOKEN_LIST_URL } from '@jup-ag/core';

// Solana connection setup
const solanaConnection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Fetch the token list for use in Jupiter
async function getTokenList() {
    const response = await fetch(TOKEN_LIST_URL['mainnet-beta']);
    const tokenList = await response.json();
    return tokenList;
}

// Get price from Jupiter for a given input/output pair
export async function getJupiterPrice(inputMint: string, outputMint: string, amount: number) {
    const tokenList = await getTokenList();
    
    // Initialize the Jupiter client
    const jupiter = await Jupiter.load({
        connection: solanaConnection,
        cluster: 'mainnet-beta',
        user: null, // No need for a wallet for just price fetching
    });
    
    // Find the tokens in the token list
    const inputToken = tokenList.find(token => token.address === inputMint);
    const outputToken = tokenList.find(token => token.address === outputMint);

    // Quote the swap
    const routes = await jupiter.computeRoutes({
        inputMint: new PublicKey(inputMint),
        outputMint: new PublicKey(outputMint),
        amount: amount, // Amount in smallest units (e.g., 1 USDC = 1000000 because of 6 decimals)
        slippage: 1, // 1% slippage tolerance
    });
    
    // Return the best route price
    if (routes.routesInfos.length > 0) {
        return {
            inAmount: routes.routesInfos[0].inAmount,
            outAmount: routes.routesInfos[0].outAmount,
            price: routes.routesInfos[0].outAmount / routes.routesInfos[0].inAmount,
        };
    } else {
        throw new Error('No routes found for the given pair.');
    }
}

// Example usage to get SOL/USDC price
export async function getSolanaPrice() {
    const solanaToUsdc = await getJupiterPrice(
        'So11111111111111111111111111111111111111112', // SOL token address
        'EPjFWdd5AufqSSqeM2qB8R4RWNpkJGm7rZZxW1tKGrg', // USDC token address
        1000000000 // 1 SOL = 1,000,000,000 lamports
    );
    return solanaToUsdc;
}
