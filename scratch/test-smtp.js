const nodemailer = require("nodemailer");

async function testSMTP() {
  const host = "smtp-relay.brevo.com";
  const user = "af6df1001@smtp-brevo.com";
  const pass = "FYGzj6VJa07mvbDs";
  const from = "GaonSe <no-reply@gaonse.com>";

  console.log("Testing credentials:");
  console.log("Host:", host);
  console.log("User:", user);
  console.log("Pass:", pass);

  const testPorts = [587, 2525, 465];
  for (const p of testPorts) {
    console.log(`\n--- Testing Port ${p} ---`);
    const transporter = nodemailer.createTransport({
      host,
      port: p,
      secure: p === 465,
      auth: {
        user,
        pass,
      },
      debug: true,
      logger: true,
    });
    try {
      console.log(`Verifying connection on port ${p}...`);
      await transporter.verify();
      console.log(`SMTP port ${p} connection verified successfully!`);
      
      console.log(`Sending a test email via port ${p}...`);
      const info = await transporter.sendMail({
        from,
        to: user, // Send to self
        subject: `GaonSe SMTP Test Connection (Port ${p})`,
        text: `This is a test email to verify that the Brevo SMTP server settings are working properly on port ${p}.`,
        html: `<p>This is a test email to verify that the <strong>Brevo SMTP server</strong> settings are working properly on port ${p}.</p>`
      });
      console.log("Email sent successfully! Message ID:", info.messageId);
      return; // Stop if success
    } catch (err) {
      console.error(`Failed on port ${p}:`, err.message);
    }
  }
  console.log("\nAll ports failed.");
}

testSMTP();
