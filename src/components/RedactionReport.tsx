import { AlertTriangle, Shield } from "lucide-react";
import { RedactionMatch } from "../types/pdf";

interface RedactionReportProps {
  matches: RedactionMatch[];
}

export function RedactionReport({ matches }: RedactionReportProps) {
  const groupedMatches = matches.reduce((acc, match) => {
    if (!acc[match.ruleName]) {
      acc[match.ruleName] = [];
    }
    acc[match.ruleName].push(match);
    return acc;
  }, {} as Record<string, RedactionMatch[]>);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-amber-600" />
        <h3 className="text-sm font-semibold text-slate-800">Scan Results</h3>
      </div>
      
      {matches.length === 0 ? (
        <p className="text-sm text-slate-500 italic">No sensitive data detected.</p>
      ) : (
        <div className="space-y-2">
          {Object.entries(groupedMatches).map(([ruleName, items]) => (
            <div key={ruleName} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-amber-800">{ruleName}</span>
                <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                  {items.length} found
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {items.slice(0, 3).map((item) => (
                  <span
                    key={item.id}
                    className="text-xs bg-white border border-amber-300 px-2 py-1 rounded font-mono text-slate-600"
                  >
                    {item.text}
                  </span>
                ))}
                {items.length > 3 && (
                  <span className="text-xs text-amber-700 px-2 py-1">
                    +{items.length - 3} more
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}