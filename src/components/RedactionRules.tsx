import { useState } from "react";
import { Shield, Plus, Trash2, Check, X } from "lucide-react";
import { RedactionRule } from "../types/pdf";
import { DEFAULT_REDACTION_RULES } from "../utils/pdfUtils";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

interface RedactionRulesProps {
  rules: RedactionRule[];
  onRulesChange: (rules: RedactionRule[]) => void;
}

export function RedactionRules({ rules, onRulesChange }: RedactionRulesProps) {
  const [newRuleName, setNewRuleName] = useState("");
  const [newRulePattern, setNewRulePattern] = useState("");

  const toggleRule = (id: string) => {
    onRulesChange(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const addRule = () => {
    if (newRuleName && newRulePattern) {
      const newRule: RedactionRule = {
        id: Math.random().toString(36).substring(2, 9),
        name: newRuleName,
        pattern: newRulePattern,
        enabled: true,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      onRulesChange([...rules, newRule]);
      setNewRuleName("");
      setNewRulePattern("");
    }
  };

  const removeRule = (id: string) => {
    onRulesChange(rules.filter((rule) => rule.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-semibold text-slate-800">Redaction Rules</h2>
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
              rule.enabled
                ? "bg-white border-slate-200 shadow-sm"
                : "bg-slate-50 border-slate-200 opacity-60"
            }`}
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleRule(rule.id)}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                  rule.enabled
                    ? "bg-emerald-500 border-emerald-500"
                    : "bg-white border-slate-300"
                }`}
              >
                {rule.enabled && <Check className="w-3 h-3 text-white" />}
              </button>
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rule.color }}
              />
              <div>
                <p className="font-medium text-slate-800 text-sm">{rule.name}</p>
                <p className="text-xs text-slate-500 font-mono">{rule.pattern}</p>
              </div>
            </div>
            <button
              onClick={() => removeRule(rule.id)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Add Custom Rule</p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="rule-name">Rule Name</Label>
            <Input
              id="rule-name"
              value={newRuleName}
              onChange={(e) => setNewRuleName(e.target.value)}
              placeholder="e.g., Phone Number"
            />
          </div>
          <div>
            <Label htmlFor="rule-pattern">Regex Pattern</Label>
            <Input
              id="rule-pattern"
              value={newRulePattern}
              onChange={(e) => setNewRulePattern(e.target.value)}
              placeholder="e.g., \d{10}"
            />
          </div>
          <Button onClick={addRule} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>
    </div>
  );
}