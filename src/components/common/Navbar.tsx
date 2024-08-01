import React, { useState } from "react";
import PantryForm from "../pantry/PantryForm";

const Navbar = () => {

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Pantry Management</h1>
      <PantryForm />
    </div>
  );
};

export default Navbar;
