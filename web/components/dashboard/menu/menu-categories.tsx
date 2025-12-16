import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuCategoriesProps {
  disabled?: boolean;
}

export default async function MenuCategories({
  disabled,
}: MenuCategoriesProps) {
  return (
    <Card className="flex-1 ">
      <CardContent>
        <Select disabled={disabled}>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Category 1</SelectItem>
            <SelectItem value="2">Category 2</SelectItem>
            <SelectItem value="3">Category 3</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
