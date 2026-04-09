import styled from 'styled-components';
import {useSocialStore} from '@/component/stores/socialStore';
import {useShallow} from 'zustand/react/shallow';
import {useEffect, useState} from 'react';
import {SCHE_IMAGE} from '@/component/lib/scheImage';
import { SCHE_EMER_BACK as SCHE_EMER_BACK_LIST } from '@/component/constants/scheConst';
import {SOCIAL_PHOTO_MENU} from '@/component/constants/socialConst';
import moment from 'moment';

const PhotoEmer = () => {
    const {emers, norms, photos, vmsPhotos, setActivePhoto, activePhoto} = useSocialStore(
        useShallow((s) => ({
            emers: s.emers,
            norms: s.norms,
            photos: s.photos,
            vmsPhotos: s.vmsPhotos,
            setActivePhoto: s.actions.setActivePhoto,
            activePhoto: s.activePhoto,
        })),
    );

    const [backFile, setBackFile] = useState<string>('');
    const [expireTime, setExpireTime] = useState<string>('');
    const [nowTime, setNowTime] = useState<string>('');

    // 배경 이미지 + 만료시간 설정
    useEffect(() => {
        if (emers.length === 0) {
            setExpireTime('');
            return;
        }
        const backImageKey = emers[0].fileList;
        if (backImageKey.length > 0) {
            const fileId = backImageKey[0].fileId;
            if (fileId === 'NONE') {
                setBackFile(SCHE_IMAGE.MAIN.BACK.NONE.NORM);
            } else if (fileId === SCHE_EMER_BACK_LIST[1].cd) {
                setBackFile(SCHE_IMAGE.MAIN.BACK.FIRE);
            } else if (fileId === SCHE_EMER_BACK_LIST[2].cd) {
                setBackFile(SCHE_IMAGE.MAIN.BACK.TYPHOON);
            } else {
                setBackFile(SCHE_IMAGE.MAIN.BACK.SAFETY);
            }
        }
        setExpireTime(emers[0].expireDtm);
    }, [emers]);

    // 1초마다 현재시간 업데이트
    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = moment();
            setNowTime(
                `${now.format('YYYYMMDD')}${now.format('HH')}${now.format('mm')}${now.format('ss')}`,
            );
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // 만료시간 도달 시 다음 화면으로 전환
    useEffect(() => {
        if (!expireTime || !nowTime) return;
        if (Number(nowTime) >= Number(expireTime)) {
            if (norms.length > 0) setActivePhoto(SOCIAL_PHOTO_MENU.NORM);
            else if (photos.length > 0) setActivePhoto(SOCIAL_PHOTO_MENU.PHOTO);
            else if (vmsPhotos.length > 0) setActivePhoto(SOCIAL_PHOTO_MENU.VMS_PHOTO);
            else setActivePhoto(SOCIAL_PHOTO_MENU.NONE);
        }
    }, [nowTime]);

    // EMER이 active인데 데이터가 없으면 (삭제 등) 즉시 다음 우선순위로 전환
    useEffect(() => {
        if (activePhoto !== SOCIAL_PHOTO_MENU.EMER || emers.length > 0) return;
        if (norms.length > 0)          setActivePhoto(SOCIAL_PHOTO_MENU.NORM);
        else if (photos.length > 0)    setActivePhoto(SOCIAL_PHOTO_MENU.PHOTO);
        else if (vmsPhotos.length > 0) setActivePhoto(SOCIAL_PHOTO_MENU.VMS_PHOTO);
        else                           setActivePhoto(SOCIAL_PHOTO_MENU.NONE);
    }, [emers, activePhoto]);

    if (emers.length === 0) return null;

    return (
        <StyledPhotoEmer $isActive={activePhoto === SOCIAL_PHOTO_MENU.EMER}>
            <StyledPhotoEmerBox $backImg={backFile}>
                <StyledPhotoEmerTitle>{emers[0].contentTitle}</StyledPhotoEmerTitle>
                <StyledPhotoEmerContents>
                    <p>{emers[0].contentCntn}</p>
                </StyledPhotoEmerContents>
            </StyledPhotoEmerBox>
        </StyledPhotoEmer>
    );
};

export default PhotoEmer;

const StyledPhotoEmer = styled.div<{ $isActive: boolean }>`
    display: ${({$isActive}) => ($isActive ? 'block' : 'none')};
    width: 100%;
    height: 100%;
    position: absolute;
`;

const StyledPhotoEmerBox = styled.div<{ $backImg: string }>`
    position: relative;
    height: 1131px;
    background: url("${({$backImg}) => $backImg}") no-repeat center / 100%;
    background-size: cover;
`;

const StyledPhotoEmerTitle = styled.p`
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

const StyledPhotoEmerContents = styled.div`
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
