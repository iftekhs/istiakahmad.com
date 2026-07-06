import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getLaunches } from "@/lib/cms.functions";
import { upsertLaunch, deleteLaunch } from "@/lib/admin.functions";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin/launches")({
  head: () => ({ meta: [{ title: "Launches | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: LaunchesAdmin,
});

type Launch = {
  id?: string;
  name: string;
  role: string;
  launch_date: string;
  rank: string;
  extras: string[];
  description: string;
  href: string;
  featured: boolean;
  sort_order: number;
};

const blank: Launch = {
  name: "", role: "Hunter", launch_date: "", rank: "#1 Product of the Day",
  extras: [], description: "", href: "", featured: false, sort_order: 100,
};

function LaunchesAdmin() {
  const fetchLaunches = useServerFn(getLaunches);
  const upsert = useServerFn(upsertLaunch);
  const remove = useServerFn(deleteLaunch);
  const qc = useQueryClient();
  const { data: launches = [], isLoading } = useQuery({
    queryKey: ["admin-launches"],
    queryFn: () => fetchLaunches(),
  });
  const [editing, setEditing] = useState<Launch | null>(null);

  const saveMut = useMutation({
    mutationFn: (payload: Launch) => upsert({ data: payload as any }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-launches"] });
      setEditing(null);
    },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-launches"] }),
  });

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Launches</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage Product Hunt launches.</p>
        </div>
        <button
          onClick={() => setEditing({ ...blank })}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white"
        >
          <Plus className="h-4 w-4" /> Add launch
        </button>
      </div>

      {isLoading ? (
        <p className="mt-8 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="mt-6 glass-strong rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-muted-foreground bg-black/30">
              <tr>
                <th className="text-left px-4 py-3">Name</th>
                <th className="text-left px-4 py-3">Rank</th>
                <th className="text-left px-4 py-3">Date</th>
                <th className="text-left px-4 py-3">Order</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {launches.map((l: any) => (
                <tr key={l.id} className="border-t border-white/5">
                  <td className="px-4 py-3 font-medium">{l.name} {l.featured && <span className="ml-2 text-[10px] rounded bg-[color:var(--ph)]/20 text-[color:var(--ph)] px-1.5 py-0.5">FEATURED</span>}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.rank}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.launch_date}</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.sort_order}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button onClick={() => setEditing(l)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs hover:bg-white/10">
                      <Pencil className="h-3 w-3" /> Edit
                    </button>
                    <button
                      onClick={() => confirm(`Delete ${l.name}?`) && delMut.mutate(l.id)}
                      className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/70 grid place-items-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg glass-strong rounded-2xl p-6 my-8">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold">{editing.id ? "Edit" : "Add"} launch</h2>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); saveMut.mutate(editing); }}
              className="mt-5 space-y-3"
            >
              <Field label="Name"><input required value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className={input} /></Field>
              <Field label="Role"><input required value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value })} className={input} /></Field>
              <Field label="Launch date (display string)"><input required value={editing.launch_date} onChange={(e) => setEditing({ ...editing, launch_date: e.target.value })} className={input} /></Field>
              <Field label="Rank"><input required value={editing.rank} onChange={(e) => setEditing({ ...editing, rank: e.target.value })} className={input} /></Field>
              <Field label="Extras (comma-separated)">
                <input
                  value={editing.extras.join(", ")}
                  onChange={(e) => setEditing({ ...editing, extras: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  className={input}
                />
              </Field>
              <Field label="Description"><textarea required rows={3} value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={input} /></Field>
              <Field label="URL"><input required type="url" value={editing.href} onChange={(e) => setEditing({ ...editing, href: e.target.value })} className={input} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Sort order"><input required type="number" value={editing.sort_order} onChange={(e) => setEditing({ ...editing, sort_order: Number(e.target.value) })} className={input} /></Field>
                <Field label="Featured">
                  <select value={editing.featured ? "1" : "0"} onChange={(e) => setEditing({ ...editing, featured: e.target.value === "1" })} className={input}>
                    <option value="0">No</option><option value="1">Yes</option>
                  </select>
                </Field>
              </div>
              {saveMut.isError && <p className="text-xs text-red-400">{(saveMut.error as Error).message}</p>}
              <div className="flex gap-2 pt-2">
                <button type="submit" disabled={saveMut.isPending} className="flex-1 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
                  {saveMut.isPending ? "Saving…" : "Save"}
                </button>
                <button type="button" onClick={() => setEditing(null)} className="rounded-lg glass px-4 py-2 text-sm">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const input = "w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<label className="block space-y-1"><span className="text-xs text-muted-foreground">{label}</span>{children}</label>);
}
