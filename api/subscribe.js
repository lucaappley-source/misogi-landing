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

const redactEmailForLogs = (email) => {
  if (typeof email !== "string") return "";
  const trimmed = email.trim();
  const at = trimmed.indexOf("@");
  if (at <= 1) return "***";
  const domain = trimmed.slice(at + 1);
  return `${trimmed[0]}***@${domain}`;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { error: "Method not allowed" });
  }

  const { BEEHIIV_API_KEY, BEEHIIV_PUBLICATION_ID } = process.env;
  const publicationId = normalizePublicationId(BEEHIIV_PUBLICATION_ID);
  const requestId = req.headers["x-vercel-id"] || req.headers["x-request-id"] || "";

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
    console.log("[subscribe] start", { requestId, publicationId, email: redactEmailForLogs(email) });
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
    console.log("[subscribe] beehiiv response", {
      requestId,
      ok: upstream.ok,
      status: upstream.status,
      bodyKeys: upstreamJson && typeof upstreamJson === "object" ? Object.keys(upstreamJson) : null,
    });

    if (!upstream.ok) {
      const message =
        upstreamJson?.message ||
        upstreamJson?.error ||
        (Array.isArray(upstreamJson?.errors) ? upstreamJson.errors.map((e) => e?.message).filter(Boolean).join(", ") : "") ||
        "Beehiiv subscription failed.";

      return json(res, upstream.status, { error: message, requestId });
    }

    const data = upstreamJson?.data || upstreamJson;
    const subscriberStatus = data?.status || null;

    console.log("[subscribe] subscriber status", {
      requestId,
      subscriberStatus,
      subscriberId: data?.id || null,
    });

    // Beehiiv returns 201 even for "validating" / "invalid" emails.
    // Treat those as soft failures so the UI can inform the user.
    if (subscriberStatus === "invalid") {
      return json(res, 422, {
        error: "That email couldn't be verified. Please check for typos or use a different address.",
        requestId,
        beehiiv: { id: data?.id || null, status: subscriberStatus },
      });
    }

    if (subscriberStatus === "validating") {
      return json(res, 200, {
        ok: true,
        pending: true,
        requestId,
        beehiiv: { id: data?.id || null, status: subscriberStatus },
      });
    }

    return json(res, 200, {
      ok: true,
      requestId,
      beehiiv: {
        id: data?.id || null,
        status: subscriberStatus,
      },
    });
  } catch {
    return json(res, 502, { error: "Failed to reach Beehiiv. Please try again.", requestId });
  }
}

