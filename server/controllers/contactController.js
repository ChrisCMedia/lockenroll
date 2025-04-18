const { sendEmail, templates } = require('../utils/email');

// Kontaktformular verarbeiten
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Eingaben validieren
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Bitte alle Felder ausfüllen'
      });
    }
    
    // E-Mail Adresse validieren (einfache Prüfung)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Bitte eine gültige E-Mail-Adresse angeben'
      });
    }
    
    // E-Mail an den Salon senden
    const emailTemplate = templates.contactForm({ name, email, message });
    const emailResult = await sendEmail({
      to: process.env.CONTACT_EMAIL || 'info@lockenroll.de',
      subject: emailTemplate.subject,
      text: emailTemplate.text,
      html: emailTemplate.html
    });
    
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Fehler beim Senden der Kontaktanfrage',
        error: emailResult.error
      });
    }
    
    res.json({
      success: true,
      message: 'Kontaktanfrage erfolgreich gesendet'
    });
  } catch (error) {
    console.error('Fehler bei der Kontaktanfrage:', error);
    res.status(500).json({
      success: false,
      message: 'Serverfehler bei der Kontaktanfrage',
      error: error.message
    });
  }
}; 