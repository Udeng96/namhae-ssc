/**
 * 홈/이벤트 화면 공통 keyframe 애니메이션
 * - styled-components keyframes 객체
 */
import { keyframes } from 'styled-components';

export const ANI_KEYFRAME = {
  HOME: {
    MAP: {
      /** 배경 이미지 미세 줌인 */
      BACK: keyframes`
        0%   { transform: scale(1); }
        100% { transform: scale(1.015); }
      `,
      /** 전체 지도 페이드인 + 위에서 아래로 */
      WHOLE: keyframes`
        0%   { transform: translateY(15px); opacity: 0; }
        100% { transform: translateY(0);    opacity: 1; }
      `,
      /** 지역 패널 아래에서 위로 팝업 */
      PANEL: keyframes`
        0%   { transform: translateY(90%); opacity: 0; }
        100% { transform: translateX(0);   opacity: 1; }
      `,
    },
    /** 좌측 메뉴 왼쪽에서 오른쪽으로 슬라이드 */
    MENU: keyframes`
      0%   { transform: translateX(-40px); opacity: 0; }
      100% { transform: translateX(0);     opacity: 1; }
    `,
  },
  EVENT: {
    /** 스켈레톤 shimmer */
    SKELETON: keyframes`
      0%   { background-position: 0 0; }
      100% { background-position: -150% 0; }
    `,
    /** 마지막 이벤트 shimmer */
    LAST: keyframes`
      0%   { background-position: -100px 0; }
      100% { background-position: -100% 0; }
    `,
  },
};
