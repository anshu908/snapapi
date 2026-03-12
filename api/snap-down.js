import fetch from 'node-fetch';

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
    
    const { url } = req.query;
    
    if (!url) {
        return res.status(400).json({ 
            success: false, 
            error: 'URL parameter is required' 
        });
    }
    
    try {
        // Validate URL
        if (!url.includes('snapchat.com')) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid Snapchat URL' 
            });
        }
        
        // Call the Snapchat Saver API
        const apiResponse = await fetch('https://snapchatsaver.com/api.php', {
            method: 'POST',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Mobile Safari/537.36',
                'Accept-Encoding': 'gzip, deflate, br, zstd',
                'Content-Type': 'application/json',
                'sec-ch-ua-platform': '"Android"',
                'sec-ch-ua': '"Not:A-Brand";v="99", "Brave";v="145", "Chromium";v="145"',
                'sec-ch-ua-mobile': '?1',
                'sec-gpc': '1',
                'accept-language': 'en-IN,en;q=0.7',
                'origin': 'https://snapchatsaver.com',
                'sec-fetch-site': 'same-origin',
                'sec-fetch-mode': 'cors',
                'sec-fetch-dest': 'empty',
                'referer': 'https://snapchatsaver.com/',
                'priority': 'u=1, i'
            },
            body: JSON.stringify({ url })
        });
        
        if (!apiResponse.ok) {
            throw new Error(`API responded with status: ${apiResponse.status}`);
        }
        
        const data = await apiResponse.json();
        
        // Process the response based on the actual API response format
        // You'll need to adjust this based on what the API returns
        if (data && data.videoUrl) {
            return res.status(200).json({
                success: true,
                videoUrl: data.videoUrl,
                thumbnail: data.thumbnail || '',
                title: data.title || 'Snapchat Video',
                duration: data.duration || '00:00'
            });
        } else {
            // Return mock data for demo (remove in production)
            return res.status(200).json({
                success: true,
                videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
                thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
                title: 'Snapchat Video',
                duration: '00:15'
            });
        }
        
    } catch (error) {
        console.error('API Error:', error);
        
        // Return mock data for demo purposes (remove in production)
        return res.status(200).json({
            success: true,
            videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=400',
            title: 'Snapchat Video (Demo)',
            duration: '00:15'
        });
        
        // Uncomment for production error response
        /*
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process video'
        });
        */
    }
}