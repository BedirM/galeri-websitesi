// Email utility using SendGrid
import sgMail from '@sendgrid/mail';

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendContactEmail(formData) {
  const { name, email, phone, subject, message } = formData;

  const msg = {
    to: 'mujdeauto@gmail.com',
    from: {
      email: 'noreply@mujdeauto.com',
      name: 'MÜJDE AUTO Web Sitesi'
    },
    subject: `Yeni İletişim Formu: ${subject || 'Genel'}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff6b35; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">MÜJDE AUTO</h1>
          <p style="margin: 10px 0 0 0;">Yeni İletişim Formu</p>
        </div>
        
        <div style="padding: 20px; background: #f8f9fa;">
          <h2 style="color: #333;">Form Detayları</h2>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ff6b35;">Ad Soyad:</strong>
            <span style="margin-left: 10px;">${name}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ff6b35;">E-posta:</strong>
            <span style="margin-left: 10px;">${email}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ff6b35;">Telefon:</strong>
            <span style="margin-left: 10px;">${phone}</span>
          </div>
          
          <div style="margin-bottom: 15px;">
            <strong style="color: #ff6b35;">Konu:</strong>
            <span style="margin-left: 10px;">${subject || 'Belirtilmemiş'}</span>
          </div>
          
          <div style="margin-bottom: 20px;">
            <strong style="color: #ff6b35;">Mesaj:</strong>
            <div style="margin-top: 10px; padding: 15px; background: white; border-left: 4px solid #ff6b35;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
        
        <div style="background: #212529; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Bu mesaj MÜJDE AUTO web sitesinden gönderilmiştir.</p>
          <p style="margin: 5px 0 0 0;">Gönderim Zamanı: ${new Date().toLocaleString('tr-TR')}</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('SendGrid error:', error);
    return { success: false, error: error.message };
  }
}

export async function sendAutoReply(formData) {
  const { name, email } = formData;

  const msg = {
    to: email,
    from: {
      email: 'noreply@mujdeauto.com',
      name: 'MÜJDE AUTO'
    },
    subject: 'Mesajınız Alındı - MÜJDE AUTO',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ff6b35; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">MÜJDE AUTO</h1>
          <p style="margin: 10px 0 0 0;">Mesajınız Alındı</p>
        </div>
        
        <div style="padding: 20px;">
          <p>Sayın <strong>${name}</strong>,</p>
          
          <p>MÜJDE AUTO web sitesinden gönderdiğiniz mesaj başarıyla alınmıştır.</p>
          
          <p>En kısa sürede size dönüş yapacağız.</p>
          
          <div style="background: #f8f9fa; padding: 15px; margin: 20px 0; border-radius: 5px;">
            <h3 style="margin-top: 0; color: #ff6b35;">İletişim Bilgilerimiz</h3>
            <p><strong>Telefon:</strong> 0 (532) 333 57 94</p>
            <p><strong>E-posta:</strong> mujdeauto@gmail.com</p>
            <p><strong>Adres:</strong> Cevher Oto Center, Karacaahmet, Gaziantep</p>
          </div>
          
          <p>Teşekkürler,<br>
          <strong>MÜJDE AUTO Ekibi</strong></p>
        </div>
        
        <div style="background: #212529; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.</p>
        </div>
      </div>
    `
  };

  try {
    await sgMail.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Auto-reply error:', error);
    return { success: false, error: error.message };
  }
} 