export type PublicResourcePath =
  | "/resources/vacant-property-oklahoma"
  | "/resources/landlord-property-decisions-oklahoma"
  | "/resources/shared-inherited-property-oklahoma"
  | "/resources/relocation-property-decisions-oklahoma";

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
      "Educational guidance for Oklahoma families thinking through shared inherited property, communication, decision authority, condition, and next steps.",
    intro:
      "Shared inherited property can involve family communication, documents, timing, condition, and different goals among heirs. This guide offers a calm starting point for organizing questions before decisions are made.",
    sectionsHeading: "Shared inherited property questions to review",
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
          "Shared ownership can include questions about maintenance, insurance, utilities, access, repairs, and who is handling ongoing responsibilities while decisions are being discussed."
      },
      {
        title: "Avoiding assumptions and pressure",
        body:
          "Inherited property decisions are often easier when everyone has time to understand the facts. Owners should avoid relying on assumptions about authority, value, timing, or another family member's goals."
      },
      {
        title: "Questions to discuss before deciding",
        body:
          "Useful questions include who is involved, what documents exist, whether the property is occupied, what condition concerns are known, and what outcome would be practical for the family."
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
        prompt: "The FAQ explains inherited property conversations."
      },
      {
        question: "Is there any obligation when I contact you?",
        prompt: "The FAQ explains what happens when you ask questions."
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
        description: "Useful when a shared inherited property is currently vacant."
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
  }
];

export const resourcePagesByPath = Object.fromEntries(
  propertyResourcePages.map((page) => [page.path, page])
) as Record<PublicResourcePath, PublicResourcePage>;
