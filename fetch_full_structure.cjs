const contentful = require('contentful');

const client = contentful.createClient({
    space: 'tviniqrey0w6',
    accessToken: 'JtL7koY66p_wMJ-8QOHElQkgyfpj-KK2Wz6QfAQMvc8',
    environment: 'master'
});

async function fetchFullStructure() {
    try {
        console.log('--- Fetching Course ---');
        const courses = await client.getEntries({
            content_type: 'course',
            limit: 1,
            include: 2
        });

        if (courses.items.length > 0) {
            const course = courses.items[0];
            console.log('Course ID:', course.sys.id);
            console.log('Course Fields:', JSON.stringify(course.fields, null, 2));
        } else {
            console.log('No courses found.');
        }

        console.log('\n--- Fetching Course Tier ---');
        const tiers = await client.getEntries({
            content_type: 'courseTier',
            limit: 1
        });

        if (tiers.items.length > 0) {
            const tier = tiers.items[0];
            console.log('Tier ID:', tier.sys.id);
            console.log('Tier Fields:', JSON.stringify(tier.fields, null, 2));
        } else {
            console.log('No tiers found.');
        }

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchFullStructure();
