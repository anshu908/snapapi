// Netlify Function - CommonJS format
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow GET requests
    if (event.httpMethod !== 'GET') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Method not allowed'
            })
        };
    }

    try {
        // Get URL from query parameters
        const { url } = event.queryStringParameters || {};

        if (!url) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'URL parameter is required'
                })
            };
        }

        // Validate URL
        if (!url.includes('snapchat.com')) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'Invalid Snapchat URL'
                })
            };
        }

        // Call the working API
        const apiUrl = `https://snapapi.asapiservices.workers.dev/api/snap-down?url=${encodeURIComponent(url)}`;
        
        console.log('Fetching from:', apiUrl); // For debugging
        
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();

        // Return the formatted response
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                thumbnail: data.thumbnail,
                downloadUrl: data.downloadUrl,
                mediaList: data.mediaList || [],
                title: 'Snapchat Video',
                duration: '00:15'
            })
        };

    } catch (error) {
        console.error('Function error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Failed to process video. Please try again.'
            })
        };
    }
};
