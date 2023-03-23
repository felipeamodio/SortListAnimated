import {CARDS} from '../../data/cards';

import {Card} from '../../components/Card';
import Header from '../../components/Header';

import * as S from './styles';

export function Home(){
    return(
        <S.Container>
            <Header />

            <S.Scroll showsVerticalScrollIndicator={false}>
                {
                    CARDS.map((item) => (
                        <Card 
                            key={item.id}
                            data={item}
                        />
                    ))
                }
            </S.Scroll>
        </S.Container>
    )
}