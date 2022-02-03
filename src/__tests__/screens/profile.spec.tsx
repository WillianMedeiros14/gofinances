import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

//Função que executa o teste // Primeiro parâmetro é o nome do teste, o segundo é a ação do teste
test('check if show correctly user input name placeholder', () => {
    const { getByPlaceholderText } = render(<Profile />)
    
    const inputName = getByPlaceholderText('Nome');

    expect(inputName.props.placeholder).toBeTruthy();
});