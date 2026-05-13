'use client';

import { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { Upload, ChevronRight, Check, FileText, AlertCircle } from 'lucide-react';
import { useData } from '@/context/DataContext';
import type { DataRow, ColumnMapping, FieldKey } from '@/lib/dataTypes';

const FIELDS: { key: FieldKey; label: string; required: boolean; hint: string }[] = [
  { key: 'date',     label: 'Date',     required: true,  hint: 'Transaction or order date' },
  { key: 'amount',   label: 'Amount',   required: true,  hint: 'Revenue / payment amount' },
  { key: 'orderId',  label: 'Order ID', required: false, hint: 'Unique order identifier' },
  { key: 'customer', label: 'Customer', required: false, hint: 'Customer name or ID' },
  { key: 'product',  label: 'Product',  required: false, hint: 'Product or service name' },
  { key: 'category', label: 'Category', required: false, hint: 'Product category or type' },
  { key: 'status',   label: 'Status',   required: false, hint: 'Order status (completed / pending …)' },
  { key: 'cost',     label: 'Cost',     required: false, hint: 'Cost / expense amount' },
];

// Try to guess which CSV column maps to each field
function autoDetect(headers: string[]): Partial<ColumnMapping> {
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');
  const find = (...patterns: string[]) => headers.find(h => patterns.includes(norm(h)));
  return {
    date:     find('date', 'orderdate', 'transactiondate', 'invoicedate', 'createdat', 'created', 'timestamp'),
    amount:   find('amount', 'total', 'revenue', 'price', 'payment', 'value', 'gross', 'salesprice', 'unitprice'),
    orderId:  find('orderid', 'order', 'id', 'invoiceid', 'invoice', 'transactionid', 'ref'),
    customer: find('customer', 'customername', 'client', 'buyer', 'name', 'customerid'),
    product:  find('product', 'productname', 'item', 'sku', 'description', 'service', 'itemname'),
    category: find('category', 'type', 'department', 'tag', 'productcategory'),
    status:   find('status', 'state', 'orderstatus'),
    cost:     find('cost', 'expense', 'cogs', 'unitcost'),
  };
}

function parseDate(raw: string): string | null {
  if (!raw) return null;
  // Try ISO, US (MM/DD/YYYY), and EU (DD/MM/YYYY) formats
  const d = new Date(raw);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  // Try DD/MM/YYYY
  const eu = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (eu) {
    const d2 = new Date(`${eu[3]}-${eu[2].padStart(2, '0')}-${eu[1].padStart(2, '0')}`);
    if (!isNaN(d2.getTime())) return d2.toISOString().split('T')[0];
  }
  return null;
}

function parseRow(raw: Record<string, string>, mapping: Partial<ColumnMapping>): DataRow | null {
  const get = (key: FieldKey) => (mapping[key] ? raw[mapping[key]!]?.trim() ?? '' : '');
  const dateStr = parseDate(get('date'));
  const amountStr = get('amount').replace(/[$£€,\s]/g, '');
  if (!dateStr || !amountStr || isNaN(parseFloat(amountStr))) return null;
  return {
    date:     dateStr,
    amount:   parseFloat(amountStr),
    orderId:  get('orderId'),
    customer: get('customer'),
    product:  get('product'),
    category: get('category'),
    status:   get('status'),
    cost:     parseFloat(get('cost').replace(/[$£€,\s]/g, '')) || 0,
  };
}


export function CSVImporter() {
  const router = useRouter();
  const { setRows } = useData();
  const [step, setStep] = useState<'upload' | 'map' | 'preview'>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Partial<ColumnMapping>>({});
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [parseError, setParseError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const processText = (text: string, name: string) => {
    setParseError('');
    const result = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true });
    const fields = result.meta.fields ?? [];
    if (fields.length === 0) { setParseError('Could not read columns. Make sure your file is a valid CSV.'); return; }
    setHeaders(fields);
    setRawRows(result.data);
    setMapping(autoDetect(fields));
    setFileName(name);
    setStep('map');
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => processText(e.target?.result as string, file.name);
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const previewRows = rawRows.slice(0, 5).map(r => parseRow(r, mapping)).filter(Boolean) as DataRow[];
  const mappedOptional = FIELDS.filter(f => !f.required && mapping[f.key]);

  const handleImport = () => {
    const parsed = rawRows.map(r => parseRow(r, mapping)).filter(Boolean) as DataRow[];
    setRows(parsed);
    router.push('/');
  };

  // ── Step 1: Upload ────────────────────────────────────────────────────────
  if (step === 'upload') {
    return (
      <div className="space-y-4">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-violet-500 bg-violet-500/10' : 'border-neutral-700 hover:border-neutral-600 hover:bg-neutral-900'
          }`}
        >
          <input ref={fileRef} type="file" accept=".csv" className="hidden"
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <Upload className="w-10 h-10 mx-auto mb-4 text-neutral-500" />
          <p className="text-white font-medium mb-1">Drop your CSV here or click to browse</p>
          <p className="text-neutral-500 text-sm">Works with Shopify, Square, Stripe, Excel, Google Sheets exports</p>
        </div>

        {parseError && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            <AlertCircle className="w-4 h-4 shrink-0" /> {parseError}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Not sure about the format?</span>
          <a
            href="/sample-data.csv"
            download="syrklytical-sample.csv"
            className="text-violet-400 hover:text-violet-300 transition-colors"
            onClick={e => e.stopPropagation()}
          >
            Download sample CSV →
          </a>
        </div>
      </div>
    );
  }

  // ── Step 2: Map columns ───────────────────────────────────────────────────
  if (step === 'map') {
    const canContinue = !!(mapping.date && mapping.amount);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <FileText className="w-4 h-4" />
          <span>{fileName}</span>
          <span className="text-neutral-600">· {rawRows.length.toLocaleString()} rows · {headers.length} columns detected</span>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-1">Map your columns</h3>
          <p className="text-neutral-500 text-sm mb-6">We've auto-detected what we can. Map at least Date and Amount to continue.</p>
          <div className="space-y-4">
            {FIELDS.map(field => (
              <div key={field.key} className="flex items-start gap-4">
                <div className="w-32 shrink-0 pt-2">
                  <p className="text-sm font-medium text-white">
                    {field.label}{field.required && <span className="text-violet-400 ml-1">*</span>}
                  </p>
                  <p className="text-xs text-neutral-600 mt-0.5">{field.hint}</p>
                </div>
                <div className="flex-1 max-w-xs">
                  <select
                    value={mapping[field.key] ?? ''}
                    onChange={e => setMapping(m => ({ ...m, [field.key]: e.target.value || undefined }))}
                    className="w-full bg-neutral-800 border border-neutral-700 text-sm text-white rounded-md px-3 py-2 focus:outline-none focus:border-violet-500"
                  >
                    <option value="">— Not mapped —</option>
                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>
                {mapping[field.key] && <Check className="w-4 h-4 text-emerald-400 mt-2.5 shrink-0" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setStep('upload')} className="text-sm text-neutral-500 hover:text-white transition-colors">
            ← Choose different file
          </button>
          <button
            disabled={!canContinue}
            onClick={() => setStep('preview')}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium px-5 py-2 rounded-md transition-colors"
          >
            Preview data <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // ── Step 3: Preview ───────────────────────────────────────────────────────
  const displayKeys: FieldKey[] = ['date', 'amount', 'customer', 'product', 'category', 'status'];
  const visibleKeys = displayKeys.filter(k => k === 'date' || k === 'amount' || mapping[k]);
  const validCount = rawRows.map(r => parseRow(r, mapping)).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h3 className="text-white font-semibold mb-1">Preview</h3>
        <p className="text-neutral-500 text-sm mb-4">
          First {previewRows.length} of <span className="text-white">{rawRows.length.toLocaleString()} rows</span>
          {validCount < rawRows.length && (
            <span className="text-amber-400 ml-2">({rawRows.length - validCount} rows skipped — missing date or amount)</span>
          )}
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-neutral-800">
                {visibleKeys.map(k => (
                  <th key={k} className="pb-3 text-neutral-500 font-medium capitalize pr-6">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {previewRows.map((row, i) => (
                <tr key={i} className="hover:bg-neutral-800/40">
                  {visibleKeys.map(k => (
                    <td key={k} className="py-2.5 pr-6 text-neutral-300">
                      {k === 'amount' ? `$${row.amount.toFixed(2)}` : String((row as unknown as Record<string, unknown>)[k] || '—')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-neutral-900 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="flex-1">
          <p className="text-white text-sm font-medium">
            Ready to import {validCount.toLocaleString()} transactions
            {mappedOptional.length > 0 && ` with ${mappedOptional.map(f => f.label.toLowerCase()).join(', ')}`}
          </p>
          <p className="text-neutral-500 text-xs mt-0.5">Data is stored locally in your browser — never sent to a server</p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setStep('map')} className="text-sm text-neutral-500 hover:text-white transition-colors">
          ← Back to mapping
        </button>
        <button
          onClick={handleImport}
          className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-6 py-2 rounded-md transition-colors"
        >
          Import & open dashboard →
        </button>
      </div>
    </div>
  );
}
