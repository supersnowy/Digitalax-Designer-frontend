import React, { useState, useRef } from 'react';
import LazyLoad from 'react-lazyload';
import Button from '@components/buttons/button';
import styles from './styles.module.scss';
import { useRouter } from 'next/router';

const CollectionCard = (props) => {
  const router = useRouter();
  const { id } = router.query;
  const [zoomMedia, setZoomMedia] = useState(false);
  const videoTagRef = useRef();
  const [hasAudio, setHasAudio] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);

  const getAudio = (video) => {
    return (
      video.mozHasAudio ||
      Boolean(video.webkitAudioDecodedByteCount) ||
      Boolean(video.audioTracks && video.audioTracks.length)
    );
  };

  const onClickZoomOut = () => {
    setZoomMedia(true);
  };

  const onClickZoomIn = () => {
    setZoomMedia(false);
  };

  const onClickMute = () => {
    videoTagRef.current.pause();
    setVideoMuted(!videoMuted);
    videoTagRef.current.play();
  };

  const { item } = props;
  const f3mItemLink = `https://market.f3manifesto.xyz/product/${item.id}/${
    item.isAuction ? '1' : item.rarity
  }/${item.isAuction}`;
  const itemLink = `https://${item.isModel ? 'runway' : 'fashion'}.digitalax.xyz/product/${
    item.id
  }/${item.isAuction ? '1' : item.rarity}/${item.isAuction}`;
  const onClickView = () => {
    window.open(id === 'F₃Manifesto' ? f3mItemLink : itemLink, '_blank');
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.collectionName}>{item.name}</div>
      <div className={styles.frameWrapper}>
        <img className={styles.frameBack} src="/images/designer-page/frame.png" />
        <div
          className={zoomMedia ? styles.zoomWrapper : styles.mediaWrapper}
          onClick={() => onClickZoomIn()}
        >
          <LazyLoad>
            {item.animation && item.animation != '' ? (
              <video
                autoPlay
                muted={videoMuted}
                loop
                ref={videoTagRef}
                preload={'auto'}
                onLoadedData={() => {
                  var video = videoTagRef.current;
                  if (getAudio(video)) {
                    setHasAudio(true);
                  } else {
                    setHasAudio(false);
                  }
                }}
              >
                <source
                  src={item.animation.replace('gateway.pinata', 'digitalax.mypinata')}
                  type="video/mp4"
                />
              </video>
            ) : (
              <img src={item.image} />
            )}
          </LazyLoad>
        </div>
        <Button className={styles.zoomButton} onClick={() => onClickZoomOut()}>
          <img src="/images/zoom_btn.png" />
        </Button>
        {item.animation && item.animation != '' && hasAudio && (
          <Button className={styles.muteButton} onClick={() => onClickMute()}>
            {videoMuted ? <img src="/images/audio-off.png" /> : <img src="/images/audio-on.png" />}
          </Button>
        )}
      </div>
      <div className={styles.gotoLink}>
        <Button className={styles.viewButton} onClick={() => onClickView()}>
          VIEW FASHION
        </Button>
        <img src="/images/yellow-neon-arrow.png" onClick={() => onClickView()} />
      </div>
    </div>
  );
};

export default CollectionCard;
