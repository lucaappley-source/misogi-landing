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

const normalizePublicationId = (value) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (/^pub_[0-9a-fA-F-]+$/.test(trimmed)) return trimmed;
  if (/^[0-9a-fA-F-]{36}$/.test(trimmed)) return `pub_${trimmed}`;
  return trimmed;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const { BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID } = process.env;
  const publicationId = normalizePublicationId(BEEHIIV_PUBLICATION_ID);

  if (!BEEHIIV_API_KEY || !publicationId) {
    return json(res, 500, {
      error: "Server is missing Beehiiv configuration.",
    });
  }

  if (!/^pub_[0-9a-fA-F-]+$/.test(publicationId)) {
    return json(res, 500, {
      error: 'Invalid Beehiiv publication id. Expected format "pub_<uuid>".',
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
    const upstream = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
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

