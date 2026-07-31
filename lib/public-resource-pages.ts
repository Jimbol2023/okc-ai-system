export type PublicResourcePath =
  | "/resources/vacant-property-oklahoma"
  | "/resources/sell-vacant-house-okc"
  | "/resources/landlord-property-decisions-oklahoma"
  | "/resources/shared-inherited-property-oklahoma"
  | "/resources/relocation-property-decisions-oklahoma"
  | "/resources/sell-inherited-house-oklahoma-city"
  | "/resources/selling-house-during-probate-oklahoma"
  | "/resources/out-of-state-owner-selling-oklahoma-property"
  | "/resources/education/probate-basics-oklahoma-property-owners"
  | "/resources/education/deferred-maintenance-oklahoma"
  | "/resources/education/property-ownership-change-considerations"
  | "/resources/education/family-property-discussions";

type ResourceLink = {
  href: string;
  label: string;
  description: string;
};

type ResourceSection = {
  title: string;
  body: string;
};

type RelatedQuestion = {
  question: string;
  prompt: string;
};

export type PublicResourcePage = {
  path: PublicResourcePath;
  eyebrow: string;
  title: string;
  description: string;
  intro: string;
  sectionsHeading: string;
  sections: ResourceSection[];
  relatedQuestions: RelatedQuestion[];
  relatedResources: ResourceLink[];
};

