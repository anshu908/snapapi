// API endpoint using the working service
export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({
            success: false,
            error: 'Method not allowed'
        });
    }

    try {
        const { url } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                error: 'URL parameter is required'
            });
        }

        // Validate URL
        if (!url.includes('snapchat.com')) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Snapchat URL'
            });
        }

        // Call the working API
        const apiUrl = `https://snapapi.asapiservices.workers.dev/api/snap-down?url=${encodeURIComponent(url)}`;
        
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
        return res.status(200).json({
            success: true,
            thumbnail: data.thumbnail,
            downloadUrl: data.downloadUrl,
            mediaList: data.mediaList || [],
            title: 'Snapchat Video',
            duration: '00:15'
        });

    } catch (error) {
        console.error('API Error:', error);
        
        return res.status(500).json({
            success: false,
            error: 'Failed to process video. Please try again.'
        });
    }
}
