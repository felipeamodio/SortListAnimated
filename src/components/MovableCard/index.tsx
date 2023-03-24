import { Card, CardProps } from '../Card';
import Animated, { SharedValue } from 'react-native-reanimated';
import * as S from './styles';

// SharedValue - uma variável pra utilizar nas animações
type Props = {
    data: CardProps;
    cardsPosition: SharedValue<number[]>;
    scrollY: SharedValue<number>;
    cardsCount: number;
}

export function MovableCard({data}: Props){
    return(
        <Animated.View>
            <Card
                data={data}
            />
        </Animated.View>
    )
}