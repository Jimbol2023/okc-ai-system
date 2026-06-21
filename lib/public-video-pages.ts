import type { PublicPath } from "./public-seo";

export type PublicVideoPath =
  | "/resources/videos/inherited-property"
  | "/resources/videos/vacant-property"
  | "/resources/videos/relocation-property"
  | "/resources/videos/landlord-property";

type VideoFaq = {
  question: string;
  answer: string;
};

type RelatedResource = {
  href: PublicPath;
  label: string;
  description: string;
};

type VideoAsset = {
  src: string;
  reviewStatus: "pending_review" | "ready";
  targetDuration: string;
};

export type PublicVideoPage = {
  path: PublicVideoPath;
  title: string;
  description: string;
  summary: string;
  videoAsset?: VideoAsset;
  primaryCta?: string;
  secondaryWebsiteCta?: string;
  transcript: string[];
  faqs: VideoFaq[];
  relatedResources: RelatedResource[];
};

export const publicVideoPages: PublicVideoPage[] = [
  {
    path: "/resources/videos/inherited-property",
    title: "Understanding Inherited Property",
    description:
      "Educational video page for Oklahoma owners reviewing inherited property, family communication, documents, ownership questions, and practical next-step planning.",
    summary:
      "This 3-5 minute authority lesson helps inherited-property owners organize documents, decision authority, condition questions, family communication, responsibilities, and professional guidance needs before making a decision.",
    videoAsset: {
      src: "/videos/understanding-inherited-property.mp4",
      reviewStatus: "ready",
      targetDuration: "3-5 minutes"
    },
    primaryCta: "Learn more at jcapitalpropertygroup.com/resources/education",
    secondaryWebsiteCta:
      "If you'd like to discuss your specific situation, visit our property discussion form.",
    transcript: [
      "Understanding inherited property in Oklahoma starts with slowing the decision down and organizing the facts before anyone feels pressured to choose a path.",
      "Inherited property can involve ownership, documents, family communication, timing, property condition, and ongoing responsibilities. This lesson is general education only.",
      "Common ownership situations may include one owner, multiple heirs, a trust, an estate, or unclear decision authority. Start by identifying who can make decisions and what documents are available.",
      "Some situations may involve probate, trust review, title review, or other professional guidance. Legal, tax, financial, title, valuation, and repair questions should be reviewed with qualified professionals.",
      "Families often need to think through utilities, insurance, access, repairs, personal property, taxes, security, and who can monitor the property.",
      "Common challenges include distance, emotional stress, deferred maintenance, unclear paperwork, family disagreement, and timing pressure.",
      "Possible paths may include keeping the property, renting it, repairing it, listing it, transferring ownership, or evaluating available ownership and disposition options. The right path depends on the situation.",
      "Key takeaways: organize documents, confirm decision authority, separate facts from assumptions, understand property condition, and get qualified guidance when needed.",
      "Learn more at jcapitalpropertygroup.com/resources/education."
    ],
    faqs: [
      {
        question: "Is this legal or probate advice?",
        answer: "No. This video page is general education only and encourages qualified professional guidance."
      },
      {
        question: "What should families organize first?",
        answer: "Start with documents, decision authority, occupancy, condition, responsibilities, and timing."
      },
      {
        question: "Why is this video 3-5 minutes?",
        answer:
          "The length gives enough room to educate, support website engagement, and build trust while staying short enough to finish."
      }
    ],
    relatedResources: [
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "A broader written guide for inherited property questions."
      },
      {
        href: "/resources/education/probate-basics-oklahoma-property-owners",
        label: "Probate Basics",
        description: "General education for probate-related property questions."
      }
    ]
  },
  {
    path: "/resources/videos/vacant-property",
    title: "Vacant Property Considerations",
    description:
      "Transcript-first educational video page for Oklahoma owners reviewing vacant property access, monitoring, utilities, condition, and timing.",
    summary:
      "This lesson helps owners think through vacant property questions, including access, security, upkeep, utilities, insurance considerations, condition, and who can monitor the property.",
    transcript: [
      "Confirm whether anyone has regular access to the property.",
      "Review basic exterior visibility, mail, yard care, doors, windows, and known maintenance concerns.",
      "Think through utilities, insurance, weather exposure, and whether qualified professionals should be contacted.",
      "Write down who can check on the property and how often.",
      "Use the information to compare practical next steps without relying on assumptions."
    ],
    faqs: [
      {
        question: "Should a vacant property be checked regularly?",
        answer: "Owners often benefit from a clear monitoring plan, especially when access, utilities, or upkeep are unclear."
      },
      {
        question: "Does this replace insurance or repair advice?",
        answer: "No. Insurance, repair, safety, and legal questions should be reviewed with qualified professionals."
      },
      {
        question: "Can a video be embedded later?",
        answer: "Yes. This page is structured for a future video embed and already includes the transcript content."
      }
    ],
    relatedResources: [
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "A written guide for security, access, utilities, and upkeep questions."
      },
      {
        href: "/resources/education/deferred-maintenance-oklahoma",
        label: "Deferred Maintenance Considerations",
        description: "Useful when vacancy overlaps with delayed repairs or condition concerns."
      }
    ]
  },
  {
    path: "/resources/videos/relocation-property",
    title: "Relocation Property Decisions",
    description:
      "Transcript-first educational video page for Oklahoma owners organizing property decisions during relocation, timing, access, repairs, and responsibilities.",
    summary:
      "This lesson helps owners who are moving organize timing, access, occupancy, repairs, family availability, and ongoing property responsibilities.",
    transcript: [
      "Start with the moving timeline and when the property may become vacant or harder to access.",
      "Identify who can handle utilities, yard care, repair estimates, cleaning, or property checks.",
      "Review whether the property is owner-occupied, tenant-occupied, vacant, or in transition.",
      "Write down known repairs, remaining tasks, and timing pressures.",
      "Compare options based on practical responsibilities, not pressure or assumptions."
    ],
    faqs: [
      {
        question: "What makes relocation property decisions different?",
        answer: "Timing, access, distance, work schedules, family needs, and repair responsibilities may all change at once."
      },
      {
        question: "What should I organize before moving?",
        answer: "Consider access, utilities, repairs, occupancy, monitoring, documents, and who can help locally."
      },
      {
        question: "Is this a market update?",
        answer: "No. This is evergreen education focused on property decision planning."
      }
    ],
    relatedResources: [
      {
        href: "/resources/relocation-property-decisions-oklahoma",
        label: "Relocation Property Decisions",
        description: "A written guide for property questions during a move."
      },
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "Helpful when relocation may leave a property empty."
      }
    ]
  },
  {
    path: "/resources/videos/landlord-property",
    title: "Landlord Property Questions",
    description:
      "Transcript-first educational video page for Oklahoma landlords reviewing rental goals, repairs, management load, occupancy, and changing priorities.",
    summary:
      "This lesson helps landlords organize rental property questions, including occupancy, leases, repairs, management load, changing goals, and professional guidance needs.",
    transcript: [
      "Start by writing down the current rental property goal and what may have changed.",
      "Review occupancy, lease documents, access questions, repairs, and management responsibilities.",
      "Separate confirmed facts from assumptions about condition, timing, tenants, or obligations.",
      "Consider whether legal, tax, insurance, property management, or title guidance is needed.",
      "Use the organized information to decide what next conversation would be most helpful."
    ],
    faqs: [
      {
        question: "Is this landlord legal advice?",
        answer: "No. Tenant, lease, legal, tax, and compliance questions should be reviewed with qualified professionals."
      },
      {
        question: "What if management has become difficult?",
        answer: "Write down the recurring tasks, repairs, communication needs, and timing concerns before comparing options."
      },
      {
        question: "Can this page support a future recorded presentation?",
        answer: "Yes. The current transcript-first structure is designed for a future Canva, Loom, or YouTube video."
      }
    ],
    relatedResources: [
      {
        href: "/resources/landlord-property-decisions-oklahoma",
        label: "Landlord Property Decisions",
        description: "A written guide for rental goals, repairs, and management questions."
      },
      {
        href: "/resources/education/deferred-maintenance-oklahoma",
        label: "Deferred Maintenance Considerations",
        description: "Useful when rental decisions involve delayed repairs."
      }
    ]
  }
];

export const publicVideoPagesByPath = Object.fromEntries(
  publicVideoPages.map((page) => [page.path, page])
) as Record<PublicVideoPath, PublicVideoPage>;
