/** Layout minimal — fiche local imprimable (sans sidebar cockpit). */
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
