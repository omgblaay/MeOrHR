import ArrowLeftLineIcon from "@iconify-react/majesticons/arrow-left-line";
import { Link } from "react-router-dom";
import AppFooter from "./components/AppFooter";
import AppHeader from "./components/AppHeader";

type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

const termsSections: LegalSection[] = [
  {
    id: "service",
    title: "1. The service",
    paragraphs: [
      "Meor HR is a community job board where people can share job listings and contribute information about application and recruitment experiences. The service is informational and does not act as an employer, recruiter, or employment agency.",
      "Job listings, applicant signals, comments, and company information may be submitted by users or imported from third-party sources. Meor HR does not guarantee that any listing is current, complete, genuine, or suitable for you.",
    ],
  },
  {
    id: "accounts",
    title: "2. Accounts",
    paragraphs: [
      "You are responsible for the accuracy of your account information, keeping your login credentials secure, and activity performed through your account. Optional profile information may be visible publicly when used beside community contributions.",
    ],
  },
  {
    id: "contributions",
    title: "3. Community contributions",
    paragraphs: [
      "You may submit job offers, application outcomes, profile information, and other content. Only submit information you are entitled to share, and avoid including confidential recruitment materials, personal data about recruiters or other applicants, or misleading claims.",
      "You retain ownership of your content. You grant Meor HR a non-exclusive, worldwide, royalty-free licence to host, display, format, aggregate, and use that content as needed to operate and improve the service.",
    ],
  },
  {
    id: "conduct",
    title: "4. Acceptable use",
    paragraphs: ["You must not use Meor HR to:"],
    bullets: [
      "post false, discriminatory, defamatory, unlawful, or abusive material;",
      "impersonate another person or company;",
      "collect personal data from other users without permission;",
      "interfere with the service, bypass access controls, or upload malicious files;",
      "spam listings or manipulate community statistics.",
    ],
  },
  {
    id: "third-parties",
    title: "5. Third-party listings and links",
    paragraphs: [
      "Meor HR links to external job boards and company websites. Those services have their own terms and privacy practices. Meor HR is not responsible for their content, availability, application process, or hiring decisions.",
    ],
  },
  {
    id: "moderation",
    title: "6. Moderation and suspension",
    paragraphs: [
      "Meor HR may correct, hide, merge, or remove content that is duplicate, inaccurate, unsafe, unlawful, or inconsistent with these terms. Accounts may be restricted or removed where necessary to protect the service or its community.",
    ],
  },
  {
    id: "availability",
    title: "7. Availability and disclaimers",
    paragraphs: [
      "The service is provided on an “as is” and “as available” basis. Recruitment statistics reflect only activity reported to Meor HR and should not be treated as a complete measure of a company, a guarantee of response, or professional career advice.",
    ],
  },
  {
    id: "liability",
    title: "8. Liability",
    paragraphs: [
      "To the extent permitted by applicable law, Meor HR is not liable for hiring decisions, missed opportunities, reliance on community data, third-party content, or indirect losses resulting from use of the service. Nothing in these terms excludes rights or liability that cannot legally be excluded.",
    ],
  },
  {
    id: "changes",
    title: "9. Changes",
    paragraphs: [
      "The service and these terms may change as Meor HR develops. The updated date will be revised when material changes are published. Continuing to use the service after a change means you accept the updated terms.",
    ],
  },
];

