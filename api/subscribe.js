const json = (res, status, body) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
};

const isValidEmail = (value) => {
  if (typeof value !== "string") return false;
  const email = value.trim();
  if (email.length < 6 || email.length > 320) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const { BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID } = process.env;

  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    return json(res, 500, {
      error: "Server is missing Beehiiv configuration.",
    });
  }

  let body;
  try {
    body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch {
    return json(res, 400, { error: "Invalid JSON body" });
  }

  const email = body?.email;
  if (!isValidEmail(email)) {
    return json(res, 400, { error: "Please enter a valid email address." });
  }

  try {
    const upstream = await fetch(`https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${BEEHIIV_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim().toLowerCase(),
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: "misogi-landing",
      }),
    });

    const upstreamJson = await upstream.json().catch(() => null);

    if (!upstream.ok) {
      const message =
        upstreamJson?.message ||
        upstreamJson?.error ||
        (Array.isArray(upstreamJson?.errors) ? upstreamJson.errors.map((e) => e?.message).filter(Boolean).join(", ") : "") ||
        "Beehiiv subscription failed.";

      return json(res, upstream.status, { error: message });
    }

    return json(res, 200, { ok: true });
  } catch {
    return json(res, 502, { error: "Failed to reach Beehiiv. Please try again." });
  }
}