export const propertyResourcePages: PublicResourcePage[] = [
  {
    path: "/resources/vacant-property-oklahoma",
    eyebrow: "Vacant Property Guidance",
    title: "What To Do With a Vacant Property in Oklahoma",
    description:
      "Educational guidance for Oklahoma property owners thinking through vacant property security, upkeep, timing, condition, and next-step questions.",
    intro:
      "Vacant property can raise practical questions about access, condition, utilities, insurance, upkeep, and timing. This guide offers a plain-language starting point for thinking through those details before you choose a next step.",
    sectionsHeading: "Vacant property questions to review",
    sections: [
      {
        title: "Why vacant property decisions need planning",
        body:
          "A vacant property can require regular attention even when no one is living there. Owners may need to think about access, weather, utilities, maintenance, insurance, and who is responsible for checking on the property."
      },
      {
        title: "Securing and monitoring the property",
        body:
          "Basic security questions may include whether doors and windows close properly, whether someone can check the property, and whether mail, yard care, or visible maintenance needs could create concerns."
      },
      {
        title: "Utilities, insurance, and basic upkeep",
        body:
          "Owners often review utility status, insurance coverage, yard care, seasonal maintenance, and whether any service providers need access. A qualified insurance or property professional can help clarify situation-specific questions."
      },
      {
        title: "Property condition questions",
        body:
          "Vacant homes may have deferred maintenance, weather-related issues, or repairs that are easier to miss when no one is present every day. A written list of known condition concerns can make conversations more useful."
      },
      {
        title: "Timing and ownership considerations",
        body:
          "Some vacant property decisions involve inherited ownership, relocation, multiple owners, or a change in long-term plans. Confirming who can make decisions and what timeline feels practical can reduce confusion."
      },
      {
        title: "Questions to discuss before deciding",
        body:
          "Helpful questions include who has access, how often the property is checked, what repairs are known, what carrying responsibilities exist, and whether the owner wants a private conversation before choosing a path."
      },
      {
        title: "Helpful Oklahoma resources",
        body:
          "Owners may benefit from speaking with qualified local advisors, insurance professionals, title professionals, county offices, or property service providers before making decisions."
      }
    ],
    relatedQuestions: [
      {
        question: "Can I contact J Capital about a vacant property?",
        prompt: "The FAQ explains how vacant property conversations work."
      },
      {
        question: "What if the property needs repairs?",
        prompt: "The FAQ covers deferred maintenance and condition questions."
      },
      {
        question: "What areas do you serve?",
        prompt: "The FAQ links to local Oklahoma service-area guidance."
      }
    ],
    relatedResources: [
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "Useful if the vacant property came through an estate or ownership change."
      },
      {
        href: "/resources/relocation-property-decisions-oklahoma",
        label: "Relocation Property Decisions",
        description: "Helpful for owners managing property questions while moving."
      }
    ]
  },
  {
    path: "/resources/landlord-property-decisions-oklahoma",
    eyebrow: "Landlord Property Guidance",
    title: "Understanding Landlord Property Decisions in Oklahoma",
    description:
      "Plain-language guidance for Oklahoma landlords reviewing rental property goals, repairs, management needs, timing, and professional guidance questions.",
    intro:
      "Owning rental property can involve practical decisions about repairs, tenants, management responsibilities, timing, and long-term goals. This guide helps landlords organize questions before deciding what makes sense.",
    sectionsHeading: "Landlord property questions to review",
    sections: [
      {
        title: "Reviewing rental property goals",
        body:
          "A landlord may want to keep a property, simplify responsibilities, plan for repairs, or review whether the current arrangement still fits. Writing down the goal can make the next conversation clearer."
      },
      {
        title: "Tenant and lease considerations",
        body:
          "Rental property decisions may involve lease terms, occupancy, access, communication, and legal obligations. Owners should review documents and speak with qualified professionals before making tenant-related decisions."
      },
      {
        title: "Repairs, maintenance, and management load",
        body:
          "Deferred maintenance, recurring repairs, or management fatigue can affect an owner's comfort level. A clear repair list and timeline can help frame the discussion."
      },
      {
        title: "Relocation or changing priorities",
        body:
          "Some landlords review property decisions after moving, changing jobs, inheriting property, or shifting family priorities. The right path depends on the owner's goals and responsibilities."
      },
      {
        title: "Professional guidance considerations",
        body:
          "Landlord decisions can involve legal, tax, insurance, title, and financial questions. Qualified advisors can help owners understand obligations before final decisions are made."
      },
      {
        title: "Questions to discuss before deciding",
        body:
          "Useful questions include whether the property is occupied, what documents apply, what repairs are known, what management tasks are difficult, and what outcome would feel practical."
      },
      {
        title: "Helpful Oklahoma resources",
        body:
          "Owners may want to consult a qualified attorney, tax professional, insurance professional, property manager, title company, or local public office for situation-specific guidance."
      }
    ],
    relatedQuestions: [
      {
        question: "Can landlords contact J Capital Property Group?",
        prompt: "The FAQ explains how landlord property questions can be discussed."
      },
      {
        question: "What if the property needs repairs?",
        prompt: "The FAQ covers repair and condition conversations."
      },
      {
        question: "Is there any obligation when I contact you?",
        prompt: "The FAQ explains the no-pressure contact process."
      }
    ],
    relatedResources: [
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "Useful when a rental property is no longer occupied or needs monitoring."
      },
      {
        href: "/resources/relocation-property-decisions-oklahoma",
        label: "Relocation Property Decisions",
        description: "Helpful for landlords managing property from another area."
      },
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "Helpful if a rental property became part of an ownership transition."
      }
    ]
  },
  {
    path: "/resources/shared-inherited-property-oklahoma",
    eyebrow: "Shared Inherited Property",
    title: "Shared Inherited Property Questions for Oklahoma Families",
    description:
      "Educational guidance for Oklahoma families thinking through shared inherited property, communication, decision authority, buyer-fit signals, condition, and next steps.",
    intro:
      "Shared inherited property can involve family communication, documents, timing, condition, access, and different goals among heirs. This guide offers a calm starting point for organizing the facts buyers typically need to review before any family decides what comes next.",
    sectionsHeading: "Shared inherited property and buyer-fit questions to review",
    sections: [
      {
        title: "Understanding shared ownership questions",
        body:
          "When more than one person has an interest in a property, the next step may depend on estate documents, title records, family circumstances, and who has authority to act."
      },
      {
        title: "Communication among heirs",
        body:
          "It can help to list each person's priorities, concerns, timeline, and preferred outcome. Clear communication can reduce assumptions before the family chooses a direction."
      },
      {
        title: "Decision authority and documents",
        body:
          "Families may need to review wills, trust documents, probate filings, title records, or other documents. Qualified professionals can help clarify who can make decisions."
      },
      {
        title: "Property condition and carrying costs",
        body:
          "Shared ownership can include questions about maintenance, insurance, utilities, access, repairs, and who is handling ongoing responsibilities while decisions are being discussed. These details also help determine whether a property is ready for investor review or needs more information first."
      },
      {
        title: "Buyer-fit signals to organize",
        body:
          "Families can prepare a clearer property conversation by noting occupancy, known repair needs, access limits, preferred timing, and any price-point expectations. Those signals help compare whether a property may fit what active buyers are reviewing without making assumptions about value or outcome."
      },
      {
        title: "Avoiding assumptions and pressure",
        body:
          "Inherited property decisions are often easier when everyone has time to understand the facts. Owners should avoid relying on assumptions about authority, value, timing, market demand, or another family member's goals."
      },
      {
        title: "Questions to discuss before deciding",
        body:
          "Useful questions include who is involved, what documents exist, whether the property is occupied, what condition concerns are known, how quickly the family wants clarity, and what outcome would be practical for everyone involved."
      },
      {
        title: "Helpful Oklahoma resources",
        body:
          "A qualified attorney, title company, tax professional, county office, or estate professional may help families understand documents and responsibilities before making decisions."
      }
    ],
    relatedQuestions: [
      {
        question: "Do you work with inherited properties?",
        prompt: "The FAQ explains inherited property conversations and how owners can start with known facts."
      },
      {
        question: "What information helps buyers review a shared inherited property?",
        prompt: "Useful starting points include occupancy, access, known repairs, timing, documents, and decision authority."
      },
      {
        question: "How do I contact J Capital Property Group?",
        prompt: "The FAQ includes direct phone and email contact details."
      }
    ],
    relatedResources: [
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "A broader guide for inherited property questions in Oklahoma."
      },
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "Useful when a shared inherited property is vacant or needs access, upkeep, and condition review."
      }
    ]
  },
  {
    path: "/resources/relocation-property-decisions-oklahoma",
    eyebrow: "Relocation Property Decisions",
    title: "Property Decisions During Relocation in Oklahoma",
    description:
      "Educational guidance for Oklahoma owners thinking through property decisions during relocation, timing, access, repairs, upkeep, and next steps.",
    intro:
      "Relocation can make property decisions feel more complicated because timing, access, upkeep, repairs, and communication may all change at once. This guide helps owners organize practical questions before choosing a path.",
    sectionsHeading: "Relocation property questions to review",
    sections: [
      {
        title: "Planning around moving timelines",
        body:
          "A move can create decisions about when the property will be vacant, who can check on it, what tasks remain, and how much time the owner has for repairs or ongoing management."
      },
      {
        title: "Occupied versus vacant property questions",
        body:
          "A property may be owner-occupied, tenant-occupied, vacant, or in transition. Each situation can involve different access, maintenance, communication, and planning needs."
      },
      {
        title: "Repairs, upkeep, and access",
        body:
          "Owners who relocate may need to decide who can handle yard care, utilities, repair estimates, cleaning, inspections, or other practical tasks while they are away."
      },
      {
        title: "Family, work, and timing considerations",
        body:
          "Relocation decisions often involve job timing, family needs, school schedules, travel, or limited availability. A realistic timeline can help owners compare options without pressure."
      },
      {
        title: "Professional guidance considerations",
        body:
          "Depending on the situation, owners may want to speak with qualified legal, tax, insurance, title, financial, or property professionals before making final decisions."
      },
      {
        title: "Questions to discuss before deciding",
        body:
          "Useful questions include when the move happens, who can access the property, what repairs are known, whether the property will be vacant, and what outcome would reduce uncertainty."
      },
      {
        title: "Helpful Oklahoma resources",
        body:
          "Local advisors, title professionals, insurance professionals, county offices, and property service providers may help owners understand responsibilities during a move."
      }
    ],
    relatedQuestions: [
      {
        question: "What types of property situations can I ask about?",
        prompt: "The FAQ includes relocation, timing, and private property questions."
      },
      {
        question: "Can I contact you about a vacant property?",
        prompt: "The FAQ explains vacant property conversations."
      },
      {
        question: "How quickly do you respond?",
        prompt: "The FAQ explains typical response timing."
      }
    ],
    relatedResources: [
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "Helpful if relocation will leave a property empty for a period of time."
      },
      {
        href: "/resources/landlord-property-decisions-oklahoma",
        label: "Landlord Property Decisions",
        description: "Useful when relocation changes rental property responsibilities."
      },
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "Helpful when relocation overlaps with an ownership change."
      }
    ]
  },
  {
    path: "/resources/education/probate-basics-oklahoma-property-owners",
    eyebrow: "Property Learning Center",
    title: "Probate Basics for Oklahoma Property Owners",
    description:
      "General educational guidance for Oklahoma property owners thinking through probate, estate administration, documents, decision authority, and next-step questions.",
    intro:
      "Probate and estate administration can raise practical questions about who can act, what documents matter, and when property decisions can be discussed. This guide is a plain-language starting point, not legal advice.",
    sectionsHeading: "Probate questions to organize",
    sections: [
      {
        title: "Start with decision authority",
        body:
          "Before a property decision is made, owners and family members often need to understand who has authority to act. That answer may depend on documents, title records, court filings, or professional guidance."
      },
      {
        title: "Gather documents before deciding",
        body:
          "Helpful documents may include estate papers, title information, mortgage or lien notices, insurance records, utility details, and maintenance notes. A simple folder can make future conversations clearer."
      },
      {
        title: "Separate property questions from legal questions",
        body:
          "Property condition, access, security, and upkeep can be discussed generally, but legal authority and estate questions should be reviewed with qualified professionals before final decisions are made."
      },
      {
        title: "Think through timing and responsibilities",
        body:
          "Probate-related property questions may involve vacant-property checks, utilities, repairs, insurance, family availability, and who is responsible for keeping the property stable while decisions are pending."
      },
      {
        title: "Avoid assumptions",
        body:
          "It is easy to assume every inherited property follows the same path. Oklahoma property owners should avoid relying on assumptions about title, authority, value, taxes, debts, or timing."
      },
      {
        title: "Questions to ask before a property conversation",
        body:
          "Useful questions include who is involved, what documents exist, whether the property is occupied, what condition concerns are known, and whether a qualified advisor should review the situation first."
      }
    ],
    relatedQuestions: [
      {
        question: "Is this legal advice?",
        prompt: "No. This guide is general education only and encourages professional review."
      },
      {
        question: "Can inherited property questions be discussed?",
        prompt: "Yes. J Capital can discuss practical property questions without replacing legal or tax guidance."
      },
      {
        question: "What should I organize first?",
        prompt: "Start with decision authority, documents, occupancy, condition, and timing."
      }
    ],
    relatedResources: [
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "A broader guide for inherited property questions and practical next steps."
      },
      {
        href: "/resources/education/family-property-discussions",
        label: "Family Property Discussions",
        description: "Helpful when more than one family member is involved."
      }
    ]
  },
  {
    path: "/resources/education/deferred-maintenance-oklahoma",
    eyebrow: "Property Learning Center",
    title: "Deferred Maintenance Considerations in Oklahoma",
    description:
      "Educational guidance for Oklahoma property owners reviewing delayed repairs, maintenance needs, safety questions, timing, and professional guidance.",
    intro:
      "Deferred maintenance can affect comfort, timing, access, insurance questions, and the type of help an owner may need. This guide helps organize known concerns before making a property decision.",
    sectionsHeading: "Maintenance questions to review",
    sections: [
      {
        title: "Write down known concerns",
        body:
          "A simple list of known repairs, visible issues, recurring problems, and past service work can make a property conversation more useful and reduce guesswork."
      },
      {
        title: "Separate urgent concerns from planning questions",
        body:
          "Some issues may affect safety, access, utilities, weather exposure, or occupancy. Owners should contact qualified professionals for urgent or situation-specific repair guidance."
      },
      {
        title: "Consider access and monitoring",
        body:
          "If a property is vacant or lightly used, owners may need to think through who can check on it, how often it is monitored, and whether utilities or exterior upkeep need attention."
      },
      {
        title: "Think about repair timing",
        body:
          "Repair decisions can depend on budget, availability, property goals, family priorities, occupancy, and timing. There is no single path that fits every property."
      },
      {
        title: "Understand what is known and unknown",
        body:
          "Owners should be clear about which concerns are confirmed and which are assumptions. Inspections, contractors, insurance professionals, or other qualified advisors may help clarify unknowns."
      },
      {
        title: "Questions to ask before deciding",
        body:
          "Helpful questions include what repairs are known, whether anyone is living there, what has changed recently, who can access the property, and what timeline feels realistic."
      }
    ],
    relatedQuestions: [
      {
        question: "Do I need repairs completed first?",
        prompt: "That depends on your goals and situation. This guide helps organize the question."
      },
      {
        question: "What if the property is vacant?",
        prompt: "Vacant properties may need monitoring, access, and upkeep planning."
      },
      {
        question: "Should I rely on assumptions?",
        prompt: "No. Separate confirmed facts from assumptions before deciding."
      }
    ],
    relatedResources: [
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "Useful when maintenance concerns overlap with vacancy or access questions."
      },
      {
        href: "/resources/education/property-ownership-change-considerations",
        label: "Ownership Change Considerations",
        description: "Helpful when repairs are part of a larger ownership transition."
      }
    ]
  },
  {
    path: "/resources/education/property-ownership-change-considerations",
    eyebrow: "Property Learning Center",
    title: "Property Ownership Change Considerations",
    description:
      "General educational guidance for Oklahoma owners thinking through property ownership changes, documents, decision authority, timing, and next-step questions.",
    intro:
      "Ownership changes can happen for many reasons, including family events, estate questions, relocation, landlord decisions, or changing long-term plans. This guide helps owners organize practical questions before acting.",
    sectionsHeading: "Ownership change questions to organize",
    sections: [
      {
        title: "Clarify who is involved",
        body:
          "An ownership change may involve one owner, multiple owners, heirs, a trust, a business, or other parties. Understanding who needs to be included can prevent confusion."
      },
      {
        title: "Review documents before relying on memory",
        body:
          "Title records, estate documents, loan information, tax notices, leases, and insurance records may affect what questions need professional review."
      },
      {
        title: "Understand occupancy and access",
        body:
          "A property may be occupied, vacant, rented, or in transition. Occupancy can affect access, communication, maintenance, and timing."
      },
      {
        title: "Plan for carrying responsibilities",
        body:
          "Ownership changes can involve utilities, insurance, taxes, repairs, yard care, security, and other responsibilities while decisions are being discussed."
      },
      {
        title: "Use professional guidance when needed",
        body:
          "Legal, tax, title, financial, and insurance questions should be discussed with qualified professionals. A property conversation should not replace that guidance."
      },
      {
        title: "Questions to ask before deciding",
        body:
          "Useful questions include who has authority, what documents apply, whether the property is occupied, what costs continue, and what outcome would fit the owner's situation."
      }
    ],
    relatedQuestions: [
      {
        question: "Can ownership changes affect timing?",
        prompt: "Yes. Timing can depend on documents, decision authority, occupancy, and professional review."
      },
      {
        question: "What if several people are involved?",
        prompt: "Shared decisions usually benefit from clear communication and organized documents."
      },
      {
        question: "Is this title advice?",
        prompt: "No. Title questions should be reviewed with qualified title or legal professionals."
      }
    ],
    relatedResources: [
      {
        href: "/resources/shared-inherited-property-oklahoma",
        label: "Shared Inherited Property Questions",
        description: "Helpful when ownership questions involve family members or heirs."
      },
      {
        href: "/resources/education/probate-basics-oklahoma-property-owners",
        label: "Probate Basics",
        description: "A starting point when an estate or probate question may be involved."
      }
    ]
  },
  {
    path: "/resources/education/family-property-discussions",
    eyebrow: "Property Learning Center",
    title: "Preparing for Family Property Discussions",
    description:
      "Educational guidance for Oklahoma families preparing to discuss inherited property, shared ownership, timing, condition, responsibilities, and next steps.",
    intro:
      "Family property conversations can feel easier when people have the same basic information. This guide helps organize goals, questions, responsibilities, and next steps before a decision is made.",
    sectionsHeading: "Family discussion questions to prepare",
    sections: [
      {
        title: "Start with shared facts",
        body:
          "Before discussing preferences, families can list known facts about ownership, occupancy, condition, documents, expenses, access, and timing."
      },
      {
        title: "Let each person name their priorities",
        body:
          "Different family members may care about timing, privacy, repairs, emotional attachment, costs, or simplicity. Naming priorities can reduce assumptions."
      },
      {
        title: "Clarify roles and responsibilities",
        body:
          "Useful questions include who checks the property, who handles mail or utilities, who communicates with advisors, and who keeps notes from conversations."
      },
      {
        title: "Avoid pressure during uncertain stages",
        body:
          "When documents, authority, condition, or timing are unclear, it can help to pause and gather information before asking anyone to make a final decision."
      },
      {
        title: "Know when outside guidance helps",
        body:
          "Qualified attorneys, tax professionals, title companies, insurance professionals, or property advisors may help clarify different parts of the situation."
      },
      {
        title: "Questions to discuss together",
        body:
          "Helpful questions include what everyone knows, what is still unknown, what timeline matters, what responsibilities continue, and what next step would be respectful and practical."
      }
    ],
    relatedQuestions: [
      {
        question: "What if family members disagree?",
        prompt: "Start by separating shared facts, individual priorities, and questions for qualified advisors."
      },
      {
        question: "Should one person collect documents?",
        prompt: "A shared folder or point person can help, if everyone involved is comfortable with that approach."
      },
      {
        question: "Can J Capital discuss family property questions?",
        prompt: "J Capital can discuss practical property questions while encouraging professional guidance where needed."
      }
    ],
    relatedResources: [
      {
        href: "/resources/shared-inherited-property-oklahoma",
        label: "Shared Inherited Property Questions",
        description: "A companion guide for families managing shared property questions."
      },
      {
        href: "/resources/education/property-ownership-change-considerations",
        label: "Ownership Change Considerations",
        description: "Helpful when the family conversation involves a change in ownership."
      }
    ]
  },
  {
    path: "/resources/sell-inherited-house-oklahoma-city",
    eyebrow: "Inherited Property Education",
    title: "Sell an Inherited House in Oklahoma City",
    description:
      "Educational guidance for Oklahoma City owners reviewing inherited house questions, documents, family communication, property condition, and possible sale timing.",
    intro:
      "Selling an inherited house in Oklahoma City can involve family, documents, authority, condition, and timing questions. This guide helps owners organize practical information before deciding whether a sale, repair plan, rental plan, or another path makes sense.",
    sectionsHeading: "Inherited house questions to organize before selling",
    sections: [
      {
        title: "Start with documents and authority",
        body:
          "Before discussing a sale, families can gather known documents and confirm who has authority to make decisions. Depending on the situation, probate, title, estate, or trust questions may need qualified professional guidance."
      },
      {
        title: "Discuss family goals and timing",
        body:
          "Inherited property decisions may involve more than one person. It can help to write down each person's timing, concerns, desired outcome, and questions before anyone feels pressured to choose a path."
      },
      {
        title: "Review occupancy and condition",
        body:
          "Owners can note whether the property is occupied or vacant, whether utilities are active, what repairs are known, and whether someone can safely access and monitor the house."
      },
      {
        title: "Compare options before deciding",
        body:
          "Some families keep an inherited property, some rent it, some repair it, and some sell it. The practical choice depends on goals, responsibilities, costs, condition, and professional guidance."
      },
      {
        title: "Use a calm, no-pressure conversation",
        body:
          "J Capital Property Group can discuss practical property questions with Oklahoma City owners while encouraging legal, tax, title, and financial guidance where those topics apply."
      }
    ],
    relatedQuestions: [
      {
        question: "Should I sell an inherited house immediately?",
        prompt:
          "Not always. Start by reviewing authority, documents, condition, family goals, costs, and professional guidance needs."
      },
      {
        question: "What if more than one family member is involved?",
        prompt:
          "Clear communication helps. Families should confirm decision authority and avoid rushing while key facts are still unclear."
      },
      {
        question: "Can J Capital discuss inherited property in Oklahoma City?",
        prompt:
          "Yes. J Capital can discuss practical property questions while encouraging qualified guidance for legal, tax, title, or valuation matters."
      }
    ],
    relatedResources: [
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "A broader Oklahoma guide for inherited property questions."
      },
      {
        href: "/resources/shared-inherited-property-oklahoma",
        label: "Shared Inherited Property Questions",
        description: "Helpful when multiple family members are involved."
      },
      {
        href: "/resources/education/probate-basics-oklahoma-property-owners",
        label: "Probate Basics",
        description: "General education when probate-related questions may apply."
      }
    ]
  },
  {
    path: "/resources/sell-vacant-house-okc",
    eyebrow: "Vacant Property Education",
    title: "Sell a Vacant House in OKC",
    description:
      "Plain-language guidance for Oklahoma City owners reviewing vacant house security, utilities, insurance, repairs, timing, and possible sale questions.",
    intro:
      "A vacant house in OKC can create practical responsibilities even when no one lives there. This guide helps owners organize security, access, utilities, insurance, condition, and timing questions before deciding whether selling or another path fits.",
    sectionsHeading: "Vacant house questions to review",
    sections: [
      {
        title: "Confirm access and monitoring",
        body:
          "Owners can start by confirming who has keys, who checks the property, whether mail or yard care needs attention, and whether the home appears secure from the outside."
      },
      {
        title: "Review utilities, insurance, and taxes",
        body:
          "Vacant property planning often includes utility status, insurance coverage, tax responsibilities, and seasonal maintenance. Qualified professionals can help with situation-specific questions."
      },
      {
        title: "List known repairs and unknowns",
        body:
          "Vacant homes may have visible repairs, deferred maintenance, or unknown condition issues. A simple written list can make a property conversation clearer."
      },
      {
        title: "Think about timing and carrying responsibilities",
        body:
          "The right next step may depend on how long the property has been vacant, who is responsible for upkeep, and whether the owner wants a repair plan, rental plan, sale conversation, or more time."
      },
      {
        title: "Have a private property discussion",
        body:
          "J Capital Property Group can talk through practical vacant property questions with OKC owners without pressure or unsupported assumptions about the property."
      }
    ],
    relatedQuestions: [
      {
        question: "What should I check first on a vacant house?",
        prompt:
          "Start with access, security, utilities, insurance, taxes, known repairs, and who can monitor the property."
      },
      {
        question: "Can I discuss a vacant house before repairs are complete?",
        prompt:
          "Yes. A practical conversation can begin with what is known, what is unknown, and what outcome the owner is considering."
      },
      {
        question: "Is this property valuation advice?",
        prompt:
          "No. This guide is general education only and encourages qualified guidance for valuation, legal, tax, title, or repair questions."
      }
    ],
    relatedResources: [
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "A broader Oklahoma guide for vacant property planning."
      },
      {
        href: "/resources/education/deferred-maintenance-oklahoma",
        label: "Deferred Maintenance Considerations",
        description: "Helpful for organizing repair and condition questions."
      },
      {
        href: "/oklahoma-city",
        label: "Oklahoma City Service Area",
        description: "Local property guidance for Oklahoma City owners."
      }
    ]
  },
  {
    path: "/resources/selling-house-during-probate-oklahoma",
    eyebrow: "Probate Property Education",
    title: "Selling a House During Probate in Oklahoma",
    description:
      "General educational guidance for Oklahoma owners reviewing probate-related property documents, authority, timing, condition, and professional guidance needs.",
    intro:
      "Selling a house during probate in Oklahoma may involve legal authority, documents, family communication, property responsibilities, and timing questions. This guide is a practical starting point and is not legal advice.",
    sectionsHeading: "Probate-related property questions to organize",
    sections: [
      {
        title: "Confirm who can make decisions",
        body:
          "Probate-related property decisions can depend on documents, court process, title, and authority. Owners should speak with qualified legal or title professionals before making major decisions."
      },
      {
        title: "Gather estate and property information",
        body:
          "Helpful information may include estate documents, title records, mortgage or lien information, insurance, taxes, utility status, occupancy, and known condition concerns."
      },
      {
        title: "Keep communication clear",
        body:
          "When family members or heirs are involved, clear notes about questions, responsibilities, and timing can reduce confusion while professional guidance is being gathered."
      },
      {
        title: "Review property responsibilities",
        body:
          "Even during probate, a property may still require attention to access, security, utilities, insurance, taxes, maintenance, or repairs."
      },
      {
        title: "Separate property questions from legal advice",
        body:
          "J Capital Property Group can discuss practical property considerations, but probate, legal authority, title, tax, and estate questions should be handled by qualified professionals."
      }
    ],
    relatedQuestions: [
      {
        question: "Can a house be sold during probate in Oklahoma?",
        prompt:
          "That depends on the situation and authority involved. Property owners should speak with a qualified attorney or title professional."
      },
      {
        question: "What information should families organize first?",
        prompt:
          "Start with authority, documents, occupancy, insurance, taxes, utilities, condition, and known responsibilities."
      },
      {
        question: "Does J Capital provide probate advice?",
        prompt:
          "No. J Capital provides general property education and encourages qualified professional guidance for probate-specific questions."
      }
    ],
    relatedResources: [
      {
        href: "/resources/education/probate-basics-oklahoma-property-owners",
        label: "Probate Basics",
        description: "General education for probate-related property questions."
      },
      {
        href: "/resources/inherited-property-oklahoma",
        label: "Inherited Property Guide",
        description: "A broader guide for inherited property decisions."
      },
      {
        href: "/resources/education/family-property-discussions",
        label: "Family Property Discussions",
        description: "A framework for respectful family conversations."
      }
    ]
  },
  {
    path: "/resources/out-of-state-owner-selling-oklahoma-property",
    eyebrow: "Out-of-State Owner Education",
    title: "Out-of-State Owner Selling Oklahoma Property",
    description:
      "Educational guidance for out-of-state owners reviewing Oklahoma property access, documents, condition, local responsibilities, and possible sale questions.",
    intro:
      "Owning Oklahoma property from another state can make access, condition, documents, utilities, repairs, and timing harder to manage. This guide helps out-of-state owners organize practical questions before deciding what to do next.",
    sectionsHeading: "Out-of-state owner questions to review",
    sections: [
      {
        title: "Start with local access",
        body:
          "Owners can identify who has keys, who can check the property, whether the property is occupied or vacant, and whether access will be needed for inspections, repairs, or conversations."
      },
      {
        title: "Organize documents and responsibilities",
        body:
          "Useful items may include title or ownership documents, tax records, insurance information, utility status, mortgage information, leases, repair notes, and contact information for local helpers."
      },
      {
        title: "Review condition from a distance",
        body:
          "Out-of-state ownership can make condition questions harder. A written list of known repairs, photos from trusted sources, or qualified local guidance can make next-step conversations clearer."
      },
      {
        title: "Think through timing and privacy",
        body:
          "Some owners want time to gather facts. Others need a simpler conversation because distance makes management difficult. The right path depends on goals, responsibilities, and comfort level."
      },
      {
        title: "Use Oklahoma-focused property guidance",
        body:
          "J Capital Property Group can discuss practical Oklahoma property questions while avoiding assumptions about the property and encouraging professional guidance where needed."
      }
    ],
    relatedQuestions: [
      {
        question: "Can I discuss an Oklahoma property if I live out of state?",
        prompt:
          "Yes. Start with known documents, access, occupancy, condition, timing, and the questions you want to organize."
      },
      {
        question: "What if I cannot inspect the property myself?",
        prompt:
          "Consider trusted local access, photos, repair notes, and qualified professionals before making final decisions."
      },
      {
        question: "Can J Capital help with legal or tax questions?",
        prompt:
          "No. J Capital can discuss practical property questions and encourages qualified legal, tax, title, insurance, or repair guidance."
      }
    ],
    relatedResources: [
      {
        href: "/resources/relocation-property-decisions-oklahoma",
        label: "Relocation Property Decisions",
        description: "Helpful for owners managing property decisions from another place."
      },
      {
        href: "/resources/vacant-property-oklahoma",
        label: "Vacant Property Guide",
        description: "Useful when the Oklahoma property is vacant or hard to monitor."
      },
      {
        href: "/resources/property-insights",
        label: "Property Decision Insights",
        description: "Evergreen decision-support questions for Oklahoma owners."
      }
    ]
  }
];

export const resourcePagesByPath = Object.fromEntries(
  propertyResourcePages.map((page) => [page.path, page])
) as Record<PublicResourcePath, PublicResourcePage>;
