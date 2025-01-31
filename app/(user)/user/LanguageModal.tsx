import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
  import { Label } from "@/components/ui/label";
  import { toast } from 'sonner';
  
  interface LanguageModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentLanguage: string;
    onLanguageChange: (language: string) => void;
  }
  
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Español' },
    { value: 'fr', label: 'Français' },
    { value: 'de', label: 'Deutsch' },
  ];
  
  export function LanguageModal({ open, onOpenChange, currentLanguage, onLanguageChange }: LanguageModalProps) {
    const handleLanguageChange = (value: string) => {
      onLanguageChange(value);
      onOpenChange(false);
      toast("Language updated successfully");
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
          </DialogHeader>
          <RadioGroup
            defaultValue={currentLanguage}
            onValueChange={handleLanguageChange}
            className="space-y-3"
          >
            {languages.map((language) => (
              <div key={language.value} className="flex items-center space-x-2">
                <RadioGroupItem value={language.value} id={language.value} />
                <Label htmlFor={language.value}>{language.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </DialogContent>
      </Dialog>
    );
  }