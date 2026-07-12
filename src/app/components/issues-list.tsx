import { IssueCard, type Issue } from "./issue-card";

const issues: Issue[] = [
  {
    number: "#042",
    title: "Checkout abandons users on shipping step in Arabic locale",
    severity: "Critical",
    status: "In review",
    priority: "P0",
    effort: "L",
    category: "Checkout",
    uxLaw: "Jakob's Law",
    surface: "Web · Checkout",
    tags: ["arabic", "rtl", "form-validation", "checkout"],
    author: { name: "Lina H.", initials: "LH", color: "from-[#007AFF] to-[#5856d6]" },
    assignee: { name: "Omar K.", initials: "OK", color: "from-emerald-400 to-teal-500" },
    comments: 8,
    description:
      "On the shipping step in Arabic, required field labels collapse beneath inputs and validation errors appear far from the offending field. Five of six moderated users abandoned the flow before completing the address form.",
    recommendation:
      "Anchor inline validation to each field, mirror label position for RTL, and surface a sticky summary of remaining required fields. Re-test with the moderated panel before rollout.",
    screenshots: [
      { src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200", annotations: 6 },
      { src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600", annotations: 3 },
      { src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600", annotations: 0 },
    ],
    expanded: true,
  },
  {
    number: "#039",
    title: "Tracking screen lacks status hierarchy for multi-package orders",
    severity: "High",
    status: "Open",
    priority: "P1",
    effort: "M",
    category: "Tracking",
    uxLaw: "Hick's Law",
    surface: "Mobile · Tracking",
    tags: ["mobile", "tracking", "hierarchy"],
    author: { name: "Omar K.", initials: "OK", color: "from-emerald-400 to-teal-500" },
    assignee: { name: "Mira T.", initials: "MT", color: "from-amber-400 to-orange-500" },
    comments: 4,
    description:
      "When an order contains multiple parcels, each row uses the same weight and color, forcing users to read every line to identify the late package. Returning users report frustration after two sessions.",
    recommendation:
      "Introduce a status-led grouping with a clear primary parcel, demote completed parcels visually, and pin exceptions to the top of the list with a contextual action.",
    screenshots: [
      { src: "https://images.unsplash.com/photo-1551288049-4b1c5b1f0c1b?w=1200", annotations: 4 },
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600", annotations: 2 },
    ],
  },
  {
    number: "#036",
    title: "Empty state on saved addresses confuses returning users",
    severity: "Medium",
    status: "Open",
    priority: "P2",
    effort: "S",
    category: "Profile",
    uxLaw: "Aesthetic-Usability",
    surface: "Web · Profile",
    tags: ["empty-state", "profile", "copy"],
    author: { name: "Mira T.", initials: "MT", color: "from-amber-400 to-orange-500" },
    assignee: { name: "Lina H.", initials: "LH", color: "from-[#007AFF] to-[#5856d6]" },
    comments: 2,
    description:
      "The saved-addresses empty state reads 'No data.' Users assume their previous addresses were deleted by the system and contact support, which now sees ~40 tickets/week tied to this flow.",
    recommendation:
      "Replace with an illustrative empty state that explains why no addresses are shown and offers a single, primary action to add one. Coordinate copy with Support to remove the ticket driver.",
    screenshots: [
      { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200", annotations: 2 },
    ],
  },
];

export function IssuesList() {
  return (
    <div className="px-8 py-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-[12px] text-[var(--text-subtle)]">
          <span className="text-[var(--text-on-dark)]">3 issues</span> shown · filtered from 147 ·{" "}
          <button className="text-[var(--brand-blue)] hover:underline">Clear filters</button>
        </div>
        <div className="text-[12px] text-[var(--text-faint)]">Grouped by severity</div>
      </div>

      {issues.map((issue) => (
        <IssueCard key={issue.number} issue={issue} />
      ))}

      <button className="w-full h-11 rounded-xl border border-dashed border-[var(--border-medium)] text-[13px] text-[var(--text-subtle)] hover:text-[var(--text-on-dark)] hover:border-[var(--border-hover)] transition-colors">
        Load 144 more issues
      </button>
    </div>
  );
}
