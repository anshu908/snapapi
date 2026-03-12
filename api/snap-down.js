// Netlify Function format (CommonJS)
exports.handler = async function(event, context) {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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

        // For demo purposes, return mock data
        // In production, replace this with actual API call
        const mockResponse = {
            success: true,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
            title: 'Snapchat Video',
            duration: '00:15',
            quality: 'HD'
        };

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(mockResponse)
        };

    } catch (error) {
        console.error('Function error:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: 'Internal server error'
            })
        };
    }
};
