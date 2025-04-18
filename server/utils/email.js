const nodemailer = require('nodemailer');

// Im Entwicklungsmodus nur in der Konsole ausgeben
const isDevelopment = process.env.NODE_ENV === 'development';

// Transporter konfigurieren
let transporter;

if (!isDevelopment) {
  // Für Produktionsumgebung konfigurieren (hier ein Beispiel für SMTP)
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
}

// E-Mail-Versand (oder Simulation im Entwicklungsmodus)
const sendEmail = async ({ to, subject, text, html }) => {
  // E-Mail-Objekt
  const mailOptions = {
    from: process.env.EMAIL_FROM || 'info@lockenroll.de',
    to,
    subject,
    text,
    html
  };

  try {
    if (isDevelopment) {
      // Im Entwicklungsmodus nur in der Konsole ausgeben
      console.log('========= ENTWICKLUNGSMODUS: E-MAIL =========');
      console.log('An:', to);
      console.log('Betreff:', subject);
      console.log('Text:', text);
      console.log('HTML:', html);
      console.log('============================================');
      return { success: true, info: 'E-Mail in der Konsole ausgegeben (Entwicklungsmodus)' };
    } else {
      // In der Produktionsumgebung wirklich versenden
      const info = await transporter.sendMail(mailOptions);
      return { success: true, info };
    }
  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error);
    return { success: false, error: error.message };
  }
};

// E-Mail-Vorlagen
const templates = {
  // Terminbestätigung
  appointmentConfirmation: (appointment) => {
    const { customer, service, staff, date, startTime } = appointment;
    const formattedDate = new Date(date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    return {
      subject: 'Terminbestätigung - Locken\'Roll Friseursalon',
      text: `Hallo ${customer.name},

vielen Dank für deine Terminbuchung bei Locken'Roll!

Termin-Details:
- Datum: ${formattedDate}
- Uhrzeit: ${startTime} Uhr
- Dienstleistung: ${service.name}
- Stylist: ${staff.name}

Falls du Fragen hast oder deinen Termin ändern möchtest, kontaktiere uns bitte unter:
- Telefon: 06431 9716744
- E-Mail: info@lockenroll.de

Wir freuen uns auf deinen Besuch!

Mit freundlichen Grüßen,
Dein Locken'Roll Team`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #e67e5a; color: white; padding: 10px; text-align: center; }
    .details { margin: 20px 0; }
    .footer { margin-top: 30px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Locken'Roll Terminbestätigung</h1>
    </div>
    
    <p>Hallo ${customer.name},</p>
    
    <p>vielen Dank für deine Terminbuchung bei Locken'Roll!</p>
    
    <div class="details">
      <h3>Termin-Details:</h3>
      <ul>
        <li><strong>Datum:</strong> ${formattedDate}</li>
        <li><strong>Uhrzeit:</strong> ${startTime} Uhr</li>
        <li><strong>Dienstleistung:</strong> ${service.name}</li>
        <li><strong>Stylist:</strong> ${staff.name}</li>
      </ul>
    </div>
    
    <p>Falls du Fragen hast oder deinen Termin ändern möchtest, kontaktiere uns bitte unter:</p>
    <ul>
      <li>Telefon: 06431 9716744</li>
      <li>E-Mail: <a href="mailto:info@lockenroll.de">info@lockenroll.de</a></li>
    </ul>
    
    <p>Wir freuen uns auf deinen Besuch!</p>
    
    <p>Mit freundlichen Grüßen,<br>
    Dein Locken'Roll Team</p>
    
    <div class="footer">
      <p>Locken'Roll Friseursalon | Grabenstraße 39 | 65549 Limburg</p>
    </div>
  </div>
</body>
</html>
`
    };
  },
  
  // Kontaktformular-Weiterleitung
  contactForm: (data) => {
    const { name, email, message } = data;
    
    return {
      subject: 'Neue Kontaktanfrage - Locken\'Roll Website',
      text: `Neue Kontaktanfrage von der Website:

Name: ${name}
E-Mail: ${email}
Nachricht:
${message}`,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #e67e5a; color: white; padding: 10px; text-align: center; }
    .message { margin: 20px 0; padding: 10px; background-color: #f9f9f9; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Neue Kontaktanfrage</h1>
    </div>
    
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>E-Mail:</strong> ${email}</p>
    
    <div class="message">
      <h3>Nachricht:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  </div>
</body>
</html>
`
    };
  }
};

module.exports = {
  sendEmail,
  templates
}; 