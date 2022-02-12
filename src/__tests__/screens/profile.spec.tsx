import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

//Função que executa o teste // Primeiro parâmetro é o nome do teste, o segundo é a ação do teste


//Suite de Testes - Organizar os testes, por exemplo, teste por página
describe('Profile Screen', () => {
    it('should have placeholder correctly in user name input', () => {
        const { getByPlaceholderText } = render(<Profile />)
        
        const inputName = getByPlaceholderText('Nome');
    
        expect(inputName).toBeTruthy();
    });

    it('should be load user data', () => {
        const { getByTestId } = render(<Profile />);
    
        const inputName = getByTestId('input-name');
        const inputSurname = getByTestId('input-surname');
    
        expect(inputName.props.value).toEqual("Medeiros");
        expect(inputSurname.props.value).toEqual("Willian");
    });
    
    it('should exist title correctly', () => {
        const { getByTestId } = render(<Profile />);
    
        const textTitle = getByTestId('text-title');
        
        expect(textTitle.props.children).toContain('Perfil');
    });
});