import lottie from 'lottie-web';
import { useEffect } from 'react';

import mdtLogo from '../../assets/lottie/logo.json';
import { useProgressiveIncrementorHook } from '../../hooks/progressiveIncrementor';
import styles from './Loader.module.scss';

interface IStateProps {
  isFullScreen?: boolean;
  className?: string;
  isProgressVisible?: boolean;
  callBack?: (x: boolean) => void;
  isBackgroundTransparent?: boolean;
}

/**
 * Loader component
 * Renders a loader with a logo animation
 * @param {IStateProps} props - Component props
 * @returns {React.ReactElement} The rendered Loader component
 */
const Loader = ({
  isFullScreen = true,
  className = '',
  isProgressVisible = false,
  isBackgroundTransparent = true,
  callBack = (x: boolean) => x
}: IStateProps) => {
  /**
   * Loads the logo animation
   */
  useEffect(() => {
    const instance = lottie.loadAnimation({
      container: document.querySelector('#mdt-logo') as Element,
      animationData: mdtLogo,
      renderer: 'svg',
      loop: true,
      autoplay: true
    });
    return () => instance.destroy();
  }, []);

  /**
   * Handles the progressive incrementor hook
   */
  const count = useProgressiveIncrementorHook({ displayProgress: isProgressVisible, callBack });
  return (
    <div
      className={`${styles.loaderBackdrop} ${isFullScreen ? styles.fullScreen : ''} ${
        isBackgroundTransparent ? '' : styles.backgroundOpaque
      }`}
      data-testid='loader'
    >
      <div className={`${className}`}>
        <div id='mdt-logo' style={{ width: 75, height: 75 }}>
          {isProgressVisible && <div className={styles.loaderContainer}>{count}%</div>}
        </div>
        <div className={`${isProgressVisible ? styles.loaderBackground : ''}`} />
      </div>
    </div>
  );
};

export default Loader;
