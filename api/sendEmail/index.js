const { EmailClient } = require("@azure/communication-email");

const connectionString = process.env.ACS_CONNECTION_STRING; // put this in your SWA secrets
const emailClient = new EmailClient(connectionString);

module.exports = async function (context, req) {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            context.res = { status: 400, body: "Missing required fields" };
            return;
        }

        const emailMessage = {
            sender: "no-reply@syedrious.cloud", // the domain you verified
            content: {
                subject: `New message from ${name}`,
                plainText: `From: ${name} <${email}>\n\n${message}`,
                html: `<p>From: <strong>${name}</strong> &lt;${email}&gt;</p><p>${message}</p>`
            },
            recipients: {
                to: [
                    { email: "syedyangsebenar@gmail.com" } // your inbox
                ]
            }
        };

        const poller = await emailClient.beginSend(emailMessage);
        await poller.pollUntilDone();

        context.res = { status: 200, body: "Email sent successfully!" };
    } catch (err) {
        console.error(err);
        context.res = { status: 500, body: "Error sending email" };
    }
};
