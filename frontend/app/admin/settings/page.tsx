"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";

const creditCosts = [
  { feature: "Generate Script", credits: 5 },
  { feature: "Generate SEO", credits: 3 },
  { feature: "Generate Thumbnail", credits: 8 },
  { feature: "Generate Voice", credits: 15 },
  { feature: "Generate Subtitle", credits: 5 },
];

export default function AdminSettingsPage() {
  const [baseUrl, setBaseUrl] = useState(
    typeof window !== "undefined"
      ? (localStorage.getItem("ai_service_url") ?? "")
      : ""
  );
  const { toast } = useToast();

  function saveSettings() {
    localStorage.setItem("ai_service_url", baseUrl);
    toast("Pengaturan berhasil disimpan", "success");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-gray-500">Pengaturan platform.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pengaturan AI Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>AI Service URL</Label>
              <Input
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:8000"
              />
            </div>
            <Button onClick={saveSettings}>Simpan</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Biaya Credits per Fitur</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {creditCosts.map((c) => (
              <div
                key={c.feature}
                className="flex items-center justify-between rounded-lg border px-4 py-3"
              >
                <span>{c.feature}</span>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">
                  {c.credits} credits
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

