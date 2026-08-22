import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "../ui/Button";
import { contact } from "@/data/contact";

export function CtaGroup() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
      <Button href="#projects" variant="primary">
        Explore My Work <ArrowDown size={16} />
      </Button>
      <Button href="#experience" variant="ghost">
        View Experience
      </Button>
      <Button href={contact.resumeHref} variant="ghost" download>
        Download CV <ArrowUpRight size={16} />
      </Button>
    </div>
  );
}
