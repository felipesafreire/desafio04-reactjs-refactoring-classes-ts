import { FiCheckSquare } from 'react-icons/fi';

import { Form } from './styles';
import Modal from '../Modal';
import Input from '../Input';
import { useFood } from '../../hooks/useFood';
import { Food } from '../../types';
import { FormHandles } from '@unform/core';
import { createRef } from 'react';

interface ModalAddFoodProps {
  isOpen: boolean;
  setIsOpen: () => void;
}

type FoodInput = Omit<Food, 'id' | 'available'>

export default function ModalAddFood({ isOpen, setIsOpen }: ModalAddFoodProps) {

  const { createFood } = useFood();

  const formRef = createRef<FormHandles>();

  const handleSubmit = async (data: FoodInput) => {
    await createFood(data);
    setIsOpen();
  };

  return (
    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <h1>Novo Prato</h1>
        <Input name="image" placeholder="Cole o link aqui" />

        <Input name="name" placeholder="Ex: Moda Italiana" />
        <Input name="price" type="number" placeholder="Ex: 19.90" />

        <Input name="description" placeholder="Descrição" />
        <button type="submit" data-testid="add-food-button">
          <p className="text">Adicionar Prato</p>
          <div className="icon">
            <FiCheckSquare size={24} />
          </div>
        </button>
      </Form>
    </Modal>
  );

}

