import styled from 'styled-components';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonModal,
  CommonModalDimmed,
  CommonModalHide,
  CommonModalShow,
} from '@/component/lib/css';
import { MODAL_IMAGE } from '@/component/lib/constImage';
import { useEventStore } from '@/component/stores/eventStore';
import { fetchPhoneTargetList, fetchDeviceTargetList } from '@/component/api/eventApi';
import { SMS_PRESET } from '@/component/constants/eventCode';
import {
  PhoneTargetFirst,
  BroadDevice,
  PhoneTargetSecond,
  PhoneTarget,
} from '@/component/types/event';
import SmsMsg   from './SmsMsg';
import SmsBroad from './SmsBroad';

import SmsIcon from '@/assets/images/dark/page/Management_Dashboard/icon/icon_title_pop_eventDisseminateMangement.png';

// ─── 수신 불가 시 보여줄 예제 데이터 ─────────────────────
const FALLBACK_SMS_TARGETS: PhoneTargetFirst[] = [
  {
    uprDepartmentCd: '',
    departmentCd: 'DEMO',
    departmentCdNm: '테스트부서',
    departmentFullNm: '테스트부서',
    departmentSe: '',
    departmentSeq: '1',
    departmentRank: '1',
    secondDeptTargetList: [
      {
        uprDepartmentCd: 'DEMO',
        departmentCd: 'DEMO_TEAM1',
        departmentCdNm: '1팀',
        departmentFullNm: '테스트부서 1팀',
        departmentSe: '',
        departmentSeq: '1',
        departmentRank: '1',
        children: [
          { usrNm: '홍길동', departmentCd: 'DEMO_TEAM1', departmentCdNm: '1팀', hpNo: '010-1111-1111' },
          { usrNm: '김철수', departmentCd: 'DEMO_TEAM1', departmentCdNm: '1팀', hpNo: '010-2222-2222' },
        ],
      },
    ],
  },
];

const FALLBACK_BROAD_DEVICES: BroadDevice[] = [
  {
    disabled: 'N', id: 'AREA_01', lat: '34.8417', lon: '128.0908', name: '남해군', pid: '',
    subBroadDeviceList: [
      {
        disabled: 'N', id: 'SC_01', lat: '34.8417', lon: '128.0908', name: '남면', pid: 'AREA_01',
        childBroadDeviceList: [
          { disabled: 'N', id: 'DEV_001', lat: '34.8350', lon: '128.0850', name: '남면 방송1', pid: 'SC_01' },
          { disabled: 'N', id: 'DEV_002', lat: '34.8420', lon: '128.0920', name: '남면 방송2', pid: 'SC_01' },
        ],
      },
    ],
  },
];

// ─── 트리 노드 변환 헬퍼 ─────────────────────────────────
const buildSmsTree = (list: PhoneTargetFirst[]) =>
  list.map((first) => ({
    value: first.departmentCd,
    label: first.departmentCdNm,
    children: first.secondDeptTargetList.map((second: PhoneTargetSecond) => ({
      value: second.departmentCd,
      label: second.departmentCdNm,
      children: second.children.map((user: PhoneTarget) => ({
        value: `${user.usrNm}/${user.hpNo}`,
        label: `${user.usrNm}(${user.hpNo})`,
      })),
    })),
  }));

const buildBroadTree = (list: BroadDevice[]) =>
  list.map((area) => ({
    value: `${area.id}/${area.name}`,
    label: area.name,
    children: area.subBroadDeviceList.map((sc) => ({
      value: `${sc.id}/${sc.name}`,
      label: sc.name,
      children: sc.childBroadDeviceList.map((device) => ({
        value: `${device.id}/${device.name}`,
        label: device.name,
      })),
    })),
  }));

