import { useState } from 'react';
import { Card, CardProps, CARD_HEIGHT } from '../Card';
import Animated, { SharedValue, runOnJS, useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {styles} from './styles';

// SharedValue - uma variável pra utilizar nas animações
type Props = {
    data: CardProps;
    cardsPosition: SharedValue<number[]>;
    scrollY: SharedValue<number>;
    cardsCount: number;
}

export function MovableCard({data, cardsPosition, scrollY, cardsCount}: Props){
    const [moving, setMoving] = useState(false);
    const top = useSharedValue(cardsPosition.value[data.id] * CARD_HEIGHT);

    function objectMove(positions: number[], from: number, to: number){
        const newPositions = Object.assign({}, positions) //criando um clone das posições

        for(const id in positions){
            if(positions[id] ===  from){
                newPositions[id] = to;
            }
            if(positions[id] ===  to){
                newPositions[id] = from;
            }
        }
        return newPositions;
    }

    const longPressGesture = Gesture
    .LongPress()
    .onStart(() => {
        runOnJS(setMoving)(true);
        //se deixar sem o runOnJS vai dar erro 
    })
    .minDuration(200);

    // onTouchesDown - quando o usuário começa a clicar | _ é para omitir o event
    // onUpdate - quando usuário está arrastando
    const panGesture = Gesture
    .Pan()
    .manualActivation(true)
    .onTouchesDown((_, state) => {
        moving ? state.activate() : state.fail();
    }) 
    .onUpdate((event) => {
        const positionY = event.absoluteY + scrollY.value;
        top.value = positionY - CARD_HEIGHT;

        const startPositionList = 0;
        const endPositionList = cardsCount - 1;
        const currentPosition = Math.floor(positionY / CARD_HEIGHT);

        const newPosition = Math.max(startPositionList, Math.min(currentPosition, endPositionList));

        if(newPosition !== cardsPosition.value[data.id]){
            cardsPosition.value = objectMove(cardsPosition.value, cardsPosition.value[data.id], newPosition)
        }
    })
    .onFinalize(() => {
        runOnJS(setMoving)(false);
    })

    const animatedStyle = useAnimatedStyle(() => {
        return{
            top: top.value - CARD_HEIGHT,
            zIndex: moving ? 1 : 0,
            opacity: withSpring(moving ? 1 : 0.4),
        }
    }, [moving]);

    return(
        <Animated.View style={[styles.container, animatedStyle]}>
            <GestureDetector gesture={Gesture.Race(panGesture, longPressGesture)}>
                <Card data={data} />
            </GestureDetector>
        </Animated.View>
    )
}