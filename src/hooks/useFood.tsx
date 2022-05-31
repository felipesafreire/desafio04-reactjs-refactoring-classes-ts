import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { Food } from '../types';

interface FoodProviderProps {
  children: ReactNode;
}

type FoodInput = Omit<Food, 'id' | 'available'>

interface FoodContextData {
  foods: Food[],
  deleteFood: (foodId: number) => void;
  createFood: (food: FoodInput) => void;
  updateFood: (food: Food) => void;
  updateAvailable: (foodId: number, isAvailable: boolean) => void;
}

const FoodContext = createContext<FoodContextData>({} as FoodContextData);

export function FoodProvider({ children }: FoodProviderProps): JSX.Element {

  const [foods, setFoods] = useState<Food[]>([])

  useEffect(() => {
    api.get<Food[]>('foods').then(response => {
      setFoods(response.data)
    });
  }, []);

  const deleteFood = async (foodId: number) => {
    const foodsArr = [...foods]
    const updateFoods = foodsArr.filter(food => food.id !== foodId)

    await api.delete(`foods/${foodId}`)
    setFoods(updateFoods)

  }

  const createFood = async (foodInput: FoodInput) => {
    const response = await api.post('foods', {
      ...foodInput,
      available: true,
    })

    const food = response.data;
    setFoods([...foods, food])

  }

  const updateFood = async (food: Food) => {

    const response = await api.put(`foods/${food.id}`, food)

    const foodsUpdated = foods.map((food) =>
      food.id !== response.data.id ? food : response.data
    );

    setFoods(foodsUpdated)

  }

  const updateAvailable = async (foodId: number, isAvailable: boolean) => {

    const updateFoods = [...foods]
    const food = updateFoods.find(food => food.id === foodId)

    if (!food) {
      throw Error();
    }

    await api.put(`foods/${foodId}`, {
      ...food,
      available: isAvailable,
    })

    food.available = isAvailable
    setFoods(updateFoods)

  }

  return (
    <FoodContext.Provider
      value={{ foods, deleteFood, createFood, updateFood, updateAvailable }}
    >
      {children}
    </FoodContext.Provider>
  );
}

export function useFood(): FoodContextData {
  const context = useContext(FoodContext);

  return context;
}
