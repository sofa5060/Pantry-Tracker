"use client";
import React, { useState } from "react";
import PantryListCard from "./PantryListCard";
import { PantryItem } from "./schema";
import { Input } from "../ui/input";
import { useDebounce } from "@uidotdev/usehooks";

type PantryListProps = {
  pantryItems: PantryItem[];
};

const PantryList = ({ pantryItems }: PantryListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 100);

  const filteredPantryItems = pantryItems.filter((item) =>
    item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <div className="mx-6 mt-6">
      <div className="flex items-center mb-6 justify-between">
        <h2 className="text-lg font-semibold">
          Pantry List (
          {pantryItems.reduce((acc, item) => acc + item.quantity, 0)}) items
        </h2>
        <Input
          placeholder="Search pantry items"
          className="max-w-96"
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
        {debouncedSearchTerm !== ""
          ? filteredPantryItems.map((item) => (
              <PantryListCard key={item.id} item={item} />
            ))
          : pantryItems.map((item) => (
              <PantryListCard key={item.id} item={item} />
            ))}
      </div>
    </div>
  );
};

export default PantryList;
