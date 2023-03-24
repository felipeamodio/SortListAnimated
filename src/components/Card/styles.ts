import styled from "styled-components/native";

export const HEIGHT = 68;
export const MARGIN_BOTTOM = 12;

export const Container = styled.View`
    width: 100%;
    height: ${HEIGHT}px;
    border-radius: ${MARGIN_BOTTOM}px;
    background-color: #595959;
    padding: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;

export const Label = styled.Text`
    color: #FFFFFF;
    font-size: 20px;
    font-weight: bold;
`;