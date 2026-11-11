"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { files } from "@/content/files";
import { IconButton, Marker } from "@/components/ui-rt";
import { cn } from "@/lib/utils";
import { FileDetail } from "./FileOverlay";
import { STATUS_LABEL, STATUS_MARKER, pad2 } from "./shared";

/** Template view per file: a picker of all sixteen reports beside the selected file's description, template sheet and columns. */
export function TemplateViewer({ index, onIndexChange, onEntity }: { index: number; onIndexChange: (i: number) => void; onEntity: (entity: string) => void }) {
  const file = files[index];
  const n = files.length;
  const listRef = React.useRef<HTMLOListElement>(null);

  // Keep the selected file visible in the (horizontally scrolling, on small screens) picker.
  React.useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>('[aria-current="true"]');
    const list = listRef.current;
    if (!el || !list) return;
    if (list.scrollWidth > list.clientWidth) list.scrollTo({ left: el.offsetLeft - 24, behavior: "smooth" });
  }, [index]);

  return (
    <div className="grid min-w-0 grid-cols-1 gap-8 lg:grid-cols-[272px_minmax(0,1fr)] lg:gap-12">
      <nav aria-label="Choose a report" className="min-w-0">
        <p className="mb-3 t-mono-sm text-muted">
          {n} reports · select one
        </p>
        <ol ref={listRef} data-lenis-prevent className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:-mx-12 sm:px-12 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-border lg:px-0 lg:pb-0">
          {files.map((f, i) => {
            const m = STATUS_MARKER[f.status];
            const on = i === index;
            return (
              <li key={f.id} className="shrink-0 lg:shrink">
                <button
                  type="button"
                  aria-current={on ? "true" : undefined}
                  onClick={() => onIndexChange(i)}
                  title={STATUS_LABEL[f.status]}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-3 rounded-full border px-3 py-2 text-left whitespace-nowrap transition-colors duration-150 lg:rounded-none lg:border-0 lg:border-b lg:border-border lg:py-3 lg:whitespace-normal",
                    on ? "border-primary bg-surface-raised text-on-surface" : "border-border text-body hover:bg-surface hover:text-on-surface"
                  )}
                >
                  <span className="t-mono-sm text-muted tnum">{pad2(f.index)}</span>
                  <span className="min-w-0 flex-1 t-body-md">{f.name}</span>
                  <Marker tone={m.tone} shape={m.shape} size={8} />
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <article aria-labelledby="data-template-title" className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="t-mono-sm text-muted">
              File {pad2(file.index)} of {n} · {STATUS_LABEL[file.status]} · {file.direction === "input" ? "Input" : "Output"}
            </p>
            <h2 id="data-template-title" className="mt-2 t-headline-md text-on-surface">
              {file.name}
            </h2>
            <p className="mt-2 max-w-3xl t-body-lg text-body">{file.plainMeaning}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <IconButton label="Previous report" icon={<ChevronLeft />} size="sm" onClick={() => onIndexChange((index - 1 + n) % n)} />
            <IconButton label="Next report" icon={<ChevronRight />} size="sm" onClick={() => onIndexChange((index + 1) % n)} />
          </div>
        </div>
        <div className="mt-8">
          <FileDetail key={file.id} file={file} onEntity={onEntity} />
        </div>
      </article>
    </div>
  );
}
