import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import MapScreen from './src/screens/MapScreen'
import SpotDetailScreen from './src/screens/SpotDetailScreen'
import ScoreDetailScreen from './src/screens/ScoreDetailScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="SpotDetail" component={SpotDetailScreen} />
        <Stack.Screen name="ScoreDetail" component={ScoreDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
