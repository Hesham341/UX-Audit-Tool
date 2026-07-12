import logoSrc from '../../imports/Logo.png';

export function Footer() {
  return (
    <footer className="px-10 lg:px-16 py-14 border-t border-[var(--border-on-dark)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="size-7 rounded-lg overflow-hidden shrink-0">
            <img src={logoSrc} alt="UX Mosaic Logo" className="w-full h-full object-cover scale-[1.25]" />
          </div>
          <div className="text-[var(--text-subtle)] text-[13px]">Mosaic UX Audit · v3.2 · Beirut · Dubai · Riyadh</div>
        </div>
        <div className="flex items-center gap-8 text-[var(--text-subtle)] text-[13px]">
          <a href="#">Methodology</a>
          <a href="#">Privacy</a>
          <a href="#">Support</a>
          <span>© 2026 Mosaic Studio</span>
        </div>
      </div>
    </footer>
  );
}
