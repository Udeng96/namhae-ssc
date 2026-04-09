import styled from 'styled-components';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import {
  CommonModal, CommonModalHide, CommonModalShow,
} from '@/component/lib/css';
import { SCHE_IMAGE }     from '@/component/lib/scheImage';
import { useCommonStore } from '@/component/stores/commonStore';
import { SCHE_MODAL_TYPE } from '@/component/constants/scheConst';

const IMAGES   = [SCHE_IMAGE.BOARD.IMAGE.FIRST,   SCHE_IMAGE.BOARD.IMAGE.SECOND,   SCHE_IMAGE.BOARD.IMAGE.THIRD];
const TOOLTIPS = [SCHE_IMAGE.BOARD.TOOLTIP.FIRST, SCHE_IMAGE.BOARD.TOOLTIP.SECOND, SCHE_IMAGE.BOARD.TOOLTIP.THIRD];

const BoardModal = () => {
  const [activePage, setActivePage] = useState(0);

  const { modal, setModal } = useCommonStore(
    useShallow((s) => ({ modal: s.modal, setModal: s.actions.setModal })),
  );

  const handleCls = () => {
    setModal(SCHE_MODAL_TYPE.NONE);
    setTimeout(() => setActivePage(0), 300);
  };

  return (
    <StyledModal $isOpen={modal === SCHE_MODAL_TYPE.BOARD}>
      <StyledImageList>
        {IMAGES.map((img, i) => (
          <StyledImageItem
            key={i}
            $isActive={activePage === i}
            $imageUrl={img}
            onClick={() => setActivePage(i)}
          >
            <div />
          </StyledImageItem>
        ))}
      </StyledImageList>

      <StyledPageBox>
        <StyledPageIndexBox>
          {TOOLTIPS.map((tip, i) => (
            <StyledPageItem
              key={i}
              $isActive={activePage === i}
              onClick={() => setActivePage(i)}
            >
              <StyledPageNum>{i + 1}</StyledPageNum>
              <StyledPageTooltip $tooltipImg={tip}><div /></StyledPageTooltip>
            </StyledPageItem>
          ))}
        </StyledPageIndexBox>
        <StyledCloseBtn onClick={handleCls}>닫기</StyledCloseBtn>
      </StyledPageBox>
    </StyledModal>
  );
};

export default BoardModal;

const StyledModal = styled.div<{ $isOpen: boolean }>`
  ${CommonModal};
  ${({ $isOpen }) => ($isOpen ? CommonModalShow : CommonModalHide)};
  z-index: 1001 !important;
`;

const StyledImageList = styled.ul`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  width: 100%;
  height: 100%;
`;

const StyledImageItem = styled.li<{ $isActive: boolean; $imageUrl: string }>`
  width: 100%;
  height: 100%;
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};

  div {
    display: inline-block;
    width: 100%;
    height: 100%;
    background-image: url("${({ $imageUrl }) => $imageUrl}");
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
  }
`;

const StyledPageBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 28px;
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledPageIndexBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
`;

const StyledPageItem = styled.li<{ $isActive: boolean }>`
  position: relative;

  div { background: ${({ $isActive }) => ($isActive ? '#7F7AFF' : '#6F6F6F')}; }

  &:hover div {
    cursor: ${({ $isActive }) => ($isActive ? 'default' : 'pointer')};
    &:first-child { background: ${({ $isActive }) => ($isActive ? '#7F7AFF' : '#909090')}; }
    &:last-child  { display: ${({ $isActive }) => ($isActive ? 'none' : 'block')}; }
  }
`;

const StyledPageNum = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.4px;
  border-radius: 50%;
  cursor: pointer;
`;

const StyledPageTooltip = styled.div<{ $tooltipImg: string }>`
  display: none;
  width: auto;
  height: auto;
  position: absolute;
  bottom: calc(100% + 2px);
  left: 50%;
  transform: translateX(-50%);

  div {
    width: 176px;
    height: 35px;
    background: url("${({ $tooltipImg }) => $tooltipImg}") no-repeat !important;
    background-size: contain;
  }
`;

const StyledCloseBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 300px;
  height: 66px;
  margin: 0 auto;
  font-size: 26px;
  font-weight: 500;
  color: #FFF;
  letter-spacing: -0.52px;
  border-radius: 999px;
  background: #848594;
  box-shadow: 0 4px 9px rgba(0,0,0,.25);
  cursor: pointer;

  &:hover { background: #737493; }

  &::before {
    content: '';
    display: block;
    width: 30px;
    height: 30px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 31 30' fill='none'%3E%3Cpath d='M15.5029 13.5908L23.792 5.30566L25.2061 6.71973L16.917 15.0049L25.2061 23.29L23.792 24.7041L15.5029 16.418L7.20605 24.7129L5.79199 23.2988L14.0889 15.0049L5.79199 6.71094L7.20605 5.29688L15.5029 13.5908Z' fill='white'/%3E%3C/svg%3E");
    background-size: cover;
    background-repeat: no-repeat;
  }
`;
