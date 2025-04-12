import { useColorScheme } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme as toggleThemeAction } from '../../api/slice/themeSlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export const useTheme = () => {
  const dispatch = useAppDispatch();
  const systemTheme = useColorScheme();
  const theme = useAppSelector(state => state.theme.theme);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  return {theme: theme || systemTheme, toggleTheme};
};
