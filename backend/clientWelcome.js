// SMTP is injected so delivery can be tested without contacting real clients.
async function sendClientWelcome(client, { transporter, from }) {
  const contact = client.contacts?.[0] || {};
  if (!contact.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) {
    return { status: "failed", reason: "El contacto principal no tiene un correo válido" };
  }
  if (!transporter) return { status: "not_configured", reason: "SMTP no configurado en el servidor" };
  try {
    const result = await transporter.sendMail({
      from,
      to: contact.email,
      subject: "Bienvenido a GiovSoft",
      text: [
        `Hola ${contact.name || client.businessName},`,
        "",
        `Te damos la bienvenida a GiovSoft. Hemos registrado a ${client.businessName} como cliente.`,
        "Nuestro equipo te acompañará en la implementación y seguimiento de tus servicios.",
        "",
        "Puedes responder a este correo para comunicarte con nosotros.",
        "Equipo GiovSoft",
      ].join("\n"),
    });
    if (!result.accepted?.length) return { status: "failed", reason: "El servidor de correo no aceptó el destinatario" };
    return { status: "sent", sentAt: new Date().toISOString() };
  } catch {
    return { status: "failed", reason: "No fue posible enviar el correo; revisa la configuración SMTP" };
  }
}
module.exports = { sendClientWelcome };
