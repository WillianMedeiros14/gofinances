import React from 'react';

import {
    Container,
    Header,
    Title,
    Icon,
    Footer,
    Amount,
    LastTransiction
} from './styles';

interface Props {
    type: 'up' | 'down' | 'total';
    title: string;
    amount: string;
    lastTransiction: string;
}

const icon = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle',
    total: 'dollar-sign'
}

export function HighlightCard({ type, title, amount, lastTransiction } : Props){
    return (
        <Container type={type}>
            <Header>
                <Title type={type}>{title}</Title>
                <Icon name={icon[type]} type={type} />
            </Header>

            <Footer>
                <Amount type={type}>{amount}</Amount>
                <LastTransiction type={type}>{lastTransiction}</LastTransiction>
            </Footer>
        </Container>
    )
}