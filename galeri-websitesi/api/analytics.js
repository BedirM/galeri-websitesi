// Vercel Serverless Function for Analytics
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Log analytics data (in production, you'd save to a database)
    console.log('Analytics Event:', {
      event: data.event,
      page: data.page,
      timestamp: new Date().toISOString(),
      sessionId: data.sessionId,
      userAgent: data.userAgent
    });

    // Here you could save to a database like:
    // - MongoDB Atlas
    // - Supabase
    // - Firebase
    // - PostgreSQL

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
} 