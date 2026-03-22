/**
 * Footer — Bottom page footer with navigation links and branding (worldmonitor parity).
 * Links: Pro, Blog, Docs, Status, GitHub, Discord, X
 *
 * Architecture Layer: UI (L6)
 */
import { useVariant } from '@/variants';

const FOOTER_LINKS = [
  { label: 'Pro', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'Docs', href: '#' },
  { label: 'Status', href: '#' },
  { label: 'GitHub', href: 'https://github.com/PyBADR/deevo-monitor' },
  { label: 'Discord', href: 'https://discord.gg/deevo-monitor' },
  { label: 'X', href: '#' },
];

export function Footer() {
  const { variant } = useVariant();
  const year = new Date().getFullYear();

  return (
    <footer
      className="h-7 flex items-center justify-between px-4 shrink-0 font-mono border-t"
      style={{
        backgroundColor: variant.colors.bg,
        borderColor: variant.colors.border,
      }}
    >
      {/* Branding */}
      <div className="flex items-center gap-2">
        <span className="text-[9px] font-bold" style={{ color: variant.colors.textMuted }}>
          DEEVO MONITOR
        </span>
        <span className="text-[8px]" style={{ color: variant.colors.textMuted }}>
          BY BDRAI
        </span>
      </div>

      {/* Navigation links */}
      <div className="flex items-center gap-3">
        {FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('http') ? '_blank' : undefined}
            rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="text-[9px] font-mono transition-colors hover:text-gray-300"
            style={{ color: variant.colors.textMuted }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Copyright */}
      <span className="text-[8px]" style={{ color: variant.colors.textMuted }}>
        &copy; {year} Deevo Analytics
      </span>
    </footer>
  );
}
