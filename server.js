import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Support API is running"
    });
});

/* -------------------- CRASH PROTECTION -------------------- */
process.on("uncaughtException", (err) => {
    console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
    console.error("UNHANDLED REJECTION:", err);
});

/* -------------------- HELPERS -------------------- */

function generateTicketId(prefix = "SUP") {
    return `${prefix}-${Date.now().toString(36).toUpperCase()}`;
}

async function sendDiscordWebhook(webhook, embed) {
    try {
        if (!webhook) {
            console.error("Missing webhook URL");
            return;
        }

        await axios.post(webhook, {
            embeds: [embed]
        });

    } catch (err) {
        console.error("Discord webhook error:", err.message);
    }
}

/* -------------------- HEALTH CHECK -------------------- */

app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        status: "online"
    });
});

/* -------------------- SUPPORT TICKETS -------------------- */

app.post("/api/tickets", async (req, res) => {
    try {
        const { name, email, category, message } = req.body;

        const ticketId = generateTicketId("SUP");

        await sendDiscordWebhook(process.env.DISCORD_TICKETS_WEBHOOK, {
            title: "🎫 New Support Ticket",
            color: 3447003,
            fields: [
                { name: "Ticket ID", value: ticketId, inline: true },
                { name: "Name", value: name || "Unknown", inline: true },
                { name: "Email", value: email || "Not provided", inline: true },
                { name: "Category", value: category || "General" },
                { name: "Message", value: message || "No message" }
            ],
            timestamp: new Date()
        });

        res.json({
            success: true,
            ticketId
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* -------------------- BUG REPORTS -------------------- */

app.post("/api/report-bug", async (req, res) => {
    try {
        const { name, email, title, description, version } = req.body;

        await sendDiscordWebhook(process.env.DISCORD_BUGS_WEBHOOK, {
            title: "🐞 New Bug Report",
            color: 15158332,
            fields: [
                { name: "Reporter", value: name || "Unknown" },
                { name: "Email", value: email || "Not provided" },
                { name: "Title", value: title || "Untitled" },
                { name: "Version", value: version || "Unknown" },
                { name: "Description", value: description || "No description" }
            ],
            timestamp: new Date()
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* -------------------- FEATURE REQUESTS -------------------- */

app.post("/api/feature-request", async (req, res) => {
    try {
        const { name, email, feature, details } = req.body;

        await sendDiscordWebhook(process.env.DISCORD_FEATURES_WEBHOOK, {
            title: "💡 Feature Request",
            color: 3066993,
            fields: [
                { name: "User", value: name || "Unknown" },
                { name: "Email", value: email || "Not provided" },
                { name: "Feature", value: feature || "None" },
                { name: "Details", value: details || "No details" }
            ],
            timestamp: new Date()
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* -------------------- FEEDBACK -------------------- */

app.post("/api/feedback", async (req, res) => {
    try {
        const { name, feedback } = req.body;

        await sendDiscordWebhook(process.env.DISCORD_FEEDBACK_WEBHOOK, {
            title: "⭐ User Feedback",
            color: 15844367,
            fields: [
                { name: "User", value: name || "Anonymous" },
                { name: "Feedback", value: feedback || "No feedback" }
            ],
            timestamp: new Date()
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* -------------------- BILLING -------------------- */

app.post("/api/billing", async (req, res) => {
    try {
        const { name, email, issue } = req.body;

        await sendDiscordWebhook(process.env.DISCORD_BILLING_WEBHOOK, {
            title: "💳 Billing Support",
            color: 10181046,
            fields: [
                { name: "Name", value: name || "Unknown" },
                { name: "Email", value: email || "Unknown" },
                { name: "Issue", value: issue || "No issue" }
            ],
            timestamp: new Date()
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* -------------------- SECURITY -------------------- */

app.post("/api/security", async (req, res) => {
    try {
        const { name, email, report } = req.body;

        await sendDiscordWebhook(process.env.DISCORD_SECURITY_WEBHOOK, {
            title: "🔒 Security Report",
            color: 13632027,
            fields: [
                { name: "Reporter", value: name || "Anonymous" },
                { name: "Email", value: email || "Not provided" },
                { name: "Report", value: report || "No report" }
            ],
            timestamp: new Date()
        });

        res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
});

/* -------------------- START SERVER -------------------- */

app.listen(PORT, () => {
    console.log(`Support API running on port ${PORT}`);
});
