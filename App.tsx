import { StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {Home} from './src/screens/Home';

export default function App() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar 
        barStyle="light-content"
        backgroundColor="transparent"
        translucent 
      />
      <Home />
    </GestureHandlerRootView>
  );
}
