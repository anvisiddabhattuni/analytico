import logging
import os

logger = logging.getLogger(__name__)


def _verify_url(token: str) -> str:
    frontend = os.environ.get("FRONTEND_URL", "http://localhost:3001")
    return f"{frontend}/verify-email?token={token}"


def _html_body(verify_url: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#08070b;font-family:'DM Sans',sans-serif;color:#fff;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:48px 16px;">
      <table width="480" cellpadding="0" cellspacing="0"
        style="background:#15131c;border:1px solid rgba(255,255,255,0.08);border-radius:24px;overflow:hidden;">
        <!-- Header glow strip -->
        <tr><td style="height:4px;background:linear-gradient(90deg,#fb923c,#f97316,#ef4444);"></td></tr>
        <tr><td style="padding:40px 40px 32px;">
          <!-- Logo wordmark -->
          <p style="margin:0 0 32px;font-family:Syne,sans-serif;font-size:20px;font-weight:700;
                    background:linear-gradient(135deg,#fb923c,#ef4444);-webkit-background-clip:text;
                    -webkit-text-fill-color:transparent;">Analytico</p>
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;line-height:1.3;">
            Confirm your email address
          </h1>
          <p style="margin:0 0 32px;font-size:15px;line-height:1.6;color:rgba(255,255,255,0.55);">
            You're almost there. Click the button below to verify your email and start tracking
            your Meta analytics.
          </p>
          <!-- CTA button -->
          <a href="{verify_url}"
            style="display:inline-block;padding:14px 32px;
                   background:linear-gradient(135deg,#fb923c,#f97316,#ef4444);
                   color:#08070b;font-size:15px;font-weight:700;text-decoration:none;
                   border-radius:100px;">
            Verify email
          </a>
          <p style="margin:32px 0 0;font-size:12px;color:rgba(255,255,255,0.25);line-height:1.6;">
            This link expires in 24 hours. If you didn't create an Analytico account, you can
            safely ignore this email.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""


def send_verification_email(to_email: str, token: str) -> None:
    url = _verify_url(token)
    api_key = os.environ.get("RESEND_API_KEY", "").strip()

    if not api_key:
        # Dev fallback — print link so you can click it without a real email service
        logger.info(
            "\n" + "=" * 64 +
            f"\n  VERIFICATION LINK for {to_email}\n  {url}\n" +
            "=" * 64
        )
        return

    try:
        import resend  # pip install resend
        resend.api_key = api_key
        from_addr = os.environ.get("EMAIL_FROM", "Analytico <onboarding@resend.dev>")
        resend.Emails.send({
            "from": from_addr,
            "to": [to_email],
            "subject": "Confirm your Analytico account",
            "html": _html_body(url),
        })
        logger.info(f"Verification email sent to {to_email}")
    except Exception as exc:
        logger.error(f"Failed to send verification email: {exc}")
        logger.info(f"Fallback verification link: {url}")
