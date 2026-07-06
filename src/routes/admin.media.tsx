import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { uploadMedia, deleteMedia, listMedia } from "@/lib/admin.functions";
import { Upload, Trash2, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  head: () => ({ meta: [{ title: "Media | Admin" }, { name: "robots", content: "noindex,nofollow" }] }),
  component: MediaAdmin,
});

type MediaRow = {
  id: string;
  filename: string;
  public_url: string;
  alt: string | null;
  size_bytes: number | null;
  mime_type: string | null;
  created_at: string;
};

function MediaAdmin() {
  const upload = useServerFn(uploadMedia);
  const remove = useServerFn(deleteMedia);
  const fetchMedia = useServerFn(listMedia);
  const qc = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => (await fetchMedia()) as MediaRow[],
  });

  const upMut = useMutation({
    mutationFn: async (file: File) => {
      if (file.size > 10 * 1024 * 1024) throw new Error("Max 10MB");
      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => {
          const s = r.result as string;
          resolve(s.split(",")[1]);
        };
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      return upload({ data: { filename: file.name, base64, mime_type: file.type || "application/octet-stream" } });
    },
    onSuccess: () => {
      setError(null);
      qc.invalidateQueries({ queryKey: ["admin-media"] });
    },
    onError: (e: any) => setError(e.message),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => remove({ data: { id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-media"] }),
  });

  const onFiles = async (files: FileList | null) => {
    if (!files) return;
    for (const f of Array.from(files)) {
      await upMut.mutateAsync(f);
    }
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">Media</h1>
          <p className="mt-2 text-sm text-muted-foreground">Upload images for use anywhere on the site.</p>
        </div>
        <button
          onClick={() => fileInput.current?.click()}
          disabled={upMut.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-brand px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {upMut.isPending ? "Uploading…" : "Upload"}
        </button>
        <input
          ref={fileInput}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => onFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}

      {isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 glass-strong rounded-2xl p-10 text-center text-sm text-muted-foreground">
          No uploads yet.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {items.map((m) => (
            <div key={m.id} className="glass-strong rounded-xl overflow-hidden group">
              <div className="aspect-square bg-black/40">
                {m.mime_type?.startsWith("image/") ? (
                  <img src={m.public_url} alt={m.alt ?? m.filename} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="grid place-items-center h-full text-xs text-muted-foreground">{m.mime_type}</div>
                )}
              </div>
              <div className="p-3 space-y-2">
                <div className="truncate text-xs" title={m.filename}>{m.filename}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => copy(m.public_url)} className="flex-1 inline-flex items-center justify-center gap-1 rounded bg-white/5 hover:bg-white/10 px-2 py-1 text-xs">
                    {copied === m.public_url ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    {copied === m.public_url ? "Copied" : "Copy URL"}
                  </button>
                  <button onClick={() => { if (confirm("Delete this file?")) delMut.mutate(m.id); }} className="rounded bg-red-500/10 hover:bg-red-500/20 text-red-300 px-2 py-1 text-xs">
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
