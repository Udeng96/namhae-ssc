import styled from 'styled-components';
import { useSocialStore } from '@/component/stores/socialStore';
import { useShallow } from 'zustand/react/shallow';
import Slider, { Settings } from 'react-slick';
import { useEffect, useState } from 'react';
import { SOCIAL_PHOTO_MENU } from '@/component/constants/socialConst';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { API, BASE_URL } from '@/component/lib/urls';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';

const getExt = (fileType: string) => {
  if (fileType.includes('png'))  return 'png';
  if (fileType.includes('jpeg')) return 'jpeg';
  if (fileType.includes('jpg'))  return 'jpg';
  return 'jpg';
};

// fileNm에 이미 확장자가 포함돼 있을 경우 제거
const stripExt = (fileNm: string, ext: string) => {
  const suffix = '.' + ext;
  return fileNm.endsWith(suffix) ? fileNm.slice(0, -suffix.length) : fileNm;
};

const PhotoSche = () => {
  const { activePhoto, photos, vmsPhotos, setActivePhoto } = useSocialStore(
    useShallow((s) => ({
      activePhoto:    s.activePhoto,
      photos:         s.photos,
      vmsPhotos:      s.vmsPhotos,
      setActivePhoto: s.actions.setActivePhoto,
    })),
  );

  const [isInfinite, setIsInfinite] = useState(true);

  const settings: Settings = {
    className:     'photo',
    infinite:      isInfinite,
    arrows:        false,
    slidesToShow:  1,
    autoplay:      true,
    autoplaySpeed: 10000,
    cssEase:       'linear',
    dots:          false,
    afterChange: (cur) => {
      if (cur === photos.length - 1 && vmsPhotos.length > 0) {
        setTimeout(() => {
          setActivePhoto(SOCIAL_PHOTO_MENU.VMS_PHOTO);
        }, 10000);
      }
    },
  };

  useEffect(() => {
    if (activePhoto === SOCIAL_PHOTO_MENU.PHOTO) setIsInfinite(true);
  }, [activePhoto]);

  if (activePhoto !== SOCIAL_PHOTO_MENU.PHOTO || photos.length === 0) return null;

  return (
    <StyledSche $isActive={activePhoto === SOCIAL_PHOTO_MENU.PHOTO}>
      <Slider {...settings}>
        {photos.map((img) => {
          const ext = getExt(img.fileType);
          const contentType = img.noti ? SCHE_RESULT_TYPE.NORM : SCHE_RESULT_TYPE.CONTENT;
          const src = `${BASE_URL}${API.SOCIAL.FILE(stripExt(img.fileNm, ext), ext, contentType)}`;
          return (
            <StyledContent
              key={img.fileId}
              src={src}
              onLoad={() => console.log('이미지 로드됨:', src)}
            />
          );
        })}
      </Slider>
    </StyledSche>
  );
};

export default PhotoSche;

const StyledSche = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  position: absolute;
`;

const StyledContent = styled.img`
  position: relative;
  display: inline-block;
  width: 964px !important;
  height: 1131px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;
