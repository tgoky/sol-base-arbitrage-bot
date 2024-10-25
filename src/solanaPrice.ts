import { Connection } from '@solana/web3.js';

// Solana connection setup
const solanaConnection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Function to get the price of a token pair from Birdeye
export async function getBirdeyePrice(inputMint: string, outputMint: string) {
    try {
        const response = await fetch(`https://api.birdeye.so/v1/prices?baseMint=${inputMint}&quoteMint=${outputMint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const priceData = await response.json();

        // Log the entire response structure for debugging
        console.log(JSON.stringify(priceData, null, 2));

        // Check the structure of the price response
        if (priceData && priceData.data && priceData.data.length > 0) {
            return {
                inAmount: priceData.data[0].inputAmount, // Example key, adjust based on actual response
                outAmount: priceData.data[0].outputAmount, // Example key, adjust based on actual response
                price: Number(priceData.data[0].outputAmount) / Number(priceData.data[0].inputAmount), // Adjust calculation as needed
            };
        } else {
            throw new Error('No prices found for the given pair.');
        }
    } catch (error) {
        console.error("Error fetching price:", error);
        throw error;
    }
}

// Function to get Solana price
export async function getSolanaPrice() {
    const inputMint = 'YOUR_FHRNAL_MINT_ADDRESS'; // Replace with your actual FHRNAL mint address
    const outputMint = 'So11111111111111111111111111111111111111112'; // SOL mint address
    return await getBirdeyePrice(inputMint, outputMint);
}

// Example usage to get the price between two tokens
export async function getTokenPriceOnSolana(inputMint: string, outputMint: string) {
    return await getBirdeyePrice(inputMint, outputMint);
}

// Define input and output mint addresses at a broader scope
const inputMint = 'YOUR_FHRNAL_MINT_ADDRESS'; // Replace with your actual FHRNAL mint address
const outputMint = 'So11111111111111111111111111111111111111112'; // SOL mint address

// Call the function to get the price
getTokenPriceOnSolana(inputMint, outputMint)
    .then(priceInfo => {
        console.log('Price Info:', priceInfo);
    })
    .catch(error => {
        console.error('Error fetching token price:', error);
    });
