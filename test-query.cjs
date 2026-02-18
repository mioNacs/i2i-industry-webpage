
const fs = require('fs');
const path = require('path');

// Load environment variables manually
const envPath = path.resolve(__dirname, '.env.local');
const envConfig = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        envVars[key.trim()] = value.trim().replace(/"/g, ''); // Remove quotes if present
    }
});

const space = envVars.NEXT_PUBLIC_CONTENTFUL_SPACE_ID;
const accessToken = envVars.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN;

async function testFetch() {
    const id = '75Uq1K9sMAoVz6l1HHvJaW';
    const query = `query {
      job(id: "${id}") {
        sys { id }
        name
        jobOverview
      }
    }`;

    console.log(`Space: ${space}`);
    console.log(`Token: ${accessToken ? 'Found' : 'Missing'}`);

    try {
        const response = await fetch(
            `https://graphql.contentful.com/content/v1/spaces/${space}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ query }),
            }
        );

        const json = await response.json();
        console.log('Response:', JSON.stringify(json, null, 2));
    } catch (error) {
        console.error('Fetch Error:', error);
    }
}

testFetch();
