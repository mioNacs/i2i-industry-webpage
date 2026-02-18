const contentful = require('contentful');

const client = contentful.createClient({
    space: 'tviniqrey0w6',
    accessToken: 'JtL7koY66p_wMJ-8QOHElQkgyfpj-KK2Wz6QfAQMvc8', // Using the read-only token from .env.local
    environment: 'master'
});

async function fetchData() {
    try {
        const response = await client.getEntries({
            content_type: 'course',
            include: 2 // Include linked entries (tiers)
        });

        if (response.items.length > 0) {
            const course = response.items[0];
            console.log('Course Title:', course.fields.title);
            console.log('Overview Points:', course.fields.overviewPoints);

            if (course.fields.tiers) {
                console.log('\nTiers:');
                course.fields.tiers.forEach(tier => {
                    console.log(`- ${tier.fields.title} (${tier.fields.tier})`);
                    console.log(`  Duration: ${tier.fields.durationMonths}`);
                    console.log(`  Fees: ${tier.fields.programFees}`);
                    console.log(`  Modules: ${tier.fields.modules}`);
                });
            } else {
                console.log('No tiers found linked to this course.');
            }

        } else {
            console.log('No courses found.');
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchData();
