import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getPageContent } from "@/lib/cms.functions";
import { updatePageContent } from "@/lib/admin.functions";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/pages/$key")({
  head: () => ({ meta: [{ title: "Edit Page | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: PageEditor,
});

function PageEditor() {
  const { key } = useParams({ from: "/admin/pages/$key" });
  const fetchContent = useServerFn(getPageContent);
  const save = useServerFn(updatePageContent);
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin-page", key],
    queryFn: () => fetchContent({ data: { key } }),
  });

  const [json, setJson] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data !== undefined) setJson(JSON.stringify(data ?? {}, null, 2));
  }, [data]);

  const mut = useMutation({
    mutationFn: async () => {
      let parsed: any;
      try {
        parsed = JSON.parse(json);
      } catch (e: any) {
        throw new Error("Invalid JSON: " + e.message);
      }
      return save({ data: { page_key: key, content: parsed } });
    },
    onSuccess: () => {
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-page", key] });
    },
    onError: (e: any) => setError(e.message),
  });

  return (
    <div className="max-w-4xl">
      <Link to="/admin/pages" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All pages
      </Link>
      <h1 className="mt-3 font-display text-3xl font-bold capitalize">{key}</h1>
      <p className="mt-2 text-sm text-muted-foreground">Edit the structured content as JSON. Each key maps to a section on the page.</p>

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <textarea
            value={json}
            onChange={(e) => setJson(e.target.value)}
            spellCheck={false}
            className="mt-6 w-full h-[60vh] rounded-lg bg-black/40 border border-white/10 px-4 py-3 text-xs font-mono"
          />
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          {mut.isSuccess && <p className="mt-2 text-xs text-green-400">Saved.</p>}
          <button
            onClick={() => mut.mutate()}
            disabled={mut.isPending}
            className="mt-4 rounded-lg bg-gradient-brand px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
          >
            {mut.isPending ? "Saving…" : "Save changes"}
          </button>
        </>
      )}
    </div>
  );
}
