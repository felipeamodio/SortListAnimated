import { useState } from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, { SharedValue, runOnJS, useSharedValue, useAnimatedStyle, withSpring, useAnimatedReaction } from 'react-native-reanimated';

import { Card, CardProps, CARD_HEIGHT } from '../Card';

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
        'worklet';
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

    useAnimatedReaction(() => cardsPosition.value[data.id],
    (currentPosition, previusPosition) => {
        if(currentPosition !== previusPosition){
            if(!moving){
                top.value = withSpring(currentPosition * CARD_HEIGHT)
            }
        }
    }, [moving])

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
    .onTouchesMove((_, state) => {
        moving ? state.activate() : state.fail();
    }) 
    .onUpdate((event) => {
        const positionY = event.absoluteY + scrollY.value;
        top.value = positionY - CARD_HEIGHT;

        const startPositionList = 0;
        const endPositionList = cardsCount - 1;
        const currentPosition = Math.floor(positionY / CARD_HEIGHT);

        //flag pra executar código JS
        'worklet';
        const newPosition = Math.max(startPositionList, Math.min(currentPosition, endPositionList));

        if(newPosition !== cardsPosition.value[data.id]){
            cardsPosition.value = objectMove(cardsPosition.value, cardsPosition.value[data.id], newPosition)
        }
    })
    .onFinalize(() => {
        const newPosition = cardsPosition.value[data.id] * CARD_HEIGHT;
        top.value = withSpring(newPosition)
        runOnJS(setMoving)(false);
    })
    .simultaneousWithExternalGesture(longPressGesture)
    // foi passado o simultaneousWithExternalGesture dessa forma para funcionar a animação nesse caso
    //poderia passar o Simultaneous no lugar do Race no gesture, mas assim é uma prática melhor

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