import styled from 'styled-components';
import { useCallback, useEffect, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCommonStore } from '@/component/stores/commonStore';
import { useHomeStore }   from '@/component/stores/homeStore';
import { useScheStore }   from '@/component/stores/scheStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';
import { ScheLastNode, ScheParentNode, ScheRootNode } from '@/component/types/sche';
// ── 하위 영역 ────────────────────────────────────────────────
import ScheFile from '@/component/pages/manage/sche/ScheFile';
import ScheMain from '@/component/pages/manage/sche/ScheMain';
// ── 모달 / 토스트 ────────────────────────────────────────────
import DelModal   from '@/component/pages/manage/sche/main/modal/del/DelModal';
import EditModal  from '@/component/pages/manage/sche/main/modal/edit/EditModal';
import FileModal  from '@/component/pages/manage/sche/file/modal/FileModal';
import BoardModal from '@/component/pages/manage/sche/onboard/BoardModal';
import PrevNorm   from '@/component/pages/manage/sche/main/modal/prev/norm/PrevNorm';
import PrevEmer   from '@/component/pages/manage/sche/main/modal/prev/emer/PrevEmer';
import ScheToast  from '@/component/pages/manage/sche/toast/ScheToast';
import FileToast  from '@/component/pages/manage/sche/toast/FileToast';

/**
 * ScheRoot — 경로당 콘텐츠 관리 화면
 * - scheNodes 트리 빌드 (areaRoles + scFacs → useMemo 캐싱)
 * - 모달 / 토스트 마운트
 * - ScheFile + ScheMain 렌더링
 */
const ScheRoot = ({ isShow }: { isShow: boolean }) => {
  const { areaRoles, setModal } = useCommonStore(
    useShallow((s) => ({
      areaRoles: s.areaRoles,
      setModal:  s.actions.setModal,
    })),
  );

  const scFacs       = useHomeStore((s) => s.scFacs);
  const setScheNodes = useScheStore((s) => s.actions.setScheNodes);

  // ── 경로당 트리 빌드 ───────────────────────────────────────
  // areaRoles / scFacs 참조가 실제로 바뀔 때만 재계산
  const scheNodes = useMemo<ScheRootNode[]>(() => {
    const parentNodes: ScheParentNode[] = areaRoles.map((areaRole) => {
      const lastNodes: ScheLastNode[] = scFacs
        .filter((sc) => sc.areaId.substring(0, 7) === areaRole.areaCd.substring(0, 7))
        .map((sc) => ({ value: `${sc.mgtNo}/${sc.facNm}`, label: sc.facNm }));
      return { value: areaRole.areaCd, label: areaRole.znNm, children: lastNodes };
    });
    return [{ value: 'all/전체', label: '전체', children: parentNodes }];
  }, [areaRoles, scFacs]);

  // scheNodes 참조가 바뀔 때만 스토어에 반영
  useEffect(() => {
    setScheNodes(scheNodes);
  }, [scheNodes]);

  // ── 가이드 모달 오픈 (참조 안정화) ────────────────────────
  const handleOpenGuide = useCallback(
    () => setModal(SCHE_MODAL_TYPE.BOARD),
    [setModal],
  );

  return (
    <StyledSche $isShow={isShow}>
      {/* ── 헤더 ── */}
      <StyledScheHead>
        <StyledScheHeadNm>
          경로당 콘텐츠 관리 <span>Dashboard</span>
        </StyledScheHeadNm>
        <StyledOnBoardBtn onClick={handleOpenGuide}>
          사용 가이드
        </StyledOnBoardBtn>
      </StyledScheHead>

      {/* ── 모달 / 토스트 ── */}
      <DelModal />
      <EditModal />
      <FileModal />
      <BoardModal />
      <PrevNorm />
      <PrevEmer />
      <ScheToast />
      <FileToast />

      {/* ── 본문 ── */}
      <StyledScheBody>
        <ScheFile />
        <ScheMain />
      </StyledScheBody>
    </StyledSche>
  );
};

export default ScheRoot;

// ── Styled ────────────────────────────────────────────────────
const StyledSche = styled.section<{ $isShow: boolean }>`
  /*
   * display: block/none 대신 visibility + opacity + transition 사용
   * - position: absolute 이므로 레이아웃에 영향 없음
   * - 화면 전환 시 0.15s fade로 깜빡임 제거
   * - pointer-events: none으로 숨김 상태 인터랙션 차단
   */
  visibility:     ${({ $isShow }) => ($isShow ? 'visible'  : 'hidden')};
  opacity:        ${({ $isShow }) => ($isShow ? 1          : 0)};
  pointer-events: ${({ $isShow }) => ($isShow ? 'auto'     : 'none')};
  transition: opacity 0.15s ease, visibility 0.15s ease;

  position: absolute;
  width: calc(100% - 60px);
  height: 100%;
  top: 48px;
  right: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 32px 32px 38px 32px;
  box-sizing: border-box;
`;

const StyledScheHead = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledScheHeadNm = styled.h2`
  font-size: 20px;
  font-weight: 600;

  span {
    padding-left: 6px;
    font-size: 22px;
    font-weight: 200;
    background: linear-gradient(270deg, #7a45ff 0%, #9c7bff 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const StyledOnBoardBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 11px 20px;
  font-size: 16px;
  letter-spacing: -0.32px;
  color: #d9dfff;
  border-radius: 999px;
  border: 2px solid #7a45ff;
  background: rgba(122, 69, 255, 0.2);
  cursor: pointer;

  &::before {
    content: '';
    display: block;
    width: 18px;
    height: 18px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 18 18' fill='none'%3E%3Ccircle cx='9' cy='9' r='7.89286' stroke='white' stroke-width='1.21429'/%3E%3Ccircle cx='8.99956' cy='5.35491' r='1.21429' fill='white'/%3E%3Cpath d='M10.215 8.39621C10.215 8.0589 9.55974 7.78906 9.12287 7.78906C8.57678 7.78906 8.05949 7.89025 7.78645 8.39621C7.06738 9.72872 8.57679 8.4974 8.57679 9.00335C8.57679 9.5093 8.39358 10.2176 7.78645 11.4319C7.26108 12.4827 6.57219 13.8605 7.78645 13.8605C9.60794 13.8605 10.6402 13.1522 10.8222 12.6462C10.8222 12.3089 10.7179 11.7199 10.215 12.0391C8.93974 12.8486 8.27148 13.2533 9.60791 10.8248C10.2301 9.69417 10.215 8.56486 10.215 8.39621Z' fill='white'/%3E%3C/svg%3E");
    background-size: cover;
    background-repeat: no-repeat;
  }

  &:hover {
    background: #7a45ff;
    color: #fff;
  }
`;

const StyledScheBody = styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  gap: 8px;
  margin-top: 7px;
`;
