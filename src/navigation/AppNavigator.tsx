import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home/HomeScreen';
import ProfileBuilding from '../screens/Onboarding/ProfileBuilding';
const Stack = createNativeStackNavigator();

const AppNavigator = ({ showProfileBuilding }: { showProfileBuilding: boolean }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {showProfileBuilding ? (
        <Stack.Screen name="ProfileBuilding" component={ProfileBuilding} 
        />
      ) : (
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
      )}
      {/* add more private screens here */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
