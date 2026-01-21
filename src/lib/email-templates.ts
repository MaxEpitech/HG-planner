// Email template for certificate notification
export const certificateEmailTemplate = (data: {
    athleteName: string;
    competitionName: string;
    certificateId: string;
    downloadUrl: string;
}) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre Certificat Highland Games</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #0f172a;">
  <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
    
    <!-- Header -->
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="font-size: 48px; margin-bottom: 16px;">🏴</div>
      <h1 style="color: #10b981; margin: 0; font-size: 24px;">Highland Games Europe</h1>
    </div>

    <!-- Main Content -->
    <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 16px; padding: 32px; border: 2px solid #10b981;">
      
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="font-size: 64px; margin-bottom: 16px;">📜</div>
        <h2 style="color: #fbbf24; margin: 0 0 8px 0; font-size: 28px;">Certificat Disponible !</h2>
        <p style="color: #cbd5e1; margin: 0; font-size: 16px;">Félicitations pour votre participation</p>
      </div>

      <div style="background-color: rgba(255, 255, 255, 0.05); border-radius: 12px; padding: 24px; margin-bottom: 24px;">
        <p style="color: #e2e8f0; margin: 0 0 8px 0; font-size: 14px;">Bonjour <strong style="color: #fff;">${data.athleteName}</strong>,</p>
        <p style="color: #cbd5e1; margin: 0; line-height: 1.6; font-size: 14px;">
          Votre certificat de participation pour la compétition <strong style="color: #10b981;">${data.competitionName}</strong> est maintenant disponible.
        </p>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.downloadUrl}" style="display: inline-block; background-color: #10b981; color: white; text-decoration: none; padding: 16px 32px; border-radius: 9999px; font-weight: bold; font-size: 16px;">
          📥 Télécharger mon certificat
        </a>
      </div>

      <!-- Certificate ID -->
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
        <p style="color: #64748b; margin: 0; font-size: 12px;">
          ID Certificat: <span style="font-family: monospace; color: #94a3b8;">${data.certificateId}</span>
        </p>
        <p style="color: #64748b; margin: 8px 0 0 0; font-size: 12px;">
          <a href="https://highlandgameseurope.com/verify/${data.certificateId}" style="color: #10b981; text-decoration: none;">
            Vérifier l'authenticité →
          </a>
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
      <p style="color: #64748b; margin: 0 0 8px 0; font-size: 12px;">
        Partagez votre réussite sur les réseaux sociaux !
      </p>
      <div style="margin-top: 16px;">
        <a href="https://twitter.com/intent/tweet?text=Je%20viens%20de%20participer%20à%20${encodeURIComponent(data.competitionName)}%20🏴" style="display: inline-block; margin: 0 8px; text-decoration: none; color: #10b981; font-size: 24px;">🐦</a>
        <a href="https://www.facebook.com/sharer/sharer.php?u=https://highlandgameseurope.com" style="display: inline-block; margin: 0 8px; text-decoration: none; color: #10b981; font-size: 24px;">📘</a>
        <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://highlandgameseurope.com" style="display: inline-block; margin: 0 8px; text-decoration: none; color: #10b981; font-size: 24px;">💼</a>
      </div>
    </div>

    <div style="text-align: center; margin-top: 24px;">
      <p style="color: #475569; margin: 0; font-size: 11px;">
        © 2026 Highland Games Europe. Tous droits réservés.
      </p>
    </div>

  </div>
</body>
</html>
  `.trim();
};

// Plain text version
export const certificateEmailPlainText = (data: {
    athleteName: string;
    competitionName: string;
    certificateId: string;
    downloadUrl: string;
}) => {
    return `
Highland Games Europe
🏴

Certificat Disponible !

Bonjour ${data.athleteName},

Votre certificat de participation pour la compétition ${data.competitionName} est maintenant disponible.

Télécharger votre certificat:
${data.downloadUrl}

ID Certificat: ${data.certificateId}

Vérifier l'authenticité:
https://highlandgameseurope.com/verify/${data.certificateId}

---
© 2026 Highland Games Europe
  `.trim();
};
