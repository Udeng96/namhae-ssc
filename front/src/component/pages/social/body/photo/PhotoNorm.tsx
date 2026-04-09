import styled from 'styled-components';
import { SCHE_IMAGE } from '@/component/lib/scheImage';
import { useSocialStore } from '@/component/stores/socialStore';
import { useEffect, useState } from 'react';
import { API, BASE_URL } from '@/component/lib/urls';
import { SocialFileType } from '@/component/types/social';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';
import { useShallow } from 'zustand/react/shallow';
import { SOCIAL_PHOTO_MENU } from '@/component/constants/socialConst';

const getExt = (fileType: string) => {
  if (fileType.includes('png'))  return 'png';
  if (fileType.includes('jpeg')) return 'jpeg';
  if (fileType.includes('jpg'))  return 'jpg';
  return 'jpg';
};

const stripExt = (fileNm: string, ext: string) => {
  const suffix = '.' + ext;
  return fileNm.endsWith(suffix) ? fileNm.slice(0, -suffix.length) : fileNm;
};

const PhotoNorm = () => {
  const { norms, photos, vmsPhotos, activePhoto, setActivePhoto } = useSocialStore(
    useShallow((s) => ({
      norms:          s.norms,
      photos:         s.photos,
      vmsPhotos:      s.vmsPhotos,
      activePhoto:    s.activePhoto,
      setActivePhoto: s.actions.setActivePhoto,
    })),
  );
  const [backFile, setBackFile] = useState<SocialFileType[]>([]);

  useEffect(() => {
    if (norms.length === 0) return;
    const backFiles = norms[0].fileList;
    if (backFiles.length > 0 && backFiles[0].fileId !== 'none') {
      setBackFile(backFiles);
    } else {
      setBackFile([]);
    }
  }, [norms]);

  // NORM이 active인데 데이터가 없으면 즉시 다음 우선순위로 전환
  useEffect(() => {
    if (activePhoto !== SOCIAL_PHOTO_MENU.NORM || norms.length > 0) return;
    if (photos.length > 0)         setActivePhoto(SOCIAL_PHOTO_MENU.PHOTO);
    else if (vmsPhotos.length > 0) setActivePhoto(SOCIAL_PHOTO_MENU.VMS_PHOTO);
    else                           setActivePhoto(SOCIAL_PHOTO_MENU.NONE);
  }, [norms, activePhoto]);

  if (norms.length === 0) return null;

  return (
    <StyledNormWrap $isActive={activePhoto === SOCIAL_PHOTO_MENU.NORM}>
      <StyledNorm>
        {backFile.length > 0 && (
          <StyledNormBack
            src={(() => {
              const ext = getExt(backFile[0].fileType);
              const contentType = backFile[0].noti ? SCHE_RESULT_TYPE.NORM : SCHE_RESULT_TYPE.CONTENT;
              return `${BASE_URL}${API.SOCIAL.FILE(stripExt(backFile[0].fileNm, ext), ext, contentType)}`;
            })()}
          />
        )}
        <StyledNormTitle>{norms[0].contentTitle}</StyledNormTitle>
        <StyledNormContentBox>
          <p>{norms[0].contentCntn}</p>
        </StyledNormContentBox>
      </StyledNorm>
    </StyledNormWrap>
  );
};

export default PhotoNorm;

const StyledNormWrap = styled.div<{ $isActive: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  width: 100%;
  height: 100%;
  position: absolute;
`;

const StyledNorm = styled.div`
  position: relative;
  height: 1131px;
  background: url("${SCHE_IMAGE.MAIN.BACK.NONE.NORM}") no-repeat center / 100%;
`;

const StyledNormBack = styled.img`
  position: relative;
  display: inline-block;
  width: 964px !important;
  height: 1131px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const StyledNormTitle = styled.p`
  position: absolute;
  left: 50%;
  bottom: 775px;
  transform: translateX(-50%);
  width: 100%;
  padding: 0 56px;
  font-size: 72px;
  font-weight: 900;
  text-align: center;
  letter-spacing: -1.44px;
  -webkit-text-stroke-width: 2px;
  -webkit-text-stroke-color: #151C43;
  color: #fff;
  text-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
  line-height: normal;
`;

const StyledNormContentBox = styled.div`
  position: absolute;
  top: 436px;
  left: 50%;
  transform: translateX(-50%);
  width: 744px;
  height: auto;
  padding: 58px 32px;
  color: #0f1223;
  font-size: 40px;
  font-weight: 400;
  line-height: 1.35;
  border-radius: 36px;
  border: 2px solid #fff;
  background: rgba(255, 255, 255, 0.66);

  p {
    height: 100%;
    line-height: 1.42;
    letter-spacing: -0.8px;
    font-size: 40px;
    font-weight: 400;
    word-break: keep-all;
    white-space: pre-wrap;
  }
`;
