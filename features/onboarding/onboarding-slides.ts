
import {
  BookOpen,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface OnboardingSlide {
  eyebrow: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  number: string;
  highlights: readonly string[];
}

export const ONBOARDING_SLIDES = [
  {
    eyebrow: "WELCOME TO OSUSUBOOK",
    title: "Your Osusu, organised.",
    description:
      "Bring your savings group together with a simpler way to keep track of contributions and important dates.",
    Icon: BookOpen,
    number: "01",
    highlights: ["Simple to use", "Made for everyday savings"],
  },
  {
    eyebrow: "EVERYONE STAYS IN THE LOOP",
    title: "Know who has paid.",
    description:
      "Keep member contributions and payment records organised, so your group can spend less time checking and more time saving.",
    Icon: Users,
    number: "02",
    highlights: [
      "Clear contribution records",
      "Group progress at a glance",
    ],
  },
  {
    eyebrow: "BUILT AROUND TRUST",
    title: "Save together, confidently.",
    description:
      "Keep your group's records organised and accessible to the right people. Your group stays at the centre of every decision.",
    Icon: ShieldCheck,
    number: "03",
    highlights: ["Organised records", "Trust through transparency"],
  },
] as const satisfies readonly OnboardingSlide[];
