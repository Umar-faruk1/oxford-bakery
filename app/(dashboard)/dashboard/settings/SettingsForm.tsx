import { Settings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save } from "lucide-react";

interface SettingsFormProps {
  settings: Settings;
  setSettings: (settings: Settings) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function SettingsForm({ settings, setSettings, onSubmit }: SettingsFormProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Banner Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  setSettings({ ...settings, bannerUrl: url });
                }
              }}
            />
            {settings.bannerUrl && (
              <div className="mt-2">
                <img
                  src={settings.bannerUrl}
                  alt="Banner"
                  className="max-h-32 rounded-lg object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label>Delivery Fee ($)</Label>
            <Input
              type="number"
              value={settings.deliveryFee}
              onChange={(e) => setSettings({ ...settings, deliveryFee: parseFloat(e.target.value) })}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Service Fee ($)</Label>
            <Input
              type="number"
              value={settings.serviceFee}
              onChange={(e) => setSettings({ ...settings, serviceFee: parseFloat(e.target.value) })}
              step="0.01"
              min="0"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Address</Label>
            <Textarea
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <Button type="submit" className="flex items-center gap-2 bg-red-500 hover:bg-red-600">
          <Save className="w-4 h-4 "  />
          <span>Save Changes</span>
        </Button>
      </form>
    </div>
  );
}