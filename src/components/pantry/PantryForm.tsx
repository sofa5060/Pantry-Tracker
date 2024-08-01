"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { NewPantryItem } from "./schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PantryManager } from "@/managers/PantryManager";
import { useToast } from "../ui/use-toast";

const PantryForm = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [showModal, setShowModal] = useState(false);

  const [newItem, setNewItem] = React.useState<NewPantryItem>({
    name: "",
    quantity: 0,
  });

  const clearForm = () => {
    setNewItem({ name: "", quantity: 0 });
  };

  const { mutate } = useMutation({
    mutationFn: PantryManager.addItem,
    onSuccess: () => {
      clearForm();
      setShowModal(false);
    },
    onError(error) {
      toast({
        title: "Error Occurred",
        description: error.message,
      });
    },
    onSettled: () => {
      // Refetch the pantry items after adding a new item
      queryClient.invalidateQueries({
        queryKey: ["pantries"],
      });
    },
  });

  const handleSubmit = () => {
    mutate(newItem);
  };

  return (
    <>
      <Button onClick={() => setShowModal(true)}>Create New Item</Button>
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Pantry Item</DialogTitle>
            <DialogDescription>
              Fill out the form to add a new item to your pantry.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={handleSubmit}
              disabled={!newItem.name || newItem.quantity <= 0}
            >
              Add Item
            </Button>
            <div>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PantryForm;