const privacySections: LegalSection[] = [
  {
    id: "collection",
    title: "1. Information we collect",
    paragraphs: ["Meor HR may process the following information:"],
    bullets: [
      "account data, including your email address and authentication identifiers;",
      "optional public profile data, including nickname, profile picture, and short bio;",
      "job offers, source links, comments, and recruitment activity you contribute;",
      "private application dates and notes stored locally in your browser;",
      "basic technical and security logs processed by hosting and database providers.",
    ],
  },
  {
    id: "use",
    title: "2. How information is used",
    paragraphs: [
      "Information is used to authenticate users, operate profiles, publish job offers, provide application tracking, calculate community hiring signals, prevent abuse, maintain security, and improve Meor HR.",
      "Depending on the activity, processing is based on providing the service you request, Meor HR’s legitimate interests in operating and securing the community, your consent where specifically requested, or compliance with legal obligations.",
    ],
  },
  {
    id: "public",
    title: "3. Public and private information",
    paragraphs: [
      "Job offers, source information, aggregate recruitment signals, and optional profile fields are designed to be public. Do not include sensitive personal information in public contributions.",
      "Your account email is not part of your public profile. Application timeline dates and private notes are currently kept in browser local storage. Anonymous event totals may contribute to public offer insights without displaying your private notes.",
    ],
  },
  {
    id: "storage",
    title: "4. Storage and service providers",
    paragraphs: [
      "Meor HR uses Supabase for authentication, database storage, and profile images. The deployed website may also be processed by its hosting provider. These providers process information on Meor HR’s behalf and may maintain operational and security logs.",
      "External job links take you to third-party services whose privacy policies apply independently.",
    ],
  },
  {
    id: "local-storage",
    title: "5. Browser storage",
    paragraphs: [
      "Meor HR uses browser local storage for private application tracking and session-related functionality. Clearing your browser data may remove information that has not been synchronized to Supabase.",
    ],
  },
  {
    id: "retention",
    title: "6. Retention",
    paragraphs: [
      "Account and profile data is kept while your account remains active or while needed to operate the service. Community contributions may be retained after account deletion where necessary to preserve shared offer history, unless removal is legally required. Security logs are retained according to provider settings.",
    ],
  },
  {
    id: "choices",
    title: "7. Your choices and rights",
    paragraphs: [
      "You can edit or remove optional profile information from Settings and clear local application data through your browser. Depending on where you live, you may also have rights to access, correct, delete, restrict, or export personal information and to object to certain processing.",
      "Requests concerning account data can be directed to the Meor HR operator through the contact channel provided with the deployed service. Identity may need to be verified before a request is completed. You may also have the right to complain to the data protection authority in the country where you live or work.",
    ],
  },
  {
    id: "security",
    title: "8. Security",
    paragraphs: [
      "Meor HR uses access controls and Supabase row-level security to limit account changes and file uploads. No online service can guarantee absolute security, so avoid submitting information that is unnecessary or highly sensitive.",
    ],
  },
  {
    id: "updates",
    title: "9. Policy updates",
    paragraphs: [
      "This policy may be updated when features or data practices change. Material revisions will be reflected by the updated date on this page.",
    ],
  },
];

type LegalPageProps = {
  type: "terms" | "privacy";
};

export default function LegalPage({ type }: LegalPageProps) {
  const isTerms = type === "terms";
  const title = isTerms ? "Terms of Service" : "Privacy Policy";
  const intro = isTerms
    ? "These terms set the ground rules for using Meor HR and contributing to its community data."
    : "This policy explains what information Meor HR handles, where it is stored, and the choices available to you.";
  const sections = isTerms ? termsSections : privacySections;

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-[90rem] border-x border-brandgray-250 bg-white">
        <div className="border-b border-brandgray-250 px-4 py-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-semibold text-brandgray-700 transition hover:text-brand-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-900"
          >
            <ArrowLeftLineIcon aria-hidden="true" width="18" height="18" />
            Back to Meor HR
          </Link>
        </div>

        <header className="border-b border-brandgray-250 bg-brandgray-50 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <p className="text-sm font-semibold text-brand-500">Legal</p>
          <h1 className="mt-2 text-3xl font-semibold text-brand-950 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-brandgray-650">{intro}</p>
          <p className="mt-5 text-sm text-brandgray-500">
            Last updated: 25 September 2026
          </p>
        </header>

        <div className="grid lg:grid-cols-[15rem_1fr]">
          <aside className="border-b border-brandgray-250 px-4 py-6 sm:px-6 lg:border-b-0 lg:border-r lg:px-8 lg:py-10">
            <p className="mb-3 text-xs font-semibold uppercase text-brandgray-450">
              On this page
            </p>
            <nav aria-label={`${title} sections`}>
              <ol className="space-y-2 text-sm font-medium text-brandgray-650">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a className="hover:text-brand-900" href={`#${section.id}`}>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <article className="px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
            <div className="max-w-2xl space-y-10">
              {sections.map((section) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-6"
                >
                  <h2 className="text-xl font-semibold text-brandgray-900">
                    {section.title}
                  </h2>
                  <div className="mt-3 space-y-3 leading-7 text-brandgray-650">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                    {section.bullets && (
                      <ul className="list-disc space-y-2 pl-5">
                        {section.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
