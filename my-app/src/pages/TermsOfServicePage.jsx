import React from "react";
import LegalPageLayout, { Section, Bullets } from "../components/LegalPageLayout";

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service" updated="July 8, 2026">
      <p>
        These terms govern your use of Analytico. By creating an account, you agree to them. If
        you don't agree, don't use the product. We've kept this short and specific rather than
        padded with boilerplate.
      </p>

      <Section title="1. What Analytico is">
        <p>
          Analytico is a free Facebook Page analytics dashboard with an AI growth assistant
          (GrowthBot) and content planning calendar. It reads data from a Facebook Page you
          connect and control — it never posts, comments, or changes anything on your behalf.
        </p>
      </Section>

      <Section title="2. Your account">
        <Bullets
          items={[
            "You're responsible for keeping your password secure and for activity under your account.",
            "You must be at least 13 years old to use Analytico.",
            "You must provide an email address you actually control.",
            "One account per person; don't create accounts to abuse, spam, or automate against the service.",
          ]}
        />
      </Section>

      <Section title="3. Connecting Facebook">
        <p>
          Connecting a Facebook Page is optional and requires you to be an admin of that Page.
          You can revoke Analytico's access at any time from Facebook's own settings, independent
          of anything we do. We only request read access to Page analytics — never permission to
          post, message, or moderate on your behalf.
        </p>
      </Section>

      <Section title="4. AI features">
        <p>
          GrowthBot's advice and the AI-generated calendar are produced by a third-party AI model
          based on your analytics and what you type. They're suggestions, not guarantees —
          they can be wrong, generic, or not fit your situation. You're responsible for reviewing
          anything before you act on it or post it publicly.
        </p>
      </Section>

      <Section title="5. Acceptable use">
        <p>Don't use Analytico to:</p>
        <Bullets
          items={[
            "Break the law, or violate Meta's or Anthropic's own terms of service.",
            "Try to access another user's account or data.",
            "Attempt to disrupt, overload, or reverse-engineer the service.",
            "Connect a Facebook Page you're not authorized to manage.",
          ]}
        />
        <p>We can suspend or terminate accounts that do any of the above.</p>
      </Section>

      <Section title="6. No cost, no warranty">
        <p>
          Analytico is free — there are no paid plans. It's provided "as is," without warranties
          of any kind. We're a small, early-stage project: expect occasional bugs, downtime, or
          incomplete features. We're not liable for losses arising from your use of the service,
          to the maximum extent the law allows.
        </p>
      </Section>

      <Section title="7. Ending your account">
        <p>
          You can stop using Analytico and request account deletion at any time — see our{" "}
          <a href="/data-deletion" className="text-orange-400 hover:text-orange-300">
            Data Deletion
          </a>{" "}
          page. We may suspend or remove accounts that violate these terms.
        </p>
      </Section>

      <Section title="8. Changes">
        <p>
          We may update these terms as the product changes. We'll update the date at the top of
          this page when we do. Continuing to use Analytico after a change means you accept the
          updated terms.
        </p>
      </Section>

      <Section title="9. Contact">
        <p>
          Questions about these terms:{" "}
          <a href="mailto:anvimsiddabhattuni@gmail.com" className="text-orange-400 hover:text-orange-300">
            anvimsiddabhattuni@gmail.com
          </a>
        </p>
      </Section>
    </LegalPageLayout>
  );
}
