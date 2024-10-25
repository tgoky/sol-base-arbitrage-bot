// src/index.ts

import { checkForCrossChainArbitrage } from './arbitrage';

async function startArbitrageBot() {
    while (true) {
        try {
            await checkForCrossChainArbitrage();
        } catch (error) {
            console.error('Error during arbitrage check:', error);
        }
        // Poll every minute (adjust as necessary)
        await new Promise(resolve => setTimeout(resolve, 60000));
    }
}

// Start the arbitrage bot
startArbitrageBot();
