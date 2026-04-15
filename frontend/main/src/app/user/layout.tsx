import "./stitch.css";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return <div className="bg-background text-on-surface">{children}</div>;
}
