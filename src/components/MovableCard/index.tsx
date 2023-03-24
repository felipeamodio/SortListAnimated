import { useState } from 'react';
import { Card, CardProps, CARD_HEIGHT } from '../Card';
import Animated, { SharedValue, runOnJS, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {styles} from './styles';

// SharedValue - uma variável pra utilizar nas animações
type Props = {
    data: CardProps;
    cardsPosition: SharedValue<number[]>;
    scrollY: SharedValue<number>;
    cardsCount: number;
}

export function MovableCard({data, cardsPosition, scrollY}: Props){
    const [moving, setMoving] = useState(false);
    const top = useSharedValue(cardsPosition.value[data.id] * CARD_HEIGHT);

    const longPressGesture = Gesture
    .LongPress()
    .onStart(() => {
        runOnJS(setMoving)(true) //se deixar sem o runOnJS vai dar erro
    })
    .minDuration(100)

    // onTouchesDown - quando o usuário começa a clicar | _ é para omitir o event
    // onUpdate - quando usuário está arrastando
    const panGesture = Gesture
    .Pan()
    .manualActivation(true)
    .onTouchesDown((_, state) => {
        moving ? state.activate() : state.fail();
    }) 
    .onUpdate((event) => {
        top.value = event.absoluteY + scrollY.value;
    })

    const animatedStyle = useAnimatedStyle(() => {
        return{
            top: top.value - CARD_HEIGHT
        }
    });

    return(
        <Animated.View style={[styles.container, animatedStyle]}>
            <GestureDetector gesture={Gesture.Race(panGesture, longPressGesture)}>
                <Card data={data} />
            </GestureDetector>
        </Animated.View>
    )
}