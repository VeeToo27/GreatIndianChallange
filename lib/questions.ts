export type Question = {
  id: string;
  section: string;
  text: string;
  options: string[];
};

export const QUESTIONS: Question[] = [
  {
    id: "q1_frequency",
    section: "Habits",
    text: "How often do you buy skincare or personal care products?",
    options: ["Every month", "Every 2–3 months", "Occasionally", "Rarely"],
  },
  {
    id: "q2_reads_reviews",
    section: "Habits",
    text: "Do you read online reviews before buying a skincare product?",
    options: ["Yes, always", "Sometimes", "Rarely", "Never"],
  },
  {
    id: "q3_review_trust",
    section: "Trust",
    text: "How much do you trust reviews on Amazon / Nykaa / similar sites?",
    options: ["1 – Not at all", "2", "3", "4", "5 – Completely"],
  },
  {
    id: "q4_asks_friends",
    section: "Trust",
    text: "Before buying, do you ask a friend or a WhatsApp group for their opinion?",
    options: ["Yes, always", "Sometimes", "Rarely", "Never"],
  },
  {
    id: "q5_peer_vs_review",
    section: "Trust",
    text: "If a public review and a friend disagreed, who would you believe?",
    options: ["My friend, easily", "Leaning friend", "Leaning the review", "The review, easily"],
  },
  {
    id: "q6_has_posted",
    section: "Behavior",
    text: "Have you ever posted a review after buying a skincare product?",
    options: ["Yes", "No"],
  },
  {
    id: "q7_why_not_posted",
    section: "Behavior",
    text: "If you haven't posted a review, what's the main reason?",
    options: [
      "I forget",
      "Don't see the point",
      "No incentive to",
      "Not comfortable posting publicly",
      "I have posted before",
    ],
  },
  {
    id: "q8_whatsapp_groups",
    section: "Behavior",
    text: "How many active WhatsApp groups are you in where skincare/beauty comes up?",
    options: ["0", "1–2", "3–5", "6+"],
  },
  {
    id: "q9_spend",
    section: "Spend",
    text: "What's your monthly spend on skincare & personal care?",
    options: ["Under ₹500", "₹500–1,000", "₹1,000–2,000", "₹2,000+"],
  },
];
