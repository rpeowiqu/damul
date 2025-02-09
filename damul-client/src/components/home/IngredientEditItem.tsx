import { useState } from "react";
import { Ingredient } from "@/types/Ingredient";

interface IngredientEditItemProps {
  ingredient: Ingredient;
}

const IngredientEditItem = ({ ingredient }: IngredientEditItemProps) => {
  const [ingredientName, setIngredientName] = useState<string>(
    ingredient.ingredientName,
  );
  const [registrationDate, setRegistrationDate] = useState<string>(
    ingredient.registrationDate || "2025-02-11",
  );
  const [expiryDate, setExpiryDate] = useState<string>(
    ingredient.expiryDate || "2025-02-11",
  );
  const [storageLocation, setStorageLocation] = useState<string>(
    ingredient.storageLocation || "",
  );
  const [remainingAmount, setRemainingAmount] = useState<string>(
    ingredient.remainingAmount || "0",
  );

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    setExpiryDate(event.target.value);
  const handleIngredientNameChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setIngredientName(event.target.value);
  const handleRegistrationDateChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setRegistrationDate(event.target.value);
  const handleStorageLocationChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setStorageLocation(event.target.value);
  const handleRemainingAmountChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => setRemainingAmount(event.target.value);

  return (
    <div className="space-y-6 bg-white rounded-lg p-6">
      <div>
        <label
          htmlFor="ingredientName"
          className="block text-sm font-medium text-gray-700"
        >
          식자재 이름
        </label>
        <input
          id="ingredientName"
          type="text"
          className="mt-1 block w-full px-3 py-2 text-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          onChange={handleIngredientNameChange}
          value={ingredientName}
        />
      </div>
      <div>
        <label
          htmlFor="registrationDate"
          className="block text-sm font-medium text-gray-700"
        >
          등록일
        </label>
        <input
          id="registrationDate"
          type="date"
          className="mt-1 block w-full px-3 py-2 text-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          onChange={handleRegistrationDateChange}
          value={registrationDate}
        />
      </div>
      <div>
        <label
          htmlFor="expiryDate"
          className="block text-sm font-medium text-gray-700"
        >
          소비기한
        </label>
        <input
          id="expiryDate"
          type="date"
          className="mt-1 block w-full px-3 py-2 text-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          onChange={handleDateChange}
          value={expiryDate}
        />
      </div>
      <div>
        <label
          htmlFor="storageLocation"
          className="block text-sm font-medium text-gray-700"
        >
          보관장소
        </label>
        <input
          id="storageLocation"
          type="text"
          className="mt-1 block w-full px-3 py-2 text-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          onChange={handleStorageLocationChange}
          value={storageLocation}
        />
      </div>
      <div>
        <label
          htmlFor="remainingAmount"
          className="block text-sm font-medium text-gray-700"
        >
          남은 양
        </label>
        <input
          id="remainingAmount"
          type="text"
          className="mt-1 block w-full px-3 py-2 text-gray-800 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
          onChange={handleRemainingAmountChange}
          value={remainingAmount}
        />
      </div>
    </div>
  );
};

export default IngredientEditItem;
