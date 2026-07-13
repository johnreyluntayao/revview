import type { Metadata } from "next";
import { Footer, NavBar } from "@/lib/client-imports";
import LegalDocument, {
  type LegalSection,
} from "@/components/ui/LegalDocument";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Review RevView's Terms & Conditions for using quizzes, progress tools, feedback features, and recommended study products.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    url: "/terms",
    title: "Terms & Conditions | RevView",
    description:
      "Understand the rules and responsibilities that apply when using RevView.",
  },
};

const termsSections: LegalSection[] = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    content: (
      <p>
        By accessing or using RevView, you agree to these Terms & Conditions and
        our Privacy Policy. If you do not agree, do not use the platform. If you
        use RevView for an organization, you confirm that you have authority to
        accept these terms on its behalf.
      </p>
    ),
  },
  {
    id: "eligibility-and-accounts",
    title: "Eligibility and accounts",
    content: (
      <>
        <p>
          You must be legally able to enter into these terms in your location.
          You are responsible for providing accurate account information,
          protecting your credentials, and for activity under your account.
        </p>
        <p>
          Tell us promptly if you suspect unauthorized access. We may restrict
          or suspend access where reasonably necessary to protect you, other
          users, or RevView.
        </p>
      </>
    ),
  },
  {
    id: "educational-service",
    title: "Educational use and exam results",
    content: (
      <>
        <p>
          RevView provides practice quizzes, explanations, progress tools,
          analytics, and study resources for educational purposes. Content may
          contain errors or become outdated, and we may revise it over time.
        </p>
        <p>
          RevView is not affiliated with or endorsed by an examination body
          unless we explicitly say otherwise. Using the platform does not
          guarantee eligibility, admission, a passing score, certification, or
          any particular exam outcome. Always verify official requirements with
          the relevant examination authority.
        </p>
      </>
    ),
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    content: (
      <>
        <p>You agree not to:</p>
        <ul>
          <li>Use RevView for unlawful, fraudulent, or harmful activity.</li>
          <li>
            Copy, scrape, republish, sell, or distribute substantial portions
            of quizzes, explanations, software, or other platform content.
          </li>
          <li>
            Circumvent security, probe for vulnerabilities, disrupt the
            service, or use automated access without permission.
          </li>
          <li>
            Impersonate another person, misuse another account, or submit
            malicious, infringing, or deceptive content.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "ownership",
    title: "Content and intellectual property",
    content: (
      <>
        <p>
          RevView and its licensors retain rights in the platform, branding,
          interface, quiz materials, explanations, and software. We grant you a
          limited, personal, non-exclusive, non-transferable, revocable right to
          use the platform for lawful study and review.
        </p>
        <p>
          You retain ownership of content you submit. You give RevView
          permission to host, process, and display that content only as needed
          to operate, secure, and improve the service. Feedback or suggestions
          may be used without obligation to you.
        </p>
      </>
    ),
  },
  {
    id: "third-party-products",
    title: "Third-party products and affiliate links",
    content: (
      <>
        <p>
          Product listings and links may lead to third-party websites. RevView
          may earn a commission from qualifying purchases, but the third party
          is responsible for its product, pricing, availability, checkout,
          delivery, returns, warranties, and customer support.
        </p>
        <p>
          Your transaction is with that third party and is governed by its terms
          and privacy practices. Review those terms before purchasing.
        </p>
      </>
    ),
  },
  {
    id: "availability",
    title: "Availability and account termination",
    content: (
      <>
        <p>
          We may add, change, pause, or discontinue features and content. We do
          not promise uninterrupted or error-free availability, and maintenance
          or events outside our control may affect access.
        </p>
        <p>
          You may stop using RevView at any time. We may suspend or terminate
          access for a material violation of these terms, security risk, legal
          requirement, or conduct that harms the platform or its users.
        </p>
      </>
    ),
  },
  {
    id: "disclaimers-and-liability",
    title: "Disclaimers and responsibility",
    content: (
      <>
        <p>
          To the extent permitted by law, RevView is provided &ldquo;as is&rdquo; and &ldquo;as
          available,&rdquo; without warranties that the content will be complete,
          accurate, or suitable for a particular purpose.
        </p>
        <p>
          To the extent permitted by law, RevView will not be responsible for
          indirect, incidental, special, consequential, or punitive loss, or for
          decisions, exam outcomes, or third-party transactions based on use of
          the platform. Rights that cannot legally be excluded remain
          unaffected.
        </p>
      </>
    ),
  },
  {
    id: "changes-and-contact",
    title: "Changes and contact",
    content: (
      <>
        <p>
          We may update these terms as RevView evolves. We will post the current
          version here with a new effective date. Continued use after an update
          takes effect means you accept the revised terms.
        </p>
        <p>
          For questions about these terms, use the support channel provided
          within RevView. Do not include passwords or sensitive credentials in
          your message.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <NavBar State="Default" title="Terms & Conditions" />
      <LegalDocument
        eyebrow="The rules that keep RevView useful"
        title="Terms & Conditions"
        summary="These terms explain how you may use RevView's quizzes, progress tools, feedback features, and recommended study products, along with the responsibilities shared by you and the platform."
        effectiveDate="July 4, 2026"
        sections={termsSections}
        relatedHref="/privacy"
        relatedLabel="Privacy Policy"
      />
      <Footer />
    </>
  );
}
