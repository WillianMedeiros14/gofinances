import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useTheme } from 'styled-components';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';

import { useAuth } from '../../hooks/auth';

import { 
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from './styles';


export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState< DataListProps[]>([]);
    const [HighlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    function getLastTransactionDate(collection: DataListProps[], type: 'positive' | 'negative'){
        
        const collectionFilttered = collection
        .filter(transaction => transaction.type === type);

        if(collectionFilttered.length === 0){
            return 0;
        }

        const lastTransaction = new Date(
        Math.max.apply(Math, collectionFilttered
        .map(transaction => new Date(transaction.date).getTime())));
    
       return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long' })}`;
    }

    async function loadTransaction(){
        const dataKey = `gofinances:transactions_user:${user.id}`;
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensivesTotal = 0;

        const transactionsFormated: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            } else {
                expensivesTotal += Number(item.amount)
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date = Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return {
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        setTransactions(transactionsFormated);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');
        
        
        const totalInterval = lastTransactionExpensives === 0
        ? 'N??o h?? transa????es' 
        : `1 a ${lastTransactionExpensives}`
        

        //console.log(new Date(lastTransactionEntries));


        const total = entriesTotal - expensivesTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0
                ? 'N??o h?? transa????es'
                : `??ltima entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensivesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives === 0 
                ? 'N??o h?? transa????es'
                : `??ltima sa??da dia ${lastTransactionExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval,
            }
        });

        //console.log(transactionsFormated);
        setIsLoading(false);
    }

    useEffect(() => {
        loadTransaction();
    }, []);

    useFocusEffect(useCallback(() => {
        loadTransaction();
    },[]));

    return (
        <Container> 

        {
            isLoading ? 
            <LoadContainer>
                <ActivityIndicator color={theme.colors.primary} size="large"/>
            </LoadContainer> :
            <>

            <Header>
                <UserWrapper>
                    <UserInfo>
                        <Photo source={{ uri: user.photo}}/>
                        <User>
                            <UserGreeting>Ol??, </UserGreeting>
                            <UserName>{user.name}</UserName>
                        </User>
                    </UserInfo>
                    
                    <LogoutButton onPress={signOut}>
                        <Icon name="power"/>
                    </LogoutButton>
                </UserWrapper>
            </Header>
            
            <HighlightCards>
                <HighlightCard 
                    type="up"
                    title="Entradas" 
                    amount={HighlightData.entries.amount} 
                    lastTransiction={HighlightData.entries.lastTransaction}
                />
                <HighlightCard 
                    type="down"
                    title="Sa??das" 
                    amount={HighlightData.expensives.amount} 
                    lastTransiction={HighlightData.expensives.lastTransaction}
                />
                <HighlightCard 
                    type="total"
                    title="Total" 
                    amount={HighlightData.total.amount} 
                    lastTransiction={HighlightData.total.lastTransaction}
                />
            </HighlightCards>
        
            <Transactions>
                <Title>Listagem</Title>

                <TransactionList                     
                    data={transactions}
                    keyExtractor={ item => item.id }
                    renderItem={({ item }) => <TransactionCard data={item} />}
                />
                
            </Transactions>
            </>
        }
        </Container>
    )
}