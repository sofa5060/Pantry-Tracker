import { NewPantryItem, PantryItem } from "@/components/pantry/schema";
import { db } from "@/firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  runTransaction,
} from "firebase/firestore";

export class PantryManager {
  static async addItem(item: NewPantryItem) {
    try {
      const docRef = await addDoc(collection(db, "items"), item);
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      throw new Error("Error adding document: " + e);
    }
  }

  static async getItems() {
    try {
      const querySnapshot = await getDocs(collection(db, "items"));

      if (querySnapshot.empty) {
        console.log("No matching documents.");
        return [];
      }

      const items: PantryItem[] = [];
      querySnapshot.forEach((doc) => {
        items.push({...doc.data(), id: doc.id} as PantryItem);
      });

      return items;
    } catch (error) {
      throw new Error("Error getting documents: " + error);
    }
  }

  static async deleteItem(id: string) {
    try {
      await deleteDoc(doc(db, "items", id));
      console.log("Document successfully deleted!");
    } catch (error) {
      throw new Error("Error removing document: " + error);
    }
  }

  static async incrementQuantity(id: string) {
    try {
      const sfDocRef = doc(db, "items", id);

      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        const newQuantity = sfDoc.data().quantity + 1;
        transaction.update(sfDocRef, { quantity: newQuantity });
      });
      console.log("Transaction successfully committed!");
    } catch (error) {
      throw new Error("Error incrementing quantity: " + error);
    }
  }

  static async decrementQuantity(id: string) {
    try {
      const sfDocRef = doc(db, "items", id);

      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        if (sfDoc.data().quantity <= 0) {
          throw "Quantity cannot be negative!";
        }

        const newQuantity = sfDoc.data().quantity - 1;
        transaction.update(sfDocRef, { quantity: newQuantity });
      });
      console.log("Transaction successfully committed!");
    } catch (error) {
      throw new Error("Error decrementing quantity: " + error);
    }
  }

  static async updateQuantity(id: string, quantity: number) {
    try {
      const sfDocRef = doc(db, "items", id);

      await runTransaction(db, async (transaction) => {
        const sfDoc = await transaction.get(sfDocRef);
        if (!sfDoc.exists()) {
          throw "Document does not exist!";
        }

        transaction.update(sfDocRef, { quantity });
      });
      console.log("Transaction successfully committed!");
    } catch (error) {
      throw new Error("Error decrementing quantity: " + error);
    }
  }
}
