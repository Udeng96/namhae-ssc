import styled from 'styled-components';
import { CommonFormBox, CommonFormBoxNm, CommonFormBoxVal } from '@/component/lib/css';
import { useScheStore } from '@/component/stores/scheStore';
import { useShallow } from 'zustand/react/shallow';
import { SCHE_TYPE } from '@/component/constants/scheConst';

const SortForm = () => {
  const { activeType, setActiveType, setActiveSche, setSelectContent } = useScheStore(
    useShallow((s) => ({
      activeType:       s.activeType,
      setActiveType:    s.actions.setActiveType,
      setActiveSche:    s.actions.setActiveSche,
      setSelectContent: s.actions.setSelectContent,
    })),
  );

  const handleSort = (id: string) => {
    setActiveType(id);
    setSelectContent('');
    setActiveSche(null);
  };

  return (
    <StyledSort>
      <StyledSortNm>구분*</StyledSortNm>
      <StyledSortVal>
        <StyledSortValBox>
          {[
            { id: SCHE_TYPE.NORM,  label: '일반 공지' },
            { id: SCHE_TYPE.EMER,  label: '긴급 공지' },
          ].map(({ id, label }) => (
            <StyledSortLabel key={id} htmlFor={id}>
              <StyledSortInput
                type="radio"
                id={id}
                name="notice"
                checked={activeType === id}
                onChange={() => handleSort(id)}
              />
              <span />
              <p>{label}</p>
            </StyledSortLabel>
          ))}
        </StyledSortValBox>
      </StyledSortVal>
    </StyledSort>
  );
};

export default SortForm;

const StyledSort    = styled.div`${CommonFormBox}`;
const StyledSortNm  = styled.div`${CommonFormBoxNm}`;
const StyledSortVal = styled.div`${CommonFormBoxVal}`;

const StyledSortValBox = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
  gap: 0 24px;
`;

const StyledSortLabel = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  width: auto;
  height: 12px;
  margin: 0;
  &:hover { cursor: pointer; p { color: #9C7BFF; cursor: pointer; } }
  span {
    position: relative;
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 7px;
    border-radius: 50%;
    border: 1px solid #829099;
    background: #1A203A;
    cursor: pointer;
    &:after { content: ''; display: block; }
  }
  p { font-size: 13px; font-weight: 300; color: inherit; cursor: pointer; }
`;

const StyledSortInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  &:checked ~ span {
    border: 1px solid #7A45FF;
    &:after {
      position: absolute;
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      width: 6px; height: 6px;
      border-radius: 50%;
      background-color: #7A45FF;
    }
  }
  &:checked ~ p { color: #fff; }
`;
