import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { getAuditLog } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/audit")({
  head: () => ({ meta: [{ title: "Audit log | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: AuditAdmin,
});

function AuditAdmin() {
  const fetchLog = useServerFn(getAuditLog);
  const { data = [], isLoading } = useQuery({ queryKey: ["admin-audit"], queryFn: () => fetchLog() });

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl font-bold">Audit log</h1>
      <p className="mt-2 text-sm text-muted-foreground">Every change made through the admin dashboard.</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : data.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">No activity yet.</p>
      ) : (
        <div className="mt-6 glass-strong rounded-xl divide-y divide-white/5">
          {data.map((row: any) => (
            <div key={row.id} className="p-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">
                  <span className="text-[color:var(--ph)]">{row.action}</span> · {row.entity}
                  {row.entity_id ? <span className="text-muted-foreground"> · {row.entity_id}</span> : null}
                </span>
                <span className="text-xs text-muted-foreground">{new Date(row.created_at).toLocaleString()}</span>
              </div>
              {row.changes && (
                <pre className="mt-2 text-xs text-muted-foreground bg-black/30 rounded p-2 overflow-x-auto">
                  {JSON.stringify(row.changes, null, 2)}
                </pre>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
