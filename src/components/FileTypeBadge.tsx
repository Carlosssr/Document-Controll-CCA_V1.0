const STYLES: Record<string, string> = {
  PDF: 'bg-red-100 text-red-700',
  DOCX: 'bg-blue-100 text-blue-700',
  XLSX: 'bg-green-100 text-green-700',
  PPTX: 'bg-orange-100 text-orange-700',
};

export default function FileTypeBadge({ type }: { type: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold tracking-wide ${STYLES[type] ?? 'bg-gray-100 text-gray-600'}`}>
      {type}
    </span>
  );
}
