import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Category } from "@/types";
import { Image } from "lucide-react";

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (category: Partial<Category>) => void;
  category?: Category;
}

export function CategoryModal({ open, onClose, onSave, category }: CategoryModalProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (category) {
      setTitle(category.title);
      setDescription(category.description);
      setPreviewUrl(category.image);
    } else {
      setTitle("");
      setDescription("");
      setPreviewUrl("");
      setImageFile(null);
    }
  }, [category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = () => {
    onSave({
      ...(category && { id: category.id }),
      title,
      description,
      image: previewUrl || "",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 border rounded-lg overflow-hidden">
                {previewUrl ? (
                  <img src={previewUrl} alt={title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Image className="w-8 h-8 text-gray-400" />
                  </div>
                )}
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="max-w-[220px]"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Category title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Category description"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} className="bg-red-500 hover:bg-red-600">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}