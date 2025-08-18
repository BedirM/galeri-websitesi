// Vercel Serverless Function for Contact Form
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message, _csrf } = req.body;

    // Basic validation
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Here you would typically:
    // 1. Send email using a service like SendGrid, Mailgun, or Nodemailer
    // 2. Save to database
    // 3. Send notification to admin

    // Example email sending (you'd need to set up an email service)
    const emailData = {
      to: 'mujdeauto@gmail.com',
      from: 'noreply@mujdeauto.com',
      subject: `Yeni İletişim Formu: ${subject || 'Genel'}`,
      html: `
        <h2>Yeni İletişim Formu</h2>
        <p><strong>Ad Soyad:</strong> ${name}</p>
        <p><strong>E-posta:</strong> ${email}</p>
        <p><strong>Telefon:</strong> ${phone}</p>
        <p><strong>Konu:</strong> ${subject || 'Belirtilmemiş'}</p>
        <p><strong>Mesaj:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Bu mesaj MÜJDE AUTO web sitesinden gönderilmiştir.</small></p>
      `
    };

    // For now, just log the data
    console.log('Contact Form Submission:', {
      name,
      email,
      phone,
      subject,
      message,
      timestamp: new Date().toISOString()
    });

    // In production, you would send the email here
    // await sendEmail(emailData);

    res.status(200).json({ 
      success: true, 
      message: 'Mesajınız başarıyla gönderildi!' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ 
      error: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' 
    });
  }
} 