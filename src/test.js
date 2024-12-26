const {SolanaAgentKit} = require("solana-agent-kit");


const privateKey = '2nQKdYmXMq2x5SS8DN7Vk7qNBQv5Si96pYPGfGQizrUcLkv2GiXnAuyj8RqTtSTsASK6CSKi6j9g8GFnQV7iFrWx';
// Initialize with private key and optional RPC URL
agent = new SolanaAgentKit(
    privateKey,
    "https://api.devnet.solana.com"
);

const opt = {
    initialLiquiditySOL: 1000,
    priorityFee: 100,
    slippageBps: 9,
    telegram: 'https://me.foija',
    twitter: 'https://me.foija',
    website: 'https://me.foija'
};
const r = agent.launchPumpFunToken(
    'My Test Token', 'Lmtt', 'xi xi ha ha', 'https://gangdanai.oss-cn-hongkong.aliyuncs.com/images/vip.png',
    opt
);
console.log(r)

// Mint public key: 57dFxie69dYGHvpqJZp2K4iVKay1RWUwzbPkF4CRy5t8
// Mint public key: FoiYqGGFtmmQwjmy3vdXBeYkpbHbc6TU6xJj2xXUy54D
// Mint public key: 6Zy8nnAZsQDHVxSHaSaMpQPrJbzxmyaSq8avdjEqg1eL

