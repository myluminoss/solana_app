import { createRouter, createWebHistory } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: import('@/views/home/MainIndex.vue')
    },
    {
        path: '/pump',
        name: 'Pump',
        component: import('@/views/pump/PumpIndex.vue')
    },
    {
        path: '/solana',
        name: 'Solana',
        component: import('@/views/solana/SolanaIndex.vue')
    },
];
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;


