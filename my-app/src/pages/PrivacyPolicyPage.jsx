import React from "react";
import LegalPageLayout, { Section, Bullets } from "../components/LegalPageLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" updated="July 8, 2026">
      <p>
        Analytico ("we," "us," "our") provides a Facebook Page analytics dashboard and AI growth
        assistant. This policy explains what we collect, why, and what control you have over it.
        We've tried to write it in plain language rather than legal boilerplate — if anything is
        unclear, email us at{" "}
        <a href="mailto:anvimsiddabhattuni@gmail.com" className="text-orange-400 hover:text-orange-300">
          anvimsiddabhattuni@gmail.com
        </a>.
      </p>

      <Section title="1. What we collect">
        <p>Directly from you:</p>
        <Bullets
          items={[
            "Email address and password (we store a one-way hash of your password, never the password itself).",
            "Anything you type into GrowthBot or add to your content calendar.",
            "Your stated company name and objective, if you fill in the Objective tab.",
          ]}
        />
        <p>From Meta, only if you choose to connect a Facebook Page:</p>
        <Bullets
          items={[
            "A long-lived access token that lets us read (not post to) your Page.",
            "Page-level metrics: follower/fan counts, reach, impressions, and engagement. We do not receive personal data about the people who follow or interact with your Page — only aggregate Page statistics.",
          ]}
        />
        <p>Automatically, via our hosting providers:</p>
        <Bullets
          items={[
            "Standard server request logs (IP address, timestamps, browser type) collected by our infrastructure providers (Render, Vercel, Cloudflare) for security and reliability — we don't use this for tracking or advertising.",
          ]}
        />
        <p>
          We don't use tracking cookies. Your login session is kept in your browser's local
          storage, not a cookie, and exists only to keep you signed in.
        </p>
      </Section>

      <Section title="2. How we use it">
        <Bullets
          items={[
            "To run your account and show you your Page analytics.",
            "To generate GrowthBot's advice and AI-suggested content calendar entries — this means your analytics summary and whatever you ask GrowthBot are sent to Anthropic (maker of the Claude AI model) to generate a response. Anthropic processes this to return an answer; see their policies for how they handle API data.",
            "To send you account-related email (e.g. verification) via our email provider, Resend.",
            "To keep the service secure and diagnose problems.",
          ]}
        />
        <p>
          We do not sell your data, use it for advertising, or share it with anyone beyond the
          service providers listed here who help us run Analytico.
        </p>
      </Section>

      <Section title="3. Who we share data with">
        <p>We use the following processors to run the product. Each only receives what it needs to do its job:</p>
        <Bullets
          items={[
            "Meta Platforms, Inc. — to read your connected Page's analytics via the Graph API.",
            "Anthropic — to generate GrowthBot responses and AI calendar suggestions.",
            "Supabase — hosts our database (accounts, calendar entries, objectives).",
            "Render — hosts our backend API.",
            "Vercel — hosts our frontend application.",
            "Resend — delivers account-related emails.",
          ]}
        />
      </Section>

      <Section title="4. How long we keep it">
        <p>
          We keep your data for as long as your account exists. If you ask us to delete your
          account (see our{" "}
          <a href="/data-deletion" className="text-orange-400 hover:text-orange-300">
            Data Deletion
          </a>{" "}
          page), we delete your account record, connected Facebook access token, calendar
          entries, and objective from our database.
        </p>
      </Section>

      <Section title="5. Your rights">
        <p>
          Regardless of where you live, you can ask us to access, correct, export, or delete your
          data at any time by emailing{" "}
          <a href="mailto:anvimsiddabhattuni@gmail.com" className="text-orange-400 hover:text-orange-300">
            anvimsiddabhattuni@gmail.com
          </a>. If you're in the EU/UK, this covers your rights under GDPR (access, rectification,
          erasure, restriction, portability, and objection). If you're a California resident,
          this covers your rights under the CCPA — we don't sell personal information, so there's
          nothing to opt out of on that front. You can also revoke Analytico's access to your
          Facebook Page at any time from your own Facebook settings, independent of us.
        </p>
      </Section>

      <Section title="6. Security">
        <p>
          Passwords are one-way hashed, never stored in plain text. All traffic between your
          browser and our servers is encrypted in transit (HTTPS). No system is perfectly secure,
          and we can't guarantee absolute security — but we don't take shortcuts we know about.
        </p>
      </Section>

      <Section title="7. Children">
        <p>
          Analytico isn't directed at children, and we don't knowingly collect data from anyone
          under 13. If you believe a child has created an account, email us and we'll remove it.
        </p>
      </Section>

      <Section title="8. International transfers">
        <p>
          Our infrastructure providers operate in the United States and other countries. By using
          Analytico, you understand your data may be processed outside the country you live in.
        </p>
      </Section>

      <Section title="9. Changes to this policy">
        <p>
          If we materially change how we handle your data, we'll update this page and change the
          "Last updated" date above. We won't retroactively expand our use of data you've already
          given us without telling you.
        </p>
      </Section>

      <Section title="10. Contact">
        <p>
          Questions, requests, or concerns:{" "}
          <a href="mailto:anvimsiddabhattuni@gmail.com" className="text-orange-400 hover:text-orange-300">
            anvimsiddabhattuni@gmail.com
          </a>
        </p>
      </Section>
    </LegalPageLayout>
  );
}
