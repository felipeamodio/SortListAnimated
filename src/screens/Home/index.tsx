import {CARDS} from '../../data/cards';

import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';

import { MovableCard } from '../../components/MovableCard';
import { CARD_HEIGHT } from '../../components/Card';
import Header from '../../components/Header';

import * as S from './styles';

export function Home(){

    const scrollY = useSharedValue(0);
    const cardsPosition = useSharedValue(listToObjetct(CARDS));

    const handleScroll = useAnimatedScrollHandler((event) => {
        scrollY.value = event.contentOffset.y
    });

    //converter um objeto a partir do array pra identificar o elemento quando a posição muda
    function listToObjetct(list: typeof CARDS){
        const listOfCards = Object.values(list)

        const object: any = {};

        listOfCards.forEach((card, index) => {
            object[card.id] = index;
        });
        return object;
    }

    return(
        <S.Container>
            <Header />

            <Animated.ScrollView 
                showsVerticalScrollIndicator={false} 
                style={{
                    flex: 1,
                    padding: 32,
                    position: 'relative'
                }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{height: CARDS.length * CARD_HEIGHT}}
                >
                {
                    CARDS.map((item) => (
                        <MovableCard 
                            key={item.id}
                            data={item}
                            scrollY={scrollY}
                            cardsPosition={cardsPosition}
                            cardsCount={CARDS.length}
                        />
                    ))
                }
            </Animated.ScrollView>
        </S.Container>
    )
}