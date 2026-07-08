import React from "react";
import LegalPageLayout, { Section, Bullets } from "../components/LegalPageLayout";

export default function DataDeletionPage() {
  return (
    <LegalPageLayout title="Data Deletion" updated="July 8, 2026">
      <p>
        You can delete your Analytico account and everything in it at any time. Here's exactly
        what that removes, and how to request it.
      </p>

      <Section title="How to request deletion">
        <p>
          Email{" "}
          <a href="mailto:anvimsiddabhattuni@gmail.com?subject=Delete%20my%20Analytico%20account" className="text-orange-400 hover:text-orange-300">
            anvimsiddabhattuni@gmail.com
          </a>{" "}
          from the address your account is registered under, with the subject "Delete my
          Analytico account." We'll confirm and delete your data within 30 days — in practice,
          almost always much sooner.
        </p>
      </Section>

      <Section title="What gets deleted">
        <Bullets
          items={[
            "Your account (email and password hash).",
            "Your connected Facebook access token, if you connected a Page.",
            "Everything in your content calendar.",
            "Your saved company name and objective.",
          ]}
        />
        <p>
          This is permanent — we can't restore a deleted account. It does not delete anything
          from your actual Facebook Page; Analytico only ever had read access to it, and never
          stored a copy of your posts or Page content.
        </p>
      </Section>

      <Section title="Revoking Facebook access separately">
        <p>
          If you just want to disconnect Analytico from your Facebook Page without deleting your
          Analytico account entirely, you can do that directly from Facebook, independent of us:
        </p>
        <Bullets
          items={[
            "Go to Facebook → Settings & Privacy → Settings → Apps and Websites.",
            "Find Analytico in the list and click Remove.",
          ]}
        />
        <p>
          This immediately revokes our access on Meta's side. Your Analytico account will still
          exist, showing demo data until you connect a Page again or request full deletion above.
        </p>
      </Section>
    </LegalPageLayout>
  );
}
