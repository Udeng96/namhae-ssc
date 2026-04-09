import styled from 'styled-components';
import { CommonFormBox, CommonFormBoxNm, CommonFormBoxVal } from '@/component/lib/css';
import SelectBox from '@/component/pages/manage/sche/main/board/form/select/SelectBox';
import { useState } from 'react';
import { SCHE_EMER_SHOW_TIME } from '@/component/constants/scheConst';
import { useScheStore } from '@/component/stores/scheStore';

const ExpireForm = () => {
  const [expireOpen, setExpireOpen] = useState(false);
  const selectExpire = useScheStore((s) => s.selectExpire);
  const label = SCHE_EMER_SHOW_TIME.find((i) => i.cd === selectExpire)?.nm ?? '';

  return (
    <StyledExpire>
      <StyledExpireNm>노출시간</StyledExpireNm>
      <StyledExpireVal>
        <SelectBox
          type="expire"
          setIsOpen={setExpireOpen}
          isOpen={expireOpen}
          width="345px"
          value={label}
          optionList={SCHE_EMER_SHOW_TIME.map((i) => i.nm)}
        />
      </StyledExpireVal>
    </StyledExpire>
  );
};

export default ExpireForm;

const StyledExpire    = styled.div`${CommonFormBox}`;
const StyledExpireNm  = styled.div`${CommonFormBoxNm}`;
const StyledExpireVal = styled.div`${CommonFormBoxVal}`;
