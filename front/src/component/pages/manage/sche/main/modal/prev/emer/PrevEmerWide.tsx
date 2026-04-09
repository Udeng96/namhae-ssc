import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useScheStore } from '@/component/stores/scheStore';
import { SCHE_IMAGE }   from '@/component/lib/scheImage';
import { SCHE_EMER_BACK } from '@/component/constants/scheConst';

const PrevEmerWide = () => {
  const { selectBack, activeSche, titleOpt, selectContent } = useScheStore(
    useShallow((s) => ({
      selectBack:    s.selectBack,
      activeSche:    s.activeSche,
      titleOpt:      s.titleOpt,
      selectContent: s.selectContent,
    })),
  );

  const [back,  setBack]  = useState<string>(SCHE_EMER_BACK[0].cd);
  const [title, setTitle] = useState('제목 없음');

  useEffect(() => {
    setBack(activeSche ? activeSche.backImage : selectBack);
  }, [activeSche, selectBack]);

  useEffect(() => {
    setTitle(titleOpt || '제목 없음');
  }, [titleOpt]);

  const backSrc: Record<string, string> = {
    [SCHE_EMER_BACK[0].cd]: SCHE_IMAGE.MAIN.BACK.NONE.WIDE,
    [SCHE_EMER_BACK[1].cd]: SCHE_IMAGE.MAIN.BACK.FIRE,
    [SCHE_EMER_BACK[2].cd]: SCHE_IMAGE.MAIN.BACK.TYPHOON,
    [SCHE_EMER_BACK[3].cd]: SCHE_IMAGE.MAIN.BACK.SAFETY,
  };

  return (
    <StyledBoard>
      <StyledBackImg src={backSrc[back] ?? SCHE_IMAGE.MAIN.BACK.NONE.WIDE} />
      <StyledContent>
        <StyledTitle>{title}</StyledTitle>
        <StyledTextBox>
          <p>
            {selectContent
              ? selectContent.split('\n').map((line, i) => <span key={i}>{line}<br /></span>)
              : '내용 없음'}
          </p>
        </StyledTextBox>
      </StyledContent>
    </StyledBoard>
  );
};

export default PrevEmerWide;

const StyledBoard = styled.div`
  position: relative;
  width: 1200px;
  color: #151C43;
  font-weight: 400;
  line-height: normal;
`;

const StyledBackImg = styled.img`
  width: 100%;
  height: 100%;
`;

const StyledContent = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 36px;
  z-index: 2;
`;

const StyledTitle = styled.div`
  font-size: 40px;
  font-weight: 700;
  line-height: 0.75;
  color: #FFF;
  text-align: center;
  text-shadow: 0 0 4px rgba(0,0,0,.24);
  -webkit-text-stroke: 1px #151C43;
`;

const StyledTextBox = styled.div`
  padding: 29px 16px;
  height: auto;
  border-radius: 13px;
  border: 0.72px solid #B19EFF;
  background: rgba(245, 242, 255, 0.66);
  width: fit-content;
  min-width: 682px;
  font-size: 30px;
  font-weight: 400;

  p { line-height: 1; }
`;
