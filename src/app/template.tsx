/** Re-mounts on navigation, giving every route a subtle entrance (disabled for reduced motion). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page-in">{children}</div>;
}
