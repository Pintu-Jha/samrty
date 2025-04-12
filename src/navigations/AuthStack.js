import * as Screens from '../screens/index';
import NavigationString from './navigationString';

export const AuthStack = Stack => {
  return (
    <>
      <Stack.Screen
        name={NavigationString.LoginScreen}
        component={Screens.LoginScreen}
      />
      <Stack.Screen
        name={NavigationString.InitialScreen}
        component={Screens.InitialScreen}
      />
    </>
  );
};
