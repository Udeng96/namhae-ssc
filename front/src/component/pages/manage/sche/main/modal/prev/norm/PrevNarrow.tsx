import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useScheStore } from '@/component/stores/scheStore';
import { SCHE_IMAGE }   from '@/component/lib/scheImage';
import { SCHE_RESULT_TYPE } from '@/component/constants/scheConst';
import { BASE_URL } from '@/component/lib/urls';

const PrevNarrow = () => {
  const { titleOpt, selectContent, selectNarrowBack } = useScheStore(
    useShallow((s) => ({
      titleOpt:        s.titleOpt,
      selectContent:   s.selectContent,
      selectNarrowBack: s.selectNarrowBack,
    })),
  );

  const [title, setTitle] = useState('제목 없음');

  useEffect(() => {
    setTitle(titleOpt || '제목 없음');
  }, [titleOpt]);

  /** 파일 URL 구성 (확장자 제거 후 경로 조합) */
  const buildBackUrl = () => {
    if (!selectNarrowBack) return null;
    const ext    = selectNarrowBack.fileType.split('/')[1];
    const fileNm = selectNarrowBack.fileNm.replace(`.${ext}`, '');
    return `${BASE_URL}/newfile/${fileNm}/${ext}/${SCHE_RESULT_TYPE.NORM}`;
  };

  const backUrl = buildBackUrl();

  return (
    <StyledBoard>
      {backUrl
        ? <StyledBackImg src={backUrl} />
        : <StyledBackDefault />
      }
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

export default PrevNarrow;

const StyledBoard = styled.div`
  position: relative;
  width: 341px;
  height: 450px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  color: #151C43;
`;

const StyledBackDefault = styled.div`
  width: 100%;
  height: 100%;
  background: url("${SCHE_IMAGE.MAIN.BACK.NONE.NORM}") no-repeat center / 100%;
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
  gap: 32px;
  z-index: 2;
`;

const StyledTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
`;
