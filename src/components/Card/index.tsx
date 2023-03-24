import {MaterialIcons} from '@expo/vector-icons';

import * as S  from './styles';

export const CARD_HEIGHT = S.HEIGHT + S.MARGIN_BOTTOM;

export type CardProps = {
    id: number;
    title: string;
}

type Props = {
    data: CardProps;
}

export function Card({data}: Props){
    return(
        <S.Container>
            <S.Label>{data.title}</S.Label>

            <MaterialIcons 
                name='drag-indicator'
                size={32}
                color="#EEEEEE"
            />
        </S.Container>
    )
}