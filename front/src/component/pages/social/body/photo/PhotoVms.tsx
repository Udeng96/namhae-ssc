import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, useState } from 'react';
import Slider, { Settings } from 'react-slick';
import { SOCIAL_PHOTO_MENU } from '@/component/constants/socialConst';
import { API, BASE_URL } from '@/component/lib/urls';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PhotoVms = () => {
  const { activePhoto, photos, vmsPhotos, setActivePhoto } = useSocialStore(
    useShallow((s) => ({
      activePhoto:    s.activePhoto,
      photos:         s.photos,
      vmsPhotos:      s.vmsPhotos,
      setActivePhoto: s.actions.setActivePhoto,
    })),
  );

  const [isInfinite, setIsInfinite] = useState(true);

  const vmsSetting: Settings = {
    className:     'photo_cross',
    infinite:      isInfinite,
    arrows:        false,
    slidesToShow:  1,
    autoplay:      true,
    autoplaySpeed: 10000,
    cssEase:       'linear',
    dots:          false,
    afterChange: (cur) => {
      if (cur === vmsPhotos.length - 1 && photos.length > 0) {
        setTimeout(() => {
          setActivePhoto(SOCIAL_PHOTO_MENU.PHOTO);
        }, 10000);
      }
    },
  };

  useEffect(() => {
    if (activePhoto === SOCIAL_PHOTO_MENU.VMS_PHOTO) setIsInfinite(true);
  }, [activePhoto]);

  return (
    <StyledVmsWrap $isActive={activePhoto === SOCIAL_PHOTO_MENU.VMS_PHOTO}>
      <Slider {...vmsSetting}>
        {activePhoto === SOCIAL_PHOTO_MENU.VMS_PHOTO &&
          vmsPhotos.map((vmsPhoto) => (
            <StyledVms
              src={`${BASE_URL}${API.SOCIAL.VMS_FILE(vmsPhoto.seqn)}`}
              key={`CONTENT_IMG_${vmsPhoto.seqn}`}
            />
          ))}
      </Slider>
    </StyledVmsWrap>
  );
};

export default PhotoVms;

const StyledVmsWrap = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  position: absolute;
`;

const StyledVms = styled.img`
  display: inline-block;
  width: 964px !important;
  height: 1131px;
  position: relative;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
