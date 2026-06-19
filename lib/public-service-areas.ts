export type PublicServiceArea = {
  slug: "/oklahoma-city" | "/yukon" | "/moore" | "/norman" | "/edmond" | "/midwest-city";
  city: string;
  headline: string;
  description: string;
  localIntro: string;
  localTrust: string;
};

export const commonPropertySituations = [
  {
    title: "Inherited property",
    description: "Ownership changes can raise questions about timing, condition, communication, and next steps."
  },
  {
    title: "Vacant property",
    description: "Vacant homes often need thoughtful planning around upkeep, security, timing, and future use."
  },
  {
    title: "Deferred maintenance",
    description: "Properties with repairs or delayed maintenance deserve a clear review before any decision is made."
  },
  {
    title: "Landlord questions",
    description: "Rental ownership can change when repairs, management needs, or long-term goals shift."
  },
  {
    title: "Relocation",
    description: "Moving timelines can make property decisions more complex and benefit from a calm conversation."
  },
  {
    title: "Private property decisions",
    description: "Some property questions are best handled through a direct, respectful, and private discussion."
  }
] as const;

export const serviceAreaSteps = [
  {
    title: "Contact J Capital",
    description: "Call, email, or start with the property discussion page when you are ready to ask questions."
  },
  {
    title: "Discuss Your Situation",
    description: "Share the local property details, timing, condition, and circumstances you are thinking through."
  },
  {
    title: "Review Possible Options",
    description: "Talk through practical considerations in plain language without pressure."
  },
  {
    title: "Decide What Makes Sense",
    description: "Choose the next step that fits your goals, timing, and comfort level."
  }
] as const;

export const serviceAreas = {
  "/oklahoma-city": {
    slug: "/oklahoma-city",
    city: "Oklahoma City",
    headline: "Professional Property Guidance in Oklahoma City",
    description:
      "Professional, no-pressure property guidance for Oklahoma City owners thinking through inherited property, vacancy, repairs, landlord questions, relocation, or private property decisions.",
    localIntro:
      "J Capital Property Group helps Oklahoma City property owners think through real estate situations with professionalism, transparency, and practical guidance.",
    localTrust:
      "Our Oklahoma market focus helps keep the conversation grounded in local property considerations without making assumptions about your property."
  },
  "/yukon": {
    slug: "/yukon",
    city: "Yukon",
    headline: "Professional Property Guidance in Yukon",
    description:
      "No-pressure property guidance for Yukon owners reviewing inherited property, vacant property, repair concerns, landlord questions, relocation, or private decisions.",
    localIntro:
      "J Capital Property Group helps Yukon property owners review real estate questions with clear communication, practical guidance, and a no-pressure approach.",
    localTrust:
      "For Yukon property owners, the goal is a respectful conversation that accounts for local Oklahoma property questions without unsupported claims."
  },
  "/moore": {
    slug: "/moore",
    city: "Moore",
    headline: "Professional Property Guidance in Moore",
    description:
      "Professional property guidance for Moore owners with questions about inherited property, vacancy, deferred maintenance, landlord needs, relocation, or private next steps.",
    localIntro:
      "J Capital Property Group helps Moore property owners talk through property decisions with professionalism, transparency, and practical next-step guidance.",
    localTrust:
      "Moore property conversations are handled with attention to timing, condition, and owner goals, while avoiding pressure or exaggerated promises."
  },
  "/norman": {
    slug: "/norman",
    city: "Norman",
    headline: "Professional Property Guidance in Norman",
    description:
      "Clear, no-pressure property guidance for Norman owners considering inherited property, vacant homes, repairs, landlord questions, relocation, or private decisions.",
    localIntro:
      "J Capital Property Group helps Norman property owners consider real estate questions through a calm, educational, and professional conversation.",
    localTrust:
      "For Norman owners, we focus on clear communication and practical property considerations instead of assumptions or one-size-fits-all advice."
  },
  "/edmond": {
    slug: "/edmond",
    city: "Edmond",
    headline: "Professional Property Guidance in Edmond",
    description:
      "Professional property guidance for Edmond owners thinking through inherited property, vacancy, deferred maintenance, landlord questions, relocation, or private goals.",
    localIntro:
      "J Capital Property Group helps Edmond property owners discuss real estate situations with transparency, practical guidance, and room to decide.",
    localTrust:
      "Edmond property owners can use the conversation to organize questions about timing, condition, ownership goals, and possible next steps."
  },
  "/midwest-city": {
    slug: "/midwest-city",
    city: "Midwest City",
    headline: "Professional Property Guidance in Midwest City",
    description:
      "No-pressure property guidance for Midwest City owners reviewing inherited property, vacant homes, repairs, landlord questions, relocation, or private next steps.",
    localIntro:
      "J Capital Property Group helps Midwest City property owners think through real estate questions with professionalism, transparency, and practical guidance.",
    localTrust:
      "For Midwest City owners, the conversation stays focused on the property situation, timing, and owner preferences without pressure or unsupported claims."
  }
} satisfies Record<PublicServiceArea["slug"], PublicServiceArea>;

export const serviceAreaList = Object.values(serviceAreas);
