export function AdminSectionPlaceholder({
  title,
  subtitle,
  checklist,
}: {
  title: string;
  subtitle: string;
  checklist: string[];
}) {
  return (
    <div className="admin-stack">
      <div>
        <h2 className="admin-page-title">{title}</h2>
        <p className="admin-page-subtitle">{subtitle}</p>
      </div>

      <article className="admin-card">
        <h3>Implementation checklist</h3>
        <ul className="admin-checklist">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}