const SmsModal = () => {
  const {
    openOpt,
    sms,
    broadcast,
    setSms,
    setBroadcast,
    setSmsTargetRes,
    setBroadTargetRes,
    setOpenOpt,
    setToastKey,
  } = useEventStore(
    useShallow((state) => ({
      openOpt:          state.openOpt,
      sms:              state.sms,
      broadcast:        state.broadcast,
      setSms:           state.actions.setSms,
      setBroadcast:     state.actions.setBroadcast,
      setSmsTargetRes:  state.actions.setSmsTargetRes,
      setBroadTargetRes: state.actions.setBroadTargetRes,
      setOpenOpt:       state.actions.setOpenOpt,
      setToastKey:      state.actions.setToastKey,
    })),
  );

  // SMS 연락처 조회
  const { data: targetsData, isError: targetsError } = useQuery({
    queryKey: ['sms', 'targets'],
    queryFn:  fetchPhoneTargetList,
    staleTime: Infinity,
  });

  // 방송 장치 조회
  const { data: devicesData, isError: devicesError } = useQuery({
    queryKey: ['sms', 'devices'],
    queryFn:  fetchDeviceTargetList,
    staleTime: Infinity,
  });

  // 연락처 → 스토어 반영 (실패 시 fallback)
  useEffect(() => {
    const list = targetsData?.data?.length ? targetsData.data : (targetsError ? FALLBACK_SMS_TARGETS : null);
    if (list) setSmsTargetRes(list);
  }, [targetsData, targetsError]);

  // 방송 장치 → 스토어 반영 (실패 시 fallback)
  useEffect(() => {
    const list = devicesData?.data?.length ? devicesData.data : (devicesError ? FALLBACK_BROAD_DEVICES : null);
    if (list) setBroadTargetRes(list);
  }, [devicesData, devicesError]);

  // 활성화 조건
  const isSmsActive   = sms.title !== '' && sms.content !== '' && sms.selectedTargets.length > 0;
  const isBroadActive = broadcast.title !== '' && broadcast.content !== '' && broadcast.selectedTargets.length > 0;

  const handleCancel = () => {
    setSms({ title: '', content: '', selectedTargets: [], preset: SMS_PRESET[0] });
    setBroadcast({ title: '', content: '', selectedTargets: [], preset: SMS_PRESET[0] });
    setOpenOpt('');
  };

  const handleApply = () => {
    if (isSmsActive || isBroadActive) {
      setOpenOpt('confirm');
    } else {
      // 유효성 안내 (SMS 우선)
      if (!sms.title)                    setToastKey('NO_SMS_TITLE');
      else if (!sms.content)             setToastKey('NO_SMS_CONTENT');
      else if (!sms.selectedTargets.length) setToastKey('NO_SMS_TARGET');
      else if (!broadcast.title)            setToastKey('NO_BROAD_TITLE');
      else if (!broadcast.content)          setToastKey('NO_BROAD_CONTENT');
      else                                  setToastKey('NO_BROAD_TARGET');
    }
  };

  const isOpen = openOpt === 'sms' || openOpt === 'preset' || openOpt === 'presetBroad';

  return (
    <StyledWrap $isOpen={isOpen}>
      <StyledDimmed />
      <StyledBox>
        <StyledHead>
          <h2>전파내용 상세보기 및 전파 내용 / 전파 대상 수정</h2>
          <StyledClsBtn onClick={handleCancel} />
        </StyledHead>
        <StyledBodyWrap>
          <StyledBody>
            <SmsMsg />
            <SmsBroad />
          </StyledBody>
          <StyledFoot>
            <StyledApplyBtn onClick={handleApply}>확인</StyledApplyBtn>
          </StyledFoot>
        </StyledBodyWrap>
      </StyledBox>
    </StyledWrap>
  );
};

export { buildSmsTree, buildBroadTree };
export default SmsModal;

/* ─── Styled ─────────────────────────────────────────── */
const StyledWrap = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
`;

const StyledDimmed = styled.div`
  ${CommonModalDimmed};
`;

const StyledBox = styled.div`
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: auto;
  height: auto;
  border-radius: 16px;
  background-color: rgba(0, 0, 0, 0.8);
`;

const StyledHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 63px;
  padding: 0 19px 0 24px;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 0.03vw 0.15vw 0 rgba(0,0,0,.2), inset 0 0.03vw 0 0 rgba(232,232,232,.18);
  background-image: linear-gradient(334deg, #2a2c7a 37%, #292564 100%);

  h2 {
    display: flex;
    align-items: center;
    color: #f5f8ff;
    font-size: 19px;
    font-weight: 500;

    &::before {
      content: '';
      display: inline-block;
      width: 34px;
      height: 34px;
      margin-right: 7px;
      background: url(${SmsIcon}) no-repeat center / 100%;
    }
  }
`;

const StyledClsBtn = styled.button`
  width: 28px;
  height: 28px;
  margin-left: auto;
  background: url(${MODAL_IMAGE.CLS.BASE}) no-repeat center / 100%;
  &:hover { background-image: url(${MODAL_IMAGE.CLS.HOVER}); }
`;

const StyledBodyWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: calc(100% - 63px);
  padding: 20px;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  background-image: linear-gradient(334deg, #1a1b3a, #202249 90%);
  box-shadow: 0 0.58px 2.88px 0 rgba(0,0,0,.2);
`;

const StyledBody = styled.div`
  display: flex;
  justify-content: center;
  gap: 14px;
  width: 100%;
`;

const StyledFoot = styled.div`
  display: flex;
  width: 100%;
  padding: 10px 0;
`;

const StyledApplyBtn = styled.button`
  width: 128px;
  height: 36px;
  margin: 0 auto;
  font-family: 'SCDreamM', sans-serif;
  font-size: 15px;
  color: #fff;
  border-radius: 17.52px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.2), inset 0 1px 0 0 rgba(232,232,232,.18);
  background-color: #5d5ce2;
  &:hover { background-color: #6d77fd; }
`;
