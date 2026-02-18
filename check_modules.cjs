const contentful = require('contentful');

const client = contentful.createClient({
    space: 'tviniqrey0w6',
    accessToken: 'JtL7koY66p_wMJ-8QOHElQkgyfpj-KK2Wz6QfAQMvc8',
    environment: 'master'
});

async function checkModules() {
    try {
        const response = await client.getEntries({
            content_type: 'courseTier',
            limit: 1
        });

        if (response.items.length > 0) {
            const tier = response.items[0];
            console.log('Tier Name:', tier.fields.tier);
            console.log('Modules Type:', typeof tier.fields.modules);
            console.log('Modules Content:', JSON.stringify(tier.fields.modules, null, 2));
        } else {
            console.log('No tiers found.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

checkModules();
