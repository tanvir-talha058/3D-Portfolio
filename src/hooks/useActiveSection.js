import { useEffect, useState } from 'react';

/**
 * Tracks which of `sectionIds` is currently under the reading line
 * (`offset` px below the top of the viewport). Shared by Navbar (active
 * link highlight) and ScrollProgress (section-change pulse) so they read
 * off the same notion of "current section" instead of each computing it.
 */
export function useActiveSection(sectionIds, { offset = 200, initial = '' } = {}) {
  const [activeSection, setActiveSection] = useState(initial);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + offset;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sectionIds, offset]);

  return activeSection;
}
