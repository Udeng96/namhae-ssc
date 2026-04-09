import styled from 'styled-components';
import {
  CommonFormBox, CommonFormBoxNm, CommonFormBoxVal, CommonFormBoxValDisabled,
} from '@/component/lib/css';
import SelectBox from '@/component/pages/manage/sche/main/board/form/select/SelectBox';
import { useEffect, useState } from 'react';
import { SCHE_EMER_BACK, SCHE_MODE } from '@/component/constants/scheConst';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';

interface Props {
  isNorm: boolean;
}

const TextForm = ({ isNorm }: Props) => {
  const { activeSche, selectBack, selectContent, setSelectContent, scheMode } = useScheStore(
    useShallow((s) => ({
      activeSche:       s.activeSche,
      selectBack:       s.selectBack,
      selectContent:    s.selectContent,
      setSelectContent: s.actions.setSelectContent,
      scheMode:         s.scheMode,
    })),
  );
  const [backOpen, setBackOpen] = useState(false);
  const [back, setBack] = useState<string>(SCHE_EMER_BACK[0].cd);

  useEffect(() => {
    setSelectContent(activeSche ? activeSche.contentCntn : '');
  }, [activeSche]);

  useEffect(() => {
    setBack(activeSche ? activeSche.backImage : selectBack);
  }, [activeSche, selectBack]);

  const handleEnterKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.code === 'Enter' && (selectContent.split('\n') || []).length === 0) {
      e.preventDefault();
    }
  };

  const backNm = SCHE_EMER_BACK.find((i) => i.cd === back)?.nm ?? '';

  return (
    <StyledContent>
      <StyledContentNm>내용*</StyledContentNm>
      <StyledContentVal>
        {scheMode === SCHE_MODE.READ && <StyledDisabled />}
        <textarea
          maxLength={110}
          onKeyDown={handleEnterKey}
          placeholder="내용을 입력해 주세요."
          value={selectContent}
          onChange={(e) => setSelectContent(e.currentTarget.value)}
          rows={5}
        />
        {!isNorm && (
          <StyledContentBack>
            <StyledContentNm>배경 선택</StyledContentNm>
            <StyledContentVal>
              <SelectBox
                type="back"
                optionList={SCHE_EMER_BACK.map((i) => i.nm)}
                setIsOpen={setBackOpen}
                isOpen={backOpen}
                width="100%"
                value={backNm}
              />
            </StyledContentVal>
          </StyledContentBack>
        )}
      </StyledContentVal>
    </StyledContent>
  );
};

export default TextForm;

const StyledContent     = styled.div`${CommonFormBox}`;
const StyledContentNm   = styled.div`${CommonFormBoxNm}`;
const StyledContentBack = styled.div`
  ${CommonFormBox};
  width: 100%;
  align-items: unset;
  flex-wrap: unset;
  margin-top: 8px;
`;
const StyledContentVal  = styled.div`
  ${CommonFormBoxVal};
  textarea {
    width: 345px;
    height: 116px;
    padding: 10px 15px;
    color: #fff;
    line-height: 1.4;
    border-radius: 6px;
    border: 1px solid #090A14;
    background: #12172E;
  }
`;
const StyledDisabled = styled.div`${CommonFormBoxValDisabled}`;
