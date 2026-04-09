import styled from 'styled-components';
import { SOCIAL_IMAGE } from '@/component/lib/socialImage';
import { useEffect, useState } from 'react';
import { SOCIAL_PHOTO_MENU } from '@/component/constants/socialConst';
import { useSocialStore } from '@/component/stores/socialStore';

const IMAGES = [
  SOCIAL_IMAGE.CONTENT.PHOTO.NONE.BACK.ONE,
  SOCIAL_IMAGE.CONTENT.PHOTO.NONE.BACK.TWO,
  SOCIAL_IMAGE.CONTENT.PHOTO.NONE.BACK.THREE,
];

const PhotoNone = () => {
  const activePhoto = useSocialStore((s) => s.activePhoto);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isChange,    setIsChange]    = useState(false);

  // 최초 8초 후 전환 시작
  useEffect(() => {
    const timer = setTimeout(() => setIsChange(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  // 이미지 변경 루프
  useEffect(() => {
    if (isChange) {
      setActiveIndex((prev) => (prev === 2 ? 0 : prev + 1));
    } else {
      const timer = setTimeout(() => setIsChange(true), 8000);
      return () => clearTimeout(timer);
    }
  }, [isChange]);

  useEffect(() => {
    setIsChange(false);
  }, [activeIndex]);

  return (
    <StyledNone $isActive={activePhoto === SOCIAL_PHOTO_MENU.NONE}>
      <StyledNoneBox>
        <StyledNoneBoxIcon />
        <StyledNoneBoxContent>표시할 데이터가 없습니다.</StyledNoneBoxContent>
      </StyledNoneBox>
      <StyledNoneBoxBack $image={IMAGES[activeIndex]} />
    </StyledNone>
  );
};

export default PhotoNone;

const StyledNone = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'flex' : 'none')};
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: absolute;
`;

const StyledNoneBox = styled.div`
  width: 370px;
  height: 205px;
  border-radius: 24px;
  border: 2px solid rgba(255, 255, 255, 0.45);
  background: rgba(255, 255, 255, 0.45);
  box-shadow: 0 20px 40px 0 rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
  position: absolute;
  z-index: 2;
`;

const StyledNoneBoxIcon = styled.div`
  width: 64px;
  height: 64px;
  background: url(${SOCIAL_IMAGE.CONTENT.PHOTO.NONE.ICON});
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 40px;
`;

const StyledNoneBoxContent = styled.p`
  width: 370px;
  height: 30px;
  color: #151c43;
  text-align: center;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.6px;
  position: absolute;
  top: 127px;
`;

const StyledNoneBoxBack = styled.div<{ $image: string }>`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-repeat: no-repeat;
  transition-duration: 2s;
  opacity: 1;
  background-image: url(${({ $image }) => $image});
  position: absolute;
  z-index: 1;
`;
