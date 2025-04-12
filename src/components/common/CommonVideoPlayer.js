import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';
import {
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Video from 'react-native-video';
import * as SvgIcon from '../../assets'; // your icons
import { spacing } from '../../styles/spacing';
import colors from '../../utils/colors';

const { width, height } = Dimensions.get('window');

const CommonVideoPlayer = ({
  source,
  backgroundColor = '#000', // Default placeholder background
}) => {
  const videoRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Callbacks for react-native-video
  const handleBuffer = useCallback(({ isBuffering }) => {
    // Handle buffering state if you want
  }, []);

  const handleError = useCallback(error => {
    console.error('Video playback error:', error);
  }, []);

  const handleProgress = useCallback(data => {
    setCurrentTime(data.currentTime);
  }, []);

  const handleLoad = useCallback(meta => {
    setDuration(meta.duration);
  }, []);

  // Called when user taps the placeholder
  const openFullscreenVideo = () => {
    setIsFullScreen(true);
  };

  // Called when user taps the Close (X) button
  const closeFullscreenVideo = () => {
    setIsFullScreen(false);
    // Optionally reset current time or do other cleanup
    // setCurrentTime(0);
  };

  return (
    <View style={styles.container}>
      {/* Placeholder + Play Icon in the main view */}
      <TouchableOpacity
        style={[styles.placeholderContainer, { backgroundColor }]}
        onPress={openFullscreenVideo}
        activeOpacity={0.7}
      >
        <View style={styles.playIconContainer}>
          <SvgIcon.PlayIcon color={colors.white} />
        </View>
      </TouchableOpacity>

      {/* Fullscreen Modal with Video */}
      <Modal
        visible={isFullScreen}
        transparent={false}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={closeFullscreenVideo}
      >
        <View style={styles.fullScreenContainer}>
          <Video
            ref={videoRef}
            source={source}
            style={styles.fullScreenVideoStyle}
            paused={false}        
            controls={true}        
            onBuffer={handleBuffer}
            onError={handleError}
            onProgress={handleProgress}
            onLoad={handleLoad}
            resizeMode="contain"
          />

          {/* Close (X) button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeFullscreenVideo}>
            <SvgIcon.Wrong color={colors.white} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

CommonVideoPlayer.propTypes = {
  source: PropTypes.oneOfType([PropTypes.object, PropTypes.number]).isRequired,
  backgroundColor: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    width: '80%',
    aspectRatio: 2 / 3.5,
    borderRadius: spacing.RADIUS_16,
    overflow: 'hidden',
    marginVertical: 20,
    // You can tweak or remove these
    alignSelf: 'center',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIconContainer: {
    // Centered play icon, with optional background
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 40,
    padding: 15,
  },

  // Fullscreen styles
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenVideoStyle: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: spacing.PADDING_20,
    right: spacing.PADDING_20,
  },
  timelineContainer: {
    position: 'absolute',
    bottom: spacing.PADDING_20,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.PADDING_20,
  },
});

export default CommonVideoPlayer;
