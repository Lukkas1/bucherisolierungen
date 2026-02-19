// Netlify submission-created event function
// Wird automatisch ausgelöst wenn eine verifizierte Formular-Einreichung eingeht
// Sendet eine E-Mail-Benachrichtigung mit allen Formulardaten

const ANLAGENART_MAP = {
  "1": "Gas",
  "2": "Öl",
  "3": "Pellets",
  "4": "Hackschnitzel",
  "5": "Wärmepumpe",
  "6": "Kälteanlage",
  "7": "Andere"
};

exports.handler = async function(event) {
  const { payload } = JSON.parse(event.body);
  const data = payload.data;

  // E-Mail-Adresse aus Umgebungsvariable oder Standard
  const recipientEmail = process.env.NOTIFICATION_EMAIL || "info@bucher-isolierungen.de";

  const anlagenart = ANLAGENART_MAP[data.anlagenart] || data.anlagenart || "Nicht angegeben";

  // Formatierte Zusammenfassung der Formulardaten
  const summary = `
Neue Kontaktanfrage über das Kontaktformular
=============================================

Name:           ${data.vorname || ""} ${data.nachname || ""}
Adresse:        ${data.strasse || ""} ${data.hausnummer || ""}, ${data.plz || ""} ${data.stadt || ""}
Telefon:        ${data.telefonnummer || ""}
E-Mail:         ${data.email || ""}

Rohrgrößen:     ${data.rohrgroessen ? data.rohrgroessen + " mm" : "Nicht angegeben"}
Meteranzahl:    ${data.meter ? data.meter + " m" : "Nicht angegeben"}
Anlagenart:     ${anlagenart}

Anmerkung:      ${data.anmerkung || "Keine"}

---
Eingegangen am: ${new Date(payload.created_at).toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}
Formular:       ${payload.form_name}
  `.trim();

  console.log("Neue Formular-Einreichung erhalten:");
  console.log(summary);

  // Falls ein externer E-Mail-Dienst konfiguriert ist (z.B. SendGrid, Mailgun),
  // kann hier die E-Mail versendet werden.
  // Beispiel mit fetch an einen E-Mail-API-Dienst:
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: recipientEmail }] }],
          from: { email: "noreply@bucher-isolierungen.de", name: "Bucher Isolierungen Kontaktformular" },
          reply_to: { email: data.email, name: `${data.vorname} ${data.nachname}` },
          subject: `Neue Kontaktanfrage von ${data.vorname} ${data.nachname}`,
          content: [{ type: "text/plain", value: summary }]
        })
      });

      if (!response.ok) {
        console.error("SendGrid Fehler:", await response.text());
      }
    } catch (error) {
      console.error("E-Mail Versand fehlgeschlagen:", error);
    }
  }

  // Hinweis: Ohne externen E-Mail-Dienst werden die Benachrichtigungen
  // über die Netlify UI Einstellung "Form submission notifications" versendet.
  // Diese müssen unter Project configuration > Notifications konfiguriert werden.

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Submission processed" })
  };
};
