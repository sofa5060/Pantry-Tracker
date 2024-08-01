import React, { useEffect, useState } from "react";
import { PantryItem } from "./schema";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PantryManager } from "@/managers/PantryManager";
import { useToast } from "../ui/use-toast";
import { useDebounce } from "@uidotdev/usehooks";

type PantryListCardProps = {
  item: PantryItem;
};

const PantryListCard = ({ item }: PantryListCardProps) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [quantity, setQuantity] = useState(item.quantity);
  const debouncedQuantity = useDebounce(quantity, 500);

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity <= 1) return;
    setQuantity(quantity - 1);
  };

  const { mutate: removeItem } = useMutation({
    mutationFn: PantryManager.deleteItem,
    onError(error, variables, context) {
      toast({
        title: "Error Occurred",
        description: error.message,
      });
    },
    onSettled: () => {
      // Refetch the pantry items after removing an item
      queryClient.invalidateQueries({
        queryKey: ["pantries"],
      });
    },
  });

  const { mutate: updateQuantity } = useMutation({
    mutationFn: async ({id, quantity}: { id: string; quantity: number }) =>
      await PantryManager.updateQuantity(id, quantity),
    onMutate: async ({id, quantity}) => {
      // Optimistically update the quantity
      const previousPantryItems = queryClient.getQueryData<PantryItem[]>([
        "pantries",
      ]);

      if (!previousPantryItems) return;

      queryClient.setQueryData<PantryItem[]>(["pantries"], (pantryItems) =>
        previousPantryItems.map((item) =>
          item.id === id ? { ...item, quantity: quantity} : item
        )
      );
    },
    onError(error, variables, context) {
      toast({
        title: "Error Occurred",
        description: error.message,
      });
    },
    onSettled: () => {
      // Refetch the pantry items after removing an item
      queryClient.invalidateQueries({
        queryKey: ["pantries"],
      });
    },
  });

  useEffect(() => {
    if (debouncedQuantity === item.quantity) return;
    updateQuantity({id: item.id, quantity: debouncedQuantity});
  }, [debouncedQuantity, item.id, item.quantity]);

  return (
    <Card key={item.id} className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{item.name}</h3>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => decrementQuantity()}
            disabled={item.quantity <= 1}
          >
            <MinusIcon className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => incrementQuantity()}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => removeItem(item.id)}
      >
        Remove
      </Button>
    </Card>
  );
};

export default PantryListCard;
