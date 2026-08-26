const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");
const { sendClientWelcome } = require("./clientWelcome");

test("welcome handles SMTP acceptance, missing configuration and failure", async () => {
  const client = { businessName: "Prueba", contacts: [{ name: "Ana Pérez", email: "ana@example.test" }] };
  assert.equal((await sendClientWelcome(client, { transporter: null })).status, "not_configured");
  let sent;
  assert.equal((await sendClientWelcome(client, { from: "equipo@example.test", transporter: { sendMail: async (mail) => { sent = mail; return { accepted: [mail.to] }; } } })).status, "sent");
  assert.equal(sent.to, "ana@example.test");
  assert.match(sent.text, /Ana Pérez/);
  assert.equal((await sendClientWelcome(client, { transporter: { sendMail: async () => { throw new Error("SMTP rejected"); } } })).status, "failed");
  assert.equal((await sendClientWelcome(client, { transporter: { sendMail: async () => ({ accepted: [] }) } })).status, "failed");
});

test("client preferences survive create, read and edit; SMTP failure does not lose client", async (t) => {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), "hub-client-test-"));
  const server = net.createServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const port = server.address().port;
  await new Promise((resolve) => server.close(resolve));
  const child = spawn(process.execPath, [path.join(__dirname, "index.js")], {
    cwd: dir,
    env: { PATH: process.env.PATH, NODE_ENV: "development", PORT: String(port), GIOVSOFT_DATA_DIR: dir, ADMIN_2FA_ENABLED: "false" },
    stdio: "ignore",
  });
  t.after(async () => {
    const stopped = new Promise((resolve) => child.once("exit", resolve));
    child.kill("SIGTERM");
    await stopped;
    // Only the isolated fixture directory created above is removed.
    await fs.rm(dir, { recursive: true, force: true });
  });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base + "/api/health")).ok) { ready = true; break; } } catch {}
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  assert.ok(ready, "isolated API started");
  const login = await fetch(base + "/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: "dev@giovsoft.com", password: "GiovSoftDev2026!" }) });
  const { token } = await login.json();
  assert.ok(token);
  const headers = { "content-type": "application/json", Authorization: `Bearer ${token}` };
  const preferences = { industry: "Retail", companySize: "11-50", executive: "Giovanni Ramos", category: "Premium", sendWelcomeEmail: true };
  const response = await fetch(base + "/api/admin/clients", { method: "POST", headers, body: JSON.stringify({ businessName: "Fixture", preferences, notes: "Nota", primaryService: "Business", status: "inactive", contacts: [{ name: "Ana Pérez", email: "ana@example.test" }] }) });
  assert.equal(response.status, 201);
  const { client } = await response.json();
  assert.equal(client.preferences.welcomeEmail.status, "not_configured");
  const list = await (await fetch(base + "/api/admin/clients", { headers })).json();
  const saved = list.clients.find((item) => item.id === client.id);
  for (const key of Object.keys(preferences)) assert.equal(saved.preferences[key], preferences[key]);
  assert.equal(saved.primaryService, "Business");
  assert.equal(saved.status, "inactive");
  assert.equal(saved.notes, "Nota");
  const edited = await (await fetch(base + "/api/admin/clients/" + client.id, { method: "PATCH", headers, body: JSON.stringify({ notes: "", preferences: { industry: "Servicios", category: "" } }) })).json();
  assert.equal(edited.client.notes, "");
  assert.equal(edited.client.preferences.industry, "Servicios");
  assert.equal(edited.client.preferences.category, "");
  assert.equal(edited.client.preferences.companySize, "11-50");
  assert.equal(edited.client.preferences.welcomeEmail.status, "not_configured");
});
