import { Footer, NavBar } from "@/lib/client-imports";
import LegalDocument, {
  type LegalSection,
} from "@/components/ui/LegalDocument";

const privacySections: LegalSection[] = [
  {
    id: "information-we-collect",
    title: "Information we collect",
    content: (
      <>
        <p>
          We collect information you provide when you create or update an
          account, such as your name, email address, profile details, and sign-in
          credentials handled through our authentication provider.
        </p>
        <p>When you use RevView, we may also process:</p>
        <ul>
          <li>Quiz selections, answers, scores, completion times, and results history.</li>
          <li>Progress data, category performance, and learning preferences.</li>
          <li>Feedback, support messages, and other content you submit.</li>
          <li>
            Basic technical data such as device, browser, IP address, and
            security or diagnostic events.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How we use information",
    content: (
      <>
        <p>
          We use information to authenticate you, deliver quizzes, save your
          progress, show results and analytics, maintain your account, and
          respond to feedback or support requests.
        </p>
        <p>
          We may also use aggregated or de-identified information to understand
          how RevView is used, improve question quality and platform
          performance, prevent abuse, and keep the service secure.
        </p>
      </>
    ),
  },
  {
    id: "sharing-and-providers",
    title: "Sharing and service providers",
    content: (
      <>
        <p>
          We do not sell your personal information. We may share only the
          information needed with service providers that support hosting,
          database, authentication, analytics, security, or communications.
          These providers process information for the services they perform for
          RevView.
        </p>
        <p>
          We may also disclose information when required by law, to protect
          users or the platform, or as part of a business transfer where
          appropriate safeguards apply.
        </p>
      </>
    ),
  },
  {
    id: "affiliate-links",
    title: "Products and third-party links",
    content: (
      <>
        <p>
          RevView may display recommended study products or affiliate links.
          Selecting one can take you to an independent third-party website.
          That site may collect information under its own privacy policy, and
          RevView does not control its data practices.
        </p>
        <p>
          We may receive a commission from eligible purchases without changing
          the price you pay. A recommendation is not a guarantee of a
          third-party product or service.
        </p>
      </>
    ),
  },
  {
    id: "retention-and-security",
    title: "Retention and security",
    content: (
      <>
        <p>
          We retain information for as long as reasonably necessary to provide
          the service, maintain required records, resolve disputes, enforce our
          agreements, and protect the platform. Retention periods can differ by
          data type and legal requirement.
        </p>
        <p>
          We use reasonable administrative and technical safeguards, but no
          online system can promise absolute security. Keep your credentials
          private and notify us if you believe your account has been
          compromised.
        </p>
      </>
    ),
  },
  {
    id: "your-choices",
    title: "Your choices and rights",
    content: (
      <>
        <p>
          You may review or update available profile information in your
          account. You may also request access, correction, deletion, or other
          action regarding your personal information, subject to identity
          verification and applicable exceptions.
        </p>
        <p>
          You can control cookies through your browser, although disabling
          essential storage may prevent sign-in or other platform features from
          working correctly.
        </p>
      </>
    ),
  },
  {
    id: "children-and-changes",
    title: "Children and policy updates",
    content: (
      <>
        <p>
          RevView is not intended for children who cannot legally consent to
          data processing in their location. If you believe a child has
          provided personal information without appropriate consent, please
          contact us.
        </p>
        <p>
          We may update this policy as the platform or legal requirements
          change. We will post the revised version here and update its effective
          date. Material changes may also be communicated through the platform.
        </p>
      </>
    ),
  },
  {
    id: "contact-us",
    title: "Contact us",
    content: (
      <p>
        For a privacy question or request, use the support channel provided
        within RevView. Include enough detail for us to understand the request,
        but do not send passwords or other sensitive credentials.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <NavBar State="Default" title="Privacy Policy" />
      <LegalDocument
        eyebrow="Your data, explained clearly"
        title="Privacy Policy"
        summary="This policy explains what information RevView processes, why we use it, when it may be shared, and the choices available to you while using our exam-preparation platform."
        effectiveDate="July 4, 2026"
        sections={privacySections}
        relatedHref="/terms"
        relatedLabel="Terms & Conditions"
      />
      <Footer />
    </>
  );
}
