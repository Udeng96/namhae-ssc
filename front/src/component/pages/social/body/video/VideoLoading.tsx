import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';

/** 이 시간이 지나면 안내 문구를 재시도 안내로 바꾼다 (ms) */
const SLOW_AFTER_MS = 10000;

/**
 * 영상 영역 로딩 표시.
 *
 * 모니터를 켠 직후 유튜브 목록 조회가 끝나기 전까지 잠깐 표출된다.
 * (표출 순서가 유튜브 → 스케줄 영상 이므로 유튜브 조회를 기다린다)
 *
 * 노출 조건은 SocialVideo 에서 activeVideo === NONE && !videoLoaded 로 판정하며,
 * videoLoaded 는 SocialBody 가 조회 완료 또는 10초 상한에서 올린다.
 * 바탕색은 VideoYoutube 의 StyledYoutubeBox 와 같은 #000 이라 영상으로 넘어갈 때
 * 화면이 깜빡이지 않는다.
 */
const VideoLoading = () => {
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setIsSlow(true), SLOW_AFTER_MS);
    return () => clearTimeout(id);
  }, []);

  return (
    <StyledLoading>
      <StyledSpinner viewBox="0 0 48 48" aria-hidden="true">
        <defs>
          <linearGradient id="videoLoadingGradient">
            <stop offset="0%"   stopColor="#fff" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
          </linearGradient>
        </defs>
        <StyledPath
          fill="none"
          stroke="url(#videoLoadingGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          cx="24"
          cy="24"
          r="20.5"
        />
      </StyledSpinner>
      {/* 스피너는 계속 돌려 "멈춘 게 아니라 계속 시도 중"임을 보여준다 */}
      <StyledMessage>
        {isSlow ? '잠시 후 다시 시도합니다' : '영상을 불러오는 중입니다'}
      </StyledMessage>
    </StyledLoading>
  );
};

export default VideoLoading;

const rotator = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// 원본 spinner.css 와 동일한 dasharray(=2πr, r=20.5) / 1.4s 주기
const dash = keyframes`
  0%   { stroke-dashoffset: 131.946864; }
  50%  { stroke-dashoffset: 65.973432; transform: rotate(180deg); }
  100% { stroke-dashoffset: 131.946864; transform: rotate(360deg); }
`;

const StyledLoading = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const StyledSpinner = styled.svg`
  width: 120px;
  height: 120px;
  animation: ${rotator} 1.4s linear infinite;
`;

const StyledPath = styled.circle`
  stroke-dasharray: 131.946864;
  stroke-dashoffset: 0;
  transform-origin: center;
  animation: ${dash} 1.4s linear infinite;
`;

const StyledMessage = styled.p`
  margin: 0;
  color: #fff;
  font-size: 30px;
  font-weight: 500;
  letter-spacing: -0.6px;
`;
