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

type LessonGuideQuestion = {
  question: string;
  answer: string;
};

type LessonGuide = {
  heading: string;
  intro: string;
  lessonSummary: string;
  keyTakeaways: string[];
  commonQuestions: LessonGuideQuestion[];
  educationalDisclaimer: string;
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
  lessonGuide?: LessonGuide;
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
    lessonGuide: {
      heading: "Understanding Inherited Property in Oklahoma",
      intro:
        "Inherited property can create emotional, legal, financial, and practical decisions for Oklahoma families. This lesson explains the main areas property owners should organize before deciding whether to keep, rent, repair, or sell an inherited property.",
      lessonSummary:
        "Inherited property often requires families to slow down and organize information before making major decisions. Important areas include ownership authority, probate or legal process, family communication, property condition, taxes, insurance, utilities, occupancy, repairs, and professional guidance.",
      keyTakeaways: [
        "Do not rush inherited property decisions.",
        "Gather important documents before making decisions.",
        "Confirm who has authority to act on behalf of the property.",
        "Communicate clearly with all heirs or family members involved.",
        "Review the property's condition, occupancy, utilities, taxes, and insurance.",
        "Consider professional guidance from an attorney, tax professional, appraiser, real estate professional, or property manager.",
        "Use educational resources before deciding whether to keep, rent, repair, or sell the property."
      ],
      commonQuestions: [
        {
          question: "Should I sell an inherited property immediately?",
          answer:
            "Not always. Families should first understand ownership, documentation, property condition, family goals, and possible legal or tax considerations."
        },
        {
          question: "What if multiple family members inherited the property?",
          answer:
            "Clear communication is important. Families should confirm who has decision-making authority and avoid making rushed decisions without everyone understanding the situation."
        },
        {
          question: "What should I check first?",
          answer:
            "Start with documents, occupancy, utilities, insurance, taxes, repairs, and whether probate or another legal process may be involved."
        }
      ],
      educationalDisclaimer:
        "This page provides general educational information for Oklahoma property owners. It is not legal, tax, financial, title, valuation, or property repair advice. Property owners should speak with qualified professionals before making major decisions."
    },
    transcript: [
      "Understanding Inherited Property in Oklahoma",
      "Inherited property can create emotional and practical decisions for Oklahoma families.",
      "When a loved one passes away, families may suddenly have to think about ownership, documents, repairs, taxes, insurance, utilities, and who has authority to make decisions about the property.",
      "The first step is to slow down and organize the situation.",
      "Before deciding whether to keep, rent, repair, or sell the property, families should gather important documents and understand whether probate or another legal process may be involved.",
      "The second step is communication.",
      "Inherited property often involves more than one family member. Clear and respectful communication can help prevent confusion, disagreements, and rushed decisions.",
      "The third step is reviewing the property condition.",
      "Families should look at whether the property is occupied or vacant, whether utilities are active, whether insurance is current, whether taxes are owed, and whether repairs or maintenance are needed.",
      "The fourth step is getting professional guidance.",
      "Depending on the situation, families may need to speak with an attorney, tax professional, appraiser, real estate professional, contractor, or property manager.",
      "Every inherited property situation is different.",
      "Some families keep the property. Some rent it. Some repair it. Some sell it. Others need time before making a decision.",
      "The goal is not to rush.",
      "The goal is to understand the property, protect the family, and make an informed decision.",
      "J Capital Property Group provides educational resources to help Oklahoma property owners understand their options before making major property decisions.",
      "To learn more, visit the J Capital Property Group Education Center at jcapitalpropertygroup.com."
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
      },
      {
        href: "/resources/education",
        label: "Education Center",
        description: "Browse educational resources for Oklahoma property owners."
      },
      {
        href: "/contact",
        label: "Contact J Capital Property Group",
        description: "Use direct phone and email links for general communication."
      }
    ]
  },
  {
    path: "/resources/videos/vacant-property",
    title: "Vacant Property in Oklahoma",
    description:
      "Educational video page for Oklahoma owners reviewing vacant property access, monitoring, utilities, condition, responsibilities, and practical next-step planning.",
    summary:
      "This 3-5 minute authority lesson helps owners think through vacant property questions, including access, security, upkeep, utilities, insurance considerations, condition, and who can monitor the property.",
    videoAsset: {
      src: "/videos/vacant-property-in-oklahoma.mp4",
      reviewStatus: "pending_review",
      targetDuration: "3-5 minutes"
    },
    primaryCta: "Learn more at jcapitalpropertygroup.com/resources/education",
    secondaryWebsiteCta:
      "If you'd like to discuss your specific situation, visit our property discussion form.",
    transcript: [
      "Vacant property decisions in Oklahoma often start with access, visibility, security, condition, and responsibility questions.",
      "A vacant home may be empty temporarily, between occupants, inherited, part of a relocation, or waiting for a longer-term decision.",
      "Start by confirming who has access, who can check on the property, and whether keys, utilities, mail, and basic monitoring are organized.",
      "Review visible condition concerns, yard care, doors, windows, weather exposure, insurance questions, and whether qualified professionals should be contacted.",
      "Families and owners often face distance, time, repair uncertainty, recurring upkeep, and unclear responsibility for day-to-day property needs.",
      "Possible paths may include keeping the property, repairing it, renting it, listing it, transferring responsibilities, or evaluating available ownership and disposition options.",
      "Before making decisions, separate confirmed facts from assumptions about condition, safety, access, costs, and timing.",
      "Key takeaways: confirm access, organize monitoring, document known concerns, review responsibilities, and get qualified guidance when needed.",
      "Learn more at jcapitalpropertygroup.com/resources/education."
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
        question: "Why is this video 3-5 minutes?",
        answer:
          "The length gives enough room to educate, support website engagement, and build trust while staying short enough to finish."
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
      "Educational video page for Oklahoma owners organizing property decisions during relocation, timing, access, repairs, responsibilities, and practical next-step planning.",
    summary:
      "This 3-5 minute authority lesson helps owners who are moving organize timing, access, occupancy, repairs, family availability, and ongoing property responsibilities.",
    videoAsset: {
      src: "/videos/relocation-property-decisions.mp4",
      reviewStatus: "pending_review",
      targetDuration: "3-5 minutes"
    },
    primaryCta: "Learn more at jcapitalpropertygroup.com/resources/education",
    secondaryWebsiteCta:
      "If you'd like to discuss your specific situation, visit our property discussion form.",
    transcript: [
      "Relocation property decisions can become complicated when moving timelines, distance, repairs, access, and ongoing responsibilities overlap.",
      "Start with the moving timeline and when the property may become vacant, harder to access, or more difficult to manage locally.",
      "Review whether the property is owner-occupied, tenant-occupied, vacant, or in transition, and identify who can handle local tasks.",
      "Owners may need to organize utilities, yard care, cleaning, property checks, repair estimates, personal property, and document access.",
      "Common challenges include time pressure, distance, family availability, uncertainty about condition, and the need to make decisions from another location.",
      "Possible paths may include keeping the property, renting it, repairing it, listing it, transferring responsibilities, or evaluating available ownership and disposition options.",
      "Before choosing a path, separate confirmed facts from assumptions about access, occupancy, repairs, carrying costs, and timing.",
      "Key takeaways: clarify the timeline, assign local responsibilities, organize known repairs, protect access, and get qualified guidance when needed.",
      "Learn more at jcapitalpropertygroup.com/resources/education."
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
    title: "Landlord Property Decisions",
    description:
      "Educational video page for Oklahoma landlords reviewing rental goals, repairs, management load, occupancy, changing priorities, and practical next-step planning.",
    summary:
      "This 3-5 minute authority lesson helps landlords organize rental property questions, including occupancy, leases, repairs, management load, changing goals, and professional guidance needs.",
    videoAsset: {
      src: "/videos/landlord-property-decisions.mp4",
      reviewStatus: "pending_review",
      targetDuration: "3-5 minutes"
    },
    primaryCta: "Learn more at jcapitalpropertygroup.com/resources/education",
    secondaryWebsiteCta:
      "If you'd like to discuss your specific situation, visit our property discussion form.",
    transcript: [
      "Landlord property decisions often begin when rental goals, repairs, management load, occupancy, or personal priorities start to change.",
      "Start by writing down the current rental property goal and what may have changed since the property was first rented.",
      "Review occupancy, lease documents, access questions, repairs, recurring tasks, communication needs, and management responsibilities.",
      "Some situations may require legal, tax, insurance, property management, title, or repair guidance from qualified professionals.",
      "Common challenges include deferred maintenance, vacancy risk, tenant coordination, distance, time demands, and changing financial or family priorities.",
      "Possible paths may include keeping the rental, adjusting management, repairing it, listing it, transferring responsibilities, or evaluating available ownership and disposition options.",
      "Before choosing a path, separate confirmed facts from assumptions about condition, occupancy, obligations, expenses, and timing.",
      "Key takeaways: clarify your goal, organize documents, understand condition, review responsibilities, and get qualified guidance when needed.",
      "Learn more at jcapitalpropertygroup.com/resources/education."
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
        question: "Can this page be used as a lesson guide?",
        answer: "Yes. The page is structured with teaching notes, common questions, related resources, and disclaimers."
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
