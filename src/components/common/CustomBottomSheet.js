import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import PropTypes from 'prop-types';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { BackHandler, StyleSheet } from 'react-native';
import colors from '../../utils/colors';
import THEME_COLOR from '../../utils/constant';
import { useTheme } from '../hooks';

const CustomBottomSheet = forwardRef(
  (
    {
      children,
      snapPoints = ['30%'],
      onDismiss,
      modalStyle,
      backgroundStyle,
      onChange,
      ListEmptyComponent,
      enableBackHandler = true,
      ...otherProps
    },
    ref,
  ) => {
    const {theme} = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const memoizedSnapPoints = useMemo(() => snapPoints, [snapPoints]);

    const renderBackdrop = useCallback(
      backdropProps => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={1}
          disappearsOnIndex={-1}
        />
      ),
      [],
    );

    useEffect(() => {
      if (!enableBackHandler) return;

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (isModalOpen) {
            ref.current?.dismiss();
            return true;
          }
          return false;
        },
      );

      return () => {
        backHandler.remove();
      };
    }, [isModalOpen, ref, enableBackHandler]);

    const handlePresent = () => {
      setIsModalOpen(true);
    };

    const handleDismiss = () => {
      setIsModalOpen(false);
      if (onDismiss) {
        onDismiss();
      }
    };

    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={ref}
          snapPoints={memoizedSnapPoints}
          onDismiss={handleDismiss}
          onChange={index => setIsModalOpen(index >= 0)}
          backdropComponent={renderBackdrop}
          handleIndicatorStyle={styles.handleIndicator}
          backgroundStyle={[
            styles.background,
            backgroundStyle,
            {backgroundColor: theme === THEME_COLOR ? colors.white : '#212020'},
          ]}
          style={[styles.modal, modalStyle]}
          enablePanDownToClose={true}
          {...otherProps}>
          <BottomSheetView>{children}</BottomSheetView>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  },
);

CustomBottomSheet.propTypes = {
  children: PropTypes.node,
  snapPoints: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  onDismiss: PropTypes.func,
  modalStyle: PropTypes.object,
  backgroundStyle: PropTypes.object,
  onChange: PropTypes.func,
  enableBackHandler: PropTypes.bool,
};

export default CustomBottomSheet;

const styles = StyleSheet.create({
  modal: {
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  handleIndicator: {
    backgroundColor: '#ccc',
  },
  background: {
    backgroundColor: colors.white,
  },
});
